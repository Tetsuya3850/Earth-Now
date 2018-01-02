import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Earthquake from "./Earthquake";
import Livecam from "./Livecam";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/earthquake" component={Earthquake} />
          <Route path="/livecam" component={Livecam} />
        </Switch>
      </div>
    );
  }
}

export default App;
