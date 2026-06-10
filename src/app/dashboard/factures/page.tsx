'use client'

import { useState, useRef, useEffect } from 'react'
import PlanGate from '@/components/PlanGate'
import { Plus, Trash2, Download, FileText, X, ChevronDown } from 'lucide-react'
import { useApp } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'

interface InvoiceLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface InvoiceData {
  number: string
  date: string
  dueDate: string
  sellerName: string
  sellerAddress: string
  sellerCity: string
  sellerEmail: string
  sellerPhone: string
  clientName: string
  clientAddress: string
  clientCity: string
  clientEmail: string
  lines: InvoiceLine[]
  notes: string
  taxRate: number
}

const emptyLine = (): InvoiceLine => ({
  id: Date.now().toString(),
  description: '', quantity: 1, unitPrice: 0,
})

function newInvoice(num: number): InvoiceData {
  return {
    number: `FAC-${String(num).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    sellerName: '', sellerAddress: '', sellerCity: '', sellerEmail: '', sellerPhone: '',
    clientName: '', clientAddress: '', clientCity: '', clientEmail: '',
    lines: [emptyLine()],
    notes: '',
    taxRate: 0,
  }
}

export default function FacturesPage() {
  return (
    <PlanGate requiredPlan="pro" featureName="Générateur de factures">
      <FacturesPageContent />
    </PlanGate>
  )
}

function FacturesPageContent() {
  const { sales, currency } = useApp()
  const [invoiceCount, setInvoiceCount] = useState(1)
  const [inv, setInv] = useState<InvoiceData>(() => newInvoice(1))

  useEffect(() => {
    try {
      const saved = parseInt(localStorage.getItem('risly_invoice_count') || '1')
      setInvoiceCount(saved)
      setInv(newInvoice(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('risly_invoice_count', String(invoiceCount)) } catch {}
  }, [invoiceCount])
  const [showImport, setShowImport] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  function set(field: keyof InvoiceData, value: unknown) {
    setInv(p => ({ ...p, [field]: value }))
  }

  function updateLine(id: string, field: keyof InvoiceLine, value: string) {
    setInv(p => ({
      ...p,
      lines: p.lines.map(l => l.id === id
        ? { ...l, [field]: field === 'description' ? value : parseFloat(value) || 0 }
        : l
      )
    }))
  }

  function addLine() {
    setInv(p => ({ ...p, lines: [...p.lines, emptyLine()] }))
  }

  function removeLine(id: string) {
    setInv(p => ({ ...p, lines: p.lines.filter(l => l.id !== id) }))
  }

  function newInvoiceDoc() {
    const n = invoiceCount + 1
    setInvoiceCount(n)
    setInv(newInvoice(n))
  }

  function importSale(saleId: string) {
    const sale = sales.find(s => s.id === saleId)
    if (!sale) return
    setInv(p => ({
      ...p,
      lines: [{
        id: Date.now().toString(),
        description: `${sale.product}${sale.brand ? ` — ${sale.brand}` : ''}`,
        quantity: sale.quantity,
        unitPrice: sale.sellPrice,
      }]
    }))
    setShowImport(false)
  }

  const subtotal = inv.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0)
  const taxAmount = subtotal * (inv.taxRate / 100)
  const total = subtotal + taxAmount

  function handlePrint() {
    const content = printRef.current
    if (!content) return
    const w = window.open('', '_blank') ?? window.open('', '_self')
    if (!w) { alert('Autorisez les popups pour imprimer la facture.'); return }
    w.document.open()
    w.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Facture ${inv.number}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; background: white; padding: 0; }
          .invoice { max-width: 800px; margin: 0 auto; padding: 48px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
          .logo { font-size: 28px; font-weight: 900; color: #059669; letter-spacing: -1px; }
          .invoice-meta { text-align: right; }
          .invoice-num { font-size: 20px; font-weight: 700; color: #111; }
          .invoice-dates { font-size: 12px; color: #6b7280; margin-top: 4px; }
          .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 36px; }
          .party-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #059669; margin-bottom: 8px; }
          .party-name { font-size: 15px; font-weight: 600; color: #111; margin-bottom: 4px; }
          .party-detail { font-size: 12px; color: #6b7280; line-height: 1.6; }
          .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
          th:last-child, td:last-child { text-align: right; }
          td { padding: 12px; font-size: 13px; color: #374151; border-bottom: 1px solid #f3f4f6; }
          .totals { margin-left: auto; width: 260px; }
          .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #6b7280; }
          .total-final { display: flex; justify-content: space-between; padding: 12px 16px; background: #f0fdf4; border-radius: 10px; margin-top: 8px; }
          .total-final span:first-child { font-size: 14px; font-weight: 700; color: #111; }
          .total-final span:last-child { font-size: 18px; font-weight: 900; color: #059669; }
          .notes { margin-top: 40px; padding: 16px; background: #f9fafb; border-radius: 10px; font-size: 12px; color: #6b7280; }
          .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #d1d5db; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="logo">Risly</div>
            <div class="invoice-meta">
              <div class="invoice-num">${inv.number}</div>
              <div class="invoice-dates">
                Émise le ${inv.date}<br>
                Échéance : ${inv.dueDate}
              </div>
            </div>
          </div>

          <div class="parties">
            <div>
              <div class="party-label">De</div>
              <div class="party-name">${inv.sellerName || '—'}</div>
              <div class="party-detail">
                ${inv.sellerAddress ? inv.sellerAddress + '<br>' : ''}
                ${inv.sellerCity || ''}
                ${inv.sellerEmail ? '<br>' + inv.sellerEmail : ''}
                ${inv.sellerPhone ? '<br>' + inv.sellerPhone : ''}
              </div>
            </div>
            <div>
              <div class="party-label">Facturer à</div>
              <div class="party-name">${inv.clientName || '—'}</div>
              <div class="party-detail">
                ${inv.clientAddress ? inv.clientAddress + '<br>' : ''}
                ${inv.clientCity || ''}
                ${inv.clientEmail ? '<br>' + inv.clientEmail : ''}
              </div>
            </div>
          </div>

          <hr class="divider">

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align:center">Qté</th>
                <th style="text-align:right">Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${inv.lines.map(l => `
                <tr>
                  <td>${l.description || '—'}</td>
                  <td style="text-align:center">${l.quantity}</td>
                  <td style="text-align:right">${l.unitPrice.toFixed(2)} ${currency}</td>
                  <td style="text-align:right;font-weight:600">${(l.quantity * l.unitPrice).toFixed(2)} ${currency}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row"><span>Sous-total</span><span>${subtotal.toFixed(2)} ${currency}</span></div>
            ${inv.taxRate > 0 ? `<div class="total-row"><span>TVA (${inv.taxRate}%)</span><span>${taxAmount.toFixed(2)} ${currency}</span></div>` : ''}
            <div class="total-final">
              <span>Total</span>
              <span>${total.toFixed(2)} ${currency}</span>
            </div>
          </div>

          ${inv.notes ? `<div class="notes"><strong>Notes :</strong> ${inv.notes}</div>` : ''}

          <div class="footer">Généré avec Risly · risly.ch</div>
        </div>
        <script>setTimeout(() => { window.print(); }, 300);</script>
      </body>
      </html>
    `)
    w.document.close()
  }

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Outils</p>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Générateur de factures</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={newInvoiceDoc} className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-all" style={{ background: 'var(--surface-input)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <FileText size={14} /> Nouvelle facture
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
              <Download size={14} /> Exporter PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* ── FORMULAIRE ── */}
          <div className="space-y-4">

            {/* En-tête facture */}
            <div className="glass-dashboard rounded-2xl p-5 space-y-3">
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Informations</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>N° facture</label>
                  <input value={inv.number} onChange={e => set('number', e.target.value)} className="input-field font-mono" />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Date</label>
                  <input type="date" value={inv.date} onChange={e => set('date', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Échéance</label>
                  <input type="date" value={inv.dueDate} onChange={e => set('dueDate', e.target.value)} className="input-field" />
                </div>
              </div>
            </div>

            {/* Vendeur & Client */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: 'Vos informations', fields: [
                    { label: 'Nom / Société', key: 'sellerName' as const },
                    { label: 'Adresse', key: 'sellerAddress' as const },
                    { label: 'Ville / CP', key: 'sellerCity' as const },
                    { label: 'Email', key: 'sellerEmail' as const },
                    { label: 'Téléphone', key: 'sellerPhone' as const },
                  ]
                },
                {
                  title: 'Client', fields: [
                    { label: 'Nom / Société', key: 'clientName' as const },
                    { label: 'Adresse', key: 'clientAddress' as const },
                    { label: 'Ville / CP', key: 'clientCity' as const },
                    { label: 'Email', key: 'clientEmail' as const },
                  ]
                }
              ].map(section => (
                <div key={section.title} className="glass-dashboard rounded-2xl p-4 space-y-2.5">
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{section.title}</p>
                  {section.fields.map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                      <input value={inv[key] as string} onChange={e => set(key, e.target.value)} className="input-field py-2 text-xs" placeholder={label} />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Lignes */}
            <div className="glass-dashboard rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Articles</p>
                {sales.length > 0 && (
                  <div className="relative">
                    <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                      Importer une vente <ChevronDown size={11} />
                    </button>
                    {showImport && (
                      <div className="absolute right-0 top-6 z-10 w-64 rounded-xl border shadow-xl overflow-hidden" style={{ background: 'var(--surface-modal)', borderColor: 'var(--border)' }}>
                        {sales.slice(0, 10).map(s => (
                          <button key={s.id} onClick={() => importSale(s.id)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-white/5 transition-colors border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{s.product}</span>
                            <span className="ml-2" style={{ color: 'var(--text-muted)' }}>{s.sellPrice} {currency}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {inv.lines.map((line, i) => (
                  <div key={line.id} className="grid grid-cols-[1fr_60px_80px_32px] gap-2 items-center">
                    <input value={line.description} onChange={e => updateLine(line.id, 'description', e.target.value)} className="input-field py-2 text-xs" placeholder={`Article ${i + 1}`} />
                    <input type="number" min="1" value={line.quantity || ''} onChange={e => updateLine(line.id, 'quantity', e.target.value)} className="input-field py-2 text-xs text-center" placeholder="Qté" />
                    <input type="number" min="0" step="0.01" value={line.unitPrice || ''} onChange={e => updateLine(line.id, 'unitPrice', e.target.value)} className="input-field py-2 text-xs" placeholder="Prix" />
                    <button onClick={() => removeLine(line.id)} disabled={inv.lines.length === 1} className="text-gray-700 hover:text-red-400 transition-colors disabled:opacity-30">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={addLine} className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                <Plus size={12} /> Ajouter une ligne
              </button>

              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>TVA %</label>
                <input type="number" min="0" max="100" value={inv.taxRate || ''} onChange={e => set('taxRate', parseFloat(e.target.value) || 0)} className="input-field py-1.5 text-xs w-20" placeholder="0" />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Laisser 0 si pas de TVA</span>
              </div>
            </div>

            {/* Notes */}
            <div className="glass-dashboard rounded-2xl p-4">
              <label className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Notes</label>
              <textarea value={inv.notes} onChange={e => set('notes', e.target.value)} className="input-field resize-none text-xs" rows={2} placeholder="Conditions de paiement, remerciements…" />
            </div>
          </div>

          {/* ── APERÇU ── */}
          <div className="lg:sticky lg:top-8">
            <div ref={printRef} className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'white', color: '#111' }}>
              {/* Top bar verte */}
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #059669, #10b981)' }} />

              <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-2xl font-black" style={{ color: '#059669' }}>Risly</p>
                    <p className="text-xs text-gray-400 mt-0.5">risly.ch</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">{inv.number}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Émise le {inv.date}</p>
                    <p className="text-xs text-gray-500">Échéance : {inv.dueDate}</p>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#059669' }}>De</p>
                    <p className="text-sm font-semibold text-gray-900">{inv.sellerName || '—'}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      {inv.sellerAddress}{inv.sellerAddress && <br />}
                      {inv.sellerCity}{inv.sellerCity && <br />}
                      {inv.sellerEmail}{inv.sellerEmail && <br />}
                      {inv.sellerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#059669' }}>Facturer à</p>
                    <p className="text-sm font-semibold text-gray-900">{inv.clientName || '—'}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                      {inv.clientAddress}{inv.clientAddress && <br />}
                      {inv.clientCity}{inv.clientCity && <br />}
                      {inv.clientEmail}
                    </p>
                  </div>
                </div>

                <hr style={{ borderColor: '#e5e7eb' }} />

                {/* Table */}
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      {['Description', 'Qté', 'Prix unit.', 'Total'].map((h, i) => (
                        <th key={h} className={`pb-2 font-bold uppercase tracking-wider text-gray-400 ${i > 0 ? 'text-right' : 'text-left'}`} style={{ fontSize: '10px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inv.lines.map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td className="py-2.5 text-gray-700">{l.description || '—'}</td>
                        <td className="py-2.5 text-right text-gray-600">{l.quantity}</td>
                        <td className="py-2.5 text-right text-gray-600">{formatCurrency(l.unitPrice, currency)}</td>
                        <td className="py-2.5 text-right font-semibold text-gray-900">{formatCurrency(l.quantity * l.unitPrice, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totaux */}
                <div className="ml-auto w-52 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Sous-total</span><span>{formatCurrency(subtotal, currency)}</span>
                  </div>
                  {inv.taxRate > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>TVA ({inv.taxRate}%)</span><span>{formatCurrency(taxAmount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center rounded-xl px-3 py-2.5 mt-2" style={{ background: '#f0fdf4' }}>
                    <span className="font-bold text-gray-900 text-sm">Total</span>
                    <span className="font-black text-lg" style={{ color: '#059669' }}>{formatCurrency(total, currency)}</span>
                  </div>
                </div>

                {inv.notes && (
                  <div className="rounded-xl p-3 text-xs text-gray-500" style={{ background: '#f9fafb' }}>
                    <span className="font-semibold text-gray-700">Notes : </span>{inv.notes}
                  </div>
                )}

                <p className="text-center text-[10px] text-gray-300">Généré avec Risly · risly.ch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
