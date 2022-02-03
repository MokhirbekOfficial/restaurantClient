import "./App.scss";
import Home from "./Components/Home/Home";
import HomeMedium from "./Components/Home/HomeMedium";
import { Route, Switch } from "react-router-dom";
function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/medium" component={HomeMedium} />
      </Switch>
    </>
  );
}

export default App;
