/**
 * generate-rag-html.js
 *
 * Lee propiedades-suntzu-yucatan-v7.html (el catálogo real)
 * y genera el HTML RAG optimizado para ElevenLabs en data/rag/propiedades-suntzu-vercel.html.
 *
 * Uso:
 *   node generate-rag-html.js
 */

const fs = require('fs');
const path = require('path');

const V7_HTML = path.join(__dirname, 'propiedades-suntzu-yucatan-v7.html');
const OUTPUT_DIR = path.join(__dirname, 'data', 'rag');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'propiedades-suntzu-vercel.html');
const VERCEL_BASE = 'https://realestate-viviendas.vercel.app';

function slugify(text) {
  return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
}

function main() {
  console.log(`📂 Leyendo catálogo base: ${V7_HTML}`);
  if (!fs.existsSync(V7_HTML)) {
    console.error('❌ No se encuentra el archivo v7.html');
    return;
  }

  const html = fs.readFileSync(V7_HTML, 'utf-8');

  // Dividir por artículos para inyectar metadata si es necesario, 
  // o simplemente asegurar que las URLs son correctas.
  // Pero EL USER QUIERE QUE SEA "COMO V7", así que vamos a mantener la estructura fiel.

  let processedHtml = html;

  // Aseguramos que el directorio existe
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Guardamos
  fs.writeFileSync(OUTPUT_FILE, processedHtml, 'utf-8');

  const sizeKb = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`✅ RAG HTML 'vercel' sincronizado directamente con v7.html`);
  console.log(`📄 Guardado en: ${OUTPUT_FILE}`);
  console.log(`📦 Tamaño: ${sizeKb} KB`);
}

main();
