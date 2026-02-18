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

  // Update HTML: Replace URL with location (if not already done)
  // Note: Since we already modified the HTML in the previous step, we might need to be careful.
  // But the previous step replaced it with: href="#" data-address="${location}" ... Ver Detalles Completos →

  // If we want the HTML to show the address instead of "Ver Detalles...", let's ensure it's correct.
  if (location) {
    // This regex looks for either the old Vivla link or the new placeholder link
    // We need to use the vivlaSlug here to target the specific original link
    const urlPattern = new RegExp(`href="https:\\/\\/www\\.vivla\\.com\\/es\\/listings\\/${vivlaSlug}"`, 'g');
    updatedHtml = updatedHtml.replace(urlPattern, `href="#" data-address="${location}" title="${location}" onclick="alert('${location}'); return false;"`);

    // Let's replace the link text and href.
    // This regex needs to be robust enough to catch the original link text or the already modified one.
    // We'll target the original "Ver Detalles Completos →" text associated with the Vivla URL.
    const linkRegex = new RegExp(`(<a href=")https:\\/\\/www\\.vivla\\.com\\/es\\/listings\\/${vivlaSlug}(" class="property-url" target="_blank">)Ver Detalles Completos →(<\\/a>)`, 'g');
    updatedHtml = updatedHtml.replace(linkRegex, `$1#$2${location}$3`);
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
