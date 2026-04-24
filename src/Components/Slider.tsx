import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { IMovie } from "../Routes/Home";
import { makeImagePath } from "../utils";
import { useQuery } from "react-query";
import { getMovieDetail, getVideoLink } from "../api";
import BigCard from "./BigCard";

const SliderContainer = styled.div<{ isHovered: boolean }>`
  position: relative;
  width: 100%;
  height: 340px;
  margin-bottom: 200px;
  &:first-child {
    margin-top: -100px;
  }
  z-index: ${(props) => (props.isHovered ? 100 : 1)};
`;
const SliderTitle = styled.h2`
  font-size: 25px;
  font-weight: 600;
  padding: 30px 0 10px 70px;
`;
const Larrow = styled(motion.div)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
`;
const Rarrow = styled(motion.div)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99;
`;
const Icon = styled(motion.svg)`
  width: 35px;
  height: 35px;
`;
const Rows = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
  padding-left: 60px;
  padding-right: 60px;
  z-index: 1;
`;
const Card = styled(motion.div)<{ bgPhoto: string }>`
  width: 100%;
  border-radius: 10%;
  aspect-ratio: 2 / 3;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(${(props) => makeImagePath(props.bgPhoto, "w200")});
  position: relative;
`;

interface ISliderProps {
  title: string;
  data: IMovie[];
}
interface IRowsVars {
  windowWidth: number;
  back: boolean;
}
const rowsVars: Variants = {
  initial: ({ back }: IRowsVars) => ({
    x: back ? "-100%" : "100%",
  }),
  animate: { x: 0, transition: { type: "tween", duration: 0.5 } },
  exit: ({ back }: IRowsVars) => ({
    x: back ? "100%" : "-100%",
    transition: { type: "tween", ease: "easeOut" },
  }),
};
interface IVideo {
  id: number;
  results: {
    key: string;
    site: string;
    type: string;
  }[];
}
interface IMovieDetail {
  genres: [{ id: number; name: "string" }];
  release_date: string;
  runtime: number;
}

function Slider({ title, data }: ISliderProps) {
  const [page, setPage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const [hoverMovie, setHoverMovie] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const isHovered = hoverMovie !== 0;
  const { isLoading: videoLoading, data: video } = useQuery<IVideo>(
    ["video", hoverMovie],
    () => getVideoLink(hoverMovie),
    {
      enabled: hoverMovie !== 0,
    }
  );
  const { isLoading: movieDetailLoading, data: movieDetail } =
    useQuery<IMovieDetail>(
      ["detail", hoverMovie],
      () => getMovieDetail(hoverMovie),
      {
        enabled: hoverMovie !== 0,
      }
    );
  const trailer =
    video?.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    )?.key || null;
  const bigCardLoading = movieDetailLoading || videoLoading;

  const offset = 6;
  const index = offset * page;
  const totalMovies = data?.length || 0;
  const maxpage = Math.floor(totalMovies / offset) - 1;
  const onRClicked = () => {
    if (leaving) return;
    setBack(false);
    setPage((prev) => (prev === maxpage ? 0 : prev + 1));
    setLeaving(true);
  };
  const onLClicked = () => {
    if (leaving) return;
    setBack(true);
    setPage((prev) => (prev === 0 ? maxpage : prev - 1));
    setLeaving(true);
  };
  const onMouseEnter = (id: number) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      setHoverMovie(id);
    }, 50);
    setHoverTimeout(timeout);
  };
  const onMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverMovie(0);
  };

  return (
    <SliderContainer isHovered={isHovered}>
      <SliderTitle>{title}</SliderTitle>
      <div style={{ position: "relative", width: "100%", height: "200px" }}>
        <AnimatePresence initial={false} custom={{ back }}>
          <Rows
            custom={{ back }}
            variants={rowsVars}
            initial="initial"
            animate="animate"
            exit="exit"
            key={page}
            onAnimationComplete={() => setLeaving(false)}
          >
            {data?.slice(index, index + offset).map((movie, i) => (
              <>
                <Larrow onClick={onLClicked}>
                  <Icon
                    whileHover={{ scale: 1.3 }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                  >
                    <path
                      fill="white"
                      d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z"
                    />
                  </Icon>
                </Larrow>
                <div
                  key={movie.id}
                  style={{
                    position: "relative",
                    zIndex: hoverMovie === movie.id ? 10 : 1,
                  }}
                  onMouseEnter={() => onMouseEnter(movie.id)}
                  onMouseLeave={onMouseLeave}
                >
                  <Card
                    layoutId={title + movie.id + ""}
                    bgPhoto={movie?.poster_path || ""}
                  />
                  {hoverMovie === movie.id && (
                    <BigCard
                      basePath="/movie"
                      movieId={movie.id}
                      layoutId={title + movie.id + ""}
                      index={i}
                    />
                  )}
                </div>
                <Rarrow onClick={onRClicked}>
                  <Icon
                    whileHover={{ scale: 1.3 }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                  >
                    <path
                      fill="white"
                      d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"
                    />
                  </Icon>
                </Rarrow>
              </>
            ))}
          </Rows>
        </AnimatePresence>
      </div>
    </SliderContainer>
  );
}

export default Slider;
