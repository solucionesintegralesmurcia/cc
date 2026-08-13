// Ilustraciones vectoriales propias, estilo flat, una por categoría.
// Se generan como código (no como archivos de imagen descargados), así
// evitamos cualquier problema de derechos de autor de bancos de imágenes,
// pesan casi nada (SVG inline) y heredan los colores de marca automáticamente.

const PALETTE = {
  navy: '#1e3a8a',
  navyDark: '#0f1c40',
  gold: '#f59e0b',
  goldLight: '#fbbf24',
  bg: '#eff6ff',
}

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="100" r="90" fill={PALETTE.bg} />
      {children}
    </svg>
  )
}

function LaboralIllustration() {
  return (
    <Base>
      <rect x="70" y="80" width="100" height="70" rx="8" fill={PALETTE.navy} />
      <rect x="70" y="80" width="100" height="18" rx="8" fill={PALETTE.navyDark} />
      <rect x="105" y="65" width="30" height="20" rx="4" fill={PALETTE.navy} />
      <circle cx="120" cy="115" r="10" fill={PALETTE.gold} />
      <rect x="90" y="140" width="60" height="6" rx="3" fill={PALETTE.goldLight} />
    </Base>
  )
}

function FiscalIllustration() {
  return (
    <Base>
      <rect x="80" y="55" width="80" height="100" rx="6" fill="white" stroke={PALETTE.navy} strokeWidth="4" />
      <line x1="95" y1="75" x2="145" y2="75" stroke={PALETTE.navy} strokeWidth="4" strokeLinecap="round" />
      <line x1="95" y1="90" x2="145" y2="90" stroke={PALETTE.navy} strokeWidth="4" strokeLinecap="round" />
      <circle cx="120" cy="120" r="20" fill={PALETTE.gold} />
      <text x="120" y="127" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">
        %
      </text>
    </Base>
  )
}

function HipotecasIllustration() {
  return (
    <Base>
      <polygon points="120,50 175,90 65,90" fill={PALETTE.navyDark} />
      <rect x="75" y="90" width="90" height="65" fill={PALETTE.navy} />
      <rect x="105" y="115" width="30" height="40" fill={PALETTE.gold} />
      <rect x="85" y="100" width="18" height="18" fill={PALETTE.goldLight} />
      <rect x="137" y="100" width="18" height="18" fill={PALETTE.goldLight} />
    </Base>
  )
}

function PrestamosIllustration() {
  return (
    <Base>
      <ellipse cx="120" cy="130" rx="45" ry="30" fill={PALETTE.gold} />
      <circle cx="120" cy="105" r="35" fill={PALETTE.goldLight} />
      <text x="120" y="113" fontSize="26" fill={PALETTE.navyDark} textAnchor="middle" fontWeight="bold">
        €
      </text>
      <rect x="95" y="95" width="8" height="8" rx="2" fill={PALETTE.navy} opacity="0.3" />
    </Base>
  )
}

function AhorroIllustration() {
  return (
    <Base>
      <ellipse cx="120" cy="115" rx="55" ry="38" fill={PALETTE.gold} />
      <circle cx="165" cy="100" r="8" fill={PALETTE.gold} />
      <rect x="105" y="60" width="10" height="18" rx="4" fill={PALETTE.navy} />
      <circle cx="140" cy="110" r="5" fill={PALETTE.navyDark} />
      <rect x="110" y="150" width="8" height="14" rx="3" fill={PALETTE.navyDark} />
      <rect x="140" y="150" width="8" height="14" rx="3" fill={PALETTE.navyDark} />
    </Base>
  )
}

function VehiculosIllustration() {
  return (
    <Base>
      <rect x="55" y="110" width="130" height="30" rx="10" fill={PALETTE.navy} />
      <path d="M75 110 L90 80 H150 L165 110 Z" fill={PALETTE.navyDark} />
      <rect x="98" y="88" width="20" height="18" fill={PALETTE.bg} opacity="0.6" />
      <rect x="122" y="88" width="20" height="18" fill={PALETTE.bg} opacity="0.6" />
      <circle cx="85" cy="142" r="14" fill={PALETTE.navyDark} />
      <circle cx="85" cy="142" r="6" fill={PALETTE.goldLight} />
      <circle cx="155" cy="142" r="14" fill={PALETTE.navyDark} />
      <circle cx="155" cy="142" r="6" fill={PALETTE.goldLight} />
    </Base>
  )
}

function EmpresasIllustration() {
  return (
    <Base>
      <rect x="70" y="60" width="55" height="95" fill={PALETTE.navy} />
      <rect x="130" y="80" width="45" height="75" fill={PALETTE.navyDark} />
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={80 + col * 20}
            y={72 + row * 22}
            width="12"
            height="14"
            fill={PALETTE.goldLight}
          />
        ))
      )}
      <rect x="140" y="92" width="10" height="12" fill={PALETTE.gold} />
      <rect x="158" y="92" width="10" height="12" fill={PALETTE.gold} />
      <rect x="140" y="114" width="10" height="12" fill={PALETTE.gold} />
      <rect x="158" y="114" width="10" height="12" fill={PALETTE.gold} />
    </Base>
  )
}

const ILLUSTRATIONS: Record<string, () => React.JSX.Element> = {
  laboral: LaboralIllustration,
  fiscal: FiscalIllustration,
  hipotecas: HipotecasIllustration,
  prestamos: PrestamosIllustration,
  ahorro: AhorroIllustration,
  vehiculos: VehiculosIllustration,
  empresas: EmpresasIllustration,
}

export function CategoryIllustration({
  categorySlug,
  className,
}: {
  categorySlug: string
  className?: string
}) {
  const Illustration = ILLUSTRATIONS[categorySlug]
  if (!Illustration) return null

  return (
    <div className={className}>
      <Illustration />
    </div>
  )
}

export function hasIllustration(categorySlug: string) {
  return categorySlug in ILLUSTRATIONS
}
