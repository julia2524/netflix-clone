import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getVideoLink } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 */
  display: flex;
  justify-content: center;
  align-items: center; /* 자식인 Modal Box를 정중앙으로! */
  z-index: 99999;
`;
const BigScreen = styled.div`
  width: 70%;
  height: 90%;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 20px;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 100000;
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
  aspect-ratio: 16 / 9;
  border: none;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
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
const Title = styled.h1`
  color: ${(props) => props.theme.white.lighter};
  font-size: 50px;
  font-weight: 500;
`;
const Overview = styled.div`
  font-size: 18px;
  line-height: 1.3;
`;
const Exit = styled.button`
  position: absolute;
  right: 15px;
  top: 15px;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 30px;
  font-weight: 100;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background-color: rgba(215, 214, 214, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
`;
const VideoWrapper = styled.div`
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(
      to top,
      ${(props) => props.theme.black.darker},
      transparent
    );
  }
`;
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
  overview: string;
  title: string;
}
interface IParams {
  id: string;
}
function BigModel() {
  const history = useHistory();
  const { id } = useParams<IParams>();
  const paramId = Number(id);
  const { isLoading: videoLoading, data: video } = useQuery<IVideo>(
    ["video", paramId],
    () => getVideoLink(paramId),
    {
      enabled: !isNaN(paramId) && paramId !== 0,
    }
  );
  const { isLoading: movieDetailLoading, data: movieDetail } =
    useQuery<IMovieDetail>(["detail", paramId], () => getMovieDetail(paramId), {
      enabled: !isNaN(paramId) && paramId !== 0,
    });
  const trailer =
    video?.results?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    )?.key || null;
  const bigCardLoading = movieDetailLoading || videoLoading;
  useEffect(() => {
    document.body.style.overflow = "hidden"; // 모달 켜질 때 배경 스크롤 금지
    return () => {
      document.body.style.overflow = "auto"; // 모달 꺼질 때 복구
    };
  }, []);
  return (
    <Overlay onClick={() => history.goBack()}>
      <BigScreen key={paramId} onClick={(e) => e.stopPropagation()}>
        <Exit onClick={() => history.goBack()}>x</Exit>
        {bigCardLoading ? (
          <Loader>Loading... </Loader>
        ) : (
          <>
            {trailer ? (
              <VideoWrapper>
                <Video
                  src={`https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=0`}
                  title="Trailer"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </VideoWrapper>
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
              <Title>{movieDetail?.title}</Title>
              <InfoRow>
                <span className="year">
                  {movieDetail?.release_date.slice(0, 4)}
                </span>
                <span className="runtime">
                  {movieDetail?.runtime
                    ? `${Math.floor(movieDetail.runtime / 60)}h ${
                        movieDetail.runtime % 60
                      }m`
                    : ""}
                </span>
              </InfoRow>
              <GenreList>
                {movieDetail?.genres?.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </GenreList>
              <Overview>{movieDetail?.overview}</Overview>
            </Detail>
          </>
        )}
      </BigScreen>
    </Overlay>
  );
}

export default BigModel;
