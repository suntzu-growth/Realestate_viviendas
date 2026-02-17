import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SunTzu Real Estate | Catálogo de Propiedades",
  description: "Encuentra la casa de tus sueños en nuestro catálogo exclusivo de viviendas de lujo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="bg-white border-b py-6 sticky top-0 z-50">
          <div className="container flex justify-between items-center">
            <a href="/" className="text-2xl font-serif font-bold text-gray-900 tracking-tighter">
              SUNTZU <span className="text-accent">REAL ESTATE</span>
            </a>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="/" className="hover:text-accent transition-colors">CATÁLOGO</a>
              <a href="#" className="hover:text-accent transition-colors">SERVICIOS</a>
              <a href="#" className="hover:text-accent transition-colors">NOSOTROS</a>
              <a href="#" className="hover:text-accent transition-colors">CONTACTO</a>
            </nav>
          </div>
        </header>

        <main className="min-h-screen pb-20">
          {children}
        </main>

        <footer className="bg-gray-900 text-white py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-serif font-bold mb-6">SUNTZU REAL ESTATE</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Especialistas en propiedades exclusivas en Menorca, Ibiza, Cantabria y Madrid.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-accent">Enlaces Rápidos</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li><a href="/" className="hover:text-white transition-colors">Catálogo Completo</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Viviendas en Menorca</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Viviendas en Ibiza</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Viviendas en Cantabria</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-accent">Contacto</h4>
                <p className="text-gray-400 text-sm mb-4">
                  ¿Tienes alguna duda o quieres visitar una propiedad?
                </p>
                <a href="mailto:info@suntzu.re" className="text-white hover:text-accent transition-colors">info@suntzu.re</a>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
              © 2026 SunTzu Real Estate. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
