import React, { Component } from "react";
import THREELib from "three-js";
import Client from "./client";
import earth from "./earthmap4k.jpg";

const THREE = THREELib(["OrbitControls"]);

let earthCanvas;
let renderer;
let scene;
let camera;
let cameraControl;
let loader, canvas;

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

    // create a cloudGeometry, slighly bigger than the original sphere
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

    Client.dailyLocationSearch(data => {
      data.forEach(function(e) {
        var posX = parseFloat(e[0]);
        var posY = parseFloat(e[1]);

        var x2 = 4096 / 360.0 * (180 + posX);
        var y2 = 2048 / 180.0 * (90 - posY);

        context.beginPath();
        context.arc(x2, y2, 8, 0, 2 * Math.PI, false);
        context.fillStyle = "yellow";
        context.fill();

        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "yellow";
        context.stroke();
      });
    });

    return canvas;
  }

  lonLatToVector3(lng, lat, out) {
    out = out || new THREE.Vector3();
    const adjust = 90 - lat;
    out.set(lng / 90 * Math.PI / 2, adjust / 90 * Math.PI / 2, 0);
    return out;
  }

  threeRender = () => {
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
    return (
      <div>
        <div id="earthCanvas" />
      </div>
    );
  }
}

export default Earth;
