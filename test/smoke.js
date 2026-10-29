// End-to-end check of the core flow: register -> list -> bid -> outbid -> accept -> contact reveal.
process.env.DB_FILE = require('path').join(require('os').tmpdir(), `km-test-${Date.now()}.json`);
const assert = require('assert');
const { app } = require('../server');
const server = app.listen(0, async () => {
  const base = `http://localhost:${server.address().port}/api`;
  const call = async (path, method = 'GET', body, token) => {
    const r = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, body: body && JSON.stringify(body) });
    return { status: r.status, ...(await r.json()) };
  };
  try {
    const farmer = await call('/register', 'POST', { name: 'Test Farmer', phone: '03111111111', password: 'secret1', role: 'farmer', location: 'Peshawar' });
    const b1 = await call('/register', 'POST', { name: 'Buyer One', phone: '03222222222', password: 'secret1', role: 'buyer', location: 'Peshawar' });
    const b2 = await call('/register', 'POST', { name: 'Buyer Two', phone: '03333333333', password: 'secret1', role: 'buyer', location: 'Lahore' });
    assert(farmer.token && b1.token && b2.token, 'registration');
    assert.strictEqual((await call('/register', 'POST', { name: 'x', phone: '03111111111', password: 'secret1', role: 'buyer', location: 'y' })).status, 409, 'duplicate phone');

    const created = await call('/listings', 'POST', { crop: 'tomato', quantity: 100, unit: 'kg', basePrice: 80, hours: 24 }, farmer.token);
    assert.strictEqual(created.status, 201); const id = created.listing.id;
    assert.strictEqual((await call('/listings', 'POST', { crop: 'x', quantity: 1, unit: 'kg', basePrice: 1, hours: 24 }, b1.token)).status, 403, 'buyer cannot list');

    assert.strictEqual((await call(`/listings/${id}/bids`, 'POST', { amount: 70 }, b1.token)).status, 400, 'below base price');
    assert.strictEqual((await call(`/listings/${id}/bids`, 'POST', { amount: 85 }, b1.token)).status, 201);
    assert.strictEqual((await call(`/listings/${id}/bids`, 'POST', { amount: 85 }, b2.token)).status, 400, 'must beat current bid');
    assert.strictEqual((await call(`/listings/${id}/bids`, 'POST', { amount: 90 }, b2.token)).status, 201);
    assert.strictEqual((await call(`/listings/${id}/bids`, 'POST', { amount: 95 }, farmer.token)).status, 403, 'farmer cannot bid');

    const detail = await call(`/listings/${id}`, 'GET', null, b1.token);
    assert.strictEqual(detail.listing.currentBid, 90);
    assert(detail.bids.every((b) => b.mine || b.bidder.startsWith('Buyer ')), 'bidders hidden from rivals');
    const mine = await call('/my/bids', 'GET', null, b1.token);
    assert.strictEqual(mine.items.find((i) => i.id === id).state, 'outbid');

    const recs = await call('/recommendations', 'GET', null, b1.token);
    assert(recs.items.length > 0, 'recommendations');
    const hint = await call('/price-hint?crop=Tomato&unit=kg', 'GET', null, farmer.token);
    assert(hint.liveCount >= 1, 'price hint');

    const sold = await call(`/listings/${id}/accept`, 'POST', null, farmer.token);
    assert.strictEqual(sold.listing.status, 'sold'); assert.strictEqual(sold.listing.finalPrice, 90);
    assert.strictEqual(sold.listing.contact.name, 'Buyer Two');
    const winner = await call(`/listings/${id}`, 'GET', null, b2.token);
    assert(winner.listing.won && winner.listing.contact.phone === '03111111111', 'winner sees farmer contact');
    const loser = await call(`/listings/${id}`, 'GET', null, b1.token);
    assert(!loser.listing.contact, 'loser sees no contact');
    assert.strictEqual((await call(`/listings/${id}/bids`, 'POST', { amount: 200 }, b1.token)).status, 409, 'closed');
    console.log('All smoke checks passed.');
    server.close(); process.exit(0);
  } catch (e) { console.error('FAILED:', e.message); server.close(); process.exit(1); }
});
