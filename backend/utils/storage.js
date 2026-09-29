const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let memoryStore = {
  products: [],
  categories: [],
  users: [],
  orders: [],
  carts: [],
  wishlists: [],
  reviews: [],
  coupons: []
};

// Load existing data if file exists
function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf8');
      memoryStore = { ...memoryStore, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error loading store.json:', err.message);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving store.json:', err.message);
  }
}

loadStore();

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Generate MongoDB-compatible ObjectId string
function generateId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomHex = Math.random().toString(16).substring(2, 18).padEnd(16, '0');
  return timestamp + randomHex;
}

module.exports = {
  isMongoConnected,
  memoryStore,
  saveStore,
  loadStore,
  generateId
};
