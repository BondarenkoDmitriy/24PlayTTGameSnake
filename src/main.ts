import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const width = 640;
const height = 480;
let points = 0;

const app = document.querySelector<HTMLDivElement>('#app')!;
const pointsCounter = document.querySelector<HTMLDivElement>('#points')!;

function updatePoints() {
  pointsCounter.innerHTML = `Points: ${points}`;
}

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
  const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(x, y, 0);
  scene.add( cube );
  return cube;
}

class Snake {
  x: number; 
  y: number; 
  lastPosition: [number, number][] = [];
  direction: [number, number] = [0, -1];
  head: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>
  children: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>[] = []
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

    if (this.x < -10 || this.x > 10) {
      this.x = -this.x;
    }

    if (this.y < -10 || this.y > 10) {
      this.y = -this.y;
    }

    this.x += this.direction[0];
    this.y += this.direction[1];
    this.head.position.set(this.x, this.y, 0)

    if (this.lastPosition.length > this.children.length + 2) {
      this.lastPosition.shift()
    }

    this.moveChildren();
  }

  checkCollisionWithChildren() {
    for (let i = 0; i < this.children.length; i++) {
      const current = this.children[i];

      if (current.position.x === this.x && current.position.y === this.y) {
        init()
      }
    }
  }

  update() {
    this.move();
    this.checkCollisionWithChildren();
  }

  grow() {
    this.children.push(genCube(
      this.lastPosition[1][0],
      this.lastPosition[1][1],
    ));
  }
}

let snake: Snake;

class Apple {
  x: number = 3;
  y: number = 0;
  apple: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>
  constructor(x: number, y: number) {
    this.apple = genCube(x, y);
    this.apple.material = new THREE.MeshStandardMaterial({color: 0xff0000})
    this.x = x
    this.y = y
  }

  static genRandomApple() {
    const rint = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

    return new Apple(rint(-5, 5), rint(-5, 5))
  }

  collistion() {
    if (this.x === snake.x && this.y === snake.y) {
      scene.remove(this.apple);
      apple = Apple.genRandomApple();
      snake.grow();
      points++;
    }
  }
}

let apple: Apple;

function init() {
  scene.clear()

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add( ambient );

  const mainLight = new THREE.PointLight(0xe67710, 100, 500);
  mainLight.position.set(-2, 0, 10);
  scene.add( mainLight );

  const rimLight = new THREE.PointLight(0x7f5adb, 100, 500);
  rimLight.position.set(4, 0, -5);
  scene.add( rimLight );

  // const sphereSize = 1;
  // const pointLightHelper = new THREE.PointLightHelper( mainLight, sphereSize );
  // scene.add( pointLightHelper );

  // const pointLightOtherHelper = new THREE.PointLightHelper( rimLight, sphereSize );
  // scene.add( pointLightOtherHelper );

  camera.position.set(0, 0, 10);
  points = 0;
  snake = new Snake(0, 0);
  apple = Apple.genRandomApple()
}

init();

camera.position.z = 10;

function update() {
  snake.update();
  apple.collistion();
  updatePoints();
  setTimeout(update, 250);
}
update();

function animate() {
	requestAnimationFrame( animate );

  controls.update();

	renderer.render( scene, camera );
}

animate();

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
    case "0": 
      camera.position.set(0, 0, 10);
      break;

    default: 
      break;
  }
}
