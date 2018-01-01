import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Earth from "./Earth";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/earth" component={Earth} />
        </Switch>
      </div>
    );
  }
}

export default App;
