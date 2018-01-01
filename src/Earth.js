import React, { Component } from "react";
import THREELib from "three-js";
import Client from "./client";
import earth from "./blueMarble.jpg";
import { timeConverter } from "./helper";

const THREE = THREELib(["OrbitControls"]);

let earthCanvas;
let renderer;
let scene;
let camera;
let cameraControl;
let loader, canvas;
let timeCount = Date.now();

class Earth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earthquake: {},
      startStamp: Date.now(),
      endStamp: Date.now(),
      timestamp: Date.now(),
      startTime: 0,
      time: 0
    };
  }

  componentDidMount() {
    Client.monthlyTimeLocationSearch((data, startTime) => {
      const keys = Object.keys(data);
      this.setState({
        earthquake: data,
        startStamp: parseInt(keys[0], 10),
        endStamp: parseInt(keys[keys.length - 1], 10),
        timestamp: parseInt(keys[0], 10),
        startTime,
        time: startTime
      });
    });

    this.init();

    setInterval(() => {
      if (this.state.timestamp === this.state.endStamp) {
        this.setState({
          timestamp: this.state.startStamp,
          time: this.state.startTime
        });
      } else {
        this.setState(prevState => {
          return {
            timestamp: prevState.timestamp + 1,
            time: prevState.time + 100000000
          };
        });
      }
    }, 500);
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

    let point = this.lonLatToVector3(38, 135);

    // create a cloudGeometry, slighly bigger than the original sphere
    var earthGeometry = new THREE.SphereGeometry(15, 60, 60);
    var earthMaterial = this.createEarthMaterial();
    var earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.name = "earth";
    scene.add(earthMesh);
    earthMesh.rotation.set(point.x, point.y, 0);

    var overlayGeometry = new THREE.SphereGeometry(15, 60, 60);
    var overlayMaterial = this.createOverlayMaterial();
    var overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlayMesh.name = "overlay";
    scene.add(overlayMesh);
    overlayMesh.rotation.set(point.x, point.y, 0);

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
    loader = new THREE.TextureLoader();
    var earthTexture = loader.load(earth);

    var earthMaterial = new THREE.MeshBasicMaterial();
    earthMaterial.map = earthTexture;
    earthMaterial.transparent = true;

    return earthMaterial;
  }

  createOverlayMaterial() {
    var olMaterial = new THREE.MeshBasicMaterial();
    olMaterial.map = new THREE.Texture(this.addCanvas());
    olMaterial.transparent = true;
    olMaterial.opacity = 0.6;
    return olMaterial;
  }

  addCanvas() {
    canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 2048;

    var context = canvas.getContext("2d");

    if (Object.keys(this.state.earthquake).length !== 0) {
      this.state.earthquake[this.state.timestamp].forEach(e => {
        const posX = parseFloat(e[0]);
        const posY = parseFloat(e[1]);
        const size = parseFloat(e[2]);

        const x2 = 4096 / 360.0 * (180 + posX);
        const y2 = 2048 / 180.0 * (90 - posY);

        context.beginPath();
        context.arc(x2, y2, 3 * size, 0, 2 * Math.PI, false);
        if (size >= 6.0) {
          context.fillStyle = "red";
        } else if (size >= 4.5) {
          context.fillStyle = "orange";
        } else {
          context.fillStyle = "yellow";
        }
        context.fill();
      });
    }

    return canvas;
  }

  lonLatToVector3(lng, lat) {
    const out = new THREE.Vector3();
    out.set(lng / 90 * Math.PI / 2, lat / 90 * Math.PI / 2, 0);
    return out;
  }

  threeRender = () => {
    if (Date.now() - timeCount > 200) {
      scene.getObjectByName("overlay").material.map = new THREE.Texture(
        this.addCanvas()
      );
      timeCount = Date.now();
    }
    scene.getObjectByName("overlay").material.map.needsUpdate = true;
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
    const standardTime = timeConverter(this.state.time);
    return (
      <div>
        <div id="earthCanvas" />
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 40,
            width: 350,
            zIndex: 100,
            display: "block",
            color: "white"
          }}
        >
          <p>"Magnitude 2.5+ Earthquakes, Past Month"</p>
          <p>{standardTime}</p>
        </div>
      </div>
    );
  }
}

export default Earth;
