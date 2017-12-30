import React, { Component } from "react";
import "./App.css";
import Client from "./client";

class TodayEarthquake extends Component {
  constructor(props) {
    super(props);

    this.state = {
      earthquakes: []
    };
  }

  componentDidMount() {
    this.loadEarthquakes();
    // Updates earthquake every 5 minutes.
    setInterval(this.loadEarthquakes, 300000);
  }

  loadEarthquakes = () => {
    Client.dailySearch(data => {
      this.setState({
        earthquakes: data
      });
    });
  };

  render() {
    const RecentEarthquakes = this.state.earthquakes.map(earthquake => (
      <div>
        <div key={earthquake}>{earthquake}</div>
        <br />
      </div>
    ));

    return (
      <div className="App">
        <h1 style={{ marginBottom: 20 }}>Today's Earthquakes</h1>
        {RecentEarthquakes}
      </div>
    );
  }
}

export default TodayEarthquake;
