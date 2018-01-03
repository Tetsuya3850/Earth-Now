import React, { Component } from "react";
import { livecamData } from "./helpers/livecamdata";

class Livecam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      livecam: livecamData
    };
  }

  render() {
    const livecams = this.state.livecam.map(data => (
      <a target="_blank" href={data.url} key={data.id}>
        <img
          style={{
            left: data.pos[0],
            top: data.pos[1],
            width: 80,
            height: 45,
            position: "absolute",
            zIndex: 100
          }}
          src={`https://images.webcams.travel/thumbnail/${data.id}.jpg`}
          key={data.id}
          alt={"livecam"}
        />
      </a>
    ));
    return (
      <div>
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            width: 250,
            zIndex: 100,
            display: "block",
            color: "white"
          }}
        >
          <h2>Earth Clock</h2>
        </div>
        <img
          style={{
            left: 400,
            top: 80,
            position: "absolute",
            zIndex: 0
          }}
          src={
            "https://www.fourmilab.ch/cgi-bin/Earth?img=NASAmMM-l.evif&imgsize=550&dynimg=y&opt=-l&lat=90&ns=North&lon=0&ew=East&alt=35785&tle=&date=0&utc=&jd="
          }
          alt={"earth"}
        />
        {livecams}
      </div>
    );
  }
}

export default Livecam;
