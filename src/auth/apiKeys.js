const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEYS_FILE = path.join(__dirname, '../../data/api-keys.json');

function ensureDataDirectory() {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadKeys() {
  ensureDataDirectory();
  try {
    if (fs.existsSync(KEYS_FILE)) {
      const data = fs.readFileSync(KEYS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading API keys:', error.message);
  }
  return {};
}

function saveKeys(keys) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving API keys:', error.message);
    return false;
  }
}

function generateApiKey() {
  return 'lmx_' + crypto.randomBytes(32).toString('hex');
}

function createApiKey(clientName, description = '') {
  const keys = loadKeys();
  const apiKey = generateApiKey();
  
  keys[apiKey] = {
    clientName,
    description,
    createdAt: new Date().toISOString(),
    active: true,
    requestCount: 0,
    lastUsed: null
  };
  
  if (saveKeys(keys)) {
    return apiKey;
  }
  return null;
}

function validateApiKey(apiKey) {
  const keys = loadKeys();
  
  if (keys[apiKey] && keys[apiKey].active) {
    keys[apiKey].requestCount += 1;
    keys[apiKey].lastUsed = new Date().toISOString();
    saveKeys(keys);
    return true;
  }
  
  return false;
}

function getApiKeyInfo(apiKey) {
  const keys = loadKeys();
  return keys[apiKey] || null;
}

function deactivateApiKey(apiKey) {
  const keys = loadKeys();
  if (keys[apiKey]) {
    keys[apiKey].active = false;
    return saveKeys(keys);
  }
  return false;
}

function getAllKeys() {
  return loadKeys();
}

function getKeyStats() {
  const keys = loadKeys();
  const stats = {
    totalKeys: 0,
    activeKeys: 0,
    inactiveKeys: 0,
    totalRequests: 0
  };
  
  for (const key in keys) {
    stats.totalKeys++;
    if (keys[key].active) {
      stats.activeKeys++;
    } else {
      stats.inactiveKeys++;
    }
    stats.totalRequests += keys[key].requestCount || 0;
  }
  
  return stats;
}

module.exports = {
  generateApiKey,
  createApiKey,
  validateApiKey,
  getApiKeyInfo,
  deactivateApiKey,
  getAllKeys,
  getKeyStats
};