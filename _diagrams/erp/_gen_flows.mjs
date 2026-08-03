import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'node:fs'

// ---- primitives -------------------------------------------------------------
const box = (x, y, w, h, title, sub, o = {}) => {
  const stroke = o.ok ? '#34d399' : o.danger ? '#f43f5e' : o.accent ? o.accentColor : '#2a3350'
  const fill = o.fill || (o.ok ? '#10261d' : o.danger ? '#1a1320' : '#141a2e')
  const cx = x + w / 2
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`
  if (sub) {
    s += `<text x="${cx}" y="${y + h / 2 - 3}" fill="#e2e8f0" font-size="16" font-weight="600" text-anchor="middle">${title}</text>`
    s += `<text x="${cx}" y="${y + h / 2 + 18}" fill="#94a3b8" font-size="12.5" text-anchor="middle">${sub}</text>`
  } else {
    s += `<text x="${cx}" y="${y + h / 2 + 6}" fill="#e2e8f0" font-size="16" font-weight="600" text-anchor="middle">${title}</text>`
  }
  return s
}
const arr = (x1, y1, x2, y2, o = {}) => {
  const c = o.danger ? '#f43f5e' : o.acc ? o.acc : '#475569'
  const m = o.danger ? 'aR' : o.acc ? 'aA' : 'a'
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2" ${o.dash ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#${m})"/>`
}
const lbl = (x, y, t, c = '#64748b') => `<text x="${x}" y="${y}" fill="${c}" font-size="13" text-anchor="middle">${t}</text>`
const diamond = (cx, cy, hw, hh, label, a) =>
  `<polygon points="${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}" fill="#141a2e" stroke="${a}" stroke-width="1.8"/>` +
  `<text x="${cx}" y="${cy + 5}" fill="#e2e8f0" font-size="15" font-weight="600" text-anchor="middle">${label}</text>`

const header = (t, s) =>
  `<text x="64" y="66" fill="#f1f5f9" font-size="32" font-weight="700">${t}</text>` +
  `<text x="64" y="100" fill="#94a3b8" font-size="18">${s}</text>`

const wrap = (accent, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" font-family="'Segoe UI', system-ui, sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0e1a"/><stop offset="1" stop-color="#0d1326"/></linearGradient>
    <marker id="a" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="#64748b"/></marker>
    <marker id="aA" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="${accent}"/></marker>
    <marker id="aR" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="#f43f5e"/></marker>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  ${body}
</svg>`

// horizontal state chain helper
const chain = (items, a, { y = 300, h = 80, w, gap } = {}) => {
  const n = items.length
  w = w || Math.floor((1180 - gap * (n - 1)) / n)
  const total = n * w + gap * (n - 1)
  const x0 = (1280 - total) / 2
  let s = ''
  items.forEach((it, i) => {
    const x = x0 + i * (w + gap)
    s += box(x, y, w, h, it.t, it.s || '', it.ok ? { ok: true } : it.acc ? { accent: true, accentColor: a } : {})
    if (i < n - 1) s += arr(x + w, y + h / 2, x0 + (i + 1) * (w + gap) - 3, y + h / 2)
  })
  return { s, x0, w, gap, y, h }
}

// ---- diagram bodies ---------------------------------------------------------
const salesApproval = (a) => {
  const c = chain(
    [{ t: 'Draft' }, { t: 'Wait: Sales Mgr', acc: 1 }, { t: 'Wait: Finance', acc: 1 }, { t: 'Wait: Director', acc: 1 }, { t: 'Confirmed', s: 'sale', ok: 1 }],
    a, { y: 300, h: 80, w: 185, gap: 45 },
  )
  let s = c.s
  const x1 = c.x0 + c.w / 2
  const x5 = c.x0 + 4 * (c.w + c.gap) + c.w / 2
  s += `<path d="M ${x1} 300 C ${x1} 205, ${x5} 205, ${x5} 300" fill="none" stroke="${a}" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#aA)"/>`
  s += lbl((x1 + x5) / 2, 195, 'within credit limit → auto-confirm', a)
  const x4 = c.x0 + 3 * (c.w + c.gap) + c.w / 2
  s += box(490, 455, 220, 64, 'Cancel', 'rejected at any gate', { danger: true })
  s += `<path d="M ${x4} 380 C ${x4} 430, 640 430, 600 455" fill="none" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#aR)"/>`
  return header('Sales order approval chain', 'Credit-limit gating decides how far an order climbs before it confirms') + s
}

const salesReturn = (a) => {
  const c = chain(
    [{ t: 'Draft', s: 'return created' }, { t: 'Waiting Deposit', acc: 1 }, { t: 'Waiting Picking', acc: 1 }, { t: 'Done', s: 'settled', ok: 1 }],
    a, { y: 320, h: 86, w: 210, gap: 56 },
  )
  let s = c.s
  const step = c.w + c.gap
  s += box(c.x0, 200, 280, 56, 'account.deposit (inbound)', '', { accent: true, accentColor: a })
  s += arr(c.x0 + 140, 256, c.x0 + c.w + c.gap / 2, 318, { acc: a, dash: true })
  s += box(c.x0 + 2 * step - 30, 200, 260, 56, 'stock return picking', '', { accent: true, accentColor: a })
  s += arr(c.x0 + 2 * step + 100, 256, c.x0 + 2 * step + c.w / 2, 318, { acc: a, dash: true })
  return header('Sales return with deposit settlement', 'A return settles a customer deposit, then generates the return picking') + s
}

const wmsSync = (a) => {
  let s = box(80, 280, 240, 92, 'ERP', 'delivery confirmed', {})
  s += `<text x="200" y="405" fill="#94a3b8" font-size="13" text-anchor="middle">request.delivery created</text>`
  s += box(490, 280, 300, 92, 'Sync worker', 'cron · XML-RPC', { accent: true, accentColor: a })
  s += box(960, 280, 240, 92, 'External WMS', 'insert / update', {})
  s += arr(320, 325, 487, 325, {})
  s += lbl(403, 312, 'queued request')
  s += arr(790, 310, 957, 310, { acc: a })
  s += lbl(873, 297, 'push insert / update', a)
  s += `<path d="M 960 360 C 873 430, 403 430, 322 372" fill="none" stroke="#475569" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#a)"/>`
  s += lbl(640, 445, 'status synced back')
  return header('Delivery request → external WMS sync', 'Confirmed delivery requests sync over XML-RPC, driven by a cron worker') + s
}

const prApproval = (a) => {
  const c = chain(
    [{ t: 'Draft' }, { t: 'Waiting 1', s: 'department', acc: 1 }, { t: 'Waiting 2', s: 'director', acc: 1 }, { t: 'Approved', acc: 1 }, { t: 'Process', s: 'PO raised' }, { t: 'Done', ok: 1 }],
    a, { y: 300, h: 82, w: 165, gap: 30 },
  )
  let s = c.s
  const x2 = c.x0 + 1 * (c.w + c.gap) + c.w / 2
  s += box(540, 460, 220, 60, 'Cancel', 'rejected', { danger: true })
  s += `<path d="M ${x2} 382 C ${x2} 440, 640 440, 620 460" fill="none" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#aR)"/>`
  return header('Purchase request approval workflow', 'Two-tier department approval before a PO is raised') + s
}

const threeWay = (a) => {
  let s = box(110, 200, 200, 70, 'PO qty', '', {})
  s += box(110, 305, 200, 70, 'Receipt qty', '', {})
  s += box(110, 410, 200, 70, 'Invoice qty', '', {})
  s += `<circle cx="560" cy="340" r="62" fill="#141a2e" stroke="${a}" stroke-width="2"/>`
  s += `<text x="560" y="335" fill="#e2e8f0" font-size="17" font-weight="700" text-anchor="middle">= ?</text>`
  s += `<text x="560" y="358" fill="#94a3b8" font-size="12" text-anchor="middle">quantities</text>`
  s += arr(310, 235, 505, 320, {})
  s += arr(310, 340, 498, 340, {})
  s += arr(310, 445, 505, 360, {})
  s += box(820, 250, 250, 70, 'Post vendor bill', '', { ok: true })
  s += box(820, 380, 250, 70, 'Blocked', 'quantities disagree', { danger: true })
  s += arr(622, 320, 818, 290, { acc: a }); s += lbl(720, 270, 'match', a)
  s += arr(622, 365, 818, 410, { danger: true }); s += lbl(720, 430, 'mismatch', '#fb7185')
  return header('Three-way match validation', 'A vendor bill posts only when PO, receipt and invoice quantities agree') + s
}

const efaktur = (a) => {
  const c = chain(
    [{ t: 'Posted invoice' }, { t: 'Assign e-Faktur', s: 'DJP serial no.', acc: 1 }, { t: 'Validate NPWP', acc: 1 }, { t: 'Export XML / PDF', acc: 1 }, { t: 'Upload to DMS', s: 'Alfresco + link', ok: 1 }],
    a, { y: 300, h: 88, w: 200, gap: 38 },
  )
  return header('e-Faktur export and DMS upload', 'Invoices get a DJP tax number, then export and archive to the document store') + c.s
}

const mismatch = (a) => {
  let s = box(70, 300, 200, 80, 'Scan asset', 'during opname', {})
  s += diamond(430, 340, 96, 56, 'Location OK?', a)
  s += arr(270, 340, 332, 340, {})
  s += box(600, 215, 220, 70, 'Valid', 'condition recorded', { ok: true })
  s += arr(470, 305, 600, 255, { acc: a }); s += lbl(545, 240, 'match', a)
  s += box(600, 385, 240, 70, 'Queue ITF', 'mismatch flagged', { danger: true })
  s += arr(470, 375, 600, 415, { danger: true }); s += lbl(545, 450, 'mismatch', '#fb7185')
  s += box(900, 385, 250, 70, 'Internal transfer', 'asset.move created', { accent: true, accentColor: a })
  s += arr(840, 420, 898, 420, {})
  s += lbl(1025, 478, 'user: Transfer or Keep')
  return header('Location mismatch → internal transfer', 'Assets found in the wrong place auto-queue an internal transfer') + s
}

const scrap = (a) => {
  const c = chain(
    [{ t: 'Draft' }, { t: 'Waiting 1', acc: 1 }, { t: 'Waiting 2', acc: 1 }, { t: 'Waiting 3', acc: 1 }, { t: 'Done', s: '→ Disposal', ok: 1 }],
    a, { y: 300, h: 80, w: 185, gap: 45 },
  )
  let s = c.s
  s += lbl(640, 225, 'approval levels scale with the asset value threshold', a)
  s += `<line x1="220" y1="240" x2="1060" y2="240" stroke="${a}" stroke-width="1" stroke-dasharray="3 4" opacity="0.5"/>`
  return header('Scrap / disposal approval', 'Threshold-based multi-level approval; final disposal updates asset condition') + s
}

const ssoLogin = (a) => {
  const lanes = [{ x: 220, t: 'Mobile app' }, { x: 640, t: 'SSO server' }, { x: 1060, t: 'Database' }]
  let s = ''
  for (const ln of lanes) {
    s += box(ln.x - 95, 150, 190, 52, ln.t, '', { accent: true, accentColor: a })
    s += `<line x1="${ln.x}" y1="202" x2="${ln.x}" y2="630" stroke="#2a3350" stroke-width="1.5" stroke-dasharray="4 5"/>`
  }
  const msg = (x1, x2, y, t, dash) => arr(x1, y, x2, y, { dash }) + `<text x="${(x1 + x2) / 2}" y="${y - 10}" fill="#cbd5e1" font-size="13" text-anchor="middle">${t}</text>`
  s += msg(220, 640, 250, 'POST /web/login (credentials)', false)
  s += msg(640, 1060, 320, 'validate user', false)
  s += msg(1060, 640, 380, 'ok', true)
  s += msg(640, 1060, 445, 'store sso_token + session.portal', false)
  s += msg(640, 220, 515, 'return token + session id', true)
  s += `<rect x="150" y="560" width="200" height="46" rx="10" fill="#141a2e" stroke="${a}"/><text x="250" y="588" fill="#e2e8f0" font-size="13" text-anchor="middle">store token · call APIs</text>`
  return header('Login → SSO token generation', 'Credentials are exchanged for a token and a tracked session') + s
}

const ssoOtp = (a) => {
  let s = box(120, 305, 200, 80, 'Unverified', 'after password', { accent: true, accentColor: a })
  s += box(560, 200, 200, 76, 'Active', 'session valid', { ok: true })
  s += box(560, 405, 200, 76, 'Frozen', 'locked out', { danger: true })
  s += box(900, 200, 200, 76, 'Expired', 'timed out', {})
  s += arr(320, 320, 558, 250, { acc: a }); s += lbl(440, 255, 'valid OTP', a)
  s += arr(320, 365, 558, 435, { danger: true }); s += lbl(440, 425, 'failed × N', '#fb7185')
  s += arr(760, 238, 898, 238, {}); s += lbl(829, 225, 'timeout')
  s += `<path d="M 560 455 C 430 500, 320 470, 240 387" fill="none" stroke="#475569" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#a)"/>`
  s += lbl(400, 505, 'after cooldown')
  return header('OTP / 2FA session states', 'A session activates on valid OTP and freezes on repeated failures') + s
}

const ssoBridge = (a) => {
  let s = box(500, 150, 280, 96, 'SSO server', 'token authority', { accent: true, accentColor: a })
  s += box(90, 300, 200, 80, 'User login', 'one sign-on', {})
  s += arr(290, 340, 498, 230, { acc: a }); s += lbl(370, 250, 'authenticate', a)
  const tiles = [{ x: 200, t: 'ERP A' }, { x: 540, t: 'ERP B' }, { x: 880, t: 'ERP C' }]
  for (const t of tiles) {
    s += box(t.x, 460, 200, 80, t.t, 'sso_client', {})
    s += `<path d="M ${t.x + 100} 460 C ${t.x + 100} 380, 640 340, 640 248" fill="none" stroke="#475569" stroke-width="1.8" marker-end="url(#a)"/>`
  }
  s += lbl(870, 360, 'validate token (XML-RPC)')
  return header('Cross-ERP single sign-on', 'One token, validated by each ERP client, unlocks every connected system') + s
}

const ssoMiddleware = (a) => {
  const c = chain(
    [{ t: 'Request', s: 'Id/Secret + User' }, { t: 'checkAuth', s: 'verify keys', acc: 1 }, { t: 'authorizedUser', s: 'resolve roles', acc: 1 }, { t: 'API handler', s: 'execute' }, { t: 'Response', s: 'logged', ok: 1 }],
    a, { y: 290, h: 86, w: 190, gap: 30 },
  )
  let s = c.s
  const step = c.w + c.gap
  const x2 = c.x0 + 1 * step + c.w / 2
  const x3 = c.x0 + 2 * step + c.w / 2
  s += box(c.x0 + step, 470, 320, 60, '401 + WhatsApp alert', '', { danger: true })
  s += arr(x2, 376, x2 + 30, 470, { danger: true, dash: true })
  s += arr(x3, 376, x3 - 30, 470, { danger: true, dash: true })
  s += lbl((x2 + x3) / 2, 560, 'auth failure → reject and alert', '#fb7185')
  return header('API gateway auth middleware', 'Every request is authenticated, authorized, executed and logged') + s
}

// ---- config -----------------------------------------------------------------
const D = [
  { flow: 'erp-sales-order-to-cash', accent: '#34d399', items: [
    { n: '02-approval-chain-sales-finance-director', body: salesApproval },
    { n: '04-sales-return-deposit-settlement', body: salesReturn },
  ] },
  { flow: 'erp-inventory-wms', accent: '#22d3ee', items: [
    { n: '05-wms-delivery-request-sync', body: wmsSync },
  ] },
  { flow: 'erp-procurement-purchase', accent: '#38bdf8', items: [
    { n: '02-purchase-request-approval-workflow', body: prApproval },
    { n: '05-three-way-match-validation', body: threeWay },
  ] },
  { flow: 'erp-accounting-efaktur', accent: '#2dd4bf', items: [
    { n: '02-efaktur-export-dms-upload', body: efaktur },
  ] },
  { flow: 'erp-asset-inventory-mobile', accent: '#a78bfa', items: [
    { n: '03-location-mismatch-internal-transfer', body: mismatch },
    { n: '06-scrap-disposal-approval', body: scrap },
  ] },
  { flow: 'portal-sso-mobile-api', accent: '#fb7185', items: [
    { n: '01-login-sso-token-generation', body: ssoLogin },
    { n: '02-otp-2fa-session-state-machine', body: ssoOtp },
    { n: '03-cross-erp-sso-bridge', body: ssoBridge },
    { n: '04-api-gateway-auth-middleware', body: ssoMiddleware },
  ] },
]

let count = 0
for (const f of D) {
  const dir = `_diagrams/erp/${f.flow}`
  mkdirSync(dir, { recursive: true })
  for (const it of f.items) {
    const markup = wrap(f.accent, it.body(f.accent))
    writeFileSync(`${dir}/${it.n}.svg`, markup)
    await sharp(Buffer.from(markup), { density: 200 }).png().toFile(`${dir}/${it.n}.png`)
    count++
    console.log('rendered', f.flow + '/' + it.n)
  }
}
console.log('done:', count, 'diagrams')
