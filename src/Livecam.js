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
    return (
      <div>
        {webcamImages}
        <img
          src={
            "https://www.fourmilab.ch/cgi-bin/Earth?img=NASAmMM-l.evif&imgsize=600&dynimg=y&opt=-l&lat=90&ns=North&lon=0&ew=East&alt=35785&tle=&date=0&utc=&jd="
          }
        />
      </div>
    );
  }
}

export default Livecam;
