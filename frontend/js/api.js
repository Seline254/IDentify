/**
 * api.js - all fetch() calls to the IDentify backend
 * Replace BASE_URL with your deployed backend URL
 */

const BASE_URL = 'http://localhost:5000/api';

const API = {

  // ── AUTH ──
  async register(data) {
    return request('POST', '/auth/register', data);
  },
  async login(data) {
    return request('POST', '/auth/login', data);
  },

  // ── DOCUMENTS ──
  async searchByReg(regNumber) {
    return request('GET', `/documents/search?reg=${encodeURIComponent(regNumber)}`);
  },
  async getRecent(limit = 6) {
    return request('GET', `/documents/recent?limit=${limit}`);
  },
  async uploadDocument(formData) {
    // formData is a FormData object with: photo, docType, regNumber, ownerName, location, finderPhone
    return requestFormData('POST', '/documents/upload', formData);
  },
  async claimDocument(docId, selfieBlob) {
    const formData = new FormData();
    formData.append('selfie', selfieBlob, 'selfie.jpg');
    formData.append('docId', docId);
    return requestFormData('POST', '/documents/claim', formData, true);
  },

  // ── FACE MATCH ──
  async verifyFace(docId, selfieBlob) {
    const formData = new FormData();
    formData.append('selfie', selfieBlob, 'selfie.jpg');
    formData.append('docId', docId);
    return requestFormData('POST', '/face/verify', formData, true);
  },
};

// ── HELPERS ──
async function request(method, path, body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE_URL + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function requestFormData(method, path, formData, requiresAuth = false) {
  const opts = {
    method,
    headers: requiresAuth ? authHeader() : {},
    body: formData,
    // Do NOT set Content-Type - browser sets multipart/form-data with boundary automatically
  };
  const res = await fetch(BASE_URL + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
}

function authHeader() {
  const token = localStorage.getItem('identify-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

window.API = API;
