const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'propiedades-suntzu.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const propertyRegex = /<article class="property" id="property-(\d+)">([\s\S]*?)<\/article>/g;
const titleRegex = /<h2>(.*?)<\/h2>/;
const specsRegex = /<strong>📋 Especificaciones:<\/strong><br>\s*([\s\S]*?)\s*<\/div>/;
const descRegex = /<strong>📝 Descripción:<\/strong><br>\s*<p>([\s\S]*?)<\/p>/;
const imageRegex = /<img src="(.*?)" alt="(.*?)"/g;
const slugRegex = /href="https:\/\/www\.vivla\.com\/es\/listings\/(.*?)"/;

const properties = [];
let match;

while ((match = propertyRegex.exec(html)) !== null) {
  const content = match[2];
  
  const title = titleRegex.exec(content)?.[1] || '';
  const specs = specsRegex.exec(content)?.[1].replace(/\n/g, '').trim() || '';
  const description = descRegex.exec(content)?.[1].trim() || '';
  const slug = slugRegex.exec(content)?.[1] || `property-${match[1]}`;
  
  const images = [];
  let imgMatch;
  while ((imgMatch = imageRegex.exec(content)) !== null) {
    images.push(imgMatch[1]);
  }
  
  // Parse specs into individual fields if possible
  const specsParts = specs.split('|').map(s => s.trim()).filter(Boolean);
  
  properties.push({
    id: match[1],
    slug,
    title,
    specs: specsParts,
    description,
    images,
    originalUrl: `https://www.vivla.com/es/listings/${slug}`
  });
}

const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'properties.json'), JSON.stringify(properties, null, 2));
console.log(`Extracted ${properties.length} properties.`);
