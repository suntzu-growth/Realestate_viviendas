const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'propiedades-suntzu-yucatan-v7.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const propertyRegex = /<article class="property" id="property-(\d+)">([\s\S]*?)<\/article>/g;
const titleRegex = /<h2>(.*?)<\/h2>/;
const refRegex = /Referencia:<\/strong>\s*([\w-]+)/;
const specsRegex = /<strong>📋 Especificaciones:<\/strong><br>\s*([\s\S]*?)\s*<\/div>/;
const descRegex = /<strong>📝 Descripción:<\/strong><br>\s*<p>([\s\S]*?)<\/p>/;
const imageRegex = /<img src="(.*?)" alt="(.*?)"/g;

const properties = [];
let match;
let updatedHtml = html;

while ((match = propertyRegex.exec(html)) !== null) {
  const propertyId = match[1];
  const content = match[2];

  const title = titleRegex.exec(content)?.[1] || '';
  const slug = slugify(title);
  const specs = specsRegex.exec(content)?.[1]?.replace(/\n/g, '').trim() || '';
  const description = descRegex.exec(content)?.[1]?.trim() || '';

  // Extract Location (Ubicación)
  const locationMatch = description.match(/Ubicación:\s*(.*?)\./);
  const location = locationMatch ? locationMatch[1].trim() : '';

  const images = [];
  let imgMatch;
  while ((imgMatch = imageRegex.exec(content)) !== null) {
    images.push(imgMatch[1]);
  }

  const specsParts = specs.split('|').map(s => s.trim()).filter(Boolean);

  properties.push({
    id: propertyId,
    slug,
    title,
    specs: specsParts,
    description,
    images,
    location,
    originalUrl: `https://www.vivla.com/es/listings/${slug}`
  });

  // Update HTML: Use absolute Vercel link with name-based slug
  const linkRegex = /<a [^>]*class="property-url"[^>]*>.*?<\/a>/;

  // Find property in updatedHtml
  const propertyToFind = `<article class="property" id="property-${propertyId}">`;
  const startIndex = updatedHtml.indexOf(propertyToFind);
  if (startIndex !== -1) {
    const endIndex = updatedHtml.indexOf('</article>', startIndex) + 10;
    let propertyHtml = updatedHtml.substring(startIndex, endIndex);

    const absoluteUrl = `https://realestate-viviendas.vercel.app/${slug}`;
    const newLink = `<a href="${absoluteUrl}" class="property-url" target="_blank">Ver Detalles Completos →</a>`;
    propertyHtml = propertyHtml.replace(linkRegex, newLink);

    // REMOVE property-ref if present to look exactly like the reference
    propertyHtml = propertyHtml.replace(/<div class="property-ref">.*?<\/div>/s, '');

    // REMOVE any leaked RAG_METADATA
    propertyHtml = propertyHtml.replace(/<!-- RAG_METADATA:.*? -->/g, '');

    updatedHtml = updatedHtml.substring(0, startIndex) + propertyHtml + updatedHtml.substring(endIndex);
  }
}

fs.writeFileSync(htmlPath, updatedHtml);

const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'properties.json'), JSON.stringify(properties, null, 2));
console.log(`Updated ${properties.length} properties. v7.html now looks exactly like the reference but with correct URLs.`);
