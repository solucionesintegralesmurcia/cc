const TRAMOS = [
  { rango: 'Hasta 12.450 €', tipo: '19%' },
  { rango: '12.450 € – 20.200 €', tipo: '24%' },
  { rango: '20.200 € – 35.200 €', tipo: '30%' },
  { rango: '35.200 € – 60.000 €', tipo: '37%' },
  { rango: '60.000 € – 300.000 €', tipo: '45%' },
  { rango: 'Más de 300.000 €', tipo: '47%' },
]

export function IrpfTramosTable() {
  return (
    <div className="not-prose overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left dark:border-slate-800">
            <th className="py-2 pr-4 font-medium text-slate-500">Base liquidable</th>
            <th className="py-2 font-medium text-slate-500">Tipo marginal</th>
          </tr>
        </thead>
        <tbody>
          {TRAMOS.map((t) => (
            <tr key={t.rango} className="border-b border-slate-100 dark:border-slate-900">
              <td className="py-2 pr-4">{t.rango}</td>
              <td className="py-2 font-medium">{t.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-slate-500">
        Tipos combinados (estatal + autonómico general), 2026, orientativos. País Vasco y Navarra
        tienen regímenes forales con cálculo diferente.
      </p>
    </div>
  )
}
