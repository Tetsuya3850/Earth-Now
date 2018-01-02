import React, { Component } from "react";
import Client from "./helpers/api";

class Livecam extends Component {
  componentDidMount() {
    Client.liveCamSearch();
  }

  render() {
    return (
      <div>
        <img src={"https://images.webcams.travel/preview/1171032474.jpg"} />
        livecam
      </div>
    );
  }
}

export default Livecam;
