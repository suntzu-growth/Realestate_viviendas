const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'propiedades-suntzu-yucatan-v6.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const propertyRegex = /<article class="property" id="property-(\d+)">([\s\S]*?)<\/article>/g;
const titleRegex = /<h2>(.*?)<\/h2>/;
const specsRegex = /<strong>📋 Especificaciones:<\/strong><br>\s*([\s\S]*?)\s*<\/div>/;
const descRegex = /<strong>📝 Descripción:<\/strong><br>\s*<p>([\s\S]*?)<\/p>/;
const imageRegex = /<img src="(.*?)" alt="(.*?)"/g;
const vivlaSlugRegex = /href="https:\/\/www\.vivla\.com\/es\/listings\/(.*?)"|data-address="/; // Adjusted to handle already modified HTML if needed

const properties = [];
let match;
let updatedHtml = html;

while ((match = propertyRegex.exec(html)) !== null) {
  const propertyId = match[1];
  const content = match[2];

  const title = titleRegex.exec(content)?.[1] || '';
  const specs = specsRegex.exec(content)?.[1]?.replace(/\n/g, '').trim() || '';
  const description = descRegex.exec(content)?.[1]?.trim() || '';

  // Generate slug from title
  const slug = slugify(title) || `property-${propertyId}`;

  // Extract Vivla slug for reference (if still exists in some form)
  const vivlaMatch = content.match(/https:\/\/www\.vivla\.com\/es\/listings\/([a-zA-Z0-9-]+)/);
  const vivlaSlug = vivlaMatch ? vivlaMatch[1] : slug;

  // Extract Location (Ubicación)
  const locationMatch = description.match(/Ubicación:\s*(.*?)\./);
  const location = locationMatch ? locationMatch[1].trim() : '';

  const images = [];
  let imgMatch;
  while ((imgMatch = imageRegex.exec(content)) !== null) {
    images.push(imgMatch[1]);
  }

  // Parse specs into individual fields
  const specsParts = specs.split('|').map(s => s.trim()).filter(Boolean);

  properties.push({
    id: propertyId,
    slug,
    title,
    specs: specsParts,
    description,
    images,
    location,
    originalUrl: `https://www.vivla.com/es/listings/${vivlaSlug}`
  });

  // Update HTML: Replace URL and Text with location
  if (location) {
    // Escape dots and other characters in vivlaSlug for regex
    const escapedSlug = vivlaSlug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // This regex targets the original link structure
    const fullLinkRegex = new RegExp(`<a href="https:\\/\\/www\\.vivla\\.com\\/es\\/listings\\/${escapedSlug}" class="property-url" target="_blank">Ver Detalles Completos →<\\/a>`, 'g');

    // Replace with a simple span or a link that shows the address
    const newElement = `<a href="#" class="property-url" data-address="${location}" onclick="alert('${location}'); return false;">${location}</a>`;

    updatedHtml = updatedHtml.replace(fullLinkRegex, newElement);

    // Fallback: If it was already partially replaced (e.g. href="#"), target the remaining text
    const partialLinkRegex = new RegExp(`href="#" data-address="${location.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}"[^>]*>Ver Detalles Completos →<\\/a>`, 'g');
    updatedHtml = updatedHtml.replace(partialLinkRegex, `href="#" data-address="${location}" onclick="alert('${location}'); return false;">${location}</a>`);
  }
}

// Since we want to ensure titles and addresses are fully synced, let's regenerate the HTML content logically if needed,
// but for now, the user specifically asked about the URLs of the pages (slugs in properties.json).

// Write updated HTML back
fs.writeFileSync(htmlPath, updatedHtml);

const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'properties.json'), JSON.stringify(properties, null, 2));
console.log(`Updated ${properties.length} properties in properties.json with new slugs matching titles.`);
