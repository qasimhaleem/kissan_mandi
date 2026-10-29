// Sample data so the app looks alive on first run. Prices are illustrative, in PKR.
const H = 3600 * 1000;
module.exports = function seed(db, bcrypt) {
  const now = Date.now();
  const hash = bcrypt.hashSync('demo1234', 8);
  const u = (id, name, phone, role, location) => ({ id, name, phone, role, location, passwordHash: hash, createdAt: now - 72 * H });
  db.users.push(
    u('f1', 'Ali Khan', '03001111111', 'farmer', 'Peshawar'),
    u('f2', 'Gul Zaman', '03002222222', 'farmer', 'Swat'),
    u('f3', 'Noor Muhammad', '03003333333', 'farmer', 'Mardan'),
    u('b1', 'Bilal Traders', '03004444444', 'buyer', 'Peshawar'),
    u('b2', 'Hamza Foods', '03005555555', 'buyer', 'Islamabad')
  );
  const l = (id, farmerId, crop, quantity, unit, basePrice, location, description, ageH, leftH) => ({
    id, farmerId, crop, quantity, unit, basePrice, location, description,
    status: 'open', createdAt: now - ageH * H, endsAt: now + leftH * H,
  });
  db.listings.push(
    l('l1', 'f1', 'Tomato', 500, 'kg', 80, 'Peshawar', 'Fresh red tomatoes, picked this morning.', 2, 20),
    l('l2', 'f1', 'Onion', 1200, 'kg', 90, 'Peshawar', 'Dry onions, medium size, sorted.', 10, 30),
    l('l3', 'f2', 'Apple', 300, 'kg', 150, 'Swat', 'Sweet mountain apples, grade A.', 5, 40),
    l('l4', 'f3', 'Wheat', 80, 'maund', 3500, 'Mardan', 'Clean wheat, low moisture.', 20, 8),
    l('l5', 'f3', 'Maize', 60, 'maund', 2400, 'Mardan', 'Dry maize, ready for pickup.', 1, 48),
    l('l6', 'f2', 'Potato', 900, 'kg', 70, 'Swat', 'Washed potatoes, uniform size.', 30, 12),
    l('l7', 'f1', 'Tomato', 200, 'kg', 75, 'Peshawar', 'Slightly soft, good for sauce.', 50, -2)
  );
  const bid = (id, listingId, buyerId, amount, agoH) => ({ id, listingId, buyerId, amount, createdAt: now - agoH * H });
  db.bids.push(
    bid('x1', 'l2', 'b1', 92, 6), bid('x2', 'l2', 'b2', 95, 3),
    bid('x3', 'l4', 'b2', 3550, 10), bid('x4', 'l6', 'b1', 72, 12),
    bid('x5', 'l7', 'b1', 78, 49)
  );
  db.views.push({ userId: 'b1', listingId: 'l1', ts: now - H });
};
