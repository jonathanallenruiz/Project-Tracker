const STORAGE_KEY = "projectflow-friendswood-v1";

const WORKFLOW_STATUSES = [
  "Backlog",
  "In progress",
  "In review",
  "Complete",
  "Invoice time spent at end of month"
];

const INITIAL_ISSUES = [
  {
    id: 1,
    key: "FGE-1",
    title: "Friendswood GENCO Expansion T1 – TDSP Interconnection",
    description: "APPLICATION (IF REQUIRED)",
    lineOfBusiness: "Generation Interconnection",
    client: "Shell",
    manager: "Joelle Abi-Nahed",
    projectManager: "Joelle Abi-Nahed",
    contractType: "Fixed",
    status: "In progress",
    sourceStatus: "In progress",
    priority: "High",
    budget: 10000,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "",
    externalDueDate: "2026-12-01",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    notes: "needed or not??"
  },
  {
    id: 2,
    key: "FGE-2",
    title: "Friendswood GENCO Expansion T2 – Full Registration RARF &",
    description: "ERCOT REGISTRATION SUPPORT",
    lineOfBusiness: "Generation Interconnection",
    client: "Shell",
    manager: "Joelle Abi-Nahed",
    projectManager: "Joelle Abi-Nahed",
    contractType: "Fixed",
    status: "In progress",
    sourceStatus: "In progress",
    priority: "Highest",
    budget: 19000,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "2026-09-10",
    externalDueDate: "2026-09-15",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    notes: "PO?"
  },
  {
    id: 3,
    key: "FGE-3",
    title: "Friendswood GENCO Expansion T3 – ERCOT PSS/E Model",
    description: "QUALITY TEST AND VRT TUNING",
    lineOfBusiness: "Generation Interconnection",
    client: "Shell",
    manager: "Joelle Abi-Nahed",
    projectManager: "Joelle Abi-Nahed",
    contractType: "Fixed",
    status: "In progress",
    sourceStatus: "In progress",
    priority: "High",
    budget: 11000,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "2026-09-10",
    externalDueDate: "2026-09-15",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    notes: "PO? combined?"
  },
  {
    id: 4,
    key: "FGE-4",
    title: "Friendswood GENCO Expansion T4 – General Interconnection",
    description: "SUPPORT",
    lineOfBusiness: "Generation Interconnection",
    client: "Shell",
    manager: "Joelle Abi-Nahed",
    projectManager: "Joelle Abi-Nahed",
    contractType: "HNTE",
    status: "Invoice time spent at end of month",
    sourceStatus: "Invoice time spent at end of month",
    priority: "Medium",
    budget: 15000,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "",
    externalDueDate: "2026-12-01",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    notes: "PO?"
  }
];

let issues = loadIssues();
let currentView = "board";
let editingIssueId = null;
let filters = { search: "", assignee: "", status: "", contract: "", due: "" };

const els = {
  board: document.getElementById("board"),
  tableBody: document.getElementById("issueTableBody"),
  kpiGrid: document.getElementById("kpiGrid"),
  budgetChart: document.getElementById("budgetChart"),
  deadlineList: document.getElementById("deadlineList"),
  workloadGrid: document.getElementById("workloadGrid"),
  resultCount: document.getElementById("resultCount"),
  globalSearch: document.getElementById("globalSearch"),
  assigneeFilter: document.getElementById("assigneeFilter"),
  statusFilter: document.getElementById("statusFilter"),
  contractFilter: document.getElementById("contractFilter"),
  dueFilter: document.getElementById("dueFilter"),
  issueModal: document.getElementById("issueModal"),
  issueForm: document.getElementById("issueForm"),
  deleteIssueBtn: document.getElementById("deleteIssueBtn"),
  toast: document.getElementById("toast"),
  sidebar: document.getElementById("sidebar")
};

function loadIssues() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : structuredClone(INITIAL_ISSUES);
  } catch {
    return structuredClone(INITIAL_ISSUES);
  }
}

function saveIssues(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  if (message) showToast(message);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
}

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "?";
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function dateLabel(dateString) {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${dateString}T12:00:00`));
}

function daysFromToday(dateString) {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dateString}T00:00:00`);
  return Math.ceil((due - today) / 86400000);
}

function dueBadge(issue) {
  const days = daysFromToday(issue.externalDueDate);
  if (days === null) return "";
  if (days < 0) return `<span class="badge overdue">${Math.abs(days)}d overdue</span>`;
  if (days <= 30) return `<span class="badge soon">Due in ${days}d</span>`;
  return `<span class="badge">${dateLabel(issue.externalDueDate)}</span>`;
}

function prioritySymbol(priority) {
  return priority === "Highest" ? "⇈" : priority === "High" ? "↑" : priority === "Low" ? "↓" : "→";
}

function statusClass(status) {
  const s = status.toLowerCase();
  if (s.includes("complete") || s.includes("done")) return "done";
  if (s.includes("review")) return "review";
  if (s.includes("backlog") || s.includes("not started")) return "backlog";
  if (s.includes("invoice")) return "invoice";
  return "";
}

function getFilteredIssues() {
  const now = new Date();
  return issues.filter(issue => {
    const haystack = Object.values(issue).join(" ").toLowerCase();
    if (filters.search && !haystack.includes(filters.search.toLowerCase())) return false;
    if (filters.assignee && issue.assignedTo !== filters.assignee) return false;
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.contract && issue.contractType !== filters.contract) return false;
    if (filters.due) {
      const days = daysFromToday(issue.externalDueDate);
      if (filters.due === "none" && issue.externalDueDate) return false;
      if (filters.due === "overdue" && !(days !== null && days < 0)) return false;
      if (["30", "90"].includes(filters.due) && !(days !== null && days >= 0 && days <= Number(filters.due))) return false;
    }
    return true;
  });
}

function allStatuses() {
  const fromData = issues.map(issue => issue.status).filter(Boolean);
  return [...new Set([...WORKFLOW_STATUSES, ...fromData])];
}

function populateFilters() {
  const preserve = {
    assignee: els.assigneeFilter.value,
    status: els.statusFilter.value,
    contract: els.contractFilter.value
  };
  fillSelect(els.assigneeFilter, [...new Set(issues.map(i => i.assignedTo).filter(Boolean))].sort(), "All assignees", preserve.assignee);
  fillSelect(els.statusFilter, allStatuses(), "All statuses", preserve.status);
  fillSelect(els.contractFilter, [...new Set(issues.map(i => i.contractType).filter(Boolean))].sort(), "All contracts", preserve.contract);
}

function fillSelect(select, options, firstLabel, selected = "") {
  select.innerHTML = `<option value="">${escapeHtml(firstLabel)}</option>` + options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  select.value = selected;
}

function render() {
  populateFilters();
  const filtered = getFilteredIssues();
  els.resultCount.textContent = `${filtered.length} issue${filtered.length === 1 ? "" : "s"}`;
  renderBoard(filtered);
  renderTable(filtered);
  renderDashboard(filtered);
}

function renderBoard(filtered) {
  els.board.innerHTML = allStatuses().map(status => {
    const cards = filtered.filter(issue => issue.status === status);
    return `
      <section class="board-column" data-status="${escapeHtml(status)}">
        <div class="column-header">
          <div class="column-title"><span class="status-dot"></span>${escapeHtml(status)}</div>
          <span class="column-count">${cards.length}</span>
        </div>
        <div class="issue-stack" data-drop-status="${escapeHtml(status)}">
          ${cards.length ? cards.map(issueCardHtml).join("") : `<div class="empty-column">Drop an issue here</div>`}
        </div>
        <button class="add-card-button" data-add-status="${escapeHtml(status)}" type="button">＋ Create issue</button>
      </section>`;
  }).join("");
  bindBoardEvents();
}

function issueCardHtml(issue) {
  const contractClass = issue.contractType.toLowerCase() === "fixed" ? "fixed" : issue.contractType.toLowerCase() === "hnte" ? "hnte" : "";
  return `
    <article class="issue-card" draggable="true" data-id="${issue.id}" tabindex="0">
      <div class="card-top">
        <span class="issue-key">${escapeHtml(issue.key)}</span>
        <span class="priority-icon priority-${escapeHtml(issue.priority)}" title="${escapeHtml(issue.priority)} priority">${prioritySymbol(issue.priority)}</span>
      </div>
      <div class="issue-title">${escapeHtml(issue.title)}</div>
      <p class="issue-description">${escapeHtml(issue.description || issue.notes || "No description")}</p>
      <div class="card-meta">
        <span class="badge ${contractClass}">${escapeHtml(issue.contractType || "No contract")}</span>
        ${dueBadge(issue)}
      </div>
      <div class="card-footer">
        <span class="budget">${money(issue.budget)}</span>
        <div class="avatar-row" title="Assignee: ${escapeHtml(issue.assignedTo)} · Reviewer: ${escapeHtml(issue.review)}">
          <span class="person-avatar">${initials(issue.assignedTo)}</span>
          <span class="person-avatar">${initials(issue.review)}</span>
        </div>
      </div>
    </article>`;
}

function bindBoardEvents() {
  document.querySelectorAll(".issue-card").forEach(card => {
    card.addEventListener("click", () => openModal(Number(card.dataset.id)));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") openModal(Number(card.dataset.id));
    });
    card.addEventListener("dragstart", event => {
      event.dataTransfer.setData("text/plain", card.dataset.id);
      setTimeout(() => card.classList.add("dragging"), 0);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  });

  document.querySelectorAll(".board-column").forEach(column => {
    column.addEventListener("dragover", event => { event.preventDefault(); column.classList.add("drag-over"); });
    column.addEventListener("dragleave", () => column.classList.remove("drag-over"));
    column.addEventListener("drop", event => {
      event.preventDefault();
      column.classList.remove("drag-over");
      const id = Number(event.dataTransfer.getData("text/plain"));
      const issue = issues.find(item => item.id === id);
      if (!issue) return;
      issue.status = column.dataset.status;
      saveIssues(`${issue.key} moved to ${issue.status}`);
      render();
    });
  });

  document.querySelectorAll("[data-add-status]").forEach(button => {
    button.addEventListener("click", () => openModal(null, button.dataset.addStatus));
  });
}

function renderTable(filtered) {
  els.tableBody.innerHTML = filtered.length ? filtered.map(issue => `
    <tr data-id="${issue.id}">
      <td><strong>${escapeHtml(issue.key)}</strong></td>
      <td class="cell-title"><strong>${escapeHtml(issue.title)}</strong><span>${escapeHtml(issue.description || "")}</span></td>
      <td><span class="status-pill ${statusClass(issue.status)}">${escapeHtml(issue.status)}</span></td>
      <td>${escapeHtml(issue.assignedTo || "—")}</td>
      <td>${escapeHtml(issue.review || "—")}</td>
      <td>${escapeHtml(issue.contractType || "—")}</td>
      <td>${money(issue.budget)}</td>
      <td>${dateLabel(issue.internalCompletionDate)}</td>
      <td>${dateLabel(issue.externalDueDate)}</td>
    </tr>`).join("") : `<tr><td colspan="9">No issues match the current filters.</td></tr>`;
  els.tableBody.querySelectorAll("tr[data-id]").forEach(row => row.addEventListener("click", () => openModal(Number(row.dataset.id))));
}

function renderDashboard(filtered) {
  const totalBudget = filtered.reduce((sum, issue) => sum + Number(issue.budget || 0), 0);
  const active = filtered.filter(issue => !/complete|done/i.test(issue.status)).length;
  const upcoming = filtered.filter(issue => {
    const d = daysFromToday(issue.externalDueDate);
    return d !== null && d >= 0 && d <= 90;
  }).length;
  const overdue = filtered.filter(issue => (daysFromToday(issue.externalDueDate) ?? 0) < 0).length;

  els.kpiGrid.innerHTML = [
    ["Total budget", money(totalBudget), `${filtered.length} tracked work items`],
    ["Active issues", active, `${filtered.length - active} completed`],
    ["Due in 90 days", upcoming, "External client deadlines"],
    ["Overdue", overdue, overdue ? "Needs attention" : "No missed deadlines"]
  ].map(([label, value, sub]) => `<article class="kpi-card"><span>${label}</span><strong>${value}</strong><small>${sub}</small></article>`).join("");

  const maxBudget = Math.max(...filtered.map(i => Number(i.budget || 0)), 1);
  els.budgetChart.innerHTML = filtered.length ? [...filtered].sort((a,b) => b.budget-a.budget).map(issue => `
    <div class="bar-row">
      <div class="bar-label" title="${escapeHtml(issue.title)}">${escapeHtml(issue.key)} · ${escapeHtml(issue.title.replace("Friendswood GENCO Expansion ", ""))}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3, issue.budget / maxBudget * 100)}%"></div></div>
      <div class="bar-value">${money(issue.budget)}</div>
    </div>`).join("") : `<p>No budget data available.</p>`;

  const deadlines = filtered.filter(i => i.externalDueDate).sort((a,b) => a.externalDueDate.localeCompare(b.externalDueDate));
  els.deadlineList.innerHTML = deadlines.length ? deadlines.map(issue => {
    const date = new Date(`${issue.externalDueDate}T12:00:00`);
    const days = daysFromToday(issue.externalDueDate);
    return `<div class="deadline-item">
      <div class="date-tile"><strong>${date.getDate()}</strong><small>${date.toLocaleString("en-US", {month:"short"}).toUpperCase()}</small></div>
      <div class="deadline-copy"><strong>${escapeHtml(issue.key)} · ${escapeHtml(issue.title)}</strong><span>${escapeHtml(issue.assignedTo)}</span></div>
      <span class="days-left">${days < 0 ? `${Math.abs(days)}d late` : `${days}d left`}</span>
    </div>`;
  }).join("") : `<p>No external due dates.</p>`;

  const people = {};
  filtered.forEach(issue => {
    [
      [issue.assignedTo, "Assignee"],
      [issue.review, "Reviewer"]
    ].forEach(([name, role]) => {
      if (!name) return;
      people[name] ??= { name, assigned: 0, reviews: 0, budget: 0 };
      if (role === "Assignee") { people[name].assigned += 1; people[name].budget += Number(issue.budget || 0); }
      else people[name].reviews += 1;
    });
  });
  els.workloadGrid.innerHTML = Object.values(people).map(person => `
    <div class="workload-card">
      <div class="workload-person"><span class="person-avatar">${initials(person.name)}</span><div><strong>${escapeHtml(person.name)}</strong><span>Project contributor</span></div></div>
      <div class="workload-stats"><span><strong>${person.assigned}</strong> assigned</span><span><strong>${person.reviews}</strong> reviews</span><span><strong>${money(person.budget)}</strong></span></div>
    </div>`).join("") || `<p>No workload data.</p>`;
}

function openModal(id = null, defaultStatus = "In progress") {
  editingIssueId = id;
  const issue = issues.find(item => item.id === id);
  document.getElementById("modalKey").textContent = issue ? issue.key : "New issue";
  document.getElementById("modalTitle").textContent = issue ? "Edit issue" : "Create issue";
  els.deleteIssueBtn.classList.toggle("hidden", !issue);
  fillSelect(document.getElementById("statusInput"), allStatuses(), "Select status", issue?.status || defaultStatus);

  const values = issue || {
    title: "", description: "", status: defaultStatus, priority: "Medium", assignedTo: "", review: "",
    manager: "Joelle Abi-Nahed", projectManager: "Joelle Abi-Nahed", contractType: "Fixed", budget: 0,
    internalCompletionDate: "", externalDueDate: "", lineOfBusiness: "Generation Interconnection", client: "Shell",
    region: "ERCOT", isoUtility: "", technology: "gas", projectSource: "", bqeProjectNumber: "400782", notes: ""
  };

  const fieldMap = {
    issueId: id || "", titleInput: values.title, descriptionInput: values.description, statusInput: values.status,
    priorityInput: values.priority, assigneeInput: values.assignedTo, reviewerInput: values.review,
    managerInput: values.manager, projectManagerInput: values.projectManager, contractInput: values.contractType,
    budgetInput: values.budget, internalDateInput: values.internalCompletionDate, externalDateInput: values.externalDueDate,
    lobInput: values.lineOfBusiness, clientInput: values.client, regionInput: values.region, isoInput: values.isoUtility,
    technologyInput: values.technology, sourceInput: values.projectSource, bqeInput: values.bqeProjectNumber, notesInput: values.notes
  };
  Object.entries(fieldMap).forEach(([field, value]) => { document.getElementById(field).value = value ?? ""; });
  els.issueModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("titleInput").focus(), 0);
}

function closeModal() {
  els.issueModal.classList.add("hidden");
  document.body.style.overflow = "";
  editingIssueId = null;
  els.issueForm.reset();
}

function formValue(id) { return document.getElementById(id).value.trim(); }

function handleSubmit(event) {
  event.preventDefault();
  const data = {
    title: formValue("titleInput"),
    description: formValue("descriptionInput"),
    status: formValue("statusInput"),
    priority: formValue("priorityInput"),
    assignedTo: formValue("assigneeInput"),
    review: formValue("reviewerInput"),
    manager: formValue("managerInput"),
    projectManager: formValue("projectManagerInput"),
    contractType: formValue("contractInput"),
    budget: Number(document.getElementById("budgetInput").value || 0),
    internalCompletionDate: formValue("internalDateInput"),
    externalDueDate: formValue("externalDateInput"),
    lineOfBusiness: formValue("lobInput"),
    client: formValue("clientInput"),
    region: formValue("regionInput"),
    isoUtility: formValue("isoInput"),
    technology: formValue("technologyInput"),
    projectSource: formValue("sourceInput"),
    bqeProjectNumber: formValue("bqeInput"),
    notes: formValue("notesInput")
  };

  if (editingIssueId) {
    const issue = issues.find(item => item.id === editingIssueId);
    Object.assign(issue, data);
    saveIssues(`${issue.key} updated`);
  } else {
    const nextId = Math.max(0, ...issues.map(i => i.id)) + 1;
    const issue = { id: nextId, key: `FGE-${nextId}`, sourceStatus: data.status, ...data };
    issues.push(issue);
    saveIssues(`${issue.key} created`);
  }
  closeModal();
  render();
}

function deleteIssue() {
  const issue = issues.find(item => item.id === editingIssueId);
  if (!issue || !confirm(`Delete ${issue.key}? This cannot be undone.`)) return;
  issues = issues.filter(item => item.id !== editingIssueId);
  saveIssues(`${issue.key} deleted`);
  closeModal();
  render();
}

function exportCsv() {
  const columns = [
    ["Key", "key"], ["Line of Business", "lineOfBusiness"], ["Client", "client"], ["Project", "title"],
    ["Scope", "description"], ["Manager/Director", "manager"], ["Project Manager", "projectManager"],
    ["Contract Type", "contractType"], ["Status", "status"], ["Budget", "budget"], ["Assigned To", "assignedTo"],
    ["Review", "review"], ["Internal Completion Date", "internalCompletionDate"], ["Due Date (External)", "externalDueDate"],
    ["BQE Project #", "bqeProjectNumber"], ["Region", "region"], ["ISO/TSO/Utility", "isoUtility"],
    ["Technology", "technology"], ["Project Source", "projectSource"], ["Notes", "notes"]
  ];
  const quote = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [columns.map(([label]) => quote(label)).join(","), ...getFilteredIssues().map(issue => columns.map(([,key]) => quote(issue[key])).join(","))].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "friendswood-genco-project-tracker.csv";
  a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.add("hidden"), 2600);
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === view));
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.remove("active"));
  document.getElementById(`${view}View`).classList.add("active");
  const copy = {
    board: ["Project board", "Track interconnection deliverables, ownership, budgets, and deadlines."],
    list: ["Issue list", "Review every tracker field in a sortable, scan-friendly format."],
    dashboard: ["Project dashboard", "Monitor budget, schedule risk, and team workload."]
  };
  document.getElementById("viewTitle").textContent = copy[view][0];
  document.getElementById("viewSubtitle").textContent = copy[view][1];
  els.sidebar.classList.remove("open");
}

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => switchView(item.dataset.view)));
document.getElementById("createIssueBtn").addEventListener("click", () => openModal());
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelModalBtn").addEventListener("click", closeModal);
els.issueForm.addEventListener("submit", handleSubmit);
els.deleteIssueBtn.addEventListener("click", deleteIssue);
document.getElementById("exportBtn").addEventListener("click", exportCsv);
document.getElementById("menuBtn").addEventListener("click", () => els.sidebar.classList.toggle("open"));

document.getElementById("resetDataBtn").addEventListener("click", () => {
  if (!confirm("Reset the app to the original workbook data?")) return;
  issues = structuredClone(INITIAL_ISSUES);
  saveIssues("Workbook data restored");
  render();
});

document.getElementById("clearFiltersBtn").addEventListener("click", () => {
  filters = { search: "", assignee: "", status: "", contract: "", due: "" };
  els.globalSearch.value = "";
  els.assigneeFilter.value = "";
  els.statusFilter.value = "";
  els.contractFilter.value = "";
  els.dueFilter.value = "";
  render();
});

els.globalSearch.addEventListener("input", event => { filters.search = event.target.value; render(); });
els.assigneeFilter.addEventListener("change", event => { filters.assignee = event.target.value; render(); });
els.statusFilter.addEventListener("change", event => { filters.status = event.target.value; render(); });
els.contractFilter.addEventListener("change", event => { filters.contract = event.target.value; render(); });
els.dueFilter.addEventListener("change", event => { filters.due = event.target.value; render(); });

els.issueModal.addEventListener("click", event => { if (event.target === els.issueModal) closeModal(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !els.issueModal.classList.contains("hidden")) closeModal();
  if (event.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault(); els.globalSearch.focus();
  }
});

render();
