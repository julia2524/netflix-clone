import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path={["/search/:keyword/:id", "/search/:keyword"]}>
          <Search />
        </Route>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path={["/movie/:id", "/"]}>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
