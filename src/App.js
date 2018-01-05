import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Earthquake from "./Earthquake";
import Livecam from "./Livecam";
import Radio from "./Radio";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/earthquake" component={Earthquake} />
          <Route path="/livecam" component={Livecam} />
          <Route path="/radio" component={Radio} />
        </Switch>
      </div>
    );
  }
}

export default App;
