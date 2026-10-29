const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');
const HOUR = 3600 * 1000;
const SNIPE_WINDOW = 5 * 60 * 1000; // a bid in the last 5 minutes extends the auction by 5 minutes

let db = { users: [], listings: [], bids: [], views: [], sessions: {} };
function load() {
  if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  else { fs.mkdirSync(path.dirname(DB_FILE), { recursive: true }); require('./seed')(db, bcrypt); save(); }
}
function save() {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DB_FILE);
}
const uid = () => crypto.randomBytes(6).toString('hex');
const clean = (s, n = 200) => String(s ?? '').trim().slice(0, n);
const fail = (res, code, msg) => res.status(code).json({ error: msg });

// ---------- auction logic ----------
const bidsFor = (listingId) => db.bids.filter((b) => b.listingId === listingId);
function highest(listingId) {
  return bidsFor(listingId).reduce((best, b) =>
    !best || b.amount > best.amount || (b.amount === best.amount && b.createdAt < best.createdAt) ? b : best, null);
}
// Close auctions whose deadline has passed: highest bid wins, otherwise the listing expires.
function settleExpired() {
  let changed = false;
  for (const l of db.listings) {
    if (l.status === 'open' && Date.now() >= l.endsAt) {
      const top = highest(l.id);
      if (top) { l.status = 'sold'; l.winnerBidId = top.id; l.finalPrice = top.amount; l.soldAt = l.endsAt; }
      else l.status = 'expired';
      changed = true;
    }
  }
  if (changed) save();
}
function present(l, viewer) {
  const farmer = db.users.find((u) => u.id === l.farmerId);
  const top = highest(l.id);
  const out = {
    id: l.id, crop: l.crop, quantity: l.quantity, unit: l.unit, basePrice: l.basePrice, location: l.location,
    description: l.description, status: l.status, createdAt: l.createdAt, endsAt: l.endsAt,
    currentBid: top ? top.amount : null, bidCount: bidsFor(l.id).length, finalPrice: l.finalPrice ?? null,
    farmer: { id: farmer?.id, name: farmer?.name, location: farmer?.location },
    mine: viewer?.id === l.farmerId,
  };
  if (l.status === 'sold' && viewer) {
    const win = db.bids.find((b) => b.id === l.winnerBidId);
    const buyer = db.users.find((u) => u.id === win?.buyerId);
    if (viewer.id === l.farmerId) out.contact = { name: buyer?.name, phone: buyer?.phone };
    if (viewer.id === win?.buyerId) { out.contact = { name: farmer?.name, phone: farmer?.phone }; out.won = true; }
  }
  return out;
}

// ---------- recommendations (rule-based v1) ----------
function recommend(user, limit = 8) {
  const mineBids = db.bids.filter((b) => b.buyerId === user.id);
  const mineViews = db.views.filter((v) => v.userId === user.id);
  const cropW = {}, locW = {};
  const bump = (m, k, w) => { if (k) m[k] = (m[k] || 0) + w; };
  for (const b of mineBids) { const l = db.listings.find((x) => x.id === b.listingId); if (l) { bump(cropW, l.crop, 3); bump(locW, l.location, 1.5); } }
  for (const v of mineViews) { const l = db.listings.find((x) => x.id === v.listingId); if (l) { bump(cropW, l.crop, 1); bump(locW, l.location, 0.5); } }
  const open = db.listings.filter((l) => l.status === 'open' && l.farmerId !== user.id);
  return open.map((l) => {
    const reasons = [];
    let score = 0;
    if (cropW[l.crop]) { score += cropW[l.crop]; reasons.push(`You showed interest in ${l.crop}`); }
    if (locW[l.location]) { score += locW[l.location]; reasons.push(`Near places you buy from (${l.location})`); }
    if (l.location === user.location) { score += 1.5; reasons.push('Close to you'); }
    const ageH = (Date.now() - l.createdAt) / HOUR;
    const fresh = 2 * Math.exp(-ageH / 48);
    score += fresh; if (ageH < 12) reasons.push('Just listed');
    const n = bidsFor(l.id).length;
    if (n >= 2) { score += 0.5; reasons.push('Active bidding'); }
    const hoursLeft = (l.endsAt - Date.now()) / HOUR;
    if (hoursLeft < 6) reasons.push('Ending soon');
    return { score, listing: present(l, user), reasons: reasons.slice(0, 2) };
  }).sort((a, b) => b.score - a.score).slice(0, limit)
    .map(({ listing, reasons }) => ({ ...listing, reasons }));
}

// ---------- app ----------
const app = express();
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req, res, next) => {
  settleExpired();
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const s = db.sessions[token];
  req.user = s ? db.users.find((u) => u.id === s.userId) : null;
  next();
});
const need = (role) => (req, res, next) => {
  if (!req.user) return fail(res, 401, 'Please log in first.');
  if (role && req.user.role !== role) return fail(res, 403, `Only ${role}s can do this.`);
  next();
};
const publicUser = (u) => ({ id: u.id, name: u.name, phone: u.phone, role: u.role, location: u.location });
function startSession(res, user) {
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = { userId: user.id, at: Date.now() };
  save();
  res.json({ token, user: publicUser(user) });
}

app.post('/api/register', (req, res) => {
  const name = clean(req.body.name, 60), phone = clean(req.body.phone, 20).replace(/[\s-]/g, '');
  const password = String(req.body.password || ''), role = req.body.role, location = clean(req.body.location, 60);
  if (!name || !location) return fail(res, 400, 'Name and location are required.');
  if (!/^\+?\d{10,13}$/.test(phone)) return fail(res, 400, 'Enter a valid phone number, e.g. 03001234567.');
  if (password.length < 6) return fail(res, 400, 'Password must be at least 6 characters.');
  if (!['farmer', 'buyer'].includes(role)) return fail(res, 400, 'Choose farmer or buyer.');
  if (db.users.some((u) => u.phone === phone)) return fail(res, 409, 'This phone number is already registered.');
  const user = { id: uid(), name, phone, role, location, passwordHash: bcrypt.hashSync(password, 8), createdAt: Date.now() };
  db.users.push(user);
  startSession(res, user);
});
app.post('/api/login', (req, res) => {
  const phone = clean(req.body.phone, 20).replace(/[\s-]/g, '');
  const user = db.users.find((u) => u.phone === phone);
  if (!user || !bcrypt.compareSync(String(req.body.password || ''), user.passwordHash)) return fail(res, 401, 'Wrong phone number or password.');
  startSession(res, user);
});
app.post('/api/logout', (req, res) => {
  delete db.sessions[(req.headers.authorization || '').replace('Bearer ', '')]; save(); res.json({ ok: true });
});
app.get('/api/me', need(), (req, res) => res.json({ user: publicUser(req.user) }));

app.get('/api/listings', (req, res) => {
  const { q = '', crop = '', location = '', status = 'open', sort = 'latest' } = req.query;
  let list = db.listings.filter((l) => status === 'all' || l.status === status);
  const ql = q.toLowerCase();
  if (ql) list = list.filter((l) => `${l.crop} ${l.description} ${l.location}`.toLowerCase().includes(ql));
  if (crop) list = list.filter((l) => l.crop.toLowerCase() === crop.toLowerCase());
  if (location) list = list.filter((l) => l.location.toLowerCase().includes(location.toLowerCase()));
  const items = list.map((l) => present(l, req.user));
  const sorters = {
    latest: (a, b) => b.createdAt - a.createdAt,
    ending: (a, b) => a.endsAt - b.endsAt,
    price_asc: (a, b) => (a.currentBid ?? a.basePrice) - (b.currentBid ?? b.basePrice),
    price_desc: (a, b) => (b.currentBid ?? b.basePrice) - (a.currentBid ?? a.basePrice),
  };
  items.sort(sorters[sort] || sorters.latest);
  res.json({ items, crops: [...new Set(db.listings.map((l) => l.crop))].sort() });
});

app.get('/api/listings/:id', (req, res) => {
  const l = db.listings.find((x) => x.id === req.params.id);
  if (!l) return fail(res, 404, 'Listing not found.');
  if (req.user?.role === 'buyer') { db.views.push({ userId: req.user.id, listingId: l.id, ts: Date.now() }); save(); }
  const isOwner = req.user?.id === l.farmerId;
  const bids = bidsFor(l.id).sort((a, b) => b.amount - a.amount).map((b, i, all) => {
    const buyer = db.users.find((u) => u.id === b.buyerId);
    const mine = req.user?.id === b.buyerId;
    return { id: b.id, amount: b.amount, createdAt: b.createdAt, mine, bidder: isOwner || mine ? buyer?.name : `Buyer ${all.length - i}`, leading: i === 0 };
  });
  res.json({ listing: present(l, req.user), bids });
});

app.post('/api/listings', need('farmer'), (req, res) => {
  const b = req.body;
  const crop = clean(b.crop, 40), unit = ['kg', 'maund', 'dozen'].includes(b.unit) ? b.unit : null;
  const quantity = Number(b.quantity), basePrice = Number(b.basePrice), hours = Number(b.hours);
  if (!crop) return fail(res, 400, 'Enter the crop name.');
  if (!unit) return fail(res, 400, 'Choose a unit.');
  if (!(quantity > 0) || !(basePrice > 0)) return fail(res, 400, 'Quantity and base price must be above zero.');
  if (![6, 12, 24, 48, 72].includes(hours)) return fail(res, 400, 'Choose how long the auction runs.');
  const l = {
    id: uid(), farmerId: req.user.id, crop: crop[0].toUpperCase() + crop.slice(1).toLowerCase(), quantity, unit, basePrice,
    location: clean(b.location, 60) || req.user.location, description: clean(b.description, 300),
    status: 'open', createdAt: Date.now(), endsAt: Date.now() + hours * HOUR,
  };
  db.listings.push(l); save();
  res.status(201).json({ listing: present(l, req.user) });
});

app.post('/api/listings/:id/bids', need('buyer'), (req, res) => {
  const l = db.listings.find((x) => x.id === req.params.id);
  if (!l) return fail(res, 404, 'Listing not found.');
  if (l.status !== 'open') return fail(res, 409, 'This auction has ended.');
  const amount = Number(req.body.amount);
  if (!(amount > 0)) return fail(res, 400, 'Enter a valid amount.');
  if (amount < l.basePrice) return fail(res, 400, `Bid must be at least the base price (Rs ${l.basePrice}).`);
  const top = highest(l.id);
  if (top && amount <= top.amount) return fail(res, 400, `Bid must be higher than the current bid (Rs ${top.amount}).`);
  db.bids.push({ id: uid(), listingId: l.id, buyerId: req.user.id, amount, createdAt: Date.now() });
  if (l.endsAt - Date.now() < SNIPE_WINDOW) l.endsAt = Date.now() + SNIPE_WINDOW;
  save();
  res.status(201).json({ listing: present(l, req.user) });
});

app.post('/api/listings/:id/accept', need('farmer'), (req, res) => {
  const l = db.listings.find((x) => x.id === req.params.id && x.farmerId === req.user.id);
  if (!l) return fail(res, 404, 'Listing not found.');
  if (l.status !== 'open') return fail(res, 409, 'This listing is already closed.');
  const top = highest(l.id);
  if (!top) return fail(res, 409, 'There are no bids to accept yet.');
  Object.assign(l, { status: 'sold', winnerBidId: top.id, finalPrice: top.amount, soldAt: Date.now() });
  save();
  res.json({ listing: present(l, req.user) });
});
app.post('/api/listings/:id/cancel', need('farmer'), (req, res) => {
  const l = db.listings.find((x) => x.id === req.params.id && x.farmerId === req.user.id);
  if (!l) return fail(res, 404, 'Listing not found.');
  if (l.status !== 'open') return fail(res, 409, 'This listing is already closed.');
  if (bidsFor(l.id).length) return fail(res, 409, 'You cannot cancel a listing that already has bids. Accept the best bid instead.');
  l.status = 'cancelled'; save();
  res.json({ listing: present(l, req.user) });
});

app.get('/api/my/listings', need('farmer'), (req, res) =>
  res.json({ items: db.listings.filter((l) => l.farmerId === req.user.id).sort((a, b) => b.createdAt - a.createdAt).map((l) => present(l, req.user)) }));
app.get('/api/my/bids', need('buyer'), (req, res) => {
  const ids = [...new Set(db.bids.filter((b) => b.buyerId === req.user.id).map((b) => b.listingId))];
  const items = ids.map((id) => db.listings.find((l) => l.id === id)).filter(Boolean).map((l) => {
    const mineTop = Math.max(...db.bids.filter((b) => b.listingId === l.id && b.buyerId === req.user.id).map((b) => b.amount));
    const top = highest(l.id);
    const leading = top && top.buyerId === req.user.id;
    const state = l.status === 'open' ? (leading ? 'winning' : 'outbid') : (l.status === 'sold' && leading ? 'won' : 'lost');
    return { ...present(l, req.user), myBid: mineTop, state };
  }).sort((a, b) => b.createdAt - a.createdAt);
  res.json({ items });
});
app.get('/api/recommendations', need('buyer'), (req, res) => res.json({ items: recommend(req.user) }));

// Price hint for farmers: what similar crops have sold or are currently fetching.
app.get('/api/price-hint', need('farmer'), (req, res) => {
  const crop = clean(req.query.crop, 40).toLowerCase(), unit = req.query.unit;
  const same = db.listings.filter((l) => l.crop.toLowerCase() === crop && l.unit === unit);
  const sold = same.filter((l) => l.status === 'sold').map((l) => l.finalPrice);
  const live = same.filter((l) => l.status === 'open').map((l) => highest(l.id)?.amount ?? l.basePrice);
  const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null);
  res.json({ soldAvg: avg(sold), soldCount: sold.length, liveAvg: avg(live), liveCount: live.length });
});

app.use('/api', (req, res) => fail(res, 404, 'Not found.'));
load();
if (require.main === module) app.listen(PORT, () => console.log(`KissanMandi running on http://localhost:${PORT}`));
module.exports = { app, load };
