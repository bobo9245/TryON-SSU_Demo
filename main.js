// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

// // Create Scene
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 2.5;

// const hw_ratio = 0.7;
// const renderer = new THREE.WebGLRenderer();
// //renderer.domElement.style.border='2px solid black';
// renderer.setSize(window.innerWidth*hw_ratio, window.innerHeight*hw_ratio);
// document.getElementById('main').appendChild(renderer.domElement);

// // Add Light
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(1, 1, 1).normalize();
// scene.add(light);

// // Add Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.enableZoom = false;
// controls.autoRotate = false;
// controls.autoRotateSpeed = 1000.0;
// controls.minPolarAngle=Math.PI/2;
// controls.maxPolarAngle=Math.PI/2;

// // Object containers
// const objects = {
//     mane_original: null,
//     mane_redhood: null,
//     mane_whiteknit: null,
//     mane_whitepadding: null,
// };

// // Function to load PLY files
// function loadPLYFile(fileName, key) {
//     const loader = new PLYLoader();
//     loader.load(`polygons/${fileName}.ply`, (geometry) => {
//         geometry.computeVertexNormals();
//         const material = new THREE.PointsMaterial({
//             size: 0.016,
//             color: 0x000000,
//         });
//         const pointCloud = new THREE.Points(geometry, material);
//         pointCloud.rotation.x = Math.PI;
//         objects[key] = pointCloud;
//         if (key === 'mane_original') {
//             scene.add(pointCloud); // Load the default model
//         }
//     });
// }

// // Load all models
// loadPLYFile('mane_original', 'mane_original');
// loadPLYFile('mane_redhood', 'mane_redhood');
// loadPLYFile('mane_whiteknit', 'mane_whiteknit');
// loadPLYFile('mane_whitepadding', 'mane_whitepadding');

// // Handle Card Click Events
// document.getElementById('card-mane-original').addEventListener('click', () => updateModel('mane_original'));
// document.getElementById('card-mane-redhood').addEventListener('click', () => updateModel('mane_redhood'));
// document.getElementById('card-mane-whiteknit').addEventListener('click', () => updateModel('mane_whiteknit'));
// document.getElementById('card-mane-whitepadding').addEventListener('click', () => updateModel('mane_whitepadding'));

// function updateModel(modelKey) {
//     Object.keys(objects).forEach((key) => {
//         if (objects[key]) {
//             scene.remove(objects[key]); // Remove all objects
//         }
//     });
//     if (objects[modelKey]) {
//         scene.add(objects[modelKey]); // Add selected model
//     }
// }

// // Render Loop
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }
// animate();

// // Handle Window Resize
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight - 150);
// });
//-----------------------------------------------------------------------------------------------------------------------------------

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

// // Create Scene
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 2;

// const hw_ratio = 0.7;
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth * hw_ratio, window.innerHeight * hw_ratio);
// document.getElementById('main').appendChild(renderer.domElement);

// // Add Light
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(1, 1, 1).normalize();
// scene.add(light);

// // Add Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.enableZoom = true;
// controls.autoRotate = false;
// controls.autoRotateSpeed = 1000.0;
// controls.minPolarAngle = Math.PI / 2;
// controls.maxPolarAngle = Math.PI / 2;

// // Object containers
// const objects = {
//     mane_original: null,
//     mane_redhood: null,
//     mane_whiteknit: null,
//     mane_whitepadding: null,
// };

// // Custom Gaussian Splatting ShaderMaterial
// const vertexShader = `
//     varying vec3 vColor;
//     attribute vec3 color; // 색상 데이터를 명시적으로 선언
//     void main() {
//         vColor = color; // 색상 데이터를 할당
//         gl_PointSize = 15.0;
        
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;



// const fragmentShader = `
//     varying vec3 vColor;
//     void main() {
//         float dist = length(gl_PointCoord - vec2(0.5)); // Gaussian 중심으로부터 거리
//         float alpha = exp(-dist * dist * 200.0); // Gaussian 분포
//         if (alpha < 0.1) discard; // 가장자리 제거
//         gl_FragColor = vec4(vColor, alpha);
//     }
// `;

// const splatMaterial = new THREE.ShaderMaterial({
//     vertexShader,
//     fragmentShader,
//     transparent: true,
//     vertexColors: false, // PLY 파일에서 색상 정보를 읽어옴
// });


// function loadPLYFile(fileName, key) {
//     const loader = new PLYLoader();
//     loader.load(`polygons/${fileName}.ply`, (geometry) => {
//         geometry.computeVertexNormals();
        
//         // 색상 데이터가 존재할 경우 처리
//         if (geometry.attributes.color) {
//             geometry.setAttribute('color', geometry.attributes.color);
//         } else {
//             // 색상이 없으면 기본 색상 할당
//             const colors = new Float32Array(geometry.attributes.position.count * 3);
//             for (let i = 0; i < colors.length; i += 3) {
//                 colors[i] = 0.0; // R
//                 colors[i + 1] = 0.0; // G
//                 colors[i + 2] = 0.0; // B
//             }
//             geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//         }

//         const pointCloud = new THREE.Points(geometry, splatMaterial);
//         pointCloud.rotation.x = Math.PI;
//         objects[key] = pointCloud;
//         if (key === 'mane_original') {
//             scene.add(pointCloud); // Load the default model
//         }
//     });
// }


// // Load all models
// loadPLYFile('mane_original', 'mane_original');
// loadPLYFile('mane_redhood', 'mane_redhood');
// loadPLYFile('mane_whiteknit', 'mane_whiteknit');
// loadPLYFile('mane_whitepadding', 'mane_whitepadding');

// // Handle Card Click Events
// document.getElementById('card-mane-original').addEventListener('click', () => updateModel('mane_original'));
// document.getElementById('card-mane-redhood').addEventListener('click', () => updateModel('mane_redhood'));
// document.getElementById('card-mane-whiteknit').addEventListener('click', () => updateModel('mane_whiteknit'));
// document.getElementById('card-mane-whitepadding').addEventListener('click', () => updateModel('mane_whitepadding'));

// function updateModel(modelKey) {
//     Object.keys(objects).forEach((key) => {
//         if (objects[key]) {
//             scene.remove(objects[key]); // Remove all objects
//         }
//     });
//     if (objects[modelKey]) {
//         scene.add(objects[modelKey]); // Add selected model
//     }
// }

// // Render Loop
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }
// animate();

// // Handle Window Resize
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight - 150);
// });

//-----------------------------------------------------------------------------------------------------------------------------
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

// // Create Three.js Scene
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);

// // Create Camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 2;

// // Create Renderer
// const renderer = new THREE.WebGLRenderer();
// const hw_ratio = 0.7;
// renderer.setSize(window.innerWidth * hw_ratio, window.innerHeight * hw_ratio);
// document.getElementById('main').appendChild(renderer.domElement);

// // Add Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.enableZoom = true;
// controls.autoRotate = false;
// controls.autoRotateSpeed = 1000.0;
// controls.minPolarAngle = Math.PI / 2;
// controls.maxPolarAngle = Math.PI / 2;

// // Gaussian Splats 3D Viewer
// const viewer = new GaussianSplats3D.Viewer({
//     camera, // Three.js 카메라 사용
//     renderer, // Three.js 렌더러 사용
//     threeScene: scene, // 기존 Three.js 씬 사용
//     gpuAcceleratedSort: true, // GPU 기반 가속 활성화
//     enableSIMDInSort: true, // SIMD 가속 활성화
//     sharedMemoryForWorkers: false, // SharedArrayBuffer 사용 비활성화
//     selfDrivenMode: false, // Viewer의 업데이트와 렌더링을 직접 호출
// });

// // Function to load Gaussian Splatting Scene
// async function loadGaussianScene(filePath, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0, 1]) {
//     await viewer.addSplatScene(filePath, {
//         position,
//         scale,
//         rotation,
//         splatAlphaRemovalThreshold: 1, // 알파 값이 낮은 스플랫 제거
//         showLoadingUI: true, // 로딩 UI 활성화
//     });
// }

// // Object containers for legacy PLY support
// const objects = {};


// // Load Gaussian Splats and PLY models
// const files = {
//     mane_original: 'splats/mane_original.ksplat',
//     mane_redhood: 'splats/mane_redhood.ksplat',
//     mane_whiteknit: 'splats/mane_whiteknit.ksplat',
//     mane_whitepadding: 'splats/mane_whitepadding.ksplat',
// };

// loadGaussianScene(files.mane_original); // Load default KSPLAT model

// // Handle Card Click Events
// document.getElementById('card-mane-original').addEventListener('click', () => loadGaussianScene(files.mane_original));
// document.getElementById('card-mane-redhood').addEventListener('click', () => loadGaussianScene(files.mane_redhood));
// document.getElementById('card-mane-whiteknit').addEventListener('click', () => loadGaussianScene(files.mane_whiteknit));
// document.getElementById('card-mane-whitepadding').addEventListener('click', () => loadGaussianScene(files.mane_whitepadding));

// function updateModel(modelKey) {
//     Object.keys(objects).forEach((key) => {
//         if (objects[key]) {
//             scene.remove(objects[key]); // Remove all objects
//         }
//     });
//     if (objects[modelKey]) {
//         scene.add(objects[modelKey]); // Add selected model
//     }
// }

// // Render Loop
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     viewer.update(); // Update Gaussian Splatting Viewer
//     viewer.render(); // Render Gaussian Splatting Viewer
//     renderer.render(scene, camera); // Render Three.js scene
// }
// animate();

// // Handle Window Resize
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth * hw_ratio, window.innerHeight * hw_ratio);
// });

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

// Create Three.js Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.scale.x = -1;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light); // 조명 추가

// Create Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

// Create Renderer
const renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
const hw_ratio = 0.6;
renderer.setSize(window.innerWidth * hw_ratio, window.innerHeight * hw_ratio);
document.getElementById('main').appendChild(renderer.domElement);

// Add Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.autoRotate = false;
controls.autoRotateSpeed = 1000.0;
controls.minPolarAngle=Math.PI/2;
controls.maxPolarAngle=Math.PI/2;


// Gaussian Splats 3D Viewer
const viewers = {
    mane_original: new GaussianSplats3D.Viewer({
        scene, // Three.js 씬을 명시적으로 설정
        camera, // 기존 Three.js 카메라
        renderer, // 기존 Three.js 렌더러
        selfDrivenMode: true,
    }),
    mane_redhood: new GaussianSplats3D.Viewer({
        scene, // Three.js 씬을 명시적으로 설정
        camera, // 기존 Three.js 카메라
        renderer, // 기존 Three.js 렌더러
        selfDrivenMode: true,
    }),
    mane_whiteknit: new GaussianSplats3D.Viewer({
        scene, // Three.js 씬을 명시적으로 설정
        camera, // 기존 Three.js 카메라
        renderer, // 기존 Three.js 렌더러
        selfDrivenMode: true,
    }),
    mane_whitepadding: new GaussianSplats3D.Viewer({
        scene, // Three.js 씬을 명시적으로 설정
        camera, // 기존 Three.js 카메라
        renderer, // 기존 Three.js 렌더러
        selfDrivenMode: true,
    }),
};

// Gaussian Splatting File Paths
const files = {
    mane_original: 'splats/mane_original.ksplat',
    mane_redhood: 'splats/mane_redhood.ksplat',
    mane_whiteknit: 'splats/mane_whiteknit.ksplat',
    mane_whitepadding: 'splats/mane_whitepadding.ksplat',
};

// Load all scenes sequentially
async function loadScenesSequentially() {
    for (const key of Object.keys(viewers)) {
        console.log(`Loading ${key}...`);
        await viewers[key].addSplatScene(files[key], {
            progressiveLoad: false,
            splatAlphaRemovalThreshold: 1,
            rotation: [0, 1, 0, 0],
            scale:[1,-1,1],
            showLoadingUI: true,
        });
        console.log(`${key} loaded successfully!`);
    }
}

// Toggle viewer visibility
let activeViewer = null;

function toggleViewer(activeKey) {
    if (activeViewer) {
        activeViewer.stop(); // 이전 뷰어 중지
    }

    activeViewer = viewers[activeKey];
    //console.log(activeViewer);
    activeViewer.start(); // 새 뷰어 시작
    console.log(`Viewer switched to: ${activeKey}`);
}

// Set up card click events
document.getElementById('card-mane-original').addEventListener('click', () => toggleViewer('mane_original'));
document.getElementById('card-mane-redhood').addEventListener('click', () => toggleViewer('mane_redhood'));
document.getElementById('card-mane-whiteknit').addEventListener('click', () => toggleViewer('mane_whiteknit'));
document.getElementById('card-mane-whitepadding').addEventListener('click', () => toggleViewer('mane_whitepadding'));

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (activeViewer) {
        activeViewer.update(); // 활성화된 뷰어 업데이트
    }

    renderer.render(scene, camera); // Three.js 씬 렌더링
}
animate();

// Load scenes
loadScenesSequentially().then(() => {
    console.log('All scenes loaded successfully!');
    toggleViewer('mane_original'); // 초기 뷰어 설정
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * hw_ratio, window.innerHeight * hw_ratio);
});
