import { Link, useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { motion, useScroll, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.div)`
  padding: 0 30px;
  display: flex;
  position: fixed;
  width: 100%;
  height: 100px;
  z-index: 20;
`;
const Svg = styled.svg`
  width: 100px;
  height: 100px;
  margin-right: 30px;
`;
const Items = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Item = styled(motion.li)`
  margin: auto 10px;
  cursor: pointer;
`;

const itemVars: Variants = {
  active: {
    fontWeight: 350,
    transition: { duration: 0.1 },
  },
  inactive: {
    fontWeight: 300,
    transition: { duration: 0.2 },
  },
  hover: {
    opacity: 0.7,
    transition: { duration: 0.3 },
  },
};
const Search = styled.form`
  display: flex;
  align-items: center;
  margin-left: auto;
  position: relative;
`;
const SearchIcon = styled(motion.svg)`
  width: 25px;
  height: 25px;
  position: absolute;
  left: 5px;
`;
const SearchInput = styled(motion.input)`
  border: 2px solid white;
  transform-origin: right center;
  background-color: transparent;
  padding-left: 35px;
  outline: none;
  width: 200px;
  height: 35px;
  color: white;
`;
const inputVars: Variants = {
  active: {
    scaleX: 1,
  },
  inactive: {
    scaleX: 0,
  },
};

function Header() {
  const homeMatch = useRouteMatch({ path: "/", exact: true });
  const tvMatch = useRouteMatch("/tv");
  const [clicked, setClicked] = useState(false);
  const onClick = () => {
    setClicked((prev) => !prev);
  };
  const [blacked, setBlacked] = useState(false);
  const { scrollY } = useScroll();
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 50) setBlacked(true);
      else setBlacked(false);
    });
  }, [scrollY]);
  const history = useHistory();
  const { register, setValue, handleSubmit } = useForm();

  const onValid = (data: any) => {
    history.push(`/search/${data.keyword}`);
    setValue("keyword", "");
  };
  return (
    <Nav
      animate={{
        backgroundColor: blacked ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)",
      }}
    >
      <Link to="/">
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <path
            d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
            fill="#d81f26"
          />
        </Svg>
      </Link>
      <Items>
        <Link to="/">
          <Item
            variants={itemVars}
            animate={homeMatch ? "active" : "inactive"}
            initial={false}
            whileHover={homeMatch ? "none" : "hover"}
          >
            Home
          </Item>
        </Link>
        <Link to="/tv">
          <Item
            variants={itemVars}
            animate={tvMatch ? "active" : "inactive"}
            whileHover={tvMatch ? "none" : "hover"}
          >
            TV Shows
          </Item>
        </Link>
      </Items>
      <Search onSubmit={handleSubmit(onValid)}>
        <SearchInput
          {...register("keyword")}
          variants={inputVars}
          initial="inactive"
          animate={clicked ? "active" : "inactive"}
          placeholder="Titles, people, genres"
        ></SearchInput>
        <SearchIcon
          onClick={onClick}
          initial={{ x: 150 }}
          animate={{ x: clicked ? 0 : 150 }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path
            d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"
            fill="white"
          />
        </SearchIcon>
      </Search>
    </Nav>
  );
}

export default Header;
