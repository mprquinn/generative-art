const canvasSketch = require('canvas-sketch');
const {
  lerp
} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
// random.setSeed(random.getRandomSeed());
random.setSeed('MichaelQuinn');

const settings = {
  // dimensions: [2048, 2048],
  dimensions: 'A4',
  suffix: random.getSeed()
};

const goodSeeds = [
  '999363',
  '774099'
]

console.log(random.getSeed());

const sketch = () => {
  // random.setSeed(',,...///// //,,mn')
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  const background = random.pick(palettes)[4];
  console.log(background);
  const createGrid = () => {
    const points = [];
    const count = 30;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v) * 0.065);
        points.push({
          color: random.pick(palette),
          position: [u, v],
          // radius: Math.abs(0.01 + random.gaussian() * 0.01)
          radius,
          rotation: random.noise2D(u, v)
        });
      }
    }
    return points;
  }

  // random.setSeed('Mike');
  const points = createGrid().filter(() => random.gaussian() > -0.5);
  const margin = 100;
  console.log(points);

  return ({
    context,
    width,
    height
  }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach((data, i) => {
      const {
        color,
        position,
        radius,
        rotation,
      } = data;

      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, true);
      // // context.strokeStyle = '#000000';
      // // context.fill();
      // // context.fillStyle = `hsl(${lerp(0, 360, v)},90%,80%)`;
      // // context.strokeStyle = `hsl(${lerp(0, 360, v)},90%,70%)`;
      // context.fillStyle = color
      // context.lineWidth = 20;
      // // context.stroke();
      // context.fill();
      context.save();
      context.fillStyle = color;
      context.translate(x, y);
      context.rotate(rotation);
      context.font = `${radius * width * 5}px "Helvetica"`;
      context.fillText('|', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);