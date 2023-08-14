import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const app = document.querySelector<HTMLDivElement>('#app')!;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
app.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, app);

function genCube(x: number, y: number) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(x, y, 0);
  scene.add( cube );
  return cube;
}

// genCube(0, 0);

class Snake {
  x: number; 
  y: number; 
  lastPosition: [number, number][] = [];
  direction: [number, number] = [0, -1];
  head: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.head = genCube(x, y);
  }

  move() {
    this.x += this.direction[0];
    this.y += this.direction[1];
    this.head.position.set(this.x, this.y, 0);
  }

  update() {
    this.move();
  }
}

let snake: Snake;

function init() {
  snake = new Snake(0, 0);
}

init();

camera.position.z = 10;

function update() {
  snake.update();
  setTimeout(update, 500)
}

update();

function animation() {
  requestAnimationFrame( animation );
  renderer.render( scene, camera );
}

animation();
