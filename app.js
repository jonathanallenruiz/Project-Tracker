const ISSUE_STORAGE_KEY = "projectflow-client-portfolio-v3";
const ISSUE_STORAGE_KEYS = ["projectflow-client-portfolio-v2", "projectflow-friendswood-v1"];
const DOCUMENT_STORAGE_KEY = "projectflow-document-library-v1";
const WORKSPACE_STORAGE_KEY = "projectflow-workspaces-v1";
const ACTIVE_WORKSPACE_KEY = "projectflow-active-workspace-v1";
const DEFAULT_WORKSPACE_ID = "client-portfolio";

const WORKFLOW_STATUSES = [
  "Backlog",
  "In progress",
  "In review",
  "Complete",
  "Invoice time spent at end of month"
];

const DOCUMENT_CATEGORIES = [
  "Procedure",
  "Interconnection protocol",
  "Template",
  "Report template",
  "Reference",
  "Other"
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
    allocatedHours: 0,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "",
    externalDueDate: "2026-12-01",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    tDriveLink: "",
    sharePointLink: "",
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
    allocatedHours: 0,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "2026-09-10",
    externalDueDate: "2026-09-15",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    tDriveLink: "",
    sharePointLink: "",
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
    allocatedHours: 0,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "2026-09-10",
    externalDueDate: "2026-09-15",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    tDriveLink: "",
    sharePointLink: "",
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
    allocatedHours: 0,
    assignedTo: "Ghida Hajj Hassan",
    review: "Sonjoy Roy",
    internalCompletionDate: "",
    externalDueDate: "2026-12-01",
    bqeProjectNumber: "400782",
    region: "ERCOT",
    isoUtility: "",
    technology: "gas",
    projectSource: "",
    tDriveLink: "",
    sharePointLink: "",
    notes: "PO?"
  }
];

const INITIAL_DOCUMENTS = [];

let workspaces = loadWorkspaces();
let activeWorkspaceId = loadActiveWorkspaceId(workspaces);
let issues = deepClone(getActiveWorkspace().issues);
let documents = deepClone(getActiveWorkspace().documents);
let currentView = "board";
let editingIssueId = null;
let editingDocumentId = null;
let filters = { search: "", client: "", assignee: "", status: "", contract: "", due: "" };
let documentFilters = { client: "", category: "" };

const els = {
  board: document.getElementById("board"),
  tableBody: document.getElementById("issueTableBody"),
  teamKpiGrid: document.getElementById("teamKpiGrid"),
  teamRoster: document.getElementById("teamRoster"),
  kpiGrid: document.getElementById("kpiGrid"),
  budgetChart: document.getElementById("budgetChart"),
  deadlineList: document.getElementById("deadlineList"),
  workloadGrid: document.getElementById("workloadGrid"),
  documentLibrary: document.getElementById("documentLibrary"),
  documentSummary: document.getElementById("documentSummary"),
  documentClientFilter: document.getElementById("documentClientFilter"),
  documentCategoryFilter: document.getElementById("documentCategoryFilter"),
  resultCount: document.getElementById("resultCount"),
  globalSearch: document.getElementById("globalSearch"),
  clientFilter: document.getElementById("clientFilter"),
  assigneeFilter: document.getElementById("assigneeFilter"),
  statusFilter: document.getElementById("statusFilter"),
  contractFilter: document.getElementById("contractFilter"),
  dueFilter: document.getElementById("dueFilter"),
  filterBar: document.querySelector(".filter-bar"),
  issueModal: document.getElementById("issueModal"),
  issueForm: document.getElementById("issueForm"),
  deleteIssueBtn: document.getElementById("deleteIssueBtn"),
  documentModal: document.getElementById("documentModal"),
  documentForm: document.getElementById("documentForm"),
  deleteDocumentBtn: document.getElementById("deleteDocumentBtn"),
  toast: document.getElementById("toast"),
  sidebar: document.getElementById("sidebar"),
  sidebarClientCount: document.getElementById("sidebarClientCount"),
  sidebarRegions: document.getElementById("sidebarRegions"),
  sidebarIssueCount: document.getElementById("sidebarIssueCount"),
  sidebarDocumentCount: document.getElementById("sidebarDocumentCount"),
  sidebarBudget: document.getElementById("sidebarBudget"),
  createButton: document.getElementById("createIssueBtn"),
  exportButton: document.getElementById("exportBtn"),
  importButton: document.getElementById("importCsvBtn"),
  csvFileInput: document.getElementById("csvFileInput"),
  workspaceButton: document.getElementById("workspaceButton"),
  workspaceMenu: document.getElementById("workspaceMenu"),
  workspaceList: document.getElementById("workspaceList"),
  workspaceModal: document.getElementById("workspaceModal"),
  workspaceForm: document.getElementById("workspaceForm")
};

function deepClone(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function normalizeIssues(data) {
  if (!Array.isArray(data)) return deepClone(INITIAL_ISSUES);
  return data.map((issue, index) => ({
    id: Number(issue.id || index + 1),
    key: issue.key || `PF-${index + 1}`,
    title: "",
    description: "",
    lineOfBusiness: "",
    client: "Unspecified client",
    manager: "",
    projectManager: "",
    contractType: "",
    status: "Backlog",
    sourceStatus: issue.status || "Backlog",
    priority: "Medium",
    budget: 0,
    allocatedHours: 0,
    assignedTo: "",
    review: "",
    internalCompletionDate: "",
    externalDueDate: "",
    bqeProjectNumber: "",
    region: "",
    isoUtility: "",
    technology: "",
    projectSource: "",
    tDriveLink: "",
    sharePointLink: "",
    notes: "",
    ...issue,
    budget: Number(issue.budget || 0),
    allocatedHours: Number(issue.allocatedHours || 0)
  }));
}

function normalizeDocuments(data) {
  if (!Array.isArray(data)) return deepClone(INITIAL_DOCUMENTS);
  return data.map((item, index) => ({
    id: Number(item.id || index + 1),
    title: "",
    category: "Reference",
    client: "",
    owner: "",
    description: "",
    tDriveLink: "",
    webLink: "",
    tags: "",
    updatedDate: "",
    createdAt: new Date().toISOString(),
    ...item
  }));
}


function normalizeWorkspace(item, index = 0) {
  const name = String(item?.name || `Workspace ${index + 1}`).trim();
  const prefix = String(item?.keyPrefix || name.split(/\s+/).map(part => part[0]).join("") || "PF")
    .replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8) || "PF";
  return {
    id: String(item?.id || `workspace-${index + 1}`),
    name,
    description: String(item?.description || "Project delivery workspace"),
    keyPrefix: prefix,
    defaultClient: String(item?.defaultClient || ""),
    defaultRegion: String(item?.defaultRegion || ""),
    createdAt: item?.createdAt || new Date().toISOString(),
    issues: normalizeIssues(item?.issues || []),
    documents: normalizeDocuments(item?.documents || [])
  };
}

function loadWorkspaces() {
  try {
    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed.map(normalizeWorkspace);
    }
  } catch {}

  const legacyIssues = loadIssues();
  const legacyDocuments = loadDocuments();
  const initial = normalizeWorkspace({
    id: DEFAULT_WORKSPACE_ID,
    name: "Client Portfolio",
    description: "Multi-client delivery workspace",
    keyPrefix: "PF",
    defaultClient: legacyIssues[0]?.client || "",
    defaultRegion: legacyIssues[0]?.region || "",
    issues: legacyIssues,
    documents: legacyDocuments
  });
  try { localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify([initial])); } catch {}
  return [initial];
}

function loadActiveWorkspaceId(list) {
  const stored = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
  return list.some(item => item.id === stored) ? stored : list[0].id;
}

function getActiveWorkspace() {
  return workspaces.find(item => item.id === activeWorkspaceId) || workspaces[0];
}

function workspaceInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "WS";
}

function saveWorkspaces() {
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaces));
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeWorkspaceId);
}

function syncActiveWorkspace() {
  const workspace = getActiveWorkspace();
  workspace.issues = normalizeIssues(deepClone(issues));
  workspace.documents = normalizeDocuments(deepClone(documents));
}

function switchWorkspace(id) {
  if (id === activeWorkspaceId || !workspaces.some(item => item.id === id)) {
    closeWorkspaceMenu();
    return;
  }
  syncActiveWorkspace();
  activeWorkspaceId = id;
  const workspace = getActiveWorkspace();
  issues = deepClone(workspace.issues);
  documents = deepClone(workspace.documents);
  clearAllFilters(false);
  saveWorkspaces();
  closeWorkspaceMenu();
  render();
  showToast(`Switched to ${workspace.name}`);
}

function makeWorkspaceId(name) {
  const base = String(name || "workspace").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workspace";
  let id = `${base}-${Date.now().toString(36)}`;
  let counter = 2;
  while (workspaces.some(item => item.id === id)) id = `${base}-${counter++}`;
  return id;
}

function loadIssues() {
  try {
    let stored = localStorage.getItem(ISSUE_STORAGE_KEY);
    if (!stored) {
      for (const key of ISSUE_STORAGE_KEYS) {
        stored = localStorage.getItem(key);
        if (stored) break;
      }
    }
    return stored ? normalizeIssues(JSON.parse(stored)) : deepClone(INITIAL_ISSUES);
  } catch {
    return deepClone(INITIAL_ISSUES);
  }
}

function loadDocuments() {
  try {
    const stored = localStorage.getItem(DOCUMENT_STORAGE_KEY);
    return stored ? normalizeDocuments(JSON.parse(stored)) : deepClone(INITIAL_DOCUMENTS);
  } catch {
    return deepClone(INITIAL_DOCUMENTS);
  }
}

function saveIssues(message) {
  syncActiveWorkspace();
  saveWorkspaces();
  if (message) showToast(message);
}

function saveDocuments(message) {
  syncActiveWorkspace();
  saveWorkspaces();
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

function hoursLabel(value) {
  const number = Number(value || 0);
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(number)} hr${number === 1 ? "" : "s"}`;
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

function dueInfo(issue) {
  const days = daysFromToday(issue.externalDueDate);
  if (days === null) return { days: null, level: "none", label: "No due date" };
  if (days < 0) return { days, level: "red", label: `${Math.abs(days)}d overdue`, overdue: true };
  if (days <= 3) return { days, level: "red", label: days === 0 ? "Due today" : `Due in ${days}d` };
  if (days <= 5) return { days, level: "orange", label: `Due in ${days}d` };
  if (days <= 10) return { days, level: "yellow", label: `Due in ${days}d` };
  if (days <= 15) return { days, level: "green", label: `Due in ${days}d` };
  return { days, level: "none", label: dateLabel(issue.externalDueDate) };
}

function dueBadge(issue) {
  const info = dueInfo(issue);
  if (info.days === null) return "";
  return `<span class="badge due-badge due-${info.level}"><span class="deadline-dot"></span>${escapeHtml(info.label)}</span>`;
}

function dueIndicator(issue, withText = true) {
  const info = dueInfo(issue);
  if (info.days === null) return withText ? "—" : "";
  return `<span class="due-indicator due-${info.level}" title="${escapeHtml(info.label)}"><span class="deadline-dot"></span>${withText ? escapeHtml(info.label) : ""}</span>`;
}

function prioritySymbol(priority) {
  return priority === "Highest" ? "⇈" : priority === "High" ? "↑" : priority === "Low" ? "↓" : "→";
}

function statusClass(status = "") {
  const value = status.toLowerCase();
  if (value.includes("complete") || value.includes("done")) return "done";
  if (value.includes("review")) return "review";
  if (value.includes("backlog") || value.includes("not started")) return "backlog";
  if (value.includes("invoice")) return "invoice";
  return "";
}

function normalizeDriveHref(value = "") {
  const path = value.trim();
  if (!path) return "";
  if (/^file:\/\//i.test(path)) return encodeURI(path);
  if (/^[a-z]:[\\/]/i.test(path)) return encodeURI(`file:///${path.replace(/\\/g, "/")}`);
  if (/^\\\\/.test(path)) return encodeURI(`file:${path.replace(/\\/g, "/")}`);
  return "";
}

function normalizeWebHref(value = "") {
  let url = value.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function resourceLinksHtml(tDriveLink, webLink, compact = false) {
  const driveHref = normalizeDriveHref(tDriveLink || "");
  const webHref = normalizeWebHref(webLink || "");
  const links = [];
  if (driveHref) {
    links.push(`<a class="link-chip drive-link" href="${escapeHtml(driveHref)}" target="_blank" rel="noopener" draggable="false" title="${escapeHtml(tDriveLink)}" onclick="event.stopPropagation()">${compact ? "T:" : "T-drive"}</a>`);
  }
  if (webHref) {
    links.push(`<a class="link-chip sharepoint-link" href="${escapeHtml(webHref)}" target="_blank" rel="noopener" draggable="false" title="Open SharePoint or web resource" onclick="event.stopPropagation()">${compact ? "SP" : "SharePoint / Web"}</a>`);
  }
  return links.length ? `<span class="issue-links">${links.join("")}</span>` : "—";
}

function issueLinksHtml(issue, compact = false) {
  return resourceLinksHtml(issue.tDriveLink, issue.sharePointLink, compact);
}

function getFilteredIssues() {
  return issues.filter(issue => {
    const haystack = Object.values(issue).join(" ").toLowerCase();
    if (filters.search && !haystack.includes(filters.search.toLowerCase())) return false;
    if (filters.client && issue.client !== filters.client) return false;
    if (filters.assignee && issue.assignedTo !== filters.assignee) return false;
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.contract && issue.contractType !== filters.contract) return false;
    if (filters.due) {
      const days = daysFromToday(issue.externalDueDate);
      if (filters.due === "none" && issue.externalDueDate) return false;
      if (filters.due === "overdue" && !(days !== null && days < 0)) return false;
      if (["3", "5", "10", "15", "30", "90"].includes(filters.due) && !(days !== null && days >= 0 && days <= Number(filters.due))) return false;
    }
    return true;
  });
}

function getFilteredDocuments() {
  return documents.filter(item => {
    const haystack = Object.values(item).join(" ").toLowerCase();
    if (filters.search && !haystack.includes(filters.search.toLowerCase())) return false;
    if (documentFilters.client && (item.client || "All clients") !== documentFilters.client) return false;
    if (documentFilters.category && item.category !== documentFilters.category) return false;
    return true;
  });
}

function allStatuses() {
  return [...new Set([...WORKFLOW_STATUSES, ...issues.map(issue => issue.status).filter(Boolean)])];
}

function fillSelect(select, options, firstLabel, selected = "") {
  select.innerHTML = `<option value="">${escapeHtml(firstLabel)}</option>` + options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  select.value = selected;
}

function populateFilters() {
  fillSelect(els.clientFilter, [...new Set(issues.map(i => i.client).filter(Boolean))].sort(), "All clients", filters.client);
  fillSelect(els.assigneeFilter, [...new Set(issues.map(i => i.assignedTo).filter(Boolean))].sort(), "All assignees", filters.assignee);
  fillSelect(els.statusFilter, allStatuses(), "All statuses", filters.status);
  fillSelect(els.contractFilter, [...new Set(issues.map(i => i.contractType).filter(Boolean))].sort(), "All contracts", filters.contract);

  const resourceClients = [...new Set(documents.map(item => item.client || "All clients"))].sort();
  fillSelect(els.documentClientFilter, resourceClients, "All clients", documentFilters.client);
  fillSelect(els.documentCategoryFilter, DOCUMENT_CATEGORIES, "All categories", documentFilters.category);
}

function renderWorkspaceMenu() {
  els.workspaceList.innerHTML = workspaces.map(workspace => `
    <button class="workspace-option ${workspace.id === activeWorkspaceId ? "active" : ""}" type="button" data-workspace-id="${escapeHtml(workspace.id)}">
      <span class="workspace-option-avatar">${escapeHtml(workspaceInitials(workspace.name))}</span>
      <span class="workspace-option-copy"><strong>${escapeHtml(workspace.name)}</strong><small>${workspace.issues.length} issues · ${workspace.documents.length} resources</small></span>
      <span class="workspace-option-check">${workspace.id === activeWorkspaceId ? "✓" : ""}</span>
    </button>`).join("");
  els.workspaceList.querySelectorAll("[data-workspace-id]").forEach(button => button.addEventListener("click", () => switchWorkspace(button.dataset.workspaceId)));
}

function updateWorkspaceChrome() {
  const workspace = getActiveWorkspace();
  document.getElementById("workspaceAvatar").textContent = workspaceInitials(workspace.name);
  document.getElementById("workspaceName").textContent = workspace.name;
  document.getElementById("workspaceDescription").textContent = workspace.description || "Project delivery workspace";
  document.getElementById("workspaceBreadcrumbs").textContent = `Projects / ${workspace.name}`;
  document.title = `ProjectFlow | ${workspace.name}`;
  renderWorkspaceMenu();
}

function updateSidebarSummary() {
  updateWorkspaceChrome();
  const clients = [...new Set([...issues.map(issue => issue.client), ...documents.map(item => item.client)].filter(Boolean))];
  const regions = [...new Set(issues.map(issue => issue.region).filter(Boolean))];
  els.sidebarClientCount.textContent = clients.length;
  els.sidebarRegions.textContent = regions.length ? regions.slice(0, 2).join(", ") + (regions.length > 2 ? ` +${regions.length - 2}` : "") : "—";
  els.sidebarIssueCount.textContent = issues.length;
  els.sidebarDocumentCount.textContent = documents.length;
  els.sidebarBudget.textContent = money(issues.reduce((sum, issue) => sum + Number(issue.budget || 0), 0));
}

function render() {
  populateFilters();
  updateSidebarSummary();
  const filteredIssues = getFilteredIssues();
  const filteredDocuments = getFilteredDocuments();
  els.resultCount.textContent = `${filteredIssues.length} issue${filteredIssues.length === 1 ? "" : "s"}`;
  renderBoard(filteredIssues);
  renderTable(filteredIssues);
  renderTeam(filteredIssues);
  renderDashboard(filteredIssues);
  renderDocuments(filteredDocuments);
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
  const contract = String(issue.contractType || "").toLowerCase();
  const contractClass = contract === "fixed" ? "fixed" : contract === "hnte" ? "hnte" : "";
  const due = dueInfo(issue);
  return `
    <article class="issue-card due-card-${due.level}" draggable="true" data-id="${issue.id}" tabindex="0">
      <div class="card-top">
        <span class="issue-key">${escapeHtml(issue.key)}</span>
        <span class="priority-icon priority-${escapeHtml(issue.priority)}" title="${escapeHtml(issue.priority)} priority">${prioritySymbol(issue.priority)}</span>
      </div>
      <div class="client-line">${escapeHtml(issue.client || "Unspecified client")}</div>
      <div class="issue-title">${escapeHtml(issue.title)}</div>
      <p class="issue-description">${escapeHtml(issue.description || issue.notes || "No description")}</p>
      <div class="card-meta">
        <span class="badge ${contractClass}">${escapeHtml(issue.contractType || "No contract")}</span>
        <span class="badge hours-badge">${hoursLabel(issue.allocatedHours)}</span>
        ${dueBadge(issue)}
      </div>
      <div class="card-footer">
        <div><span class="budget">${money(issue.budget)}</span><div class="card-links">${issueLinksHtml(issue, true)}</div></div>
        <div class="avatar-row">
          <span class="person-avatar" title="Assigned to ${escapeHtml(issue.assignedTo || "Unassigned")}">${initials(issue.assignedTo)}</span>
          ${issue.review ? `<span class="person-avatar reviewer-avatar" title="Review by ${escapeHtml(issue.review)}">${initials(issue.review)}</span>` : ""}
        </div>
      </div>
    </article>`;
}

function bindBoardEvents() {
  document.querySelectorAll(".issue-card").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("a")) return;
      openIssueModal(Number(card.dataset.id));
    });
    card.addEventListener("keydown", event => {
      if (event.key === "Enter") openIssueModal(Number(card.dataset.id));
    });
    card.addEventListener("dragstart", event => {
      card.classList.add("dragging");
      event.dataTransfer.setData("text/plain", card.dataset.id);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  });

  document.querySelectorAll(".board-column").forEach(column => {
    column.addEventListener("dragover", event => { event.preventDefault(); column.classList.add("drag-over"); });
    column.addEventListener("dragleave", () => column.classList.remove("drag-over"));
    column.addEventListener("drop", event => {
      event.preventDefault();
      column.classList.remove("drag-over");
      const issue = issues.find(item => item.id === Number(event.dataTransfer.getData("text/plain")));
      if (!issue) return;
      issue.status = column.dataset.status;
      saveIssues(`${issue.key} moved to ${issue.status}`);
      render();
    });
  });

  document.querySelectorAll("[data-add-status]").forEach(button => {
    button.addEventListener("click", () => openIssueModal(null, button.dataset.addStatus));
  });
}

function renderTable(filtered) {
  els.tableBody.innerHTML = filtered.length ? filtered.map(issue => {
    const due = dueInfo(issue);
    return `<tr data-id="${issue.id}" class="due-row-${due.level}">
      <td><strong>${escapeHtml(issue.key)}</strong></td>
      <td class="cell-title"><strong>${escapeHtml(issue.title)}</strong><span>${escapeHtml(issue.description || "")}</span></td>
      <td><span class="client-pill">${escapeHtml(issue.client || "—")}</span></td>
      <td><span class="status-pill ${statusClass(issue.status)}">${escapeHtml(issue.status)}</span></td>
      <td>${escapeHtml(issue.assignedTo || "—")}</td>
      <td>${escapeHtml(issue.review || "—")}</td>
      <td>${escapeHtml(issue.contractType || "—")}</td>
      <td>${hoursLabel(issue.allocatedHours)}</td>
      <td>${money(issue.budget)}</td>
      <td>${dateLabel(issue.internalCompletionDate)}</td>
      <td>${dueIndicator(issue)}</td>
      <td>${issueLinksHtml(issue, true)}</td>
    </tr>`;
  }).join("") : `<tr><td colspan="12">No issues match the current filters.</td></tr>`;

  els.tableBody.querySelectorAll("tr[data-id]").forEach(row => row.addEventListener("click", event => {
    if (event.target.closest("a")) return;
    openIssueModal(Number(row.dataset.id));
  }));
}

function renderTeam(filtered) {
  const groups = {};
  filtered.forEach(issue => {
    const name = issue.assignedTo || "Unassigned";
    groups[name] ??= { name, tasks: [], budget: 0, hours: 0, reviews: 0 };
    groups[name].tasks.push(issue);
    groups[name].budget += Number(issue.budget || 0);
    groups[name].hours += Number(issue.allocatedHours || 0);
  });

  Object.values(groups).forEach(person => {
    person.reviews = filtered.filter(issue => issue.review === person.name).length;
    person.tasks.sort((a, b) => (a.externalDueDate || "9999").localeCompare(b.externalDueDate || "9999"));
  });

  const members = Object.values(groups).sort((a, b) => b.hours - a.hours || b.budget - a.budget || a.name.localeCompare(b.name));
  const assignedIssues = filtered.filter(issue => issue.assignedTo);
  const unassignedCount = filtered.length - assignedIssues.length;
  const assignedBudget = assignedIssues.reduce((sum, issue) => sum + Number(issue.budget || 0), 0);
  const allocatedHours = assignedIssues.reduce((sum, issue) => sum + Number(issue.allocatedHours || 0), 0);
  const namedMembers = members.filter(member => member.name !== "Unassigned").length;

  els.teamKpiGrid.innerHTML = [
    ["Team members", namedMembers, `${unassignedCount} unassigned task${unassignedCount === 1 ? "" : "s"}`],
    ["Assigned tasks", assignedIssues.length, "Issues assigned to a team member"],
    ["Allocated hours", hoursLabel(allocatedHours), "Total assigned effort"],
    ["Assigned budget", money(assignedBudget), "Budget across assigned tasks"]
  ].map(([label, value, sub]) => `<article class="kpi-card"><span>${label}</span><strong>${value}</strong><small>${sub}</small></article>`).join("");

  els.teamRoster.innerHTML = members.length ? members.map(person => `
    <article class="team-member-card">
      <div class="team-member-header">
        <div class="team-member-identity">
          <span class="team-avatar">${initials(person.name)}</span>
          <div><h2>${escapeHtml(person.name)}</h2><p>${person.tasks.length} assigned task${person.tasks.length === 1 ? "" : "s"} · ${person.reviews} review${person.reviews === 1 ? "" : "s"}</p></div>
        </div>
        <div class="team-total-grid">
          <div><span>Hours</span><strong>${hoursLabel(person.hours)}</strong></div>
          <div><span>Budget</span><strong>${money(person.budget)}</strong></div>
        </div>
      </div>
      <div class="team-task-list">
        ${person.tasks.map(issue => {
          const due = dueInfo(issue);
          return `<button class="team-task-row due-row-${due.level}" type="button" data-id="${issue.id}">
            <span class="team-task-main"><strong>${escapeHtml(issue.key)} · ${escapeHtml(issue.title)}</strong><small>${escapeHtml(issue.client || "Unspecified client")} · ${escapeHtml(issue.status)}</small></span>
            <span class="team-task-hours">${hoursLabel(issue.allocatedHours)}</span>
            <span class="team-task-budget">${money(issue.budget)}</span>
            <span class="team-task-due">${dueIndicator(issue)}</span>
          </button>`;
        }).join("")}
      </div>
    </article>`).join("") : `<div class="empty-state">No team assignments match the current filters.</div>`;

  els.teamRoster.querySelectorAll(".team-task-row").forEach(row => row.addEventListener("click", () => openIssueModal(Number(row.dataset.id))));
}

function renderDashboard(filtered) {
  const totalBudget = filtered.reduce((sum, issue) => sum + Number(issue.budget || 0), 0);
  const totalHours = filtered.reduce((sum, issue) => sum + Number(issue.allocatedHours || 0), 0);
  const upcoming = filtered.filter(issue => {
    const days = daysFromToday(issue.externalDueDate);
    return days !== null && days >= 0 && days <= 15;
  }).length;
  const overdue = filtered.filter(issue => {
    const days = daysFromToday(issue.externalDueDate);
    return days !== null && days < 0;
  }).length;

  els.kpiGrid.innerHTML = [
    ["Total budget", money(totalBudget), `${filtered.length} tracked work items`],
    ["Allocated hours", hoursLabel(totalHours), "Across the current portfolio"],
    ["Due in 15 days", upcoming, "External client deadlines"],
    ["Overdue", overdue, overdue ? "Needs attention" : "No missed deadlines"]
  ].map(([label, value, sub]) => `<article class="kpi-card"><span>${label}</span><strong>${value}</strong><small>${sub}</small></article>`).join("");

  const maxBudget = Math.max(...filtered.map(issue => Number(issue.budget || 0)), 1);
  els.budgetChart.innerHTML = filtered.length ? [...filtered].sort((a, b) => b.budget - a.budget).map(issue => `
    <div class="bar-row">
      <div class="bar-label" title="${escapeHtml(issue.title)}">${escapeHtml(issue.client)} · ${escapeHtml(issue.key)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(3, issue.budget / maxBudget * 100)}%"></div></div>
      <div class="bar-value">${money(issue.budget)}</div>
    </div>`).join("") : `<p>No budget data available.</p>`;

  const deadlines = filtered.filter(issue => issue.externalDueDate).sort((a, b) => a.externalDueDate.localeCompare(b.externalDueDate));
  els.deadlineList.innerHTML = deadlines.length ? deadlines.map(issue => {
    const date = new Date(`${issue.externalDueDate}T12:00:00`);
    const due = dueInfo(issue);
    return `<div class="deadline-item due-row-${due.level}">
      <div class="date-tile due-tile-${due.level}"><strong>${date.getDate()}</strong><small>${date.toLocaleString("en-US", { month: "short" }).toUpperCase()}</small></div>
      <div class="deadline-copy"><strong>${escapeHtml(issue.key)} · ${escapeHtml(issue.title)}</strong><span>${escapeHtml(issue.client)} · ${escapeHtml(issue.assignedTo || "Unassigned")}</span></div>
      ${dueIndicator(issue)}
    </div>`;
  }).join("") : `<p>No external due dates.</p>`;

  const people = {};
  filtered.forEach(issue => {
    [[issue.assignedTo, "Assignee"], [issue.review, "Reviewer"]].forEach(([name, role]) => {
      if (!name) return;
      people[name] ??= { name, assigned: 0, reviews: 0, budget: 0, hours: 0 };
      if (role === "Assignee") {
        people[name].assigned += 1;
        people[name].budget += Number(issue.budget || 0);
        people[name].hours += Number(issue.allocatedHours || 0);
      } else {
        people[name].reviews += 1;
      }
    });
  });

  els.workloadGrid.innerHTML = Object.values(people).map(person => `
    <div class="workload-card">
      <div class="workload-person"><span class="person-avatar">${initials(person.name)}</span><div><strong>${escapeHtml(person.name)}</strong><span>Project contributor</span></div></div>
      <div class="workload-stats"><span><strong>${person.assigned}</strong> assigned</span><span><strong>${person.reviews}</strong> reviews</span><span><strong>${hoursLabel(person.hours)}</strong></span><span><strong>${money(person.budget)}</strong></span></div>
    </div>`).join("") || `<p>No workload data.</p>`;
}

function renderDocuments(filtered) {
  const categoryCounts = DOCUMENT_CATEGORIES.map(category => ({ category, count: filtered.filter(item => item.category === category).length })).filter(item => item.count);
  els.documentSummary.innerHTML = `
    <div class="resource-kpi"><strong>${filtered.length}</strong><span>Resources shown</span></div>
    ${categoryCounts.map(item => `<div class="resource-kpi"><strong>${item.count}</strong><span>${escapeHtml(item.category)}</span></div>`).join("")}`;

  els.documentLibrary.innerHTML = filtered.length ? filtered
    .sort((a, b) => (b.updatedDate || b.createdAt || "").localeCompare(a.updatedDate || a.createdAt || ""))
    .map(item => {
      const client = item.client || "All clients";
      const tags = String(item.tags || "").split(",").map(tag => tag.trim()).filter(Boolean);
      return `<article class="document-card" data-id="${item.id}" tabindex="0">
        <div class="document-card-head">
          <span class="document-category">${escapeHtml(item.category)}</span>
          <button class="icon-button document-edit-button" type="button" data-id="${item.id}" aria-label="Edit resource">•••</button>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description || "No description provided.")}</p>
        <div class="document-metadata">
          <span class="client-pill">${escapeHtml(client)}</span>
          ${item.owner ? `<span>Owner: ${escapeHtml(item.owner)}</span>` : ""}
          ${item.updatedDate ? `<span>Updated ${dateLabel(item.updatedDate)}</span>` : ""}
        </div>
        ${tags.length ? `<div class="tag-list">${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        <div class="document-card-footer">
          ${resourceLinksHtml(item.tDriveLink, item.webLink)}
        </div>
      </article>`;
    }).join("") : `<div class="empty-state document-empty"><strong>No resources match the current filters.</strong><span>Add a procedure, interconnection protocol, template, report template, or useful link.</span><button class="primary-button" id="emptyAddDocumentBtn" type="button">＋ Add document or link</button></div>`;

  els.documentLibrary.querySelectorAll(".document-card").forEach(card => {
    card.addEventListener("dblclick", event => {
      if (event.target.closest("a")) return;
      openDocumentModal(Number(card.dataset.id));
    });
    card.addEventListener("keydown", event => {
      if (event.key === "Enter") openDocumentModal(Number(card.dataset.id));
    });
  });
  els.documentLibrary.querySelectorAll(".document-edit-button").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    openDocumentModal(Number(button.dataset.id));
  }));
  document.getElementById("emptyAddDocumentBtn")?.addEventListener("click", () => openDocumentModal());
}

function openIssueModal(id = null, defaultStatus = "In progress") {
  editingIssueId = id;
  const issue = issues.find(item => item.id === id);
  document.getElementById("modalKey").textContent = issue ? issue.key : "New issue";
  document.getElementById("modalTitle").textContent = issue ? "Edit issue" : "Create issue";
  els.deleteIssueBtn.classList.toggle("hidden", !issue);
  fillSelect(document.getElementById("statusInput"), allStatuses(), "Select status", issue?.status || defaultStatus);

  const workspace = getActiveWorkspace();
  const currentClient = filters.client || workspace.defaultClient || [...new Set(issues.map(item => item.client).filter(Boolean))][0] || "";
  const values = issue || {
    title: "", description: "", status: defaultStatus, priority: "Medium", assignedTo: "", review: "",
    manager: "", projectManager: "", contractType: "Fixed", budget: 0, allocatedHours: 0,
    internalCompletionDate: "", externalDueDate: "", lineOfBusiness: "Generation Interconnection", client: currentClient,
    region: workspace.defaultRegion || "", isoUtility: "", technology: "", projectSource: "", bqeProjectNumber: "", tDriveLink: "",
    sharePointLink: "", notes: ""
  };

  const fieldMap = {
    issueId: id || "", titleInput: values.title, descriptionInput: values.description, statusInput: values.status,
    priorityInput: values.priority, assigneeInput: values.assignedTo, reviewerInput: values.review,
    managerInput: values.manager, projectManagerInput: values.projectManager, contractInput: values.contractType,
    budgetInput: values.budget, hoursInput: values.allocatedHours, internalDateInput: values.internalCompletionDate,
    externalDateInput: values.externalDueDate, lobInput: values.lineOfBusiness, clientInput: values.client,
    regionInput: values.region, isoInput: values.isoUtility, technologyInput: values.technology,
    sourceInput: values.projectSource, bqeInput: values.bqeProjectNumber, tDriveInput: values.tDriveLink,
    sharePointInput: values.sharePointLink, notesInput: values.notes
  };
  Object.entries(fieldMap).forEach(([field, value]) => { document.getElementById(field).value = value ?? ""; });
  els.issueModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("titleInput").focus(), 0);
}

function closeIssueModal() {
  els.issueModal.classList.add("hidden");
  document.body.style.overflow = "";
  editingIssueId = null;
  els.issueForm.reset();
}

function openDocumentModal(id = null) {
  editingDocumentId = id;
  const item = documents.find(documentItem => documentItem.id === id);
  document.getElementById("documentModalKey").textContent = item ? item.category : "Library resource";
  document.getElementById("documentModalTitle").textContent = item ? "Edit document or link" : "Add document or link";
  els.deleteDocumentBtn.classList.toggle("hidden", !item);

  const values = item || {
    title: "",
    category: "Procedure",
    client: documentFilters.client === "All clients" ? "" : documentFilters.client,
    owner: "",
    description: "",
    tDriveLink: "",
    webLink: "",
    tags: "",
    updatedDate: new Date().toISOString().slice(0, 10)
  };

  const fieldMap = {
    documentId: id || "",
    documentTitleInput: values.title,
    documentCategoryInput: values.category,
    documentClientInput: values.client,
    documentOwnerInput: values.owner,
    documentDescriptionInput: values.description,
    documentDriveInput: values.tDriveLink,
    documentWebInput: values.webLink,
    documentTagsInput: values.tags,
    documentUpdatedInput: values.updatedDate
  };
  Object.entries(fieldMap).forEach(([field, value]) => { document.getElementById(field).value = value ?? ""; });
  els.documentModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("documentTitleInput").focus(), 0);
}

function closeDocumentModal() {
  els.documentModal.classList.add("hidden");
  document.body.style.overflow = "";
  editingDocumentId = null;
  els.documentForm.reset();
}

function formValue(id) {
  return document.getElementById(id).value.trim();
}

function handleIssueSubmit(event) {
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
    allocatedHours: Number(document.getElementById("hoursInput").value || 0),
    internalCompletionDate: formValue("internalDateInput"),
    externalDueDate: formValue("externalDateInput"),
    lineOfBusiness: formValue("lobInput"),
    client: formValue("clientInput") || "Unspecified client",
    region: formValue("regionInput"),
    isoUtility: formValue("isoInput"),
    technology: formValue("technologyInput"),
    projectSource: formValue("sourceInput"),
    bqeProjectNumber: formValue("bqeInput"),
    tDriveLink: formValue("tDriveInput"),
    sharePointLink: formValue("sharePointInput"),
    notes: formValue("notesInput")
  };

  if (editingIssueId) {
    const issue = issues.find(item => item.id === editingIssueId);
    Object.assign(issue, data);
    saveIssues(`${issue.key} updated`);
  } else {
    const nextId = Math.max(0, ...issues.map(issue => Number(issue.id || 0))) + 1;
    const issue = { id: nextId, key: nextIssueKey(), sourceStatus: data.status, ...data };
    issues.push(issue);
    saveIssues(`${issue.key} created`);
  }
  closeIssueModal();
  render();
}

function handleDocumentSubmit(event) {
  event.preventDefault();
  const data = {
    title: formValue("documentTitleInput"),
    category: formValue("documentCategoryInput"),
    client: formValue("documentClientInput"),
    owner: formValue("documentOwnerInput"),
    description: formValue("documentDescriptionInput"),
    tDriveLink: formValue("documentDriveInput"),
    webLink: formValue("documentWebInput"),
    tags: formValue("documentTagsInput"),
    updatedDate: formValue("documentUpdatedInput")
  };

  if (editingDocumentId) {
    const item = documents.find(documentItem => documentItem.id === editingDocumentId);
    Object.assign(item, data);
    saveDocuments(`${item.title} updated`);
  } else {
    const nextId = Math.max(0, ...documents.map(item => Number(item.id || 0))) + 1;
    const item = { id: nextId, createdAt: new Date().toISOString(), ...data };
    documents.push(item);
    saveDocuments(`${item.title} added`);
  }
  closeDocumentModal();
  render();
}

function deleteIssue() {
  const issue = issues.find(item => item.id === editingIssueId);
  if (!issue || !confirm(`Delete ${issue.key}? This cannot be undone.`)) return;
  issues = issues.filter(item => item.id !== editingIssueId);
  saveIssues(`${issue.key} deleted`);
  closeIssueModal();
  render();
}

function deleteDocument() {
  const item = documents.find(documentItem => documentItem.id === editingDocumentId);
  if (!item || !confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
  documents = documents.filter(documentItem => documentItem.id !== editingDocumentId);
  saveDocuments(`${item.title} deleted`);
  closeDocumentModal();
  render();
}


function nextIssueKey() {
  const prefix = getActiveWorkspace().keyPrefix || "PF";
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)$`, "i");
  const max = issues.reduce((value, issue) => {
    const match = String(issue.key || "").match(pattern);
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return `${prefix}-${max + 1}`;
}

function openWorkspaceMenu() {
  els.workspaceMenu.classList.remove("hidden");
  els.workspaceButton.setAttribute("aria-expanded", "true");
  renderWorkspaceMenu();
}

function closeWorkspaceMenu() {
  els.workspaceMenu.classList.add("hidden");
  els.workspaceButton.setAttribute("aria-expanded", "false");
}

function toggleWorkspaceMenu() {
  els.workspaceMenu.classList.contains("hidden") ? openWorkspaceMenu() : closeWorkspaceMenu();
}

function openWorkspaceModal() {
  closeWorkspaceMenu();
  els.workspaceForm.reset();
  delete document.getElementById("workspacePrefixInput").dataset.edited;
  document.getElementById("workspaceDescriptionInput").value = "Project delivery workspace";
  document.getElementById("workspaceContentInput").value = "blank";
  els.workspaceModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("workspaceNameInput").focus(), 0);
}

function closeWorkspaceModal() {
  els.workspaceModal.classList.add("hidden");
  document.body.style.overflow = "";
  els.workspaceForm.reset();
  delete document.getElementById("workspacePrefixInput").dataset.edited;
}

function handleWorkspaceSubmit(event) {
  event.preventDefault();
  const name = formValue("workspaceNameInput");
  const prefix = formValue("workspacePrefixInput").replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8);
  if (!name || !prefix) return;
  const copyCurrent = formValue("workspaceContentInput") === "copy";
  const workspace = normalizeWorkspace({
    id: makeWorkspaceId(name),
    name,
    description: formValue("workspaceDescriptionInput") || "Project delivery workspace",
    keyPrefix: prefix,
    defaultClient: formValue("workspaceClientInput"),
    defaultRegion: formValue("workspaceRegionInput"),
    issues: copyCurrent ? deepClone(issues) : [],
    documents: copyCurrent ? deepClone(documents) : []
  }, workspaces.length);
  syncActiveWorkspace();
  workspaces.push(workspace);
  activeWorkspaceId = workspace.id;
  issues = deepClone(workspace.issues);
  documents = deepClone(workspace.documents);
  saveWorkspaces();
  clearAllFilters(false);
  closeWorkspaceModal();
  render();
  showToast(`${workspace.name} workspace created`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  const input = String(text || "").replace(/^\uFEFF/, "");
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value.length || row.length) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows.filter(item => item.some(cell => String(cell).trim()));
}

function canonicalHeader(value = "") {
  return String(value).trim().toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

const CSV_HEADER_ALIASES = {
  key: ["key", "issue key"],
  lineOfBusiness: ["line of business", "lob"],
  client: ["client", "customer"],
  title: ["project", "project name", "issue", "issue summary", "summary", "task"],
  description: ["scope", "description", "scope description"],
  manager: ["manager director", "manager", "director"],
  projectManager: ["project manager", "pm"],
  contractType: ["contract type", "contract"],
  status: ["status"],
  priority: ["priority"],
  budget: ["budget", "project budget"],
  allocatedHours: ["allocated hours", "hours", "hours allocated"],
  assignedTo: ["assigned to", "assignee", "owner"],
  review: ["review", "reviewer"],
  internalCompletionDate: ["internal completion date", "internal due", "internal due date"],
  externalDueDate: ["due date external", "external due date", "external due", "due date"],
  bqeProjectNumber: ["bqe project", "bqe project number", "bqe"],
  region: ["region"],
  isoUtility: ["iso tso utility", "iso utility", "iso", "utility"],
  technology: ["technology", "tech"],
  projectSource: ["project source", "source"],
  tDriveLink: ["t drive link", "t drive", "t drive path", "drive link"],
  sharePointLink: ["sharepoint link", "sharepoint", "web link"],
  notes: ["notes", "note"]
};

function buildCsvColumnMap(headerRow) {
  const normalized = headerRow.map(canonicalHeader);
  const map = {};
  Object.entries(CSV_HEADER_ALIASES).forEach(([field, aliases]) => {
    const index = normalized.findIndex(value => aliases.includes(value));
    if (index >= 0) map[field] = index;
  });
  return map;
}

function csvCell(row, map, field) {
  const index = map[field];
  return index === undefined ? "" : String(row[index] ?? "").trim();
}

function parseMoney(value) {
  const text = String(value || "").trim();
  if (!text) return 0;
  const negative = /^\(.*\)$/.test(text);
  const number = Number(text.replace(/[$,()\s]/g, ""));
  return Number.isFinite(number) ? (negative ? -number : number) : 0;
}

function parseImportedDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (/^\d+(\.\d+)?$/.test(text)) {
    const serial = Number(text);
    if (serial > 20000 && serial < 100000) {
      const date = new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86400000);
      return date.toISOString().slice(0, 10);
    }
  }
  const match = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (match) {
    const year = Number(match[3]) < 100 ? 2000 + Number(match[3]) : Number(match[3]);
    return `${year}-${String(match[1]).padStart(2, "0")}-${String(match[2]).padStart(2, "0")}`;
  }
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function importIssuesFromCsv(text) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error("The CSV is empty.");
  let headerIndex = rows.findIndex(row => {
    const headers = row.map(canonicalHeader);
    return headers.some(value => CSV_HEADER_ALIASES.title.includes(value)) && headers.includes("client");
  });
  if (headerIndex < 0) {
    headerIndex = rows.findIndex(row => row.map(canonicalHeader).some(value => CSV_HEADER_ALIASES.title.includes(value)));
  }
  if (headerIndex < 0) throw new Error("Could not find a Project, Issue, Summary, or Task column.");

  const map = buildCsvColumnMap(rows[headerIndex]);
  const hasDescriptionColumn = map.description !== undefined;
  const workspace = getActiveWorkspace();
  const imported = [];
  let nextId = Math.max(0, ...issues.map(issue => Number(issue.id || 0))) + 1;
  const prefix = workspace.keyPrefix || "PF";
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)$`, "i");
  let nextKeyNumber = issues.reduce((value, issue) => {
    const match = String(issue.key || "").match(pattern);
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0) + 1;

  for (const row of rows.slice(headerIndex + 1)) {
    const title = csvCell(row, map, "title");
    const primaryFields = ["lineOfBusiness", "client", "manager", "projectManager", "contractType", "status", "budget", "assignedTo", "review", "internalCompletionDate", "externalDueDate", "bqeProjectNumber", "region", "isoUtility", "technology", "projectSource", "allocatedHours"];
    const hasPrimaryMetadata = primaryFields.some(field => csvCell(row, map, field));
    const notes = csvCell(row, map, "notes");

    if (!title && !hasPrimaryMetadata && !notes) continue;

    const continuation = !hasDescriptionColumn && imported.length && title && !hasPrimaryMetadata && (title === title.toUpperCase() || title.length <= 70);
    if (continuation) {
      const previous = imported[imported.length - 1];
      previous.description = [previous.description, title].filter(Boolean).join("\n");
      if (notes) previous.notes = [previous.notes, notes].filter(Boolean).join("\n");
      continue;
    }

    if (!title) continue;
    const status = csvCell(row, map, "status") || "Backlog";
    imported.push(normalizeIssues([{
      id: nextId++,
      key: `${prefix}-${nextKeyNumber++}`,
      title,
      description: csvCell(row, map, "description"),
      lineOfBusiness: csvCell(row, map, "lineOfBusiness"),
      client: csvCell(row, map, "client") || workspace.defaultClient || "Unspecified client",
      manager: csvCell(row, map, "manager"),
      projectManager: csvCell(row, map, "projectManager"),
      contractType: csvCell(row, map, "contractType"),
      status,
      sourceStatus: status,
      priority: csvCell(row, map, "priority") || "Medium",
      budget: parseMoney(csvCell(row, map, "budget")),
      allocatedHours: parseMoney(csvCell(row, map, "allocatedHours")),
      assignedTo: csvCell(row, map, "assignedTo"),
      review: csvCell(row, map, "review"),
      internalCompletionDate: parseImportedDate(csvCell(row, map, "internalCompletionDate")),
      externalDueDate: parseImportedDate(csvCell(row, map, "externalDueDate")),
      bqeProjectNumber: csvCell(row, map, "bqeProjectNumber"),
      region: csvCell(row, map, "region") || workspace.defaultRegion,
      isoUtility: csvCell(row, map, "isoUtility"),
      technology: csvCell(row, map, "technology"),
      projectSource: csvCell(row, map, "projectSource"),
      tDriveLink: csvCell(row, map, "tDriveLink"),
      sharePointLink: csvCell(row, map, "sharePointLink"),
      notes
    }])[0]);
  }

  if (!imported.length) throw new Error("No project rows were found after the header.");
  issues.push(...imported);
  saveIssues(`${imported.length} project${imported.length === 1 ? "" : "s"} imported into ${workspace.name}`);
  render();
  return imported.length;
}

async function handleCsvFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    importIssuesFromCsv(text);
  } catch (error) {
    alert(`CSV import failed: ${error.message}`);
  } finally {
    event.target.value = "";
  }
}

function downloadCsv(filename, columns, rows) {
  const quote = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    columns.map(([label]) => quote(label)).join(","),
    ...rows.map(row => columns.map(([, key]) => quote(row[key])).join(","))
  ].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportCurrentView() {
  if (currentView === "documents") {
    downloadCsv("projectflow-document-library.csv", [
      ["Title", "title"], ["Category", "category"], ["Client", "client"], ["Owner", "owner"],
      ["Description", "description"], ["T-drive Link", "tDriveLink"], ["SharePoint/Web Link", "webLink"],
      ["Tags", "tags"], ["Last Updated", "updatedDate"]
    ], getFilteredDocuments());
    showToast("Resource library CSV exported");
    return;
  }

  const workspaceSlug = getActiveWorkspace().name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workspace";
  downloadCsv(`${workspaceSlug}-project-tracker.csv`, [
    ["Key", "key"], ["Line of Business", "lineOfBusiness"], ["Client", "client"], ["Project", "title"],
    ["Scope", "description"], ["Manager/Director", "manager"], ["Project Manager", "projectManager"],
    ["Contract Type", "contractType"], ["Status", "status"], ["Budget", "budget"], ["Allocated Hours", "allocatedHours"],
    ["Assigned To", "assignedTo"], ["Review", "review"], ["Internal Completion Date", "internalCompletionDate"],
    ["Due Date (External)", "externalDueDate"], ["BQE Project #", "bqeProjectNumber"], ["Region", "region"],
    ["ISO/TSO/Utility", "isoUtility"], ["Technology", "technology"], ["Project Source", "projectSource"],
    ["T-drive Link", "tDriveLink"], ["SharePoint Link", "sharePointLink"], ["Notes", "notes"]
  ], getFilteredIssues());
  showToast("Issue CSV exported");
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
    board: ["Project board", "Track client deliverables, ownership, budgets, hours, and deadlines."],
    list: ["Issue list", "Review every tracker field in a scan-friendly portfolio table."],
    team: ["Team workload", "See each team member’s assigned tasks, total budget, and allocated hours."],
    documents: ["Documents & links", "Build a shared library of procedures, protocols, templates, report templates, and project references."],
    dashboard: ["Portfolio dashboard", "Monitor budget, allocated effort, schedule risk, and workload."]
  };
  document.getElementById("viewTitle").textContent = copy[view][0];
  document.getElementById("viewSubtitle").textContent = copy[view][1];

  const isDocuments = view === "documents";
  els.filterBar.classList.toggle("hidden", isDocuments);
  els.createButton.textContent = isDocuments ? "＋ Add document or link" : "＋ Create issue";
  els.exportButton.textContent = isDocuments ? "Export resources CSV" : "Export CSV";
  els.globalSearch.placeholder = isDocuments ? "Search documents, links, descriptions…" : "Search issues, people, notes…";
  els.sidebar.classList.remove("open");
  render();
}

function clearAllFilters(shouldRender = true) {
  filters = { search: "", client: "", assignee: "", status: "", contract: "", due: "" };
  documentFilters = { client: "", category: "" };
  els.globalSearch.value = "";
  els.clientFilter.value = "";
  els.assigneeFilter.value = "";
  els.statusFilter.value = "";
  els.contractFilter.value = "";
  els.dueFilter.value = "";
  els.documentClientFilter.value = "";
  els.documentCategoryFilter.value = "";
  if (shouldRender) render();
}

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => switchView(item.dataset.view)));
els.createButton.addEventListener("click", () => currentView === "documents" ? openDocumentModal() : openIssueModal());
document.getElementById("addDocumentBtn").addEventListener("click", () => openDocumentModal());
document.getElementById("closeModalBtn").addEventListener("click", closeIssueModal);
document.getElementById("cancelModalBtn").addEventListener("click", closeIssueModal);
document.getElementById("closeDocumentModalBtn").addEventListener("click", closeDocumentModal);
document.getElementById("cancelDocumentModalBtn").addEventListener("click", closeDocumentModal);
els.issueForm.addEventListener("submit", handleIssueSubmit);
els.documentForm.addEventListener("submit", handleDocumentSubmit);
els.deleteIssueBtn.addEventListener("click", deleteIssue);
els.deleteDocumentBtn.addEventListener("click", deleteDocument);
els.exportButton.addEventListener("click", exportCurrentView);
els.importButton.addEventListener("click", () => els.csvFileInput.click());
els.csvFileInput.addEventListener("change", handleCsvFile);
els.workspaceButton.addEventListener("click", event => { event.stopPropagation(); toggleWorkspaceMenu(); });
document.getElementById("createWorkspaceBtn").addEventListener("click", openWorkspaceModal);
document.getElementById("createWorkspaceMenuBtn").addEventListener("click", openWorkspaceModal);
document.getElementById("closeWorkspaceModalBtn").addEventListener("click", closeWorkspaceModal);
document.getElementById("cancelWorkspaceModalBtn").addEventListener("click", closeWorkspaceModal);
els.workspaceForm.addEventListener("submit", handleWorkspaceSubmit);
document.getElementById("workspaceNameInput").addEventListener("input", event => {
  const prefixInput = document.getElementById("workspacePrefixInput");
  if (!prefixInput.dataset.edited) prefixInput.value = workspaceInitials(event.target.value).replace(/[^A-Z0-9]/g, "").slice(0, 8);
});
document.getElementById("workspacePrefixInput").addEventListener("input", event => {
  event.target.dataset.edited = event.target.value ? "true" : "";
  event.target.value = event.target.value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8);
});
document.getElementById("menuBtn").addEventListener("click", () => els.sidebar.classList.toggle("open"));

document.getElementById("resetDataBtn").addEventListener("click", () => {
  const workspace = getActiveWorkspace();
  const restoresWorkbook = workspace.id === DEFAULT_WORKSPACE_ID;
  const message = restoresWorkbook
    ? "Reset this workspace to the original workbook data and clear its document library?"
    : "Clear all issues and documents from this workspace?";
  if (!confirm(message)) return;
  issues = restoresWorkbook ? deepClone(INITIAL_ISSUES) : [];
  documents = [];
  saveIssues();
  saveDocuments(restoresWorkbook ? "Original workbook data restored" : `${workspace.name} cleared`);
  render();
});

document.getElementById("clearFiltersBtn").addEventListener("click", clearAllFilters);
els.globalSearch.addEventListener("input", event => { filters.search = event.target.value; render(); });
els.clientFilter.addEventListener("change", event => { filters.client = event.target.value; render(); });
els.assigneeFilter.addEventListener("change", event => { filters.assignee = event.target.value; render(); });
els.statusFilter.addEventListener("change", event => { filters.status = event.target.value; render(); });
els.contractFilter.addEventListener("change", event => { filters.contract = event.target.value; render(); });
els.dueFilter.addEventListener("change", event => { filters.due = event.target.value; render(); });
els.documentClientFilter.addEventListener("change", event => { documentFilters.client = event.target.value; render(); });
els.documentCategoryFilter.addEventListener("change", event => { documentFilters.category = event.target.value; render(); });

els.issueModal.addEventListener("click", event => { if (event.target === els.issueModal) closeIssueModal(); });
els.documentModal.addEventListener("click", event => { if (event.target === els.documentModal) closeDocumentModal(); });
els.workspaceModal.addEventListener("click", event => { if (event.target === els.workspaceModal) closeWorkspaceModal(); });
document.addEventListener("click", event => { if (!event.target.closest(".project-switcher")) closeWorkspaceMenu(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (!els.issueModal.classList.contains("hidden")) closeIssueModal();
    if (!els.documentModal.classList.contains("hidden")) closeDocumentModal();
    if (!els.workspaceModal.classList.contains("hidden")) closeWorkspaceModal();
    closeWorkspaceMenu();
  }
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    els.globalSearch.focus();
  }
});

saveIssues();
render();
