// Data Storage
let networkNodes = JSON.parse(localStorage.getItem("fn_network_nodes")) || [];
let customers = JSON.parse(localStorage.getItem("fn_customers")) || [];

// Check Session on Load
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("fn_is_logged_in") === "true") {
    showDashboard();
  }
});

// Authentication Handler
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (user === "admin00" && pass === "1234@1234") {
    sessionStorage.setItem("fn_is_logged_in", "true");
    document.getElementById("loginError").innerText = "";
    showDashboard();
  } else {
    document.getElementById("loginError").innerText = "Invalid Username or Password!";
  }
});

function showDashboard() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("mainDashboard").classList.remove("hidden");
  updateStats();
  renderTables();
}

function logout() {
  sessionStorage.removeItem("fn_is_logged_in");
  document.getElementById("mainDashboard").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
}

// Sidebar Navigation
function switchView(viewId) {
  document.querySelectorAll(".view-section").forEach((sec) => sec.classList.remove("active-view"));
  document.querySelectorAll(".nav-item").forEach((btn) => btn.classList.remove("active"));

  document.getElementById(viewId).classList.add("active-view");
  event.target.classList.add("active");
}

// Add Network Node
document.getElementById("networkForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const node = {
    id: Date.now(),
    techName: document.getElementById("techNameNet").value.trim(),
    area: document.getElementById("areaName").value.trim(),
    fiberName: document.getElementById("fiberName").value.trim(),
    fiberCode: document.getElementById("fiberCode").value.trim(),
    meters: document.getElementById("fiberMeters").value.trim(),
    tjBox: document.getElementById("tjBoxId").value.trim(),
    splitter: document.getElementById("splitterRatio").value,
    inPower: document.getElementById("inputPower").value.trim(),
    outPower: document.getElementById("outputPower").value.trim(),
  };

  networkNodes.push(node);
  localStorage.setItem("fn_network_nodes", JSON.stringify(networkNodes));
  document.getElementById("networkForm").reset();
  alert("Network Node Saved Successfully!");
  updateStats();
  renderTables();
});

// Add Customer
document.getElementById("customerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const cust = {
    id: Date.now(),
    techName: document.getElementById("techNameCust").value.trim(),
    name: document.getElementById("custName").value.trim(),
    phone: document.getElementById("custPhone").value.trim(),
    ip: document.getElementById("custIp").value.trim(),
    package: document.getElementById("custPackage").value.trim(),
    tjPort: document.getElementById("custTjPort").value.trim(),
    db: document.getElementById("custDb").value.trim(),
  };

  customers.push(cust);
  localStorage.setItem("fn_customers", JSON.stringify(customers));
  document.getElementById("customerForm").reset();
  alert("Customer Registered Successfully!");
  updateStats();
  renderTables();
});

// Update Statistics
function updateStats() {
  document.getElementById("statTjCount").innerText = networkNodes.length;
  document.getElementById("statCustCount").innerText = customers.length;
  
  const techSet = new Set();
  networkNodes.forEach(n => techSet.add(n.techName));
  customers.forEach(c => techSet.add(c.techName));
  document.getElementById("statTechCount").innerText = techSet.size;
}

// Render Data Tables
function renderTables() {
  const netSearch = document.getElementById("searchNetwork").value.toLowerCase();
  const custSearch = document.getElementById("searchCustomer").value.toLowerCase();

  // Network Table
  const netBody = document.getElementById("networkTableBody");
  netBody.innerHTML = "";
  const filteredNet = networkNodes.filter(
    (n) => n.area.toLowerCase().includes(netSearch) || 
           n.tjBox.toLowerCase().includes(netSearch) ||
           n.techName.toLowerCase().includes(netSearch)
  );

  filteredNet.forEach((n) => {
    netBody.innerHTML += `
      <tr>
        <td><strong>${n.techName}</strong></td>
        <td>${n.area}</td>
        <td>${n.fiberName} (${n.fiberCode})</td>
        <td>${n.meters} m</td>
        <td>${n.tjBox}</td>
        <td>${n.splitter}</td>
        <td>In: ${n.inPower} | Out: ${n.outPower}</td>
        <td><button class="delete-btn" onclick="deleteNode(${n.id})">Delete</button></td>
      </tr>
    `;
  });

  // Customer Table
  const custBody = document.getElementById("customerTableBody");
  custBody.innerHTML = "";
  const filteredCust = customers.filter(
    (c) => c.name.toLowerCase().includes(custSearch) || 
           c.ip.toLowerCase().includes(custSearch) ||
           c.techName.toLowerCase().includes(custSearch)
  );

  filteredCust.forEach((c) => {
    custBody.innerHTML += `
      <tr>
        <td><strong>${c.techName}</strong></td>
        <td>${c.name}</td>
        <td>${c.phone}</td>
        <td>${c.ip}</td>
        <td>${c.package}</td>
        <td>${c.tjPort}</td>
        <td>${c.db}</td>
        <td><button class="delete-btn" onclick="deleteCustomer(${c.id})">Delete</button></td>
      </tr>
    `;
  });
}

// Delete Handlers
function deleteNode(id) {
  if (confirm("Delete this network node?")) {
    networkNodes = networkNodes.filter((n) => n.id !== id);
    localStorage.setItem("fn_network_nodes", JSON.stringify(networkNodes));
    updateStats();
    renderTables();
  }
}

function deleteCustomer(id) {
  if (confirm("Delete this customer record?")) {
    customers = customers.filter((c) => c.id !== id);
    localStorage.setItem("fn_customers", JSON.stringify(customers));
    updateStats();
    renderTables();
  }
}

// Export CSV
function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,CATEGORY,Technician,Field1,Field2,Field3,Field4,Field5,Field6\n";

  networkNodes.forEach((n) => {
    csvContent += `NETWORK,${n.techName},${n.area},${n.fiberName},${n.meters}m,${n.tjBox},${n.splitter},Out:${n.outPower}\n`;
  });

  customers.forEach((c) => {
    csvContent += `CUSTOMER,${c.techName},${c.name},${c.phone},${c.ip},${c.package},${c.tjPort},${c.db}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Future_Network_Backup.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
