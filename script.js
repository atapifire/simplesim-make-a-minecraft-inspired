
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

// Define terrain size
const terrainSize = 10;

// Simplex noise function
function simplexNoise(x, z, seed) {
  const rand = Math.sin((x + seed) * 12.9898 + (z + seed) * 78.233) * 43758.5453;
  return rand - Math.floor(rand);
}

// Generate height map
function generateHeightMap(x, z, seed) {
  const heightMap = [];
  for (let i = 0; i < chunkSize; i++) {
    heightMap[i] = [];
    for (let j = 0; j < chunkSize; j++) {
      const noise = simplexNoise((x * chunkSize + i) / 10, (z * chunkSize + j) / 10, seed);
      heightMap[i][j] = Math.floor((noise + 1) / 2 * 10);
    }
  }
  return heightMap;
}

// Generate chunk
function generateChunk(x, z, seed) {
  const chunk = [];
  const heightMap = generateHeightMap(x, z, seed);
  for (let i = 0; i < chunkSize; i++) {
    chunk[i] = [];
    for (let j = 0; j < chunkSize; j++) {
      const height = heightMap[i][j];
      for (let k = 0; k < height; k++) {
        if (k < height - 2) {
          chunk[i][j] = blockTypes.STONE;
        } else if (k < height - 1) {
          chunk[i][j] = blockTypes.DIRT;
        } else {
          chunk[i][j] = blockTypes.GRASS;
        }
      }
    }
  }
  return chunk;
}

// Generate terrain
function generateTerrain() {
  const terrain = [];
  for (let i = -terrainSize; i <= terrainSize; i++) {
    terrain[i] = [];
    for (let j = -terrainSize; j <= terrainSize; j++) {
      terrain[i][j] = generateChunk(i, j, 12345);
    }
  }
  return terrain;
}

// Render terrain
function renderTerrain(terrain) {
  for (let i = -terrainSize; i <= terrainSize; i++) {
    for (let j = -terrainSize; j <= terrainSize; j++) {
      const chunk = terrain[i][j];
      for (let x = 0; x < chunkSize; x++) {
        for (let z = 0; z < chunkSize; z++) {
          const blockType = chunk[x][z];
          if (blockType) {
            const geometry = new THREE.BoxGeometry(1, blockType.height, 1);
            const material = new THREE.MeshBasicMaterial({ color: blockType.color });
            const block = new THREE.Mesh(geometry, material);
            block.position.set(i * chunkSize + x, blockType.height / 2, j * chunkSize + z);
            scene.add(block);
          }
        }
      }
    }
  }
}

// Generate and render terrain
const terrain = generateTerrain();
renderTerrain(terrain);

// Set camera position
camera.position.set(0, 50, 50);

// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
