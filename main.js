import * as three from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { latLongToVector3, positions, lines } from "./helper";

const sizes = { width: window.innerWidth, height: window.innerHeight };

// SCENE
const scene = new three.Scene();

// CAMERA
const camera = new three.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000,
);
camera.position.set(0, 0, 10);
scene.add(camera);

const textureLoader = new three.TextureLoader();

const earthTexture = textureLoader.load("/textures/earth.jpg");

const renderer = new three.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);
renderer.setSize(sizes.width, sizes.height);

// CONTROLS
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;

// LIGHTS
const ambientLight = new three.AmbientLight("#FFFFFF", 0.5);
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight("#FFFFFF", 0.5);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// SPHERE
const earthGeometry = new three.SphereGeometry(4, 64, 32);
const earthMaterial = new three.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.4,
  metalness: 0.5,
});
const earthMesh = new three.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// GLOX
const glowGeometry = new three.SphereGeometry(4.1, 64, 32);
const glowMaterial = new three.MeshStandardMaterial({
  map: earthTexture,
  opacity: 0.3,
  transparent: true,
  blending: three.AdditiveBlending,
  side: three.BackSide,
});
const glowMesh = new three.Mesh(glowGeometry, glowMaterial);
earthMesh.add(glowMesh);

// MARKERS
const markerGeometry = new three.SphereGeometry(0.03, 16, 16);
const markMaterial = new three.MeshStandardMaterial({
  color: "#FFFFFF",
  roughness: 0.4,
  metalness: 0.5,
});

positions.forEach((position) => {
  const markerMesh = new three.Mesh(markerGeometry, markMaterial);
  markerMesh.position.copy(position);
  earthMesh.add(markerMesh);
});

lines.forEach(({ start, end }) => {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(5);
  const curve = new three.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(100);
  const geometry = new three.BufferGeometry().setFromPoints(points);
  const material = new three.LineBasicMaterial({
    color: 0xffffff,
  });
  const arc = new three.Line(geometry, material);
  earthMesh.add(arc);
});

const tick = () => {
  earthMesh.rotation.y += 0.01;

  renderer.render(scene, camera);
  control.update();
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
