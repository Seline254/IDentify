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

function showToast(message, tone = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMsg');
  icon.innerHTML = tone === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-triangle-exclamation"></i>';
  msg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function renderInventory(items = loadInventory()) {
  const tbody = document.getElementById('inventoryTableBody');
  const count = document.getElementById('inventoryCount');

  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No IDs are currently in possession.</td></tr>';
    count.textContent = '0';
    return;
  }

  count.textContent = String(items.length);
  tbody.innerHTML = items.map((item) => `
    <tr>
      <td>${item.regNumber}</td>
      <td>${item.name}</td>
      <td>${item.college} / ${item.course || '—'}</td>
      <td>${item.pickupLocation}</td>
      <td>${item.dateLogged}</td>
      <td><button class="btn-ghost" data-id="${item.id}" type="button"><i class="fa-solid fa-circle-check"></i> Handed Over</button></td>
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
    dateLogged: new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
  };

  if (!payload.regNumber || !payload.name) {
    showToast('Registration number and full name are required.', 'error');
    return;
  }

  const inventory = loadInventory();
  inventory.unshift(payload);
  saveInventory(inventory);
  renderInventory(inventory);
  form.reset();
  showToast(`${payload.regNumber} logged successfully.`, 'success');
}

function handleHandedOver(event) {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const id = button.getAttribute('data-id');
  const inventory = loadInventory().filter((item) => item.id !== id);
  saveInventory(inventory);
  renderInventory(inventory);
  showToast('Record removed from active inventory.', 'success');
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
  renderInventory(loadInventory());
  document.getElementById('inventoryForm').addEventListener('submit', handleSubmit);
  document.getElementById('inventoryTableBody').addEventListener('click', handleHandedOver);
}

init();
