/**
 * scrape.js
 * Parsea el HTML de scraping de SunTzu y genera properties.json
 *
 * Uso:
 *   node scrape.js <ruta-al-html>
 *
 * Ejemplo:
 *   node scrape.js "C:\Users\matya\Desktop\Vivla_front\data\rag\propiedades-suntzu.html"
 */

const fs = require('fs');
const path = require('path');

// ── Leer el HTML ──────────────────────────────────────────────
const htmlPath = process.argv[2];
if (!htmlPath) {
  console.error('❌  Indica la ruta al HTML:\n   node scrape.js <ruta.html>');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf-8');

// ── Parser mínimo sin dependencias externas ───────────────────
// Extrae todos los <article class="property"> del HTML
function extractArticles(html) {
  const articles = [];
  const articleRe = /<article class="property" id="property-(\d+)">([\s\S]*?)<\/article>/g;
  let match;
  while ((match = articleRe.exec(html)) !== null) {
    articles.push({ num: match[1], body: match[2] });
  }
  return articles;
}

function getInner(html, tag, cls) {
  const re = cls
    ? new RegExp(`<${tag}[^>]*class="${cls}"[^>]*>([\\s\\S]*?)<\\/${tag}>`)
    : new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
}

function parseImages(body) {
  const imgs = [];
  const re = /<img\s+src="([^"]+)"/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    imgs.push(m[1]);
  }
  return imgs;
}

function parseSpecs(rawSpecs) {
  // rawSpecs tiene formato como: "4 | Dormitorios | 3 | Baños | 224 | m2 | Precio: 1.200.000"
  // o: "En construcción | 3 | Dormitorios | ..."
  const parts = rawSpecs.split('|').map(s => s.trim()).filter(Boolean);
  return parts;
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseOriginalUrl(body) {
  const m = body.match(/href="(https:\/\/www\.vivla\.com[^"]+)"/);
  return m ? m[1] : '';
}

// ── Procesar ──────────────────────────────────────────────────
const articles = extractArticles(html);
console.log(`✅  Encontradas ${articles.length} propiedades`);

const properties = articles.map(({ num, body }) => {
  // Título
  const titleRaw = getInner(body, 'h2', '');
  const title = stripTags(titleRaw);

  // Imágenes (solo del div .property-images)
  const imagesBlockMatch = body.match(/<div class="property-images">([\s\S]*?)<\/div>/);
  const images = imagesBlockMatch ? parseImages(imagesBlockMatch[1]) : [];

  // Specs
  const specsBlock = getInner(body, 'div', 'property-specs');
  const specsLine = stripTags(specsBlock)
    .replace('📋 Especificaciones:', '')
    .trim();
  const specs = parseSpecs(specsLine);

  // Descripción
  const contentBlock = getInner(body, 'div', 'property-content');
  const descRaw = stripTags(contentBlock)
    .replace('📝 Descripción:', '')
    .trim();

  // URL original
  const originalUrl = parseOriginalUrl(body);

  return {
    id: num,
    slug: slugify(title),
    title,
    specs,
    description: descRaw,
    images,
    originalUrl,
  };
});

// ── Escribir JSON ─────────────────────────────────────────────
const outPath = path.join(__dirname, 'src', 'data', 'properties.json');
fs.writeFileSync(outPath, JSON.stringify(properties, null, 2), 'utf-8');

console.log(`✅  properties.json actualizado con ${properties.length} propiedades`);
console.log(`📄  Guardado en: ${outPath}`);

// Preview de la primera propiedad
console.log('\n── Preview (propiedad 1) ──');
const p = properties[0];
console.log(`  Título: ${p.title}`);
console.log(`  Slug:   ${p.slug}`);
console.log(`  Specs:  ${p.specs.join(' | ')}`);
console.log(`  Imgs:   ${p.images.length} imágenes`);
console.log(`  URL:    ${p.originalUrl}`);
