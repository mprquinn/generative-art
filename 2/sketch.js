const canvasSketch = require('canvas-sketch');
const {
  lerp
} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0,colorCount);

  const createGrid = () => {
    const points = [];
    const count = 30;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          color: random.pick(palette),
          position: [u, v],
          radius: Math.abs(0.01 + random.gaussian() * 0.01)
        });
      }
    }
    return points;
  }

  random.setSeed('Mike');
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

    points.forEach(data => {
      const {
        color,
        position,
        radius
      } = data;

      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, true);
      // context.strokeStyle = '#000000';
      // context.fill();
      // context.fillStyle = `hsl(${lerp(0, 360, v)},90%,80%)`;
      // context.strokeStyle = `hsl(${lerp(0, 360, v)},90%,70%)`;
      context.fillStyle = color
      context.lineWidth = 20;
      // context.stroke();
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);