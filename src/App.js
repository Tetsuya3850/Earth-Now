import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import "./App.css";
import Earth from "./Earth";
import TodayEarthquake from "./TodayEarthquake";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/today" component={TodayEarthquake} />
          <Route path="/earth" component={Earth} />
        </Switch>
      </div>
    );
  }
}

export default App;
