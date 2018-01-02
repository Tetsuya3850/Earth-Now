import React, { Component } from "react";
import Client from "./helpers/api";

class Livecam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      livecam: []
    };
  }

  componentDidMount() {
    Client.liveCamSearch(data => {
      this.setState({ livecam: data });
    });
  }

  render() {
    const webcamImages = this.state.livecam.map(id => (
      <img
        src={`https://images.webcams.travel/thumbnail/${id}.jpg`}
        key={id}
        alt={"livecam"}
      />
    ));
    return <div>{webcamImages}</div>;
  }
}

export default Livecam;
