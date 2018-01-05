import React, { Component } from "react";
import THREELib from "three-js";
import Client from "./helpers/api";
import earth from "./assets/earth.png";
import legend from "./assets/earthquake_legend.png";
import { timeConverter } from "./helpers/utils";

const THREE = THREELib(["OrbitControls"]);

let earthCanvas;
let renderer;
let scene;
let camera;
let cameraControl;
let loader, canvas;
let timeCount = Date.now();
var raycaster;
var mouse;
var targetList = [];

class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      earthquake: []
    };
  }

  componentDidMount() {
    Client.radioSearch(data => {
      this.setState({
        earthquake: data
      });
    });

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

    var earthGeometry = new THREE.SphereGeometry(15, 60, 60);
    var earthMaterial = this.createEarthMaterial();
    var earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.name = "earth";
    scene.add(earthMesh);

    var overlayGeometry = new THREE.SphereGeometry(15, 60, 60);
    var overlayMaterial = this.createOverlayMaterial();
    var overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlayMesh.name = "overlay";
    scene.add(overlayMesh);
    targetList.push(overlayMesh);

    camera.position.z = 45;
    camera.lookAt(scene.position);

    cameraControl = new THREE.OrbitControls(camera);
    cameraControl.enableZoom = false;
    cameraControl.enablePan = false;

    earthCanvas = document.getElementById("earthCanvas");
    earthCanvas.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    this.threeRender();

    window.addEventListener("resize", this.handleResize, false);
    window.addEventListener("mousedown", this.onMouseDown, false);
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
    canvas.width = 1024;
    canvas.height = 512;

    var context = canvas.getContext("2d");

    if (Object.keys(this.state.earthquake).length !== 0) {
      this.state.earthquake.forEach(e => {
        const posX = parseFloat(e[0]);
        const posY = parseFloat(e[1]);

        const x2 = 1024 / 360.0 * (180 + posX);
        const y2 = 512 / 180.0 * (90 - posY);

        context.beginPath();
        context.arc(x2, y2, 8, 0, 2 * Math.PI, false);
        context.fillStyle = "yellow";
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

  onMouseDown(event) {
    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(targetList);

    if (intersects.length > 0) {
      console.log(intersects[0]);
    }
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
        />
      </div>
    );
  }
}

export default Radio;
