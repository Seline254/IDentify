const BASE_URL = "";

function formatDateTime(isoString) {
  try {
    return new Date(isoString).toLocaleString("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return isoString;
  }
}

function showToast(message, tone = "success") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toastIcon");
  const msg = document.getElementById("toastMsg");
  icon.innerHTML =
    tone === "success"
      ? '<i class="fa-solid fa-circle-check"></i>'
      : '<i class="fa-solid fa-triangle-exclamation"></i>';
  msg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function renderMetrics(items) {
  const today = new Date().toISOString().split("T")[0];
  const totalToday = items.filter(
    (i) => i.date_logged && i.date_logged.startsWith(today),
  ).length;
  const active = items.filter((i) => i.status === "in_custody").length;
  const handedOver = items.filter((i) => i.status === "claimed").length;

  document.getElementById("metricToday").textContent = totalToday;
  document.getElementById("metricStorage").textContent = active;
  document.getElementById("metricHandedOver").textContent = handedOver;
  document.getElementById("inventoryCount").textContent = active;
}

function renderInventory(items, filter = "") {
  const tbody = document.getElementById("inventoryTableBody");
  const normalized = filter.trim().toLowerCase();

  const rows = items.filter((item) => {
    if (!normalized) return true;
    return (
      item.reg_number.toLowerCase().includes(normalized) ||
      item.full_name.toLowerCase().includes(normalized)
    );
  });

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="table-empty">No records match your search.</td></tr>';
    return;
  }

  tbody.innerHTML = rows
    .map(
      (item) => `
        <tr>
            <td>${item.reg_number}</td>
            <td>${item.full_name}</td>
            <td>${item.college} / ${item.course}</td>
            <td>${item.gate}</td>
            <td><span class="status-pill ${item.status === "in_custody" ? "status-in-storage" : "status-handed-over"}">
                ${item.status === "in_custody" ? "In Storage" : "Handed Over"}
            </span></td>
            <td>${formatDateTime(item.date_logged)}</td>
            <td>
                <button class="btn-table" data-id="${item.id}" type="button" ${item.status === "claimed" ? "disabled" : ""}>
                    ${item.status === "claimed" ? "Completed" : '<i class="fa-solid fa-circle-check"></i> Mark as Claimed'}
                </button>
            </td>
        </tr>
    `,
    )
    .join("");
}

let currentInventory = [];

async function loadAndRender() {
  try {
    const response = await fetch(BASE_URL + "/backend/api/officer/all-ids.php");
    const result = await response.json();

    // if (response.status === 401) {
    //   window.location.href = BASE_URL + "/frontend/pages/officer-login.html";
    //   return;
    // }

    if (result.success) {
      currentInventory = result.data;
      renderInventory(currentInventory);
      renderMetrics(currentInventory);
    } else {
      showToast(result.error || "Could not load inventory.", "error");
    }
  } catch (err) {
    showToast("Network error loading inventory.", "error");
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("inventoryForm");
  const data = new FormData(form);

  const reg_number = (data.get("regNumber") || "").trim();
  const name = (data.get("fullName") || "").trim();
  const college = (data.get("college") || "").trim();
  const course = (data.get("course") || "").trim();

  if (!reg_number || !name) {
    showToast("Registration number and full name are required.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("reg_number", reg_number);
  formData.append("name", name);
  formData.append("college", college);
  formData.append("course", course);

  try {
    const response = await fetch(
      BASE_URL + "/backend/api/officer/log-item.php",
      {
        method: "POST",
        body: formData,
      },
    );

    const result = await response.json();

    if (result.success) {
      showToast(`${reg_number} logged successfully.`, "success");
      form.reset();
      loadAndRender();
    } else {
      showToast(result.error || "Could not log item.", "error");
    }
  } catch (err) {
    showToast("Network error. Try again.", "error");
  }
}

async function handleHandedOver(event) {
  const button = event.target.closest("button[data-id]");
  if (!button) return;

  const id = button.getAttribute("data-id");

  const formData = new FormData();
  formData.append("item_id", id);

  try {
    const response = await fetch(BASE_URL + "/backend/api/officer/claim.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      showToast("Item marked as claimed.", "success");
      loadAndRender();
    } else {
      showToast(result.error || "Could not mark as claimed.", "error");
    }
  } catch (err) {
    showToast("Network error. Try again.", "error");
  }
}

function initTheme() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("identify-theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  const themeButton = document.getElementById("themeToggle");
  themeButton.innerHTML =
    savedTheme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  themeButton.addEventListener("click", () => {
    const nextTheme =
      html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", nextTheme);
    localStorage.setItem("identify-theme", nextTheme);
    themeButton.innerHTML =
      nextTheme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
  });
}

function init() {
  initTheme();
  loadAndRender();
  document
    .getElementById("inventoryForm")
    .addEventListener("submit", handleSubmit);
  document
    .getElementById("inventoryTableBody")
    .addEventListener("click", handleHandedOver);
  document
    .getElementById("inventorySearch")
    .addEventListener("input", (event) => {
      renderInventory(currentInventory, event.target.value);
    });
}

init();
