const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');
// random.setSeed('Mike Quinn');
// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  dimensions: [512, 512],
  fps: 24,
  duration: 6,
  // Turn on MSAA
  attributes: {
    antialias: true
  }
};

const sketch = ({
  context
}) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 97%)', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  
  // Setup your scene
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry(1, 1, 1);

  const palette = random.pick(palettes);

 
  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshBasicMaterial({
        // color: random.pick(palette),
        color: `hsl(${Math.abs(random.noise3D(i*200, i * 0.01, i*200) * 360)}, 75%, 80%)`
      })
    );
    mesh.position.set(
      random.noise3D(i * 4, -i, -i),
      random.noise3D(i * 2, -i, i),
      random.noise3D(i * 4, -i, i)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    )
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight(random.pick(palette)));

  const light = new THREE.DirectionalLight('#ffffff', 1.1);
  scene.add(light);
  light.position.set(0, 0, 4);

  // const easeFn = BezierEasing();

  // draw each frame
  return {
    // Handle resize events here
    resize({
      pixelRatio,
      viewportWidth,
      viewportHeight
    }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({
      time,
      playhead
    }) {
      const t = Math.sin(playhead * Math.PI * 2) * 2;
      scene.rotation.y = eases.expoInOut(t);
      scene.rotation.z = eases.expoInOut(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);