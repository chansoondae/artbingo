const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 200x200 canvas
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');

// Fill background with transparency
ctx.clearRect(0, 0, 200, 200);

// Draw outer circle
ctx.strokeStyle = '#E53935';
ctx.lineWidth = 8;
ctx.beginPath();
ctx.arc(100, 100, 90, 0, 2 * Math.PI);
ctx.stroke();

// Draw inner circle
ctx.lineWidth = 4;
ctx.beginPath();
ctx.arc(100, 100, 75, 0, 2 * Math.PI);
ctx.stroke();

// Draw text
ctx.fillStyle = '#E53935';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('다녀옴', 100, 100);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/images/completed-stamp.png', buffer);

console.log('✓ Stamp image generated: public/images/completed-stamp.png');
