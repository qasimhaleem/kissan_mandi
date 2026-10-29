const $ = (s) => document.querySelector(s);
const app = $('#app');
let session = JSON.parse(localStorage.getItem('km_session') || 'null');
let timer = null;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rs = (n) => 'Rs ' + Number(n).toLocaleString('en-PK');
const user = () => session?.user;

async function api(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(session && { Authorization: 'Bearer ' + session.token }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && session) { setSession(null); }
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}
function setSession(s) {
  session = s;
  s ? localStorage.setItem('km_session', JSON.stringify(s)) : localStorage.removeItem('km_session');
  renderNav();
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2800);
}
function timeLeft(ts) {
  const ms = ts - Date.now();
  if (ms <= 0) return 'Ended';
  const m = Math.floor(ms / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24);
  return d ? `${d}d ${h % 24}h left` : h ? `${h}h ${m % 60}m left` : `${m}m left`;
}
function ago(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  return m < 1 ? 'just now' : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`;
}

function renderNav() {
  const u = user();
  $('#nav').innerHTML = [
    '<a href="#/">Browse</a>',
    u?.role === 'farmer' ? '<a href="#/new">Sell produce</a>' : '',
    u ? '<a href="#/dashboard">' + (u.role === 'farmer' ? 'My listings' : 'My bids') + '</a>' : '',
    u ? `<span class="muted">${esc(u.name)}</span><button id="out">Log out</button>` : '<a href="#/login">Log in</a><a href="#/register">Register</a>',
  ].join('');
  $('#out')?.addEventListener('click', async () => { try { await api('/logout', 'POST'); } catch {} setSession(null); location.hash = '#/'; });
}

function listingCard(l) {
  const bid = l.currentBid ? `<div><span class="muted">Current bid</span><div class="price">${rs(l.currentBid)}</div></div>` : `<div><span class="muted">Base price</span><div class="price">${rs(l.basePrice)}</div></div>`;
  return `<a class="card" href="#/listing/${l.id}">
    <h3>${esc(l.crop)}</h3>
    <div class="muted">${l.quantity} ${esc(l.unit)} · ${esc(l.location)}</div>
    <div class="row">${bid}<div style="text-align:right"><span class="muted">${l.bidCount} bid${l.bidCount === 1 ? '' : 's'}</span><div data-end="${l.endsAt}">${timeLeft(l.endsAt)}</div></div></div>
    <div class="muted hint">per ${esc(l.unit)} · listed ${ago(l.createdAt)}</div>
    ${l.reasons?.length ? `<div class="tag">${esc(l.reasons.join(' · '))}</div>` : ''}
  </a>`;
}
function tickTimes() { document.querySelectorAll('[data-end]').forEach((el) => (el.textContent = timeLeft(+el.dataset.end))); }
function every(ms, fn) { clearInterval(timer); timer = setInterval(fn, ms); }

// ---------- pages ----------
async function browse() {
  app.innerHTML = `<h1>Fresh from the farm</h1><p class="muted">Farmers list directly. Buyers bid. The best price wins, with no middleman.</p>
    <div class="bar"><input id="q" placeholder="Search crop or place" size="22"><select id="crop"><option value="">All crops</option></select>
    <select id="sort"><option value="latest">Latest posts</option><option value="ending">Ending soon</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
    <div id="recs"></div><h2>All listings</h2><div id="list" class="grid"></div>`;
  let selected = '';
  async function load(first) {
    const p = new URLSearchParams({ q: $('#q').value, crop: $('#crop').value, sort: $('#sort').value });
    const { items, crops } = await api('/listings?' + p);
    if (first) $('#crop').innerHTML += crops.map((c) => `<option>${esc(c)}</option>`).join('');
    $('#list').innerHTML = items.length ? items.map(listingCard).join('') : '<p class="muted">No listings match your search.</p>';
  }
  await load(true);
  let deb; $('#q').addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => load(), 250); });
  $('#crop').addEventListener('change', () => load()); $('#sort').addEventListener('change', () => load());
  if (user()?.role === 'buyer') {
    const { items } = await api('/recommendations');
    if (items.length) $('#recs').innerHTML = `<h2>Recommended for you</h2><div class="grid">${items.slice(0, 3).map(listingCard).join('')}</div>`;
  }
  every(30000, tickTimes);
}

async function listing(id) {
  async function draw() {
    const { listing: l, bids } = await api('/listings/' + id);
    const u = user(), open = l.status === 'open';
    const min = Math.max(l.basePrice, (l.currentBid ?? 0) + 1);
    const statusBadge = { open: '<span class="badge good">Open</span>', sold: '<span class="badge">Sold</span>', expired: '<span class="badge bad">Ended, no bids</span>', cancelled: '<span class="badge bad">Cancelled</span>' }[l.status];
    let action = '';
    if (open && u?.role === 'buyer') action = `<form id="bidf" class="stack"><label>Your bid (Rs per ${esc(l.unit)})<input id="amt" type="number" min="${min}" step="1" value="${min}" required></label>
      <div class="hint">Minimum Rs ${min}. A bid in the last 5 minutes extends the auction by 5 minutes.</div><div class="err" id="err"></div><button class="primary">Place bid</button></form>`;
    else if (open && !u) action = '<p><a href="#/login">Log in</a> or <a href="#/register">register</a> as a buyer to bid.</p>';
    else if (open && l.mine) action = `<div class="bar"><button id="acc" class="primary" ${l.bidCount ? '' : 'disabled'}>Accept best bid</button>${l.bidCount ? '' : '<button id="can" class="danger">Cancel listing</button>'}</div><div class="err" id="err"></div>`;
    const contact = l.contact ? `<div class="panel"><strong>${l.won ? 'You won this auction.' : 'Sold.'}</strong> Call ${esc(l.contact.name)} on <a href="tel:${esc(l.contact.phone)}">${esc(l.contact.phone)}</a> to arrange payment and pickup.</div>` : '';
    app.innerHTML = `<p><a href="#/">← All listings</a></p>
      <h1>${esc(l.crop)} ${statusBadge}</h1><p class="muted">${l.quantity} ${esc(l.unit)} · ${esc(l.location)} · by ${esc(l.farmer.name)}</p>
      ${l.description ? `<p>${esc(l.description)}</p>` : ''}
      <div class="panel"><div class="row" style="margin:0"><div><span class="muted">${l.status === 'sold' ? 'Sold at' : l.currentBid ? 'Current bid' : 'Base price'}</span><div class="price">${rs(l.finalPrice ?? l.currentBid ?? l.basePrice)} / ${esc(l.unit)}</div></div>
      <div><span class="muted">Base price</span><div>${rs(l.basePrice)}</div></div><div><span class="muted">${open ? 'Time' : 'Status'}</span><div data-end="${l.endsAt}">${open ? timeLeft(l.endsAt) : 'Closed'}</div></div></div></div>
      ${contact}${action}
      <h2>Bids (${bids.length})</h2>
      ${bids.length ? `<table><tr><th>Bidder</th><th>Amount</th><th>When</th></tr>${bids.map((b) => `<tr><td>${esc(b.bidder)}${b.mine ? ' (you)' : ''}${b.leading ? ' <span class="badge good">Leading</span>' : ''}</td><td>${rs(b.amount)}</td><td class="muted">${ago(b.createdAt)}</td></tr>`).join('')}</table>` : '<p class="muted">No bids yet.</p>'}`;
    $('#bidf')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      try { await api(`/listings/${id}/bids`, 'POST', { amount: +$('#amt').value }); toast('Bid placed.'); draw(); }
      catch (er) { $('#err').textContent = er.message; }
    });
    $('#acc')?.addEventListener('click', async () => {
      if (!confirm('Accept the highest bid and close this listing?')) return;
      try { await api(`/listings/${id}/accept`, 'POST'); toast('Sold. The buyer\'s contact is now shown.'); draw(); } catch (er) { $('#err').textContent = er.message; }
    });
    $('#can')?.addEventListener('click', async () => {
      if (!confirm('Cancel this listing?')) return;
      try { await api(`/listings/${id}/cancel`, 'POST'); location.hash = '#/dashboard'; } catch (er) { $('#err').textContent = er.message; }
    });
  }
  try { await draw(); } catch (e) { app.innerHTML = `<p class="err">${esc(e.message)}</p><a href="#/">Back</a>`; return; }
  every(10000, () => { if (!document.activeElement || document.activeElement.tagName !== 'INPUT') draw().catch(() => {}); });
}

function authPage(mode) {
  const reg = mode === 'register';
  app.innerHTML = `<h1>${reg ? 'Create your account' : 'Log in'}</h1><p class="muted">${reg ? 'Free for farmers and buyers.' : 'Demo: 03001111111 (farmer) or 03004444444 (buyer), password demo1234'}</p>
    <form id="f" class="stack">
      ${reg ? '<label>Full name<input name="name" required></label><label>I am a<select name="role"><option value="farmer">Farmer (I sell produce)</option><option value="buyer">Buyer (I want to buy)</option></select></label><label>Location (city or district)<input name="location" required></label>' : ''}
      <label>Phone number<input name="phone" inputmode="numeric" placeholder="03001234567" required></label>
      <label>Password<input name="password" type="password" minlength="6" required></label>
      <div class="err" id="err"></div><button class="primary">${reg ? 'Register' : 'Log in'}</button></form>`;
  $('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    try { setSession(await api(reg ? '/register' : '/login', 'POST', Object.fromEntries(new FormData(e.target)))); location.hash = '#/'; }
    catch (er) { $('#err').textContent = er.message; }
  });
}

function newListing() {
  if (user()?.role !== 'farmer') { app.innerHTML = '<p>Only farmers can post produce. <a href="#/login">Log in as a farmer</a>.</p>'; return; }
  app.innerHTML = `<h1>Sell your produce</h1><p class="muted">Set a base price. Buyers bid above it and the best bid wins.</p>
    <form id="f" class="stack">
      <label>Crop<input name="crop" list="crops" required placeholder="Tomato, wheat, apple..."></label>
      <datalist id="crops"><option>Tomato<option>Onion<option>Potato<option>Wheat<option>Maize<option>Apple<option>Rice<option>Sugarcane</datalist>
      <div style="display:flex;gap:10px"><label style="flex:1">Quantity<input name="quantity" type="number" min="1" step="any" required></label>
      <label>Unit<select name="unit"><option>kg</option><option>maund</option><option>dozen</option></select></label></div>
      <label>Base price (Rs per unit)<input name="basePrice" type="number" min="1" step="any" required></label><div class="hint" id="hint"></div>
      <label>Location<input name="location" value="${esc(user().location)}" required></label>
      <label>Auction length<select name="hours"><option value="6">6 hours</option><option value="12">12 hours</option><option value="24" selected>24 hours</option><option value="48">2 days</option><option value="72">3 days</option></select></label>
      <label>Details (quality, pickup, packing)<textarea name="description" maxlength="300"></textarea></label>
      <div class="err" id="err"></div><button class="primary">Post listing</button></form>`;
  const f = $('#f'); let deb;
  async function hint() {
    const crop = f.crop.value.trim(); if (!crop) { $('#hint').textContent = ''; return; }
    const h = await api(`/price-hint?crop=${encodeURIComponent(crop)}&unit=${f.unit.value}`).catch(() => null);
    $('#hint').textContent = !h ? '' : h.soldCount ? `Similar ${crop} sold for about ${rs(h.soldAvg)} per ${f.unit.value} (${h.soldCount} sale${h.soldCount > 1 ? 's' : ''}).` : h.liveCount ? `Open ${crop} listings are at about ${rs(h.liveAvg)} per ${f.unit.value} right now.` : 'No price data for this crop yet.';
  }
  f.crop.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(hint, 300); }); f.unit.addEventListener('change', hint);
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    try { const { listing: l } = await api('/listings', 'POST', Object.fromEntries(new FormData(f))); toast('Listing posted.'); location.hash = '#/listing/' + l.id; }
    catch (er) { $('#err').textContent = er.message; }
  });
}

async function dashboard() {
  const u = user(); if (!u) { location.hash = '#/login'; return; }
  const farmer = u.role === 'farmer';
  const { items } = await api(farmer ? '/my/listings' : '/my/bids');
  const stateBadge = { winning: '<span class="badge good">Winning</span>', outbid: '<span class="badge bad">Outbid</span>', won: '<span class="badge good">Won</span>', lost: '<span class="badge">Lost</span>' };
  app.innerHTML = `<h1>${farmer ? 'My listings' : 'My bids'}</h1>${farmer ? '<p><a class="primary" href="#/new">+ New listing</a></p>' : ''}
    ${items.length ? `<table><tr><th>Crop</th><th>${farmer ? 'Best bid' : 'My bid'}</th><th>Status</th><th></th></tr>${items.map((l) => `<tr><td>${esc(l.crop)}<div class="hint">${l.quantity} ${esc(l.unit)} · ${esc(l.location)}</div></td>
    <td>${rs(farmer ? l.finalPrice ?? l.currentBid ?? l.basePrice : l.myBid)}${farmer && !l.currentBid && !l.finalPrice ? '<div class="hint">no bids yet</div>' : ''}</td>
    <td>${farmer ? `<span class="badge">${l.status}</span> <span class="hint">${l.bidCount} bids</span>` : stateBadge[l.state]}</td><td><a href="#/listing/${l.id}">Open</a></td></tr>`).join('')}</table>` : `<p class="muted">${farmer ? 'You have not listed anything yet.' : 'You have not placed any bids yet. <a href="#/">Browse listings</a>.'}</p>`}`;
}

// ---------- router ----------
async function route() {
  clearInterval(timer);
  const [, page, arg] = location.hash.split('/');
  try {
    if (page === 'listing') await listing(arg);
    else if (page === 'login') authPage('login');
    else if (page === 'register') authPage('register');
    else if (page === 'new') newListing();
    else if (page === 'dashboard') await dashboard();
    else await browse();
  } catch (e) { app.innerHTML = `<p class="err">${esc(e.message)}</p>`; }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
renderNav(); route();
