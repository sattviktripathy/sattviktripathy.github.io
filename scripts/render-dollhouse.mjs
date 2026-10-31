// One-off: renders the TruSpace demo home into the scroll frames in public/seq.
//   node scripts/render-dollhouse.mjs           all frames
//   node scripts/render-dollhouse.mjs 0 36 71   only these frames, into the scratch folder in OUT
// The camera is orthographic so frame 0 lines up exactly with the SVG plan drawn on the page.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const GLB = resolve(process.env.HOME, 'truspace-website/public/models/refdemo-dollhouse.glb');
const COUNT = 72;
const SIDE = 1100;
const SPAN = 14.2; // metres shown across the square. Drives public scale and the SVG viewBox.
const picked = process.argv.slice(2).map(Number);
const OUT = process.env.OUT ?? resolve(ROOT, 'public/seq');
mkdirSync(`${OUT}/lg`, { recursive: true });
mkdirSync(`${OUT}/sm`, { recursive: true });

const types = { '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.html': 'text/html' };
const html = `<!doctype html><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(${SIDE}, ${SIDE});
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.75;

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(-7, 16, 9);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 45 });
scene.add(sun);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.32 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

const half = ${SPAN} / 2;
const camera = new THREE.OrthographicCamera(-half, half, half, -half, 0.1, 200);

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const gltf = await loader.loadAsync('/model.glb');
const home = gltf.scene;
const names = [];
home.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; names.push(o.name); } });
const box = new THREE.Box3().setFromObject(home);
const size = box.getSize(new THREE.Vector3());
const centre = box.getCenter(new THREE.Vector3());
home.position.set(-centre.x, -box.min.y, -centre.z);
const rig = new THREE.Group();
rig.add(home);
scene.add(rig);

// The ceiling lamps read as noisy grey squares from above, so they stay out of the render.
home.traverse((o) => { if (o.isMesh && /ceiling_light/.test(o.material?.name ?? '')) o.visible = false; });

const ease = (t) => t * t * (3 - 2 * t);
window.frame = (t) => {
  const rise = ease(Math.min(1, Math.max(0, (t - 0.08) / 0.92)));
  const tilt = ease(Math.min(1, t / 0.9));
  rig.scale.y = Math.max(0.002, rise);
  const elevation = THREE.MathUtils.degToRad(90 - 53 * tilt);
  const azimuth = THREE.MathUtils.degToRad(-38 * tilt);
  const r = 50;
  camera.position.set(
    r * Math.cos(elevation) * Math.sin(azimuth),
    r * Math.sin(elevation),
    r * Math.cos(elevation) * Math.cos(azimuth),
  );
  camera.up.set(0, 1, 0);
  if (tilt < 1e-4) camera.up.set(0, 0, -1);
  // The target drifts up a touch so the risen house stays centred in the square.
  camera.lookAt(0, 1.0 * rise, 0);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/png');
};
window.ready = { size: size.toArray(), centre: centre.toArray(), box: [box.min.toArray(), box.max.toArray()], names };
</script>`;

const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-webgl', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: SIDE, height: SIDE } });
page.on('pageerror', (e) => console.error('page error', e.message));
await page.route('http://render.local/**', (route) => {
  const path = new URL(route.request().url()).pathname;
  if (path === '/') return route.fulfill({ contentType: types['.html'], body: html });
  if (path === '/favicon.ico') return route.fulfill({ status: 204 });
  if (path === '/model.glb') return route.fulfill({ contentType: types['.glb'], body: readFileSync(GLB) });
  const file = resolve(ROOT, 'node_modules', path.slice(1));
  return route.fulfill({ contentType: types['.js'], body: readFileSync(file) });
});
await page.goto('http://render.local/');
await page.waitForFunction(() => window.ready, null, { timeout: 120000 });
const info = await page.evaluate(() => window.ready);
writeFileSync(`${OUT}/info.json`, JSON.stringify({ ...info, names: [...new Set(info.names)].slice(0, 400), span: SPAN }, null, 1));
console.log('model size', info.size, 'centre', info.centre, 'meshes', info.names.length);

const list = picked.length ? picked : [...Array(COUNT).keys()];
let total = [0, 0];
for (const i of list) {
  const url = await page.evaluate((t) => window.frame(t), i / (COUNT - 1));
  const png = Buffer.from(url.split(',')[1], 'base64');
  const name = String(i).padStart(2, '0');
  const lg = await sharp(png).resize(1000).webp({ quality: 74, alphaQuality: 80, effort: 6 }).toFile(`${OUT}/lg/${name}.webp`);
  const sm = await sharp(png).resize(700).webp({ quality: 66, alphaQuality: 70, effort: 6 }).toFile(`${OUT}/sm/${name}.webp`);
  total = [total[0] + lg.size, total[1] + sm.size];
  if (picked.length) await sharp(png).toFile(`${OUT}/f${name}.png`);
}
console.log(`frames ${list.length}, lg ${(total[0] / 1e6).toFixed(2)}MB, sm ${(total[1] / 1e6).toFixed(2)}MB`);
await browser.close();
