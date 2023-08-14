import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const width = 640;
const height = 480;

const app = document.querySelector<HTMLDivElement>('#app')!;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize( width, height );
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
  children: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = []
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.head = genCube(x, y);

    for (let i = 1; i < 5; i++) {
      this.children.push(genCube(0, -i));
      this.lastPosition.push([0, -i])
    }
  }

  moveChildren() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].position.set(
        this.lastPosition[this.lastPosition.length - 1 - i][0],
        this.lastPosition[this.lastPosition.length - 1 - i][1],
        0
      )
    }
  }

  move() {
    this.lastPosition.push([this.x, this.y])
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
  setTimeout(update, 250)
}

update();

function animation() {
  requestAnimationFrame( animation );
  controls.update();
  renderer.render( scene, camera );
}

animation();

window.onkeydown = e => {
  switch(e.key) {
    case "ArrowUp": 
      if (snake.direction[1] === 0) {
        snake.direction = [0, 1];
      }
      break;
    case "ArrowDown":
      if (snake.direction[1] === 0) {
        snake.direction = [0, -1];
      }
      break;
    case "ArrowLeft": 
      if (snake.direction[0] === 0) {
        snake.direction = [-1, 0];
      }
      break;
    case "ArrowRight": 
    if (snake.direction[0] === 0) {
      snake.direction = [1, 0];
    }
      break;

    default: 
      break;
  }
}
