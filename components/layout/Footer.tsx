import Link from 'next/link'
import Image from 'next/image'
import { categories } from '@/lib/categories'
import { getCalculatorsByCategory } from '@/lib/calculators'

export function Footer() {
  const categoriesWithContent = categories.filter((cat) => getCalculatorsByCategory(cat.slug).length > 0)

  return (
    <footer className="border-t border-slate-200 py-12 dark:border-slate-800">
      <div className="container-page">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-icon-512.png"
                alt="Calculadoras España"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight">
                Calculadoras<span className="text-gold-600">España</span>
              </span>
            </Link>
            <p className="mt-2 text-sm text-slate-500">
              Calculadoras gratuitas y actualizadas para nómina, hipoteca, fiscalidad y más.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Categorías</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {categoriesWithContent.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categoria/${cat.slug}`} className="hover:text-brand-600">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Sitio</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-brand-600">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-brand-600">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/metodologia" className="hover:text-brand-600">
                  Metodología
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-brand-600">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/aviso-legal" className="hover:text-brand-600">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/terminos-y-condiciones" className="hover:text-brand-600">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-brand-600">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-brand-600">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          © {new Date().getFullYear()} Calculadoras España. Los resultados son orientativos y no
          sustituyen el asesoramiento profesional.
        </p>
      </div>
    </footer>
  )
}
