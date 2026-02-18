/**
 * generate-yucatan-rag-v2.js
 *
 * Lee propiedades-suntzu-yucatan-v6.html (ya tiene nombres Yucatán + imágenes CDN reales + slugs)
 * y genera el HTML RAG optimizado con:
 *   - URLs reales de realestate-viviendas.vercel.app
 *   - Triple redundancia de imágenes (para evitar problemas de chunking del RAG)
 *   - RAG_METADATA comment con todos los datos clave
 *
 * Uso:
 *   node generate-yucatan-rag-v2.js
 *
 * Output:
 *   data/rag/propiedades-suntzu-yucatan.html
 */

const fs = require('fs');
const path = require('path');

const V6_HTML = path.join(__dirname, 'propiedades-suntzu-yucatan-v7.html');
const OUTPUT_DIR = path.join(__dirname, 'data', 'rag');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'propiedades-suntzu-yucatan.html');
const VERCEL_BASE = 'https://realestate-viviendas.vercel.app';

// --- Cargar datos ---
const v6Html = fs.readFileSync(V6_HTML, 'utf-8');

// --- Parsear artículos del v6 ---
function parseV6Articles(html) {
  const articles = [];
  const parts = html.split('<article class="property"');
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];

    // ID
    const idMatch = chunk.match(/id="property-(\d+)"/);
    const id = idMatch ? parseInt(idMatch[1]) : i;

    // Título
    const titleMatch = chunk.match(/<h2>(.*?)<\/h2>/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Slug (desde property-ref o slugify del título)
    // Para simplificar, si ya sincronizamos el v6/v7, el href del <a> tiene el slug real.
    // O podemos volver a slugificar el título para estar seguros.
    function slugify(text) {
      return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
    }
    const slug = slugify(title);

    // Imágenes (src de los img tags dentro de property-images)
    const imagesSection = chunk.match(/class="property-images">([\s\S]*?)<\/div>/);
    const images = [];
    if (imagesSection) {
      const imgRegex = /src="([^"]+)"/g;
      let m;
      while ((m = imgRegex.exec(imagesSection[1])) !== null) {
        images.push(m[1]);
      }
    }

    // Specs
    const specsMatch = chunk.match(/📋 Especificaciones:<\/strong><br\/?>\s*([\s\S]*?)\s*<\/div>/);
    const specs = specsMatch ? specsMatch[1].trim().replace(/\s+/g, ' ') : '';

    // Descripción completa (todo el <p> dentro de property-content)
    const descMatch = chunk.match(/class="property-content"[\s\S]*?<p>([\s\S]*?)<\/p>/);
    const desc = descMatch ? descMatch[1].trim() : '';

    articles.push({ id, title, slug, images, specs, desc });
  }
  return articles;
}

// --- Parsear specs ---
function parseSpecsText(specsRaw) {
  const parts = specsRaw.split('|').map(s => s.trim()).filter(Boolean);
  const result = { dormitorios: null, banos: null, superficie: null, precio: null, extras: [] };

  for (let i = 0; i < parts.length; i++) {
    const item = parts[i];
    if (item.startsWith('Precio:')) { result.precio = item.replace('Precio:', '').trim(); continue; }
    if (item === 'En construcción' || item === 'VENDIDO') { result.extras.push(item); continue; }
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

// --- Separar secciones de la descripción ---
function splitDesc(desc) {
  let mainDesc = desc;
  let uniqueSection = '';
  let locationSection = '';

  const uniqueIdx = desc.indexOf('¿Qué la hace única?:');
  if (uniqueIdx > -1) {
    mainDesc = desc.substring(0, uniqueIdx).trim();
    const rest = desc.substring(uniqueIdx + '¿Qué la hace única?:'.length);
    const locIdx = rest.indexOf('Ubicación:');
    if (locIdx > -1) {
      uniqueSection = rest.substring(0, locIdx).trim();
      locationSection = rest.substring(locIdx + 'Ubicación:'.length).trim();
    } else {
      uniqueSection = rest.trim();
    }
  }
  return { mainDesc, uniqueSection, locationSection };
}

// --- Generar HTML de cada propiedad ---
function buildArticle(art) {
  const vercelUrl = `${VERCEL_BASE}/${art.slug}`;
  const specsText = formatSpecs(art.specs);
  const summary = makeSummary(art.specs);
  const parsed = parseSpecsText(art.specs);
  const { mainDesc, uniqueSection, locationSection } = splitDesc(art.desc);

  const img1 = art.images[0] || '';
  const img2 = art.images[1] || '';
  const img3 = art.images[2] || '';
  const imagesSummary = art.images.map((img, i) => `image_${i + 1}: ${img}`).join(' | ');
  const imagesHtml = art.images.map((img, i) =>
    `            <img src="${img}" alt="${art.title} - Imagen ${i + 1}" loading="lazy">`
  ).join('\n');

  const specsDetailHtml = [
    parsed.dormitorios ? `<span class="spec-item"><strong>🛏 Dormitorios:</strong> ${parsed.dormitorios}</span>` : '',
    parsed.banos ? `<span class="spec-item"><strong>🚿 Baños:</strong> ${parsed.banos}</span>` : '',
    parsed.superficie ? `<span class="spec-item"><strong>📐 Superficie:</strong> ${parsed.superficie} m²</span>` : '',
    parsed.precio ? `<span class="spec-item"><strong>💰 Precio:</strong> ${parsed.precio} €</span>` : '',
    ...parsed.extras.map(e => `<span class="spec-item">${e}</span>`),
  ].filter(Boolean).join('\n            ');

  return `
    <article class="property" id="property-${art.id}">
        <h2>${art.title}</h2>

        <!-- RAG_METADATA: title="${art.title}" | url="${vercelUrl}" | slug="${art.slug}" | specs="${specsText}" | summary="${summary}" | image="${img1}" | image_2="${img2}" | image_3="${img3}" | images_count="${art.images.length}" -->

        <div class="property-meta">
            <strong>Nombre:</strong> ${art.title} |
            <strong>URL:</strong> ${vercelUrl} |
            <strong>Slug:</strong> ${art.slug} |
            <strong>Specs:</strong> ${specsText} |
            <strong>Categoría:</strong> inmobiliaria
        </div>

        <div class="property-quick-ref">
            IMAGEN_1: ${img1} |
            IMAGEN_2: ${img2} |
            IMAGEN_3: ${img3}
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
  console.log('📂 Parseando HTML v6 de Yucatán...');
  const articles = parseV6Articles(v6Html);
  console.log(`✅ Propiedades encontradas: ${articles.length}`);

  // Verificar imágenes
  const sinImagenes = articles.filter(a => a.images.length === 0);
  if (sinImagenes.length > 0) {
    console.warn(`⚠️  ${sinImagenes.length} propiedades sin imágenes:`, sinImagenes.map(a => a.title));
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const now = new Date().toISOString();
  const articlesHtml = articles.map(art => buildArticle(art)).join('\n    <hr>\n');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Propiedades - Yucatán (RAG)</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .property { margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .property h2 { color: #2c3e50; margin-top: 0; }
        .property-meta { color: #7f8c8d; font-size: 0.9em; margin-bottom: 10px; }
        .property-quick-ref { background: #fff8e1; border-left: 3px solid #f39c12; padding: 8px 15px; margin: 8px 0; font-size: 0.85em; word-break: break-all; }
        .property-rag-images-index { background: #f0fff4; border-left: 3px solid #27ae60; padding: 10px 15px; margin: 10px 0; font-size: 0.85em; word-break: break-all; }
        .property-images { display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap; }
        .property-images img { max-width: 300px; height: auto; border-radius: 4px; }
        .property-specs { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .specs-detail { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 10px; }
        .spec-item { background: #fff; padding: 6px 12px; border-radius: 4px; border: 1px solid #e0e0e0; font-size: 0.9em; }
        .property-content { margin: 15px 0; }
        .property-unique { background: #fffbf0; border-left: 3px solid #b8965a; padding: 12px 15px; margin: 15px 0; border-radius: 0 4px 4px 0; }
        .property-location { background: #f0f7ff; border-left: 3px solid #3498db; padding: 12px 15px; margin: 15px 0; border-radius: 0 4px 4px 0; }
        .property-url { display: inline-block; margin-top: 10px; padding: 8px 16px; background: #b8965a; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .property-url:hover { background: #9a7a45; }
        .summary-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>Catálogo de Propiedades - Yucatán (RAG)</h1>

    <div class="summary-box">
        <p><strong>Total de propiedades:</strong> ${articles.length}</p>
        <p><strong>Última actualización:</strong> ${now}</p>
        <p><strong>Fuente:</strong> ${VERCEL_BASE}</p>
        <p><strong>Destinos:</strong> Mérida, Progreso, Chicxulub Puerto, Chelem, Telchac Puerto, Sisal, Celestún</p>
    </div>
    <hr>
${articlesHtml}
</body>
</html>`;

  fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');
  const sizeKb = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`\n✅ HTML RAG generado: ${articles.length} propiedades`);
  console.log(`📄 Guardado en: ${OUTPUT_FILE}`);
  console.log(`📦 Tamaño: ${sizeKb} KB`);

  // Verificación de URLs
  const ceibaprime = (html.match(/ceibaprime/g) || []).length;
  const vercelRefs = (html.match(/realestate-viviendas\.vercel\.app/g) || []).length;
  console.log(`\n🔍 Verificación:`);
  console.log(`   Referencias a ceibaprime: ${ceibaprime} (debe ser 0)`);
  console.log(`   Referencias a realestate-viviendas.vercel.app: ${vercelRefs}`);

  // Verificar imágenes por propiedad
  console.log(`\n📸 Imágenes por propiedad:`);
  articles.forEach((a, i) => {
    const status = a.images.length >= 3 ? '✅' : a.images.length > 0 ? '⚠️ ' : '❌';
    console.log(`   ${status} ${i + 1}. ${a.title}: ${a.images.length} imágenes | slug: ${a.slug}`);
  });
}

main();
