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
      <body className="antialiased">
        <header className="fixed top-0 inset-x-0 z-[100] bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="container h-20 flex justify-between items-center">
            <a href="/" className="text-xl font-serif font-bold tracking-tight">
              SUNTZU <span className="text-accent italic">R.E.</span>
            </a>
            <nav className="hidden md:flex space-x-10 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
              <a href="/" className="text-primary hover:text-accent transition-colors">Catálogo</a>
              <a href="#" className="hover:text-accent transition-colors">Servicios</a>
              <a href="#" className="hover:text-accent transition-colors">Nosotros</a>
              <a href="#" className="hover:text-accent transition-colors">Contacto</a>
            </nav>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-white pt-32 pb-16 border-t border-gray-100">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
              <div className="md:col-span-5">
                <h3 className="text-2xl font-serif font-bold mb-8 tracking-tight">SUNTZU REAL ESTATE</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                  Curando las propiedades más excepcionales en las ubicaciones más prestigiosas de la costa española y Madrid.
                </p>
              </div>
              <div className="md:col-span-3 md:col-start-7 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                <h4 className="text-primary mb-8 tracking-widest">Navegación</h4>
                <ul className="space-y-4">
                  <li><a href="/" className="hover:text-accent transition-colors">Catálogo Completo</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Menorca Selection</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Ibiza Luxury</a></li>
                </ul>
              </div>
              <div className="md:col-span-3 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                <h4 className="text-primary mb-8 tracking-widest">Contacto</h4>
                <p className="mb-4">info@suntzu.re</p>
                <p>+34 912 345 678</p>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-50 flex justify-between items-center">
              <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">
                © 2026 SunTzu Real Estate
              </p>
              <div className="flex space-x-6 text-[10px] font-bold tracking-widest uppercase text-gray-300">
                <a href="#">Privacidad</a>
                <a href="#">Legal</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
