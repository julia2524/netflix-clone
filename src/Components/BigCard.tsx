import { motion, Variants } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, getVideoLink } from "../api";
import { Link } from "react-router-dom";
import { makeImagePath } from "../utils";
import { useState } from "react";

const BigCardWrapper = styled.div<{ index: number }>`
  position: absolute;
  top: -120px;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: ${(props) =>
    props.index % 6 === 0
      ? "flex-start"
      : props.index % 6 === 5
      ? "flex-end"
      : "center"};
`;
const BigCardContainer = styled(motion.div)`
  width: 22vw;
  min-width: 300px;
  height: auto;
  aspect-ratio: 1 / 1.5;
  background-color: ${(props) => props.theme.black.darker};
  flex-shrink: 0;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);

  z-index: 9999;
`;
const Loader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
`;
const Video = styled.iframe`
  width: 100%;
  height: 400px;
  border: none;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`;
const Detail = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a3a3a3;
  font-size: 14px;
  font-weight: 600;
  button {
    background-color: transparent;
    color: ${(props) => props.theme.white.lighter};
    font-weight: 600;
    font-size: 15px;
    border: solid 1px white;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
  }
`;
const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  span {
    font-size: 12px;
    font-weight: 800;
  }
`;
const NoTrailer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  span {
    position: absolute;
    bottom: 70px;
    left: 15px;
    color: white;
    font-size: 30px;
    opacity: 0.8;
  }
`;
interface IBigCardProps {
  movieId: number;
  layoutId: string;
  index: number;
  basePath: string;
}
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
  backdrop_path: string;
}

function BigCard({ movieId, layoutId, index, basePath }: IBigCardProps) {
  const bigCardVars: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };
  const { isLoading: videoLoading, data: video } = useQuery<IVideo>(
    ["video", movieId],
    () => getVideoLink(movieId),
    {
      enabled: movieId !== 0,
    }
  );
  const { isLoading: movieDetailLoading, data: movieDetail } =
    useQuery<IMovieDetail>(["detail", movieId], () => getMovieDetail(movieId), {
      enabled: movieId !== 0,
      retry: false,
    });
  const trailer =
    video?.results?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    )?.key || null;
  const bigCardLoading = movieDetailLoading || videoLoading;
  const [hoverMovie, setHoverMovie] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

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
  const onClick = (id: number | undefined) => {
    if (!id) return;
    onMouseLeave();
  };

  return (
    <BigCardWrapper index={index}>
      <BigCardContainer
        layoutId={layoutId}
        variants={bigCardVars}
        initial="initial"
        animate="animate"
      >
        {bigCardLoading ? (
          <Loader>Loading...</Loader>
        ) : !movieDetail ? (
          <Loader>Nothing found...</Loader>
        ) : (
          <>
            {trailer ? (
              <Video
                src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <>
                <NoTrailer>
                  <img
                    src={makeImagePath(movieDetail?.backdrop_path || "")}
                    alt="trailer"
                  />
                  <span>No Trailer</span>
                </NoTrailer>
              </>
            )}
            <Detail>
              <InfoRow>
                <span className="year">
                  {movieDetail?.release_date
                    ? movieDetail.release_date?.slice(0, 4)
                    : "0000"}
                </span>
                <span className="runtime">
                  {movieDetail?.runtime
                    ? `${Math.floor(movieDetail.runtime / 60)}h ${
                        movieDetail.runtime % 60
                      }m`
                    : ""}
                </span>
                <Link
                  to={{
                    pathname: `${basePath}/${movieId}`,
                    state: { id: movieId },
                  }}
                >
                  <button onClick={() => onClick(movieId)}>i</button>
                </Link>
              </InfoRow>
              <GenreList>
                {movieDetail?.genres?.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </GenreList>
            </Detail>
          </>
        )}
      </BigCardContainer>
    </BigCardWrapper>
  );
}

export default BigCard;
