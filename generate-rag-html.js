/**
 * generate-rag-html.js
 *
 * Genera un HTML estático con todas las propiedades de properties.json
 * en el mismo formato que propiedades-suntzu.html, listo para RAG.
 *
 * Uso:
 *   node generate-rag-html.js
 *
 * Output:
 *   data/rag/propiedades-suntzu-vercel.html
 */

const fs = require('fs');
const path = require('path');

// --- Rutas ---
const INPUT_JSON = path.join(__dirname, 'src', 'data', 'properties.json');
const OUTPUT_DIR = path.join(__dirname, 'data', 'rag');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'propiedades-suntzu-vercel.html');
const BASE_URL = 'https://realestate-viviendas.vercel.app'; // URL de producción en Vercel

// --- Cargar propiedades ---
const properties = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf-8'));

// --- Helper: parsear specs array plano -> objeto estructurado ---
// El array viene como: ['4', 'Dormitorios', '3', 'Baños', '224', 'm2', 'Precio: 1.200.000']
// Lo convertimos a pares legibles
function parseSpecs(specs) {
  if (!specs || specs.length === 0) return {};

  const result = {
    dormitorios: null,
    banos: null,
    superficie: null,
    precio: null,
    extras: []
  };

  for (let i = 0; i < specs.length; i++) {
    const item = specs[i].trim();

    // Detectar precio (viene como 'Precio: X.XXX.XXX')
    if (item.startsWith('Precio:')) {
      result.precio = item.replace('Precio:', '').trim();
      continue;
    }

    // Detectar pares valor + etiqueta
    const next = specs[i + 1] ? specs[i + 1].trim() : '';

    if (next.toLowerCase() === 'dormitorios') {
      result.dormitorios = item;
      i++; // saltar la etiqueta
    } else if (next.toLowerCase() === 'baños' || next.toLowerCase() === 'banos') {
      result.banos = item;
      i++;
    } else if (next.toLowerCase() === 'm2' || next.toLowerCase() === 'm²') {
      result.superficie = item;
      i++;
    } else {
      // Cualquier otro spec lo añadimos como extra
      result.extras.push(item);
    }
  }

  return result;
}

// --- Helper: formatear specs para display legible ---
function formatSpecsText(specs) {
  const parsed = parseSpecs(specs);
  const parts = [];
  if (parsed.dormitorios) parts.push(`${parsed.dormitorios} Dormitorios`);
  if (parsed.banos) parts.push(`${parsed.banos} Baños`);
  if (parsed.superficie) parts.push(`${parsed.superficie} m²`);
  if (parsed.precio) parts.push(`Precio: ${parsed.precio} €`);
  if (parsed.extras.length) parts.push(...parsed.extras);
  return parts.join(' | ');
}

// --- Helper: extraer sección "¿Qué lo hace único?" de la descripción ---
function extractUnique(description) {
  if (!description) return null;
  const match = description.match(/¿Qué lo hace único\?[:\s]*(.*?)(?:Ubicación:|$)/si);
  return match ? match[1].trim() : null;
}

// --- Helper: extraer sección "Ubicación" de la descripción ---
function extractLocation(description) {
  if (!description) return null;
  const match = description.match(/Ubicación[:\s]*(.*?)$/si);
  return match ? match[1].trim() : null;
}

// --- Helper: extraer descripción principal (antes de "¿Qué lo hace único?") ---
function extractMainDescription(description) {
  if (!description) return '';
  const uniqueIdx = description.indexOf('¿Qué lo hace único?');
  if (uniqueIdx > -1) return description.substring(0, uniqueIdx).trim();
  const locationIdx = description.indexOf('Ubicación:');
  if (locationIdx > -1) return description.substring(0, locationIdx).trim();
  return description.trim();
}

// --- Generar HTML para cada propiedad ---
function propertyToHtml(property, index) {
  const parsed = parseSpecs(property.specs);
  const specsText = formatSpecsText(property.specs);
  const mainDesc = extractMainDescription(property.description);
  const uniqueSection = extractUnique(property.description);
  const locationSection = extractLocation(property.description);
  const propertyUrl = `${BASE_URL}/${property.slug}`;

  const imagesHtml = (property.images || [])
    .map((img, i) => `            <img src="${img}" alt="${property.title} - Imagen ${i + 1}" loading="lazy">`)
    .join('\n');

  const specsDetailHtml = [
    parsed.dormitorios ? `<span class="spec-item"><strong>🛏 Dormitorios:</strong> ${parsed.dormitorios}</span>` : '',
    parsed.banos ? `<span class="spec-item"><strong>🚿 Baños:</strong> ${parsed.banos}</span>` : '',
    parsed.superficie ? `<span class="spec-item"><strong>📐 Superficie:</strong> ${parsed.superficie} m²</span>` : '',
    parsed.precio ? `<span class="spec-item"><strong>💰 Precio:</strong> ${parsed.precio} €</span>` : '',
  ].filter(Boolean).join('\n            ');

  return `
    <article class="property" id="property-${property.id}">
        <h2>${property.title}</h2>

        <div class="property-meta">
            <strong>ID:</strong> ${property.id} |
            <strong>Slug:</strong> ${property.slug} |
            <strong>Categoría:</strong> inmobiliaria
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
            <strong>✨ ¿Qué lo hace único?</strong><br>
            <p>${uniqueSection}</p>
        </div>
` : ''}${locationSection ? `
        <div class="property-location">
            <strong>📍 Ubicación:</strong><br>
            <p>${locationSection}</p>
        </div>
` : ''}
        <a href="${propertyUrl}" class="property-url">Ver propiedad en SUNTZU →</a>
    </article>`;
}

// --- Construir HTML completo ---
function buildHtml(properties) {
  const now = new Date().toISOString();
  const propertiesHtml = properties.map((p, i) => propertyToHtml(p, i)).join('\n    <hr>\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Propiedades - SunTzu Real Estate</title>
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
        .property-url { display: inline-block; margin-top: 10px; padding: 8px 16px; background: #b8965a; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .property-url:hover { background: #9a7a45; }
        .summary-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>Catálogo de Propiedades - SunTzu Real Estate</h1>

    <div class="summary-box">
        <p><strong>Total de propiedades:</strong> ${properties.length}</p>
        <p><strong>Última actualización:</strong> ${now}</p>
        <p><strong>Fuente:</strong> ${BASE_URL}</p>
        <p><strong>Destinos:</strong> Menorca, Ibiza, Madrid, Costa Brava</p>
    </div>
    <hr>
${propertiesHtml}
</body>
</html>`;
}

// --- Main ---
function main() {
  console.log(`📂 Leyendo propiedades desde: ${INPUT_JSON}`);
  console.log(`✅ Encontradas ${properties.length} propiedades`);

  // Crear directorio de output si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${OUTPUT_DIR}`);
  }

  const html = buildHtml(properties);

  fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');

  const sizeKb = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`✅ HTML generado con ${properties.length} propiedades`);
  console.log(`📄 Guardado en: ${OUTPUT_FILE}`);
  console.log(`📦 Tamaño: ${sizeKb} KB`);
}

main();
