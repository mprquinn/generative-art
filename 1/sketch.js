const canvasSketch = require('canvas-sketch');
const {
  lerp
} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {

  const createGrid = () => {
    const points = [];
    const count = 20;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  }

  random.setSeed('Sara');
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 100;
  console.log(points);

  return ({
    context,
    width,
    height
  }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, 20, 0, Math.PI * 2, true);
      // context.strokeStyle = '#000000';
      // context.fill();
      context.fillStyle = `hsl(${lerp(0, 360, u)},90%,80%)`;
      context.strokeStyle = `hsl(${lerp(0, 360, u)},90%,70%)`;
      context.lineWidth = 20;
      context.stroke();
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);