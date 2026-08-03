import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

// ---- shared helpers ---------------------------------------------------------
const arrowV = (x, y1, y2) =>
  `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 - 4}" stroke="#475569" stroke-width="2" marker-end="url(#av)"/>`

const qr = (x, y, sz) => {
  const m = sz / 7
  const finder = (fx, fy) =>
    `<rect x="${fx}" y="${fy}" width="${m * 2}" height="${m * 2}" fill="none" stroke="#cbd5e1" stroke-width="1.4"/>` +
    `<rect x="${fx + m * 0.6}" y="${fy + m * 0.6}" width="${m * 0.8}" height="${m * 0.8}" fill="#cbd5e1"/>`
  let s = finder(x, y) + finder(x + sz - m * 2, y) + finder(x, y + sz - m * 2)
  for (const [c, r] of [[3, 3], [4, 4], [5, 3], [3, 5], [5, 5], [4, 1], [1, 4]])
    s += `<rect x="${x + c * m}" y="${y + r * m}" width="${m * 0.8}" height="${m * 0.8}" fill="#94a3b8"/>`
  return s
}

const chips = (labels) => {
  let x = 72
  let s = ''
  for (const l of labels) {
    const w = Math.round(l.length * 8.4) + 30
    s += `<rect x="${x}" y="486" width="${w}" height="34" rx="17" fill="#141a2e" stroke="#2a3350"/>`
    s += `<text x="${x + w / 2}" y="508" fill="#cbd5e1" font-size="15" font-weight="500" text-anchor="middle">${l}</text>`
    x += w + 12
  }
  return s
}

const leftBlock = (f) => `
  <text x="72" y="258" fill="${f.accent}" font-size="17" font-weight="600" letter-spacing="4">${f.kicker}</text>
  <text x="70" y="332" fill="#f8fafc" font-size="56" font-weight="800">${f.title[0]}</text>
  <text x="70" y="398" fill="#f8fafc" font-size="56" font-weight="800">${f.title[1]}</text>
  <text x="72" y="446" fill="#94a3b8" font-size="20">${f.tagline}</text>
  ${chips(f.chips)}`

const svg = (f) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" font-family="'Segoe UI', system-ui, sans-serif">
  <defs>
    <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0e1a"/><stop offset="0.55" stop-color="#0c1226"/><stop offset="1" stop-color="#0e1a2e"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${f.accent}" stop-opacity="0.38"/><stop offset="1" stop-color="${f.accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="hub" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#312e81"/><stop offset="1" stop-color="#0e7490"/></linearGradient>
    <marker id="av" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="#64748b"/></marker>
  </defs>
  <rect width="1280" height="720" fill="url(#cbg)"/>
  <circle cx="965" cy="345" r="205" fill="url(#glow)"/>
  ${leftBlock(f)}
  ${f.motif(f.accent)}
</svg>`

// ---- per-flow motifs --------------------------------------------------------
const salesMotif = (a) => {
  const cards = ['Sales Manager', 'Finance', 'Director']
  const ys = [170, 244, 318]
  let s = `<text x="940" y="150" fill="${a}" font-size="14" font-weight="600" letter-spacing="2" text-anchor="middle">APPROVAL CHAIN</text>`
  ys.forEach((y, i) => {
    s += `<rect x="800" y="${y}" width="280" height="58" rx="12" fill="#141a2e" stroke="#2a3350" stroke-width="1.5"/>`
    s += `<circle cx="836" cy="${y + 29}" r="13" fill="#0f2620" stroke="${a}" stroke-width="1.8"/>`
    s += `<path d="M 830 ${y + 29} l 4 5 l 8 -10" fill="none" stroke="${a}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
    s += `<text x="864" y="${y + 35}" fill="#e2e8f0" font-size="17" font-weight="600">${cards[i]}</text>`
    if (i < 2) s += arrowV(940, y + 58, ys[i + 1])
  })
  s += arrowV(940, 376, 400)
  s += `<rect x="800" y="400" width="280" height="58" rx="12" fill="#10261d" stroke="${a}" stroke-width="1.8"/>`
  s += `<text x="940" y="435" fill="#d1fae5" font-size="17" font-weight="700" text-anchor="middle">Confirmed → Invoice</text>`
  return s
}

const box = (x, y, fill) => `<rect x="${x}" y="${y}" width="44" height="34" rx="5" fill="${fill}" stroke="#334066" stroke-width="1.4"/>`
const wmsMotif = (a) => {
  let s = `<text x="965" y="150" fill="${a}" font-size="14" font-weight="600" letter-spacing="2" text-anchor="middle">WAREHOUSE</text>`
  s += `<rect x="862" y="212" width="206" height="232" rx="12" fill="#141a2e" stroke="#2a3350" stroke-width="1.6"/>`
  s += `<line x1="862" y1="290" x2="1068" y2="290" stroke="#2a3350"/>`
  s += `<line x1="862" y1="368" x2="1068" y2="368" stroke="#2a3350"/>`
  s += box(892, 242, a) + box(962, 242, '#243049')
  s += box(892, 320, '#243049') + box(978, 320, a)
  s += box(932, 398, '#243049')
  s += `<line x1="772" y1="280" x2="858" y2="280" stroke="#475569" stroke-width="2" marker-end="url(#av)"/>`
  s += `<text x="772" y="266" fill="#94a3b8" font-size="14">IN · receipt</text>`
  s += `<line x1="1072" y1="380" x2="1158" y2="380" stroke="#475569" stroke-width="2" marker-end="url(#av)"/>`
  s += `<text x="1072" y="366" fill="#94a3b8" font-size="14">OUT · delivery</text>`
  return s
}

const purchaseMotif = (a) => {
  const node = (cx, cy, l) =>
    `<rect x="${cx - 66}" y="${cy - 28}" width="132" height="56" rx="12" fill="#141a2e" stroke="#2a3350" stroke-width="1.6"/>` +
    `<text x="${cx}" y="${cy + 6}" fill="#e2e8f0" font-size="17" font-weight="600" text-anchor="middle">${l}</text>`
  const PO = [940, 205], RC = [838, 430], IN = [1042, 430]
  let s = `<text x="940" y="150" fill="${a}" font-size="14" font-weight="600" letter-spacing="2" text-anchor="middle">THREE-WAY MATCH</text>`
  s += `<g stroke="${a}" stroke-width="2" opacity="0.5">`
  s += `<line x1="${PO[0]}" y1="${PO[1]}" x2="${RC[0]}" y2="${RC[1]}"/>`
  s += `<line x1="${PO[0]}" y1="${PO[1]}" x2="${IN[0]}" y2="${IN[1]}"/>`
  s += `<line x1="${RC[0]}" y1="${RC[1]}" x2="${IN[0]}" y2="${IN[1]}"/></g>`
  s += `<circle cx="940" cy="345" r="30" fill="#1e1b3a" stroke="${a}" stroke-width="2"/>`
  s += `<path d="M 927 345 l 7 8 l 14 -18" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
  s += node(PO[0], PO[1], 'PO') + node(RC[0], RC[1], 'Receipt') + node(IN[0], IN[1], 'Invoice')
  return s
}

const accMotif = (a) => {
  let s = `<rect x="858" y="200" width="190" height="250" rx="12" fill="#141a2e" stroke="#2a3350" stroke-width="1.6"/>`
  s += `<text x="880" y="240" fill="#e2e8f0" font-size="16" font-weight="700">Invoice</text>`
  for (let i = 0; i < 5; i++) s += `<rect x="880" y="${262 + i * 22}" width="${i % 2 ? 120 : 146}" height="8" rx="4" fill="#26304a"/>`
  s += `<text x="880" y="420" fill="${a}" font-size="18" font-weight="700">Rp •••</text>`
  s += `<rect x="980" y="392" width="48" height="48" rx="4" fill="#0c1326" stroke="#334066"/>` + qr(984, 396, 40)
  s += `<circle cx="1028" cy="232" r="40" fill="none" stroke="${a}" stroke-width="2" stroke-dasharray="4 4"/>`
  s += `<text x="1028" y="228" fill="${a}" font-size="13" font-weight="700" text-anchor="middle">e-Faktur</text>`
  s += `<text x="1028" y="247" fill="${a}" font-size="11" text-anchor="middle">DJP ✓</text>`
  return s
}

const assetMotif = (a) => {
  let s = `<rect x="772" y="330" width="74" height="50" rx="8" fill="#141a2e" stroke="#2a3350"/>`
  s += `<circle cx="790" cy="355" r="7" fill="none" stroke="${a}" stroke-width="2"/>`
  s += `<text x="812" y="360" fill="#94a3b8" font-size="13">asset</text>`
  s += `<line x1="848" y1="348" x2="910" y2="318" stroke="${a}" stroke-width="2" stroke-dasharray="5 4"/>`
  s += `<rect x="912" y="172" width="172" height="316" rx="26" fill="#0e1424" stroke="${a}" stroke-width="2"/>`
  s += `<rect x="968" y="184" width="60" height="8" rx="4" fill="#1b2540"/>`
  s += `<rect x="930" y="206" width="136" height="248" rx="12" fill="#0a1120" stroke="#1b2540"/>`
  s += `<rect x="958" y="250" width="80" height="80" rx="6" fill="#0c1326" stroke="#334066"/>` + qr(964, 256, 68)
  s += `<text x="998" y="372" fill="#cbd5e1" font-size="14" font-weight="600" text-anchor="middle">Scan asset</text>`
  s += `<rect x="950" y="392" width="96" height="28" rx="14" fill="${a}" opacity="0.18"/>`
  s += `<rect x="950" y="392" width="96" height="28" rx="14" fill="none" stroke="${a}"/>`
  s += `<text x="998" y="411" fill="${a}" font-size="13" font-weight="600" text-anchor="middle">Condition ✓</text>`
  return s
}

const ssoMotif = (a) => {
  const erp = (y, l) => `<rect x="772" y="${y}" width="96" height="44" rx="10" fill="#141a2e" stroke="#2a3350"/><text x="820" y="${y + 28}" fill="#cbd5e1" font-size="14" text-anchor="middle">${l}</text>`
  const tile = (y) => `<rect x="1086" y="${y}" width="60" height="60" rx="14" fill="#141a2e" stroke="#2a3350"/>`
  let s = erp(248, 'ERP A') + erp(420, 'ERP B') + tile(214) + tile(312) + tile(410)
  s += `<g stroke="${a}" stroke-width="2" opacity="0.5" fill="none">`
  s += `<path d="M 868 270 C 900 270, 900 330, 905 332"/>`
  s += `<path d="M 868 442 C 900 442, 900 362, 905 360"/>`
  s += `<path d="M 1025 345 C 1060 345, 1060 244, 1086 244"/>`
  s += `<path d="M 1025 348 L 1086 342"/>`
  s += `<path d="M 1025 351 C 1060 351, 1060 440, 1086 440"/></g>`
  s += `<path d="M 965 250 L 1025 278 L 1025 348 Q 1025 408 965 432 Q 905 408 905 348 L 905 278 Z" fill="url(#hub)" stroke="${a}" stroke-width="2"/>`
  s += `<text x="965" y="302" fill="#e0e7ff" font-size="15" font-weight="700" text-anchor="middle">SSO</text>`
  s += `<circle cx="965" cy="338" r="13" fill="#0a0e1a" stroke="#c7d2fe" stroke-width="1.5"/>`
  s += `<rect x="960" y="343" width="10" height="18" rx="3" fill="#0a0e1a" stroke="#c7d2fe" stroke-width="1.5"/>`
  return s
}

// ---- flows ------------------------------------------------------------------
const flows = [
  { file: 'erp-sales-order-to-cash', kicker: 'QUOTATION TO CASH', title: ['ERP Sales', 'Order-to-Cash'], tagline: 'Approval-gated selling, delivery and invoicing', chips: ['Odoo 19', 'Python', 'PostgreSQL', 'QWeb'], accent: '#34d399', motif: salesMotif },
  { file: 'erp-inventory-wms', kicker: 'WAREHOUSE OPERATIONS', title: ['Inventory', '&amp; Warehouse'], tagline: 'Receipt to delivery: holds, counts, revaluation', chips: ['Odoo 19', 'Python', 'PostgreSQL', 'XML-RPC'], accent: '#22d3ee', motif: wmsMotif },
  { file: 'erp-procurement-purchase', kicker: 'PROCURE TO PAY', title: ['Procurement', '&amp; Purchase'], tagline: 'Requests, approvals and three-way matching', chips: ['Odoo 19', 'Python', 'PostgreSQL', 'QWeb'], accent: '#38bdf8', motif: purchaseMotif },
  { file: 'erp-accounting-efaktur', kicker: 'FINANCE · COMPLIANCE', title: ['Accounting', '&amp; e-Faktur'], tagline: 'Indonesian tax, payments, close and reports', chips: ['Odoo 19', 'e-Faktur', 'XLSX', 'PostgreSQL'], accent: '#2dd4bf', motif: accMotif },
  { file: 'erp-asset-inventory-mobile', kicker: 'ASSET · MOBILE', title: ['Asset', 'Inventory'], tagline: 'Field audits over a mobile REST API', chips: ['Odoo 19', 'REST API', 'QR', 'Mobile'], accent: '#a78bfa', motif: assetMotif },
  { file: 'portal-sso-mobile-api', kicker: 'IDENTITY · API', title: ['Portal SSO', '&amp; Mobile API'], tagline: 'Single sign-on and APIs across ERPs', chips: ['Node.js', 'Express', 'Odoo', 'OTP / TOTP'], accent: '#fb7185', motif: ssoMotif },
]

for (const f of flows) {
  const markup = svg(f)
  writeFileSync(`_diagrams/erp/${f.file}-cover.svg`, markup)
  await sharp(Buffer.from(markup), { density: 200 }).png().toFile(`_diagrams/erp/${f.file}-cover.png`)
  console.log('rendered', f.file)
}
console.log('done')
