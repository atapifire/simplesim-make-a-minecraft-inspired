
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define block types
const blockTypes = {
  GRASS: { color: 0x00ff00, height: 1 },
  DIRT: { color: 0xff9900, height: 1 },
  STONE: { color: 0x777777, height: 1 }
};

// Define chunk size
const chunkSize = 16;

// Generate chunks
function generateChunk(x, z) {
  const chunk = [];
  for (let i = 0; i < chunkSize; i++) {
    chunk[i] = [];
    for (let j = 0; j < chunkSize; j++) {
      // Randomly select block type
      const blockType = Math.random() < 0.5 ? blockTypes.GRASS : Math.random() < 0.8 ? blockTypes.DIRT : blockTypes.STONE;
      chunk[i][j] = blockType;
    }
  }
  return chunk;
}

// Generate terrain
function generateTerrain() {
  const terrain = [];
  for (let i = -2; i <= 2; i++) {
    terrain[i] = [];
    for (let j = -2; j <= 2; j++) {
      terrain[i][j] = generateChunk(i * chunkSize, j * chunkSize);
    }
  }
  return terrain;
}

// Render terrain
function renderTerrain(terrain) {
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      const chunk = terrain[i][j];
      for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
          const blockType = chunk[x][z];
          const geometry = new THREE.BoxGeometry(1, blockType.height, 1);
          const material = new THREE.MeshBasicMaterial({ color: blockType.color });
          const block = new THREE.Mesh(geometry, material);
          block.position.set(i * chunkSize + x, 0, j * chunkSize + z);
          scene.add(block);
        }
      }
    }
  }
}

// Generate and render terrain
const terrain = generateTerrain();
renderTerrain(terrain);

// Set camera position
camera.position.set(0, 10, 10);

// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
