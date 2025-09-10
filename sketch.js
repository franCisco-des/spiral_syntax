let userInput = "INSERT TEXT";
let baseRadiusBase = 120;
let monumentRegular;

let fontSizeGlobal = 28;
let letterSpacingExtra = 0;
let letterStretchX = 1;
let letterStretchY = 1;
let amountSliderValue = 10;
let outerAmountSliderValue = 5;
let circleSpacing = 20;
let rotationSpeed = 0.01; // Para garantir que o loop funcione

let isPaused = false;

let time = 0;

// Create a capturer that exports a WebM video
let canvas;
let currentExportFrame = 1;

let recorder, chunks = [];
let recording = false;
let recordBtn;
let downloadBtn;

function preload() {
  monumentRegular = loadFont('monument-grotesk-regular.otf');
}

function setup() {
  canvas = createCanvas(1000, 600);
  canvas.parent('canvas-container');

  textAlign(CENTER, CENTER);

  // Inputs e sliders
  const inputText = document.getElementById('inputText');
  const amountSlider = document.getElementById('amountSlider');
  const outerAmountSlider = document.getElementById('outerAmountSlider');
  const spacingSlider = document.getElementById('spacingSlider');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const letterSpacingSlider = document.getElementById('letterSpacingSlider');
  const letterStretchSlider = document.getElementById('letterStretchSlider');
  const letterStretchYSlider = document.getElementById('letterStretchYSlider');
  const speedSlider = document.getElementById('speedSlider');

  const amountValueLabel = document.getElementById('amountValue');
  const outerAmountValueLabel = document.getElementById('outerAmountValue');
  const spacingValueLabel = document.getElementById('spacingValue');
  const fontSizeValueLabel = document.getElementById('fontSizeValue');
  const letterSpacingValueLabel = document.getElementById('letterSpacingValue');
  const letterStretchValueLabel = document.getElementById('letterStretchValue');
  const letterStretchYValueLabel = document.getElementById('letterStretchYValue');
  const speedValueLabel = document.getElementById('speedValue');

  inputText.addEventListener('input', () => {
    userInput = inputText.value;
    redraw();
  });

  amountSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(amountSlider);
    redraw();
  });

  outerAmountSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(outerAmountSlider);
    redraw();
  });

  spacingSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(spacingSlider);
    redraw();
  });

  fontSizeSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(fontSizeSlider);
    redraw();
  });

  letterSpacingSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(letterSpacingSlider);
    redraw();
  });

  letterStretchSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(letterStretchSlider);
    redraw();
  });

  letterStretchYSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(letterStretchYSlider);
    redraw();
  });

  speedSlider.addEventListener('input', () => {
    updateValues();
    updateSliderBackground(speedSlider);
    redraw();
  });

  // Atualiza o background de todos os sliders ao iniciar
  updateSliderBackground(amountSlider);
  updateSliderBackground(outerAmountSlider);
  updateSliderBackground(spacingSlider);
  updateSliderBackground(fontSizeSlider);
  updateSliderBackground(letterSpacingSlider);
  updateSliderBackground(letterStretchSlider);
  updateSliderBackground(letterStretchYSlider);
  updateSliderBackground(speedSlider);

  frameRate(30);

  // // Se velocidade > 0, ativa loop
  // if (rotationSpeed > 0) loop();

  updateValues();
  redraw();

  // Botão random
  const randomButton = document.getElementById('randomButton');
  randomButton.addEventListener('click', () => {
    fontSizeSlider.value = Math.floor(Math.random() * (72 - 8 + 1)) + 8;
    letterSpacingSlider.value = Math.floor(Math.random() * 51);
    letterStretchSlider.value = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    letterStretchYSlider.value = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    amountSlider.value = Math.floor(Math.random() * 51);
    outerAmountSlider.value = Math.floor(Math.random() * 17);
    spacingSlider.value = Math.floor(Math.random() * 51);
    speedSlider.value = (Math.random() * 0.1).toFixed(3);

    updateValues();
    updateSliderBackground(fontSizeSlider);
    updateSliderBackground(letterSpacingSlider);
    updateSliderBackground(letterStretchSlider);
    updateSliderBackground(letterStretchYSlider);
    updateSliderBackground(amountSlider);
    updateSliderBackground(outerAmountSlider);
    updateSliderBackground(spacingSlider);
    updateSliderBackground(speedSlider);

    redraw();
  });

  // Botão pause/resume
const toggleAnimationButton = document.getElementById('toggleAnimationButton');
toggleAnimationButton.addEventListener('click', () => {
  isPaused = !isPaused;
  toggleAnimationButton.textContent = isPaused ? "Resume" : "Pause";
});

  // Botão exportar PNG
  const exportImgButton = document.getElementById('exportImgButton');
  exportImgButton.addEventListener('click', () => {
    saveCanvas('parametric_circle', 'png');
  });

  // Botão Record
  recordBtn = select("#recordBtn");
  recordBtn.mousePressed(toggleRecording);
}

function draw() {
  background(255);

  noFill();
  stroke(0);
  strokeWeight(4);
  rect(0, 0, width, height);

  let centerX = width / 2;
  let centerY = height / 2;

  // Apenas avança a variável de tempo (movimento) quando não estiver pausado
  if (!isPaused) {
    time += rotationSpeed;
  }

  // --- restante desenho (mantém o teu código tal como estava) ---
  // Inner circles girando horário
  for (let i = 0; i < amountSliderValue; i++) {
    let radius = baseRadiusBase - (circleSpacing * (i + 1));
    if (radius < -20) break;
    drawTextCircle(centerX, centerY, radius, userInput, time * (i + 1));
  }

  // Círculo base
  drawTextCircle(centerX, centerY, baseRadiusBase, userInput, -time);

  // Outer circles...
  let outerRadius = baseRadiusBase;
  for (let i = 0; i < outerAmountSliderValue; i++) {
    let radius = outerRadius + circleSpacing;
    let circumference = TWO_PI * radius;
    textSize(28);
    let textLength = 0;
    for (let c of userInput) {
      textLength += textWidth(c) + 90;
    }
    let fontByCircumference = (circumference / textLength) * fontSizeGlobal;
    let fontByRatio = fontSizeGlobal * (radius / baseRadiusBase);
    let adjustedFontSize = min(fontByCircumference, fontByRatio);
    adjustedFontSize = max(4, adjustedFontSize);

    outerRadius = radius + adjustedFontSize * 0.75;
    drawTextCircle(centerX, centerY, outerRadius, userInput, -time * (i + 1));
  }
}

function drawTextCircle(cx, cy, radius, txt, rotation = 0) {
  textFont(monumentRegular);
  let baseFontSize = fontSizeGlobal;
  let minFontSize = 1;

  let circumference = TWO_PI * radius;

  textSize(baseFontSize);
  let totalTextWidth = 0;
  for (let i = 0; i < txt.length; i++) {
    totalTextWidth += textWidth(txt[i]) + 1 + letterSpacingExtra;
  }

  let maxFontByCircumference = (circumference / totalTextWidth) * baseFontSize;
  let fontByRadiusRatio = baseFontSize * (radius / baseRadiusBase);

  let adjustedFontSize = min(maxFontByCircumference, fontByRadiusRatio);
  adjustedFontSize = max(minFontSize, adjustedFontSize);

  textSize(adjustedFontSize);

  noFill();
  stroke(0, 100);
  strokeWeight(0);
  ellipse(cx, cy, radius * 2);

  push();
  translate(cx, cy);
  rotate(rotation);

  let totalAngle = 0;
  for (let i = 0; i < txt.length; i++) {
    let c = txt[i];
    let w = textWidth(c) + 1 + letterSpacingExtra;
    let charAngle = (w / circumference) * TWO_PI;

    let angle = totalAngle - HALF_PI;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + HALF_PI);
    scale(letterStretchX, letterStretchY);
    fill(0);
    noStroke();
    text(c, 0, 0);
    pop();

    totalAngle += charAngle;
  }
  pop();
}

function updateSliderBackground(slider) {
  const min = +slider.min;
  const max = +slider.max;
  const val = +slider.value;
  const percent = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, white 0%, white ${percent}%, #222 ${percent}%, #222 100%)`;
}

function updateValues() {
  const inputText = document.getElementById('inputText');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const letterSpacingSlider = document.getElementById('letterSpacingSlider');
  const letterStretchSlider = document.getElementById('letterStretchSlider');
  const letterStretchYSlider = document.getElementById('letterStretchYSlider');
  const amountSlider = document.getElementById('amountSlider');
  const outerAmountSlider = document.getElementById('outerAmountSlider');
  const spacingSlider = document.getElementById('spacingSlider');
  const speedSlider = document.getElementById('speedSlider');

  userInput = inputText.value;
  fontSizeGlobal = +fontSizeSlider.value;
  letterSpacingExtra = +letterSpacingSlider.value;
  letterStretchX = +letterStretchSlider.value / 100;
  letterStretchY = +letterStretchYSlider.value / 100;
  amountSliderValue = +amountSlider.value;
  outerAmountSliderValue = +outerAmountSlider.value;
  circleSpacing = +spacingSlider.value;
  rotationSpeed = +speedSlider.value;

  document.getElementById('fontSizeValue').textContent = fontSizeGlobal;
  document.getElementById('letterSpacingValue').textContent = letterSpacingExtra;
  document.getElementById('letterStretchValue').textContent = Math.round(letterStretchX * 100) + '%';
  document.getElementById('letterStretchYValue').textContent = Math.round(letterStretchY * 100) + '%';
  document.getElementById('amountValue').textContent = amountSliderValue;
  document.getElementById('outerAmountValue').textContent = outerAmountSliderValue;
  document.getElementById('spacingValue').textContent = circleSpacing;
  document.getElementById('speedValue').textContent = rotationSpeed.toFixed(3);

//   if(rotationSpeed === 0){
//   noLoop();
// } else {
//   loop();
// }
}

function toggleRecording() {
  if (!recording) {
    // iniciar gravação
    let stream = document.querySelector("canvas").captureStream(60);
    recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 12000000   });

     chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = e => {
      let blob = new Blob(chunks, { type: "video/webm" });
      let url = URL.createObjectURL(blob);

      // criar botão download
      if (downloadBtn) downloadBtn.remove(); // se já existe, remove
      downloadBtn = createA(url, "Download vídeo");
      downloadBtn.attribute("download", "canvas-recording.webm");
      downloadBtn.parent("controls"); // mete no mesmo div dos botões
      downloadBtn.class("download-link");
    };

    recorder.start();
    recordBtn.html("Stop");
    recording = true;
  } else {
      // parar gravação
    recorder.stop();
    recordBtn.html("Record");
    recording = false;
  }
}
