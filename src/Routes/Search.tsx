import { useParams } from "react-router-dom";
import { getKeywordData } from "../api";
import { useQuery } from "react-query";
import { IMovie } from "./Home";
import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../utils";
import BigCard from "../Components/BigCard";

interface IKeyword {
  results: IMovie[];
  media_type?: string;
}
const SearchWrapper = styled.div`
  padding-top: 250px;
  padding-bottom: 100px;
  min-height: 130vh;
`;
const Rows = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 50px;
  position: absolute;
  width: 100%;
  padding-left: 60px;
  padding-right: 60px;
`;
const Card = styled(motion.div)<{ bgPhoto: string }>`
  width: 100%;
  border-radius: 10%;
  aspect-ratio: 2 / 3;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(${(props) => makeImagePath(props.bgPhoto, "w200")});
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
function Search() {
  const { keyword } = useParams<{ keyword: string }>();
  const { isLoading, data } = useQuery<IKeyword>(
    ["search", keyword],
    () => getKeywordData(keyword),
    {
      enabled: !!keyword,
    }
  );
  // console.log(data);
  const realData = data?.results.filter((item) => item.poster_path);
  console.log(realData);
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
  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <SearchWrapper>
          <Rows>
            {realData?.map((movie, i) => (
              <div
                key={movie.id}
                style={{
                  position: "relative",
                  zIndex: hoverMovie === movie.id ? 100 : 1,
                }}
                onMouseEnter={() => onMouseEnter(movie.id)}
                onMouseLeave={onMouseLeave}
              >
                <Card
                  layoutId={"search-" + movie.id}
                  bgPhoto={movie?.poster_path || ""}
                />
                {hoverMovie === movie.id && (
                  <BigCard
                    basePath={`/search/${keyword}`}
                    movieId={movie.id}
                    layoutId={"search-" + movie.id}
                    index={i}
                  />
                )}
              </div>
            ))}
          </Rows>
        </SearchWrapper>
      )}
    </>
  );
}

export default Search;
