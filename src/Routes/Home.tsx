import { useQuery } from "react-query";
import {
  getMovieDetail,
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
  getVideoLink,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Link, useRouteMatch } from "react-router-dom";
import BigModel from "./BigModel";
import Slider from "../Components/Slider";

export interface IMovie {
  backdrop_path: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  first_air_data?: string;
  release_date?: string;
}
interface IMovies {
  results: IMovie[];
}

const Loader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 90vh;
  min-height: 600px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => makeImagePath(props.bgPhoto)});
`;
const Title = styled.h1`
  color: ${(props) => props.theme.white.lighter};
  font-size: clamp(30px, 5vw, 50px);
  font-weight: 700;
`;
const Overview = styled.p`
  font-size: clamp(15px, 5vw, 25px);
  max-width: 440px;
  width: 100%;
  line-height: 1.3;
`;
const InfoLink = styled(Link)`
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 600;
  font-size: 18px;
  border: solid 1px white;
  border-radius: 10px;
  padding: 10px;
  margin-top: 20px;
  max-width: 100px;
  cursor: pointer;
  text-align: center;
`;

const Contants = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Sliders = styled.div`
  margin-top: -110px;
  flex-direction: column;
  gap: 150px;
  position: relative;
`;

function Home() {
  const [hoverMovie, setHoverMovie] = useState(0);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const modelMatch = useRouteMatch("/:id");

  const { isLoading: nowLoading, data: nowMovies } = useQuery<IMovies>(
    ["isPlaying", "movies"],
    getNowPlayingMovies
  );
  const { isLoading: popularLoading, data: popularMovies } = useQuery<IMovies>(
    ["popular", "movies"],
    getPopularMovies
  );
  const { isLoading: upcomingLoading, data: upcomingMovies } =
    useQuery<IMovies>(["upcoming", "movies"], getUpcomingMovies);

  const moviesLoading = nowLoading || popularLoading || upcomingLoading;

  const onMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverMovie(0);
  };
  const onClick = (id: number | undefined) => {
    if (!id) return;
    onMouseLeave();
  };
  return (
    <>
      {moviesLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={nowMovies?.results[0].backdrop_path || ""}>
            <Contants>
              <Title>{nowMovies?.results[0].title}</Title>
              <Overview>{nowMovies?.results[0].overview}</Overview>
              <InfoLink
                to={{
                  pathname: `movie/${nowMovies?.results[0].id}`,
                  state: { id: nowMovies?.results[0].id },
                }}
                onClick={() => onClick(nowMovies?.results[0].id)}
              >
                More Info
              </InfoLink>
            </Contants>
          </Banner>
          <Sliders>
            <Slider
              title="Now Playing"
              data={nowMovies?.results.slice(1) || []}
            />
            <Slider title="popular" data={popularMovies?.results || []} />
            <Slider title="upcoming" data={upcomingMovies?.results || []} />
          </Sliders>
        </>
      )}
      {modelMatch !== null ? <BigModel /> : null}
    </>
  );
}

export default Home;
