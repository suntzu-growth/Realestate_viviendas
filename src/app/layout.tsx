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
        {/* Header */}
        <header className="fixed top-0 inset-x-0 z-[100] transition-all duration-500">
          <div className="bg-white/90 backdrop-blur-xl border-b border-[var(--border-light)]">
            <div className="container h-[4.5rem] flex justify-between items-center">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-px h-8 bg-[var(--accent)] opacity-60"></div>
                <span className="text-[1.05rem] font-serif font-semibold tracking-[0.05em] text-[var(--primary)]">
                  SUNTZU <span className="italic font-light text-[var(--accent)]">Real Estate</span>
                </span>
              </a>

              {/* Nav */}
              <nav className="hidden md:flex items-center gap-10">
                {[
                  { label: 'Catálogo', href: '/' },
                  { label: 'Servicios', href: '#' },
                  { label: 'Nosotros', href: '#' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors duration-300 relative group"
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[var(--accent)] group-hover:w-full transition-all duration-400"></span>
                  </a>
                ))}
                <a
                  href="#"
                  className="btn btn-accent text-[0.65rem] px-6 py-3"
                >
                  Contacto
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[var(--primary)] text-white">
          <div className="container py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-16 border-b border-white/10">
              {/* Brand */}
              <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-px h-8 bg-[var(--accent)] opacity-80"></div>
                  <span className="text-lg font-serif font-semibold tracking-wider">
                    SUNTZU <span className="italic font-light text-[var(--accent)]">Real Estate</span>
                  </span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs font-light">
                  Curando las propiedades más excepcionales en las ubicaciones más prestigiosas de la costa española y Madrid.
                </p>
                {/* Decorative line */}
                <div className="mt-10 flex gap-3 items-center">
                  <div className="w-8 h-px bg-[var(--accent)]"></div>
                  <span className="text-[0.6rem] font-bold tracking-[0.3em] uppercase text-white/20">Est. 2024</span>
                </div>
              </div>

              {/* Nav */}
              <div className="md:col-span-3 md:col-start-7">
                <h4 className="text-[0.6rem] font-bold tracking-[0.3em] uppercase text-white/30 mb-8">Navegación</h4>
                <ul className="space-y-5">
                  {['Catálogo Completo', 'Menorca Selection', 'Ibiza Luxury', 'Madrid Prime'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-[0.7rem] font-medium tracking-wider uppercase text-white/50 hover:text-[var(--accent)] transition-colors duration-300">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="md:col-span-3">
                <h4 className="text-[0.6rem] font-bold tracking-[0.3em] uppercase text-white/30 mb-8">Contacto</h4>
                <div className="space-y-4">
                  <a href="mailto:info@suntzu.re" className="block text-sm text-white/50 hover:text-[var(--accent)] transition-colors duration-300 font-light">
                    info@suntzu.re
                  </a>
                  <a href="tel:+34912345678" className="block text-sm text-white/50 hover:text-[var(--accent)] transition-colors duration-300 font-light">
                    +34 912 345 678
                  </a>
                  <p className="text-sm text-white/30 font-light pt-2">Madrid, España</p>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[0.6rem] text-white/20 font-semibold tracking-[0.2em] uppercase">
                © 2026 SunTzu Real Estate · Todos los derechos reservados
              </p>
              <div className="flex gap-8 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-white/20">
                <a href="#" className="hover:text-white/50 transition-colors">Privacidad</a>
                <a href="#" className="hover:text-white/50 transition-colors">Legal</a>
                <a href="#" className="hover:text-white/50 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
