import React, { Component } from "react";
import earth from "./assets/earth.png";
import { livecamData, clock } from "./helpers/livecamdata";

class Livecam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      livecam: livecamData
    };
  }

  componentDidMount() {
    this.addCanvas();
  }

  addCanvas() {
    const layer1 = document.getElementById("layer1");
    const ctx1 = layer1.getContext("2d");

    /*const img = new Image();
    img.src =
      "https://www.fourmilab.ch/cgi-bin/Earth?img=NASAmMM-l.evif&imgsize=550&dynimg=y&opt=-l&lat=90&ns=North&lon=0&ew=East&alt=35785&tle=&date=0&utc=&jd=";
    img.onload = function(e) {
      ctx1.drawImage(img, 400, 80);
    };
    */

    const layer2 = document.getElementById("layer2");
    const ctx2 = layer2.getContext("2d");

    this.state.livecam.forEach(data => {
      const cam_img = new Image();
      cam_img.src = `https://images.webcams.travel/thumbnail/${data.id}.jpg`;
      cam_img.onload = function(e) {
        ctx2.drawImage(cam_img, data.pos[0], data.pos[1], 80, 45);
      };
    });
  }

  render() {
    return (
      <div>
        <canvas
          id="layer1"
          width="1200"
          height="800"
          style={{ zIndex: 0, left: 0, top: 0, position: "absolute" }}
        />
        <canvas
          id="layer2"
          width="1200"
          height="800"
          style={{ zIndex: 100, left: 0, top: 0, position: "absolute" }}
        />
      </div>
    );
  }
}

export default Livecam;
