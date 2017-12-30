import React, { Component } from "react";
import THREELib from "three-js";
import loadingGif from "./Visuals/loading.gif";

const THREE = THREELib(["OrbitControls"]);

let earthCanvas;
let renderer;
let scene;
let camera;
let cameraControl;

let video, videoSrc, videoImage, videoImageContext, videoTexture;

class Earth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.Enabled = true;

    const sphereGeometry = new THREE.SphereGeometry(15, 60, 60);
    let sphereMaterial = this.createEarthMaterial();
    let earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = "earth";
    scene.add(earthMesh);
    let point = this.lonLatToVector3(this.props.lon, this.props.lat);
    earthMesh.rotation.set(point.x, point.y, 0);

    camera.position.z = 45;
    camera.lookAt(scene.position);

    cameraControl = new THREE.OrbitControls(camera);
    cameraControl.enableZoom = false;
    cameraControl.enablePan = false;

    earthCanvas = document.getElementById("earthCanvas");
    earthCanvas.appendChild(renderer.domElement);

    this.threeRender();

    window.addEventListener("resize", this.handleResize, false);
  }

  createEarthMaterial() {
    video = document.createElement("video");
    video.src = this.determineAsset();
    video.load();
    video.play();
    video.loop = this.props.loop;

    videoImage = document.createElement("canvas");
    videoImage.width = this.props.width;
    videoImage.height = this.props.height;

    videoImageContext = videoImage.getContext("2d");
    videoImageContext.fillStyle = "#000000";
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    let earthMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture
    });

    return earthMaterial;
  }

  determineAsset() {
    switch (this.props.global) {
      case "earth":
        videoSrc = require("./Visuals/earth.mp4");
        break;
      case "vapor":
        videoSrc = require("./Visuals/vapor.mp4");
        break;
      case "sst":
        videoSrc = require("./Visuals/sst.mp4");
        break;
      case "sstlonlat":
        videoSrc = require("./Visuals/sstlonlat.mp4");
        break;
      case "continentafricaamerica":
        videoSrc = require("./Visuals/continentafricaamerica.mp4");
        break;
      case "gw":
        videoSrc = require("./Visuals/gw.mp4");
        break;
      case "city":
        videoSrc = require("./Visuals/city.mp4");
        break;
      case "forest":
        videoSrc = require("./Visuals/forest.mp4");
        break;
    }
    return videoSrc;
  }

  lonLatToVector3(lng, lat, out) {
    out = out || new THREE.Vector3();
    const adjust = 90 - lat;
    out.set(lng / 90 * Math.PI / 2, adjust / 90 * Math.PI / 2, 0);
    return out;
  }

  threeRender = () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoImageContext.drawImage(video, 0, 0);
      if (videoTexture) videoTexture.needsUpdate = true;
      if (this.refs.myRef) this.setState({ loading: false });
    }
    cameraControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(this.threeRender);
  };

  handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    let loadingSign = (
      <img
        src={loadingGif}
        style={{ marginTop: 200, marginLeft: 200 }}
        alt="loading"
      />
    );
    if (this.state.loading === false) {
      loadingSign = null;
    }
    return (
      <div>
        <div ref="myRef">{loadingSign}</div>
        <div id="earthCanvas" />;
      </div>
    );
  }
}

export default Earth;
