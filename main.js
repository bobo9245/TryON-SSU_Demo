import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

// Create Three.js Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.scale.x = -1;

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(1, 1, 1).normalize();
// scene.add(light); // 조명 추가

// Create Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

// Create Renderer
const renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
renderer.setClearColor(0xffffff,1);
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
