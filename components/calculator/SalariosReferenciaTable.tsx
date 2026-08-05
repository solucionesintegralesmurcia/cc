import { nominaCalculator } from '@/lib/calculators/nomina'

const SALARIOS_BRUTOS_MENSUALES_REFERENCIA = [1000, 1200, 1500, 1800, 2000, 2500, 3000, 3500, 4000, 5000]

// Genera la tabla en tiempo de build (ISR) usando nuestro propio motor de
// cálculo, así los números siempre están sincronizados con la calculadora
// interactiva de arriba: no hay contenido estático que se pueda desincronizar.
export function SalariosReferenciaTable() {
  const filas = SALARIOS_BRUTOS_MENSUALES_REFERENCIA.map((brutoMensual) => {
    const brutoAnual = brutoMensual * 14
    const resultado = nominaCalculator.calculate({
      salarioBrutoAnual: brutoAnual,
      pagasExtra: 14,
      situacionFamiliar: 'soltero',
      numHijos: 0,
      comunidadAutonoma: 'generico',
      discapacidad: 'ninguna',
    })
    return {
      brutoMensual,
      brutoAnual,
      netoMensual: resultado.breakdown.salarioNetoMensual,
      tipoEfectivo: resultado.breakdown.retencionIrpfPorcentaje,
    }
  })

  const formatEur = (n: number) =>
    n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div className="not-prose overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left dark:border-slate-800">
            <th className="py-2 pr-4 font-medium text-slate-500">Bruto mensual</th>
            <th className="py-2 pr-4 font-medium text-slate-500">Bruto anual</th>
            <th className="py-2 pr-4 font-medium text-slate-500">Neto/mes (14 pagas)</th>
            <th className="py-2 font-medium text-slate-500">IRPF efectivo</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.brutoMensual} className="border-b border-slate-100 dark:border-slate-900">
              <td className="py-2 pr-4">{formatEur(fila.brutoMensual)}</td>
              <td className="py-2 pr-4">{formatEur(fila.brutoAnual)}</td>
              <td className="py-2 pr-4 font-medium">{formatEur(fila.netoMensual)}</td>
              <td className="py-2">{fila.tipoEfectivo}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-slate-500">
        Referencia para soltero/a sin hijos, media nacional. Usa la calculadora de arriba para tu
        caso exacto.
      </p>
    </div>
  )
}
