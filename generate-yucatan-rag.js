/**
 * generate-yucatan-rag.js
 *
 * Combina propiedades-suntzu-yucatan-v2.html (nombres, descripciones, links a demo.ceibaprime.mx)
 * con las imágenes reales de nuestro properties.json (CDN Webflow),
 * generando un HTML RAG optimizado para el agente.
 *
 * Uso:
 *   node generate-yucatan-rag.js
 *
 * Output:
 *   data/rag/propiedades-suntzu-yucatan.html
 */

const fs = require('fs');
const path = require('path');

const YUCATAN_HTML = 'C:/Users/matya/Downloads/propiedades-suntzu-yucatan-v2.html';
const PROPERTIES_JSON = path.join(__dirname, 'src', 'data', 'properties.json');
const OUTPUT_DIR = path.join(__dirname, 'data', 'rag');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'propiedades-suntzu-yucatan.html');
const VERCEL_BASE = 'https://realestate-viviendas.vercel.app';

// --- Cargar datos ---
const yucHtml = fs.readFileSync(YUCATAN_HTML, 'utf-8');
const properties = JSON.parse(fs.readFileSync(PROPERTIES_JSON, 'utf-8'));

// --- Parsear artículos del HTML de Yucatán ---
function parseYucatanArticles(html) {
  const articles = [];
  // Split por <article para no depender de regex con backreference
  const parts = html.split('<article class="property"');
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const idMatch = chunk.match(/id="property-(\d+)"/);
    const id = idMatch ? parseInt(idMatch[1]) : i;

    const titleMatch = chunk.match(/<h2>(.*?)<\/h2>/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const hrefMatch = chunk.match(/href="(https:\/\/demo\.ceibaprime\.mx[^"]+)"/);
    const href = hrefMatch ? hrefMatch[1] : '';
    const slug = href.split('/listings/')[1] || '';

    const descMatch = chunk.match(/<p>([\s\S]*?)<\/p>/);
    const desc = descMatch ? descMatch[1].trim() : '';

    // Extraer specs (línea entre 📋 y </div>)
    const specsMatch = chunk.match(/📋 Especificaciones:<\/strong><br\/?>\s*([\s\S]*?)\s*<\/div>/);
    const specs = specsMatch ? specsMatch[1].trim().replace(/\s+/g, ' ') : '';

    articles.push({ id, title, slug, href, desc, specs });
  }
  return articles;
}

// --- Parsear specs legibles ---
function parseSpecsText(specsRaw) {
  // Formato: "| 4 | Dormitorios | 3 | Baños | 224 | m2 | Precio: 1.200.000"
  // o "En construcción | 3 | Dormitorios..."
  const parts = specsRaw.split('|').map(s => s.trim()).filter(Boolean);
  const result = { dormitorios: null, banos: null, superficie: null, precio: null, extras: [] };

  for (let i = 0; i < parts.length; i++) {
    const item = parts[i];
    if (item.startsWith('Precio:')) { result.precio = item.replace('Precio:', '').trim(); continue; }
    if (item === 'En construcción') { result.extras.push('En construcción'); continue; }
    const next = parts[i + 1] || '';
    if (next.toLowerCase() === 'dormitorios') { result.dormitorios = item; i++; }
    else if (next.toLowerCase() === 'baños' || next.toLowerCase() === 'banos') { result.banos = item; i++; }
    else if (next.toLowerCase() === 'm2' || next.toLowerCase() === 'm²') { result.superficie = item; i++; }
    else { result.extras.push(item); }
  }
  return result;
}

function formatSpecs(specsRaw) {
  const p = parseSpecsText(specsRaw);
  const parts = [];
  if (p.extras.length) parts.push(...p.extras);
  if (p.dormitorios) parts.push(`${p.dormitorios} Dormitorios`);
  if (p.banos) parts.push(`${p.banos} Baños`);
  if (p.superficie) parts.push(`${p.superficie} m²`);
  if (p.precio) parts.push(`Precio: ${p.precio} €`);
  return parts.join(' | ');
}

function makeSummary(specsRaw) {
  const p = parseSpecsText(specsRaw);
  const parts = [];
  if (p.dormitorios) parts.push(`${p.dormitorios} dorm`);
  if (p.banos) parts.push(`${p.banos} baños`);
  if (p.superficie) parts.push(`${p.superficie} m²`);
  if (p.precio) parts.push(`${p.precio} €`);
  return parts.join(', ');
}

// --- Generar HTML de cada propiedad ---
function buildArticle(yuc, images, vercelSlug) {
  // URL de nuestra web de Vercel (donde realmente existe la página)
  const vercelUrl = `${VERCEL_BASE}/${vercelSlug}`;
  const specsText = formatSpecs(yuc.specs);
  const summary = makeSummary(yuc.specs);
  const parsed = parseSpecsText(yuc.specs);

  const imagesSummary = images.map((img, i) => `image_${i + 1}: ${img}`).join(' | ');
  const imagesHtml = images.map((img, i) =>
    `            <img src="${img}" alt="${yuc.title} - Imagen ${i + 1}" loading="lazy">`
  ).join('\n');

  const specsDetailHtml = [
    parsed.dormitorios ? `<span class="spec-item"><strong>🛏 Dormitorios:</strong> ${parsed.dormitorios}</span>` : '',
    parsed.banos ? `<span class="spec-item"><strong>🚿 Baños:</strong> ${parsed.banos}</span>` : '',
    parsed.superficie ? `<span class="spec-item"><strong>📐 Superficie:</strong> ${parsed.superficie} m²</span>` : '',
    parsed.precio ? `<span class="spec-item"><strong>💰 Precio:</strong> ${parsed.precio} €</span>` : '',
    ...parsed.extras.map(e => `<span class="spec-item">${e}</span>`),
  ].filter(Boolean).join('\n            ');

  // Separar descripción principal de "¿Qué la hace única?" y "Ubicación:"
  let mainDesc = yuc.desc;
  let uniqueSection = '';
  let locationSection = '';

  const uniqueIdx = yuc.desc.indexOf('¿Qué la hace única?:');
  if (uniqueIdx > -1) {
    mainDesc = yuc.desc.substring(0, uniqueIdx).trim();
    const rest = yuc.desc.substring(uniqueIdx + '¿Qué la hace única?:'.length);
    const locIdx = rest.indexOf('Ubicación:');
    if (locIdx > -1) {
      uniqueSection = rest.substring(0, locIdx).trim();
      locationSection = rest.substring(locIdx + 'Ubicación:'.length).trim();
    } else {
      uniqueSection = rest.trim();
    }
  }

  return `
    <article class="property" id="property-${yuc.id}">
        <h2>${yuc.title}</h2>

        <!-- RAG_METADATA: title="${yuc.title}" | url="${vercelUrl}" | slug="${vercelSlug}" | specs="${specsText}" | summary="${summary}" | image="${images[0] || ''}" | image_2="${images[1] || ''}" | image_3="${images[2] || ''}" | images_count="${images.length}" -->

        <div class="property-meta">
            <strong>Nombre:</strong> ${yuc.title} |
            <strong>URL:</strong> ${vercelUrl} |
            <strong>Slug:</strong> ${vercelSlug} |
            <strong>Specs:</strong> ${specsText} |
            <strong>Categoría:</strong> inmobiliaria
        </div>

        <div class="property-quick-ref">
            IMAGEN_1: ${images[0] || ''} |
            IMAGEN_2: ${images[1] || ''} |
            IMAGEN_3: ${images[2] || ''}
        </div>

        <div class="property-rag-images-index">
            <strong>🖼 URLs de imágenes (EXTRAER EXACTAS para displayPropertyResults):</strong><br>
            ${imagesSummary}
        </div>

        <div class="property-images">
${imagesHtml}
        </div>

        <div class="property-specs">
            <strong>📋 Especificaciones:</strong><br>
            ${specsText}
            <div class="specs-detail">
            ${specsDetailHtml}
            </div>
        </div>

        <div class="property-content">
            <strong>📝 Descripción:</strong><br>
            <p>${mainDesc}</p>
        </div>
${uniqueSection ? `
        <div class="property-unique">
            <strong>✨ ¿Qué la hace única?</strong><br>
            <p>${uniqueSection}</p>
        </div>
` : ''}${locationSection ? `
        <div class="property-location">
            <strong>📍 Ubicación:</strong><br>
            <p>${locationSection}</p>
        </div>
` : ''}
        <a href="${vercelUrl}" class="property-url" target="_blank">Ver propiedad →</a>
    </article>`;
}

// --- Main ---
function main() {
  console.log('📂 Parseando HTML de Yucatán...');
  const yucArticles = parseYucatanArticles(yucHtml);
  console.log(`✅ Propiedades Yucatán: ${yucArticles.length}`);
  console.log(`✅ Propiedades con imágenes reales: ${properties.length}`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const now = new Date().toISOString();
  const articlesHtml = yucArticles.map((yuc, i) => {
    // Asignar imágenes y slug de Vercel 1:1 desde properties.json
    const prop = properties[i % properties.length];
    const images = prop.images || [];
    const vercelSlug = prop.slug; // slug real de nuestra web
    return buildArticle(yuc, images, vercelSlug);
  }).join('\n    <hr>\n');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Propiedades - Ceiba Prime Realty (Demo Yucatán)</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .property { margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .property h2 { color: #2c3e50; margin-top: 0; }
        .property-meta { color: #7f8c8d; font-size: 0.9em; margin-bottom: 10px; }
        .property-images { display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap; }
        .property-images img { max-width: 300px; height: auto; border-radius: 4px; }
        .property-specs { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .specs-detail { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 10px; }
        .spec-item { background: #fff; padding: 6px 12px; border-radius: 4px; border: 1px solid #e0e0e0; font-size: 0.9em; }
        .property-content { margin: 15px 0; }
        .property-unique { background: #fffbf0; border-left: 3px solid #b8965a; padding: 12px 15px; margin: 15px 0; border-radius: 0 4px 4px 0; }
        .property-location { background: #f0f7ff; border-left: 3px solid #3498db; padding: 12px 15px; margin: 15px 0; border-radius: 0 4px 4px 0; }
        .property-rag-images-index { background: #f0fff4; border-left: 3px solid #27ae60; padding: 10px 15px; margin: 10px 0; font-size: 0.85em; word-break: break-all; }
        .property-url { display: inline-block; margin-top: 10px; padding: 8px 16px; background: #b8965a; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .property-url:hover { background: #9a7a45; }
        .summary-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>Catálogo de Propiedades - Ceiba Prime Realty (Demo Yucatán)</h1>

    <div class="summary-box">
        <p><strong>Total de propiedades:</strong> ${yucArticles.length}</p>
        <p><strong>Última actualización:</strong> ${now}</p>
        <p><strong>Fuente:</strong> https://realestate-viviendas.vercel.app</p>
        <p><strong>Destinos:</strong> Mérida, Progreso, Chicxulub Puerto, Chelem, Telchac Puerto, Sisal, Celestún</p>
    </div>
    <hr>
${articlesHtml}
</body>
</html>`;

  fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');
  const sizeKb = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`✅ HTML Yucatán generado: ${yucArticles.length} propiedades`);
  console.log(`📄 Guardado en: ${OUTPUT_FILE}`);
  console.log(`📦 Tamaño: ${sizeKb} KB`);
}

main();
