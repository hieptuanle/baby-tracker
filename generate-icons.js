const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#667eea"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="white" opacity="0.9"/>
    <text x="${size/2}" y="${size/2}" font-family="Arial" font-size="${size/4}px" fill="#667eea" text-anchor="middle" dominant-baseline="middle">👶</text>
  </svg>`;
};

// Generate icons for all required sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = createIcon(size);
  const filename = path.join(__dirname, 'public', 'icons', `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');