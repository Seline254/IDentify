const STORAGE_KEY = 'identify-officer-inventory';
const initialInventory = [
  {
    id: 'demo-001',
    regNumber: 'SCT221-0047/2023',
    name: 'John Doe Karuri',
    college: 'Faculty of Computing',
    course: 'BSc Computer Science',
    pickupLocation: 'Main Gate Security Office',
    notes: 'Collected from the gate after 6 p.m.',
    status: 'In Storage',
    createdAt: new Date().toISOString().split('T')[0],
    dateLogged: '2026-07-30 09:15'
  }
];

function loadInventory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInventory));
    return initialInventory;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialInventory;
  } catch (error) {
    return initialInventory;
  }
}

function saveInventory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDateTime(isoString) {
  try {
    return new Date(isoString).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return isoString;
  }
}

function showToast(message, tone = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMsg');
  icon.innerHTML = tone === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-triangle-exclamation"></i>';
  msg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function getInventoryCounts(items) {
  const todayKey = new Date().toISOString().split('T')[0];
  const totalToday = items.filter((item) => item.createdAt === todayKey).length;
  const active = items.filter((item) => item.status === 'In Storage').length;
  const handedOver = items.filter((item) => item.status === 'Handed Over').length;
  return { totalToday, active, handedOver };
}

function renderMetrics(items) {
  const { totalToday, active, handedOver } = getInventoryCounts(items);
  document.getElementById('metricToday').textContent = totalToday.toString();
  document.getElementById('metricStorage').textContent = active.toString();
  document.getElementById('metricHandedOver').textContent = handedOver.toString();
  document.getElementById('inventoryCount').textContent = active.toString();
}

function renderInventory(items = loadInventory(), filter = '') {
  const tbody = document.getElementById('inventoryTableBody');
  const normalized = filter.trim().toLowerCase();
  const rows = items
    .filter((item) => {
      if (!normalized) return true;
      return item.regNumber.toLowerCase().includes(normalized) || item.name.toLowerCase().includes(normalized);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No records match your search.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map((item) => `
    <tr>
      <td>${item.regNumber}</td>
      <td>${item.name}</td>
      <td>${item.college} / ${item.course || '—'}</td>
      <td>${item.pickupLocation}</td>
      <td><span class="status-pill ${item.status === 'In Storage' ? 'status-in-storage' : 'status-handed-over'}">${item.status}</span></td>
      <td>${item.dateLogged || formatDateTime(item.createdAt)}</td>
      <td>
        <button class="btn-table" data-id="${item.id}" type="button" ${item.status === 'Handed Over' ? 'disabled' : ''}>
          ${item.status === 'Handed Over' ? 'Completed' : '<i class="fa-solid fa-circle-check"></i> Mark as Claimed'}
        </button>
      </td>
    </tr>
  `).join('');
}

function handleSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('inventoryForm');
  const data = new FormData(form);

  const payload = {
    id: `id-${Date.now()}`,
    regNumber: (data.get('regNumber') || '').toString().trim(),
    name: (data.get('fullName') || '').toString().trim(),
    college: (data.get('college') || '').toString().trim(),
    course: (data.get('course') || '').toString().trim(),
    pickupLocation: (data.get('pickupLocation') || '').toString().trim(),
    notes: (data.get('notes') || '').toString().trim(),
    status: 'In Storage',
    createdAt: new Date().toISOString().split('T')[0],
    dateLogged: new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
  };

  if (!payload.regNumber || !payload.name) {
    showToast('Registration number and full name are required.', 'error');
    return;
  }

  const inventory = loadInventory();
  inventory.unshift(payload);
  saveInventory(inventory);
  renderInventory(inventory, document.getElementById('inventorySearch').value);
  renderMetrics(inventory);
  form.reset();
  showToast(`${payload.regNumber} logged successfully.`, 'success');
}

function handleHandedOver(event) {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const id = button.getAttribute('data-id');
  const inventory = loadInventory();
  const item = inventory.find((record) => record.id === id);
  if (!item || item.status === 'Handed Over') return;

  item.status = 'Handed Over';
  saveInventory(inventory);
  renderInventory(inventory, document.getElementById('inventorySearch').value);
  renderMetrics(inventory);
  showToast(`${item.regNumber} has been marked as claimed.`, 'success');
}

function initTheme() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('identify-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  const themeButton = document.getElementById('themeToggle');
  themeButton.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  themeButton.addEventListener('click', () => {
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('identify-theme', nextTheme);
    themeButton.innerHTML = nextTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}

function init() {
  initTheme();
  const inventory = loadInventory();
  renderInventory(inventory);
  renderMetrics(inventory);
  document.getElementById('inventoryForm').addEventListener('submit', handleSubmit);
  document.getElementById('inventoryTableBody').addEventListener('click', handleHandedOver);
  document.getElementById('inventorySearch').addEventListener('input', (event) => {
    renderInventory(loadInventory(), event.target.value);
  });
}

init();
