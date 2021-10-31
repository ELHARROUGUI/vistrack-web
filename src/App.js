import "./styles.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Welcome from "./screens/welcome";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Welcome} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
