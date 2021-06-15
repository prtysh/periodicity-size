let boids = [];
var offsetValue,
  seed = 0,
  t = 0,
  delta = 0.02;

function setup() {
  createCanvas(800, 800);
  rectMode(CENTER);
  offsetValue = createVector(100, 100);
  for (let i = 0; i < 40; i++) {
    for (let j = 0; j < 40; j++) {
      boids.push(new Boid(10 + i * 20, 10 + j * 20, 1));
    }
  }
  colorMode(HSB);
  rectMode(CENTER);
}

function draw() {
  background(0);
  t = t + delta;
  delta = probabilityGate(4, delta);
  for (let i = 0; i < boids.length; i++) {
    boids[i].render();
    boids[i].mutate();
  }
  offsetValue = createVector(
    periodicFunction(seed, width / 3, (2 * width) / 3, 1),
    periodicFunction(-seed, height / 3, (2 * height) / 3, 1)
  );
}

class Boid {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.type = type;
  }

  mutate() {
    if (random(1) < 0.001) {
      this.type = ceil(random(0,3));
    }
  }

  render() {
    // fill(periodicFunction(1, 2, 255, 1), 50, 50, 0.4);
    // stroke(periodicFunction(1, 2, 255, 1), 50, 50);
    let size = periodicFunction(
      t - offset(this.position.x, this.position.y),
      4,
      16,
      1
    );
    if (this.type == 1) {
      stroke(size * 6, 50, 50);
      strokeWeight(map(size, 4, 16, 2, 4));
      fill(60, 83, 100, 0.85);
      rect(this.position.x, this.position.y, size, size);
    } else if (this.type == 2) {
      noFill();
      let centerVect = createVector(width / 2, height / 2);
      push();
      translate(width / 2, height / 2);
      let tempVect = createVector(
        this.position.x - width / 2,
        this.position.y - height / 2
      );
      let angle = tempVect.heading();
      pop();

      arc(
        width / 2,
        height / 2,
        (2 *
          dist(this.position.x, this.position.y, centerVect.x, centerVect.y)) /
          cos(angle),
        (2 *
          dist(this.position.x, this.position.y, centerVect.x, centerVect.y)) /
          sin(angle),
        angle - HALF_PI / 100,
        angle + HALF_PI / 100
      );
    } else {
      stroke(size * 6, 50, 50);
      strokeWeight(map(size, 4, 16, 2, 4));
      fill(60, 83, 100, 0.85);
      circle(this.position.x, this.position.y, size);
    }
  }
}

// 2* dist(this.position.x, this.position.y, centerVect.x, centerVect.y),
// 2* dist(this.position.x, this.position.y, centerVect.x, centerVect.y),

function periodicFunction(p, min, max, ratio) {
  return map(sin((PI * p) / ratio), -1, 1, min, max);
}

function offset(x, y) {
  return 0.01 * dist(x, y, offsetValue.x, offsetValue.y);
}

function probabilityGate(p, v) {
  if (random(1) < p / 100) {
    v = -1 * v;
  }
  return v;
}
