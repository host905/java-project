/**
 * PeopleDesk - Enterprise Employment Management & Virtual Employee Portal
 * Vanilla JavaScript (ES6+) Architecture
 */

// ==========================================================================
// 1. STATE & CONSTANTS
// ==========================================================================

const STORAGE_KEY = "peopleDeskEmployees_v2";
const LEGACY_STORAGE_KEY = "peopleDeskEmployees";
const THEME_KEY = "peopleDesk_theme";
const AUTH_USER_KEY = "peopleDesk_currentUser";
const LEAVES_KEY = "peopleDesk_leaveRequests";
const ATTENDANCE_KEY = "peopleDesk_attendanceLog";

// Default Administrator Account
const defaultAdminUser = {
    role: "admin",
    id: "ADMIN01",
    name: "Admin User",
    email: "admin@peopledesk.com",
    department: "Human Resources",
    jobTitle: "HR Administrator"
};

// Default Sample Employees
const initialSampleEmployees = [
    {
        id: "EMP001",
        name: "Aarav Patel",
        department: "Human Resources",
        jobTitle: "HR Executive",
        email: "aarav.patel@example.com",
        phone: "+91 98765 43210",
        joinDate: "2023-03-15",
        status: "Active"
    },
    {
        id: "EMP002",
        name: "Siya Mehta",
        department: "Engineering",
        jobTitle: "Senior Software Engineer",
        email: "siya.mehta@example.com",
        phone: "+91 98765 43211",
        joinDate: "2022-08-01",
        status: "Active"
    },
    {
        id: "EMP003",
        name: "Rohan Shah",
        department: "Finance",
        jobTitle: "Chief Accountant",
        email: "rohan.shah@example.com",
        phone: "+91 98765 43212",
        joinDate: "2021-11-20",
        status: "Active"
    },
    {
        id: "EMP004",
        name: "Ananya Desai",
        department: "Marketing",
        jobTitle: "Brand Strategist",
        email: "ananya.desai@example.com",
        phone: "+91 98765 43213",
        joinDate: "2023-05-10",
        status: "Active"
    },
    {
        id: "EMP005",
        name: "Kabir Joshi",
        department: "Engineering",
        jobTitle: "UI/UX Developer",
        email: "kabir.joshi@example.com",
        phone: "+91 98765 43214",
        joinDate: "2022-02-18",
        status: "Inactive"
    },
    {
        id: "EMP006",
        name: "Isha Kulkarni",
        department: "Sales",
        jobTitle: "Enterprise Sales Director",
        email: "isha.kulkarni@example.com",
        phone: "+91 98765 43215",
        joinDate: "2021-06-12",
        status: "Active"
    },
    {
        id: "EMP007",
        name: "Dev Malhotra",
        department: "Human Resources",
        jobTitle: "Talent Acquisition Lead",
        email: "dev.malhotra@example.com",
        phone: "+91 98765 43216",
        joinDate: "2023-09-01",
        status: "Active"
    },
    {
        id: "EMP008",
        name: "Mira Nair",
        department: "Finance",
        jobTitle: "Senior Financial Analyst",
        email: "mira.nair@example.com",
        phone: "+91 98765 43217",
        joinDate: "2022-04-25",
        status: "Inactive"
    }
];

// Initial Sample Leave Requests
const initialSampleLeaves = [
    {
        id: "LR001",
        employeeId: "EMP002",
        employeeName: "Siya Mehta",
        leaveType: "Paid Annual Leave",
        startDate: "2026-10-20",
        endDate: "2026-10-22",
        daysCount: 3,
        reason: "Family holiday",
        status: "Pending",
        createdAt: "2026-10-10"
    },
    {
        id: "LR002",
        employeeId: "EMP003",
        employeeName: "Rohan Shah",
        leaveType: "Casual Leave",
        startDate: "2026-10-15",
        endDate: "2026-10-15",
        daysCount: 1,
        reason: "Personal errand",
        status: "Approved",
        createdAt: "2026-10-08"
    },
    {
        id: "LR003",
        employeeId: "EMP006",
        employeeName: "Isha Kulkarni",
        leaveType: "Sick Leave",
        startDate: "2026-10-02",
        endDate: "2026-10-03",
        daysCount: 2,
        reason: "Medical checkup",
        status: "Approved",
        createdAt: "2026-10-01"
    }
];

// Color palette for avatars and departments
const avatarColors = [
    { bg: "#3b66f5", text: "#ffffff" },
    { bg: "#8b5cf6", text: "#ffffff" },
    { bg: "#10b981", text: "#ffffff" },
    { bg: "#f59e0b", text: "#ffffff" },
    { bg: "#06b6d4", text: "#ffffff" },
    { bg: "#ec4899", text: "#ffffff" },
    { bg: "#3b82f6", text: "#ffffff" },
    { bg: "#14b8a6", text: "#ffffff" }
];

const deptColorPalette = [
    "#3b66f5", "#8b5cf6", "#10b981", "#f59e0b", "#06b6d4", "#ec4899", "#6366f1"
];

// Application State
let employees = loadEmployees();
let leaveRequests = loadLeaveRequests();
let currentUser = loadCurrentUser();
let currentSortColumn = "name";
let currentSortDirection = "asc";
let currentPage = 1;
let pageSize = 10;
let pendingDeleteId = null;
let activeClockInterval = null;
let currentTaskFilter = "all";

// ==========================================================================
// 2. DOM ELEMENT REFERENCES
// ==========================================================================

// Global & Auth / Switcher Elements
const brandLogo = document.getElementById("brandLogo");
const workspaceBadge = document.getElementById("workspaceBadge");
const rolePillBanner = document.getElementById("rolePillBanner");
const roleDot = document.getElementById("roleDot");
const roleBannerText = document.getElementById("roleBannerText");
const topbarEyebrow = document.getElementById("topbarEyebrow");
const topbarEyebrowText = document.getElementById("topbarEyebrowText");
const topbarPageTitle = document.getElementById("topbarPageTitle");
const topbarPageSubtitle = document.getElementById("topbarPageSubtitle");
const authBtnLabel = document.getElementById("authBtnLabel");
const openAuthModalBtn = document.getElementById("openAuthModalBtn");
const activeUserBadgeFooter = document.getElementById("activeUserBadgeFooter");

const sidebarProfileCard = document.getElementById("sidebarProfileCard");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarUserRole = document.getElementById("sidebarUserRole");
const sidebarSwitchBtn = document.getElementById("sidebarSwitchBtn");

const adminNavGroup = document.getElementById("adminNavGroup");
const employeeNavGroup = document.getElementById("employeeNavGroup");
const adminViewContainer = document.getElementById("adminViewContainer");
const employeeViewContainer = document.getElementById("employeeViewContainer");

// Auth Modal
const authModal = document.getElementById("authModal");
const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
const currentAuthAvatar = document.getElementById("currentAuthAvatar");
const currentAuthName = document.getElementById("currentAuthName");
const currentAuthRole = document.getElementById("currentAuthRole");
const switchAdminBtn = document.getElementById("switchAdminBtn");
const employeeQuickList = document.getElementById("employeeQuickList");

// Admin Metrics & Stats
const totalEmployeesEl = document.getElementById("totalEmployees");
const totalDepartmentsEl = document.getElementById("totalDepartments");
const activeEmployeesEl = document.getElementById("activeEmployees");
const inactiveEmployeesEl = document.getElementById("inactiveEmployees");
const headcountBadge = document.getElementById("headcountBadge");
const activeRateBadge = document.getElementById("activeRateBadge");
const inactiveBadge = document.getElementById("inactiveBadge");
const pendingLeavesCount = document.getElementById("pendingLeavesCount");
const pendingLeavesStatBadge = document.getElementById("pendingLeavesStatBadge");
const pendingLeavesCountBadge = document.getElementById("pendingLeavesCountBadge");
const departmentProgressBars = document.getElementById("departmentProgressBars");
const deptAnalyticsSummary = document.getElementById("deptAnalyticsSummary");

// Table & Toolbar (Admin)
const employeeTableBody = document.getElementById("employeeTableBody");
const employeeCountEl = document.getElementById("employeeCount");
const filterSummaryNote = document.getElementById("filterSummaryNote");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const departmentFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const pageSizeSelect = document.getElementById("pageSizeSelect");
const paginationInfo = document.getElementById("paginationInfo");
const paginationButtons = document.getElementById("paginationButtons");

// Admin Leave Approvals
const adminLeaveCountBadge = document.getElementById("adminLeaveCountBadge");
const adminLeavesTableBody = document.getElementById("adminLeavesTableBody");

// Employee Virtual Desk Elements
const empHeroAvatar = document.getElementById("empHeroAvatar");
const empHeroName = document.getElementById("empHeroName");
const empHeroMeta = document.getElementById("empHeroMeta");
const applyLeaveBtnHero = document.getElementById("applyLeaveBtnHero");
const liveClockTime = document.getElementById("liveClockTime");
const liveClockDate = document.getElementById("liveClockDate");
const clockStatusBadge = document.getElementById("clockStatusBadge");
const clockElapsedTimer = document.getElementById("clockElapsedTimer");
const mainClockBtn = document.getElementById("mainClockBtn");
const quickClockBtn = document.getElementById("quickClockBtn");
const quickClockBtnText = document.getElementById("quickClockBtnText");
const empLeaveBalance = document.getElementById("empLeaveBalance");
const empLeaveUsed = document.getElementById("empLeaveUsed");
const empLeavePending = document.getElementById("empLeavePending");
const empTaskCount = document.getElementById("empTaskCount");
const taskPercentBadge = document.getElementById("taskPercentBadge");
const taskProgressBar = document.getElementById("taskProgressBar");
const empAttendanceTableBody = document.getElementById("empAttendanceTableBody");
const empLeavesTableBody = document.getElementById("empLeavesTableBody");
const openApplyLeaveModalBtn = document.getElementById("openApplyLeaveModalBtn");

// Tasks
const addTaskForm = document.getElementById("addTaskForm");
const newTaskInput = document.getElementById("newTaskInput");
const taskPrioritySelect = document.getElementById("taskPrioritySelect");
const taskList = document.getElementById("taskList");

// Team Directory for Employee
const teamSearchInput = document.getElementById("teamSearchInput");
const teamDirectoryTableBody = document.getElementById("teamDirectoryTableBody");

// Modals
const employeeModal = document.getElementById("employeeModal");
const employeeForm = document.getElementById("employeeForm");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const formMessage = document.getElementById("formMessage");
const closeFormBtn = document.getElementById("closeFormBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");

const editingEmployeeIdInput = document.getElementById("editingEmployeeId");
const employeeNameInput = document.getElementById("employeeName");
const employeeIdInput = document.getElementById("employeeId");
const employeeDepartmentInput = document.getElementById("employeeDepartment");
const employeeJobTitleInput = document.getElementById("employeeJobTitle");
const employeeEmailInput = document.getElementById("employeeEmail");
const employeePhoneInput = document.getElementById("employeePhone");
const employeeJoinDateInput = document.getElementById("employeeJoinDate");
const employeeStatusInput = document.getElementById("employeeStatus");

const nameError = document.getElementById("nameError");
const idError = document.getElementById("idError");
const departmentError = document.getElementById("departmentError");
const jobTitleError = document.getElementById("jobTitleError");
const emailError = document.getElementById("emailError");

// Leave Request Modal
const applyLeaveModal = document.getElementById("applyLeaveModal");
const applyLeaveForm = document.getElementById("applyLeaveForm");
const leaveTypeSelect = document.getElementById("leaveTypeSelect");
const leaveDurationDisplay = document.getElementById("leaveDurationDisplay");
const leaveStartDate = document.getElementById("leaveStartDate");
const leaveEndDate = document.getElementById("leaveEndDate");
const leaveReason = document.getElementById("leaveReason");
const closeLeaveModalBtn = document.getElementById("closeLeaveModalBtn");
const cancelLeaveBtn = document.getElementById("cancelLeaveBtn");

// Profile Modal
const viewProfileModal = document.getElementById("viewProfileModal");
const closeProfileModalBtn = document.getElementById("closeProfileModalBtn");
const profileCloseBtn = document.getElementById("profileCloseBtn");
const profileEditBtn = document.getElementById("profileEditBtn");
const profileDeleteBtn = document.getElementById("profileDeleteBtn");
const profileModalAvatar = document.getElementById("profileModalAvatar");
const profileModalName = document.getElementById("profileModalName");
const profileModalRole = document.getElementById("profileModalRole");
const profileModalStatusBadge = document.getElementById("profileModalStatusBadge");
const profileModalIdBadge = document.getElementById("profileModalIdBadge");
const profileModalDepartment = document.getElementById("profileModalDepartment");
const profileModalEmail = document.getElementById("profileModalEmail");
const profileModalPhone = document.getElementById("profileModalPhone");
const profileModalJoinDate = document.getElementById("profileModalJoinDate");

// Delete Confirm Modal
const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const deleteModalMessage = document.getElementById("deleteModalMessage");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// Navigation & Actions
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");
const emptyClearFiltersBtn = document.getElementById("emptyClearFiltersBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const resetDataBtn = document.getElementById("resetDataBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const toastContainer = document.getElementById("toastContainer");

// ==========================================================================
// 3. PERSISTENCE & LOCAL STORAGE
// ==========================================================================

function loadEmployees() {
    try {
        let savedData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (savedData === null) {
            return initialSampleEmployees.map(e => ({ ...e }));
        }

        const parsed = JSON.parse(savedData);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            return initialSampleEmployees.map(e => ({ ...e }));
        }

        return parsed.map(item => ({
            id: String(item.id || "").trim(),
            name: String(item.name || "").trim(),
            department: String(item.department || "").trim(),
            jobTitle: String(item.jobTitle || "").trim(),
            email: String(item.email || "").trim(),
            phone: item.phone ? String(item.phone).trim() : "",
            joinDate: item.joinDate ? String(item.joinDate).trim() : "",
            status: item.status === "Inactive" ? "Inactive" : "Active"
        }));
    } catch (err) {
        console.error("Error loading employees:", err);
        return initialSampleEmployees.map(e => ({ ...e }));
    }
}

function saveEmployees() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        return true;
    } catch (err) {
        console.error("Could not save to localStorage:", err);
        showToast("Storage error: Could not persist records.", "error", "Storage Error");
        return false;
    }
}

function loadLeaveRequests() {
    try {
        const saved = localStorage.getItem(LEAVES_KEY);
        if (!saved) return initialSampleLeaves.map(l => ({ ...l }));
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : initialSampleLeaves.map(l => ({ ...l }));
    } catch {
        return initialSampleLeaves.map(l => ({ ...l }));
    }
}

function saveLeaveRequests() {
    try {
        localStorage.setItem(LEAVES_KEY, JSON.stringify(leaveRequests));
        return true;
    } catch {
        return false;
    }
}

function loadCurrentUser() {
    try {
        const saved = localStorage.getItem(AUTH_USER_KEY);
        if (!saved) return { ...defaultAdminUser };
        return JSON.parse(saved);
    } catch {
        return { ...defaultAdminUser };
    }
}

function saveCurrentUser(user) {
    try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (err) {
        console.error("Failed to save user session:", err);
    }
}

// ==========================================================================
// 4. THEME MANAGEMENT
// ==========================================================================

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    document.body.setAttribute("data-theme", initialTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    showToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} theme`, "info", "Theme Changed");
}

themeToggleBtn.addEventListener("click", toggleTheme);

// ==========================================================================
// 5. TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = "info", title = "") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconSvg = "";
    if (type === "success") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === "error") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    const defaultTitle = type === "success" ? "Success" : type === "error" ? "Error" : "Notice";

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-body">
            <div class="toast-title">${title || defaultTitle}</div>
            <div class="toast-msg">${message}</div>
        </div>
        <button type="button" class="toast-close" aria-label="Dismiss notification">✕</button>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => dismissToast(toast));
    toastContainer.appendChild(toast);

    setTimeout(() => dismissToast(toast), 3500);
}

function dismissToast(toast) {
    if (!toast || toast.classList.contains("toast-leave")) return;
    toast.classList.add("toast-leave");
    toast.addEventListener("animationend", () => toast.remove());
}

// ==========================================================================
// 6. ROLE & USER SESSION MANAGEMENT
// ==========================================================================

function switchUser(targetUser) {
    currentUser = { ...targetUser };
    saveCurrentUser(currentUser);
    applyUserRole();
    closeAuthModal();

    if (currentUser.role === "admin") {
        showToast("Switched to HR Administrator Mode (Full Privileges)", "success", "Admin Logged In");
    } else {
        showToast(`Logged into Virtual Workspace for ${currentUser.name}`, "success", "Employee Portal Active");
    }
}

function applyUserRole() {
    const isAdmin = currentUser.role === "admin";

    // Update Sidebar Profile Card
    const initials = getInitials(currentUser.name);
    sidebarAvatar.textContent = initials;
    sidebarUserName.textContent = currentUser.name;
    sidebarUserRole.textContent = currentUser.jobTitle || (isAdmin ? "HR Administrator" : "Employee");

    // Update Role Banners
    if (isAdmin) {
        workspaceBadge.textContent = "Admin Hub";
        roleDot.className = "role-dot";
        roleBannerText.textContent = "Administrator Mode";
        topbarEyebrow.className = "eyebrow-badge";
        topbarEyebrowText.textContent = "ADMINISTRATOR WORKSPACE";
        topbarPageTitle.textContent = "Employment Management";
        topbarPageSubtitle.textContent = "Monitor workforce analytics, employee records, and staffing status.";
        authBtnLabel.textContent = "Switch Role";
        activeUserBadgeFooter.textContent = "Admin Active";

        // View Visibility
        adminNavGroup.classList.remove("hidden");
        employeeNavGroup.classList.add("hidden");
        adminViewContainer.classList.remove("hidden");
        employeeViewContainer.classList.add("hidden");

        // Admin-only elements
        document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
        document.querySelectorAll(".employee-only").forEach(el => el.classList.add("hidden"));

        // Reset active nav link
        setActiveNavLink("dashboard");
        updateDashboard();
        updateDepartmentFilter();
        renderEmployees();
        renderAdminLeaveApprovals();
    } else {
        workspaceBadge.textContent = "Employee Desk";
        roleDot.className = "role-dot employee";
        roleBannerText.textContent = `${currentUser.name} (Desk)`;
        topbarEyebrow.className = "eyebrow-badge employee";
        topbarEyebrowText.textContent = "EMPLOYEE VIRTUAL DESK";
        topbarPageTitle.textContent = "My Virtual Workspace";
        topbarPageSubtitle.textContent = "Daily attendance, leave requests, task planner, and team directory.";
        authBtnLabel.textContent = "Switch Account";
        activeUserBadgeFooter.textContent = `User: ${currentUser.id}`;

        // View Visibility
        adminNavGroup.classList.add("hidden");
        employeeNavGroup.classList.remove("hidden");
        adminViewContainer.classList.add("hidden");
        employeeViewContainer.classList.remove("hidden");

        // Admin-only elements
        document.querySelectorAll(".admin-only").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".employee-only").forEach(el => el.classList.remove("hidden"));

        // Reset active nav link
        setActiveNavLink("employeeWorkspace");
        initEmployeePortal();
    }
}

function setActiveNavLink(viewName) {
    document.querySelectorAll(".navigation .nav-link").forEach(link => {
        link.classList.toggle("active", link.getAttribute("data-view") === viewName);
    });
}

// Auth Modal Functions
function openAuthModal() {
    const initials = getInitials(currentUser.name);
    currentAuthAvatar.textContent = initials;
    currentAuthName.textContent = currentUser.name;
    currentAuthRole.textContent = currentUser.jobTitle || (currentUser.role === "admin" ? "HR Administrator" : "Employee");

    // Populate employee quick list
    employeeQuickList.innerHTML = "";

    employees.forEach(emp => {
        const isCurrent = currentUser.role === "employee" && currentUser.id === emp.id;
        const color = getAvatarColor(emp.name);
        const empInitials = getInitials(emp.name);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "employee-switch-pill";
        if (isCurrent) btn.style.borderColor = "var(--primary)";

        btn.innerHTML = `
            <div class="profile-avatar" style="background-color: ${color.bg}; color: ${color.text}; width: 34px; height: 34px; font-size: 11px;">
                ${empInitials}
            </div>
            <div style="flex: 1; min-width: 0;">
                <strong style="display: block; font-size: 13px; color: var(--text-primary);">${emp.name}</strong>
                <small style="color: var(--text-muted); font-size: 11px;">${emp.department} · ${emp.jobTitle}</small>
            </div>
            <span class="id-badge">${emp.id}</span>
            ${isCurrent ? '<span class="stat-badge green" style="margin-left: 6px;">Active</span>' : ""}
        `;

        btn.addEventListener("click", () => {
            switchUser({
                role: "employee",
                id: emp.id,
                name: emp.name,
                email: emp.email,
                department: emp.department,
                jobTitle: emp.jobTitle,
                phone: emp.phone,
                joinDate: emp.joinDate
            });
        });

        employeeQuickList.appendChild(btn);
    });

    authModal.classList.remove("hidden");
}

function closeAuthModal() {
    authModal.classList.add("hidden");
}

switchAdminBtn.addEventListener("click", () => {
    switchUser({ ...defaultAdminUser });
});

openAuthModalBtn.addEventListener("click", openAuthModal);
sidebarProfileCard.addEventListener("click", openAuthModal);
closeAuthModalBtn.addEventListener("click", closeAuthModal);

// ==========================================================================
// 7. EMPLOYEE VIRTUAL DESK PORTAL
// ==========================================================================

function initEmployeePortal() {
    if (currentUser.role !== "employee") return;

    // Populate Hero Banner
    empHeroAvatar.textContent = getInitials(currentUser.name);
    empHeroName.textContent = `Welcome, ${currentUser.name}!`;
    empHeroMeta.textContent = `${currentUser.department} · ${currentUser.jobTitle} · Employee ID: ${currentUser.id}`;

    // Initialize clock widget
    initLiveClock();
    updateClockSessionUI();

    // Populate Employee Leaves & Balances
    renderEmployeeLeaves();

    // Populate Tasks
    renderTasks();

    // Populate Team Directory
    renderTeamDirectory();
}

// Live Clock & Attendance System
function initLiveClock() {
    updateClockDisplay();
    if (activeClockInterval) clearInterval(activeClockInterval);
    activeClockInterval = setInterval(() => {
        updateClockDisplay();
        updateClockElapsed();
    }, 1000);
}

function updateClockDisplay() {
    const now = new Date();
    liveClockTime.textContent = now.toLocaleTimeString("en-US", { hour12: true });
    liveClockDate.textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function getClockStorageKey() {
    return `peopleDesk_clock_${currentUser.id}`;
}

function getActiveClockSession() {
    try {
        const data = localStorage.getItem(getClockStorageKey());
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function saveActiveClockSession(session) {
    if (session) {
        localStorage.setItem(getClockStorageKey(), JSON.stringify(session));
    } else {
        localStorage.removeItem(getClockStorageKey());
    }
}

function updateClockSessionUI() {
    const session = getActiveClockSession();
    const isClockedIn = !!(session && session.isClockedIn);

    if (isClockedIn) {
        clockStatusBadge.textContent = "Working Now";
        clockStatusBadge.className = "stat-badge green";
        mainClockBtn.textContent = "Clock Out";
        mainClockBtn.className = "clock-action-btn clocked-in";
        quickClockBtnText.textContent = "Clock Out";
        quickClockBtn.className = "danger-btn employee-only";
    } else {
        clockStatusBadge.textContent = "Clocked Out";
        clockStatusBadge.className = "stat-badge amber";
        mainClockBtn.textContent = "Clock In Now";
        mainClockBtn.className = "clock-action-btn primary-clock";
        quickClockBtnText.textContent = "Clock In";
        quickClockBtn.className = "primary-btn employee-only";
        clockElapsedTimer.textContent = "00h 00m 00s";
    }

    renderEmployeeAttendanceHistory();
}

function updateClockElapsed() {
    const session = getActiveClockSession();
    if (!session || !session.isClockedIn) return;

    const start = new Date(session.clockInTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, now - start);

    const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

    clockElapsedTimer.textContent = `${hours}h ${mins}m ${secs}s`;
}

function handleClockToggle() {
    const session = getActiveClockSession();
    const isClockedIn = !!(session && session.isClockedIn);
    const now = new Date();

    if (!isClockedIn) {
        // Clock In
        saveActiveClockSession({
            isClockedIn: true,
            clockInTime: now.toISOString()
        });
        showToast(`Clocked in at ${now.toLocaleTimeString("en-US", { hour12: true })}. Shift timer started!`, "success", "Shift Started");
    } else {
        // Clock Out
        const start = new Date(session.clockInTime);
        const durationMs = now.getTime() - start.getTime();
        const durationHrs = (durationMs / 3600000).toFixed(1);

        // Add to attendance log
        const attendanceList = loadAttendanceLogs();
        attendanceList.unshift({
            id: `ATT_${Date.now()}`,
            employeeId: currentUser.id,
            date: now.toISOString().split("T")[0],
            clockIn: start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
            clockOut: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
            hours: `${durationHrs} hrs`,
            status: "Present"
        });
        saveAttendanceLogs(attendanceList);

        saveActiveClockSession(null);
        showToast(`Clocked out successfully! Total session logged: ${durationHrs} hrs`, "info", "Shift Ended");
    }

    updateClockSessionUI();
}

mainClockBtn.addEventListener("click", handleClockToggle);
quickClockBtn.addEventListener("click", handleClockToggle);

function loadAttendanceLogs() {
    try {
        const saved = localStorage.getItem(ATTENDANCE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function saveAttendanceLogs(list) {
    try {
        localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(list));
    } catch {}
}

function renderEmployeeAttendanceHistory() {
    const allLogs = loadAttendanceLogs();
    const myLogs = allLogs.filter(item => item.employeeId === currentUser.id);

    empAttendanceTableBody.innerHTML = "";

    if (myLogs.length === 0) {
        empAttendanceTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No attendance records logged yet today. Use the "Clock In" button above to start your shift!
                </td>
            </tr>
        `;
        return;
    }

    myLogs.slice(0, 10).forEach(log => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${formatDate(log.date)}</strong></td>
            <td>${log.clockIn}</td>
            <td>${log.clockOut}</td>
            <td><span class="id-badge">${log.hours}</span></td>
            <td><span class="status ${log.status.toLowerCase()}">${log.status}</span></td>
        `;
        empAttendanceTableBody.appendChild(tr);
    });
}

// ==========================================================================
// 8. LEAVE MANAGEMENT SYSTEM (EMPLOYEE & ADMIN)
// ==========================================================================

function renderEmployeeLeaves() {
    const myLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id);
    const approvedDays = myLeaves
        .filter(l => l.status === "Approved")
        .reduce((sum, l) => sum + (Number(l.daysCount) || 1), 0);
    const pendingDays = myLeaves
        .filter(l => l.status === "Pending")
        .reduce((sum, l) => sum + (Number(l.daysCount) || 1), 0);

    const baseAllowance = 18;
    const remaining = Math.max(0, baseAllowance - approvedDays);

    empLeaveBalance.textContent = `${remaining} Days`;
    empLeaveUsed.textContent = `${approvedDays} Days`;
    empLeavePending.textContent = `${pendingDays} Days`;

    empLeavesTableBody.innerHTML = "";

    if (myLeaves.length === 0) {
        empLeavesTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No leave requests on record. Click "Apply for Time Off" to request absence.
                </td>
            </tr>
        `;
        return;
    }

    myLeaves.forEach(leave => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="department-badge">${leave.leaveType}</span></td>
            <td>${formatDate(leave.startDate)}</td>
            <td>${formatDate(leave.endDate)}</td>
            <td><strong>${leave.daysCount} Day(s)</strong></td>
            <td>${escapeHtml(leave.reason)}</td>
            <td><span class="status ${leave.status.toLowerCase()}">${leave.status}</span></td>
        `;
        empLeavesTableBody.appendChild(tr);
    });
}

function renderAdminLeaveApprovals() {
    const pendingCount = leaveRequests.filter(l => l.status === "Pending").length;
    pendingLeavesCount.textContent = pendingCount;
    pendingLeavesStatBadge.textContent = `${pendingCount} Pending`;
    adminLeaveCountBadge.textContent = `${leaveRequests.length} Total Requests`;

    if (pendingCount > 0) {
        pendingLeavesCountBadge.textContent = pendingCount;
        pendingLeavesCountBadge.classList.remove("hidden");
    } else {
        pendingLeavesCountBadge.classList.add("hidden");
    }

    adminLeavesTableBody.innerHTML = "";

    if (leaveRequests.length === 0) {
        adminLeavesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No employee leave requests submitted yet.
                </td>
            </tr>
        `;
        return;
    }

    leaveRequests.forEach(leave => {
        const tr = document.createElement("tr");
        const isPending = leave.status === "Pending";

        tr.innerHTML = `
            <td>
                <strong>${escapeHtml(leave.employeeName)}</strong>
                <small style="display:block; color: var(--text-muted);">${leave.employeeId}</small>
            </td>
            <td><span class="department-badge">${leave.leaveType}</span></td>
            <td>${formatDate(leave.startDate)} &rarr; ${formatDate(leave.endDate)}</td>
            <td><strong>${leave.daysCount} d</strong></td>
            <td>${escapeHtml(leave.reason)}</td>
            <td><span class="status ${leave.status.toLowerCase()}">${leave.status}</span></td>
            <td style="text-align: right;">
                ${isPending ? `
                    <div style="display: flex; gap: 6px; justify-content: flex-end;">
                        <button type="button" class="approve-btn" data-id="${leave.id}">Approve</button>
                        <button type="button" class="reject-btn" data-id="${leave.id}">Reject</button>
                    </div>
                ` : `
                    <span style="color: var(--text-muted); font-size: 11px;">Processed</span>
                `}
            </td>
        `;

        adminLeavesTableBody.appendChild(tr);
    });

    // Attach decision listeners
    adminLeavesTableBody.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            processLeaveDecision(id, "Approved");
        });
    });

    adminLeavesTableBody.querySelectorAll(".reject-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            processLeaveDecision(id, "Rejected");
        });
    });
}

function processLeaveDecision(leaveId, decision) {
    const leave = leaveRequests.find(l => l.id === leaveId);
    if (!leave) return;

    leave.status = decision;
    saveLeaveRequests();
    renderAdminLeaveApprovals();
    showToast(`${decision} leave request for ${leave.employeeName}.`, decision === "Approved" ? "success" : "info", "Leave Processed");
}

// Apply Leave Modal
function openApplyLeaveModal() {
    applyLeaveForm.reset();
    const today = new Date().toISOString().split("T")[0];
    leaveStartDate.value = today;
    leaveEndDate.value = today;
    updateDurationDisplay();
    applyLeaveModal.classList.remove("hidden");
}

function closeApplyLeaveModal() {
    applyLeaveModal.classList.add("hidden");
}

function updateDurationDisplay() {
    if (!leaveStartDate.value || !leaveEndDate.value) return;
    const start = new Date(leaveStartDate.value);
    const end = new Date(leaveEndDate.value);
    const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
    leaveDurationDisplay.value = `${diffDays} Day(s)`;
}

leaveStartDate.addEventListener("change", updateDurationDisplay);
leaveEndDate.addEventListener("change", updateDurationDisplay);

applyLeaveForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const start = leaveStartDate.value;
    const end = leaveEndDate.value;
    const reason = leaveReason.value.trim();
    const type = leaveTypeSelect.value;

    if (!start || !end || !reason) {
        showToast("Please fill in all required fields.", "error", "Incomplete Form");
        return;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    if (endDateObj < startDateObj) {
        showToast("End date cannot precede the start date.", "error", "Invalid Dates");
        return;
    }

    const daysCount = Math.max(1, Math.round((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1);

    const newRequest = {
        id: `LR_${Date.now()}`,
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        leaveType: type,
        startDate: start,
        endDate: end,
        daysCount,
        reason,
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0]
    };

    leaveRequests.unshift(newRequest);
    saveLeaveRequests();

    closeApplyLeaveModal();
    renderEmployeeLeaves();
    showToast(`Leave request for ${daysCount} day(s) submitted for HR approval!`, "success", "Request Submitted");
});

if (openApplyLeaveModalBtn) openApplyLeaveModalBtn.addEventListener("click", openApplyLeaveModal);
if (applyLeaveBtnHero) applyLeaveBtnHero.addEventListener("click", openApplyLeaveModal);
if (closeLeaveModalBtn) closeLeaveModalBtn.addEventListener("click", closeApplyLeaveModal);
if (cancelLeaveBtn) cancelLeaveBtn.addEventListener("click", closeApplyLeaveModal);

// ==========================================================================
// 9. PERSONAL TASK BOARD (EMPLOYEE PORTAL)
// ==========================================================================

function getTasksStorageKey() {
    return `peopleDesk_tasks_${currentUser.id}`;
}

function loadEmployeeTasks() {
    try {
        const saved = localStorage.getItem(getTasksStorageKey());
        if (saved) return JSON.parse(saved);
        return [
            { id: "T1", title: "Complete Q4 Self Performance Review", priority: "High", completed: false },
            { id: "T2", title: "Review department handbook updates", priority: "Normal", completed: true },
            { id: "T3", title: "Prepare weekly deliverables summary", priority: "Urgent", completed: false }
        ];
    } catch {
        return [];
    }
}

function saveEmployeeTasks(tasks) {
    try {
        localStorage.setItem(getTasksStorageKey(), JSON.stringify(tasks));
    } catch {}
}

function renderTasks() {
    const tasks = loadEmployeeTasks();
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const pendingCount = totalCount - completedCount;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    empTaskCount.textContent = `${pendingCount} Pending`;
    taskPercentBadge.textContent = `${percent}% Done`;
    taskProgressBar.style.width = `${percent}%`;

    const filteredTasks = tasks.filter(task => {
        if (currentTaskFilter === "pending") return !task.completed;
        if (currentTaskFilter === "completed") return task.completed;
        return true;
    });

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<li style="text-align: center; color: var(--text-muted); padding: 20px;">No tasks found in this view.</li>`;
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} aria-label="Mark task done">
            <span class="task-title">${escapeHtml(task.title)}</span>
            <span class="task-priority-tag ${task.priority.toLowerCase()}">${task.priority}</span>
            <button type="button" class="task-delete-btn" aria-label="Delete task">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Toggle Done
        li.querySelector(".task-checkbox").addEventListener("change", (e) => {
            task.completed = e.target.checked;
            saveEmployeeTasks(tasks);
            renderTasks();
        });

        // Delete Task
        li.querySelector(".task-delete-btn").addEventListener("click", () => {
            const updated = tasks.filter(t => t.id !== task.id);
            saveEmployeeTasks(updated);
            renderTasks();
            showToast("Task removed from your board.", "info", "Task Deleted");
        });

        taskList.appendChild(li);
    });
}

addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = newTaskInput.value.trim();
    if (!title) return;

    const tasks = loadEmployeeTasks();
    tasks.unshift({
        id: `T_${Date.now()}`,
        title,
        priority: taskPrioritySelect.value,
        completed: false
    });
    saveEmployeeTasks(tasks);
    newTaskInput.value = "";
    renderTasks();
    showToast("Added new task to your personal board.", "success", "Task Added");
});

document.querySelectorAll(".task-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".task-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTaskFilter = btn.getAttribute("data-filter");
        renderTasks();
    });
});

// ==========================================================================
// 10. TEAM DIRECTORY (READ-ONLY FOR EMPLOYEES)
// ==========================================================================

function renderTeamDirectory() {
    const query = teamSearchInput.value.trim().toLowerCase();

    const colleagues = employees.filter(emp => {
        const text = [emp.name, emp.id, emp.department, emp.jobTitle, emp.email].join(" ").toLowerCase();
        return !query || text.includes(query);
    });

    teamDirectoryTableBody.innerHTML = "";

    if (colleagues.length === 0) {
        teamDirectoryTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No team members match your search query.
                </td>
            </tr>
        `;
        return;
    }

    colleagues.forEach(emp => {
        const initials = getInitials(emp.name);
        const color = getAvatarColor(emp.name);
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <div class="employee-cell">
                    <div class="employee-avatar" style="background-color: ${color.bg}; color: ${color.text};">
                        ${initials}
                    </div>
                    <div class="employee-text">
                        <strong style="color: var(--text-primary);">${highlightMatch(emp.name, query)}</strong>
                        <span class="employee-joined">${emp.email}</span>
                    </div>
                </div>
            </td>
            <td><span class="id-cell">${emp.id}</span></td>
            <td><span class="department-badge">${emp.department}</span></td>
            <td>${emp.jobTitle}</td>
            <td>${emp.email}</td>
            <td><span class="status ${emp.status.toLowerCase()}">${emp.status}</span></td>
            <td style="text-align: right;">
                <button type="button" class="secondary-btn btn-sm view-profile-btn" data-id="${emp.id}">
                    View Profile
                </button>
            </td>
        `;

        teamDirectoryTableBody.appendChild(tr);
    });

    teamDirectoryTableBody.querySelectorAll(".view-profile-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            openProfileModal(id);
        });
    });
}

if (teamSearchInput) teamSearchInput.addEventListener("input", renderTeamDirectory);

// ==========================================================================
// 11. DASHBOARD METRICS & ANALYTICS (ADMIN)
// ==========================================================================

function updateDashboard() {
    const totalCount = employees.length;
    totalEmployeesEl.textContent = totalCount;
    headcountBadge.textContent = `${totalCount} Staff`;

    const deptMap = new Map();
    employees.forEach(emp => {
        const dept = emp.department.trim() || "Unassigned";
        deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
    });

    totalDepartmentsEl.textContent = deptMap.size;
    deptAnalyticsSummary.textContent = `${deptMap.size} Active Departments`;

    const activeCount = employees.filter(e => e.status === "Active").length;
    const inactiveCount = totalCount - activeCount;

    activeEmployeesEl.textContent = activeCount;
    inactiveEmployeesEl.textContent = inactiveCount;

    const activePercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
    activeRateBadge.textContent = `${activePercentage}% Active`;
    inactiveBadge.textContent = `${inactiveCount} Inactive`;

    renderDepartmentBreakdown(deptMap, totalCount);
}

function renderDepartmentBreakdown(deptMap, totalCount) {
    if (!departmentProgressBars) return;
    departmentProgressBars.innerHTML = "";

    if (totalCount === 0 || deptMap.size === 0) {
        departmentProgressBars.innerHTML = `<p class="table-note" style="grid-column: span 2;">No department data available.</p>`;
        return;
    }

    const sortedDepts = Array.from(deptMap.entries()).sort((a, b) => b[1] - a[1]);

    sortedDepts.forEach(([dept, count], index) => {
        const percent = Math.round((count / totalCount) * 100);
        const color = deptColorPalette[index % deptColorPalette.length];

        const item = document.createElement("div");
        item.className = "dept-item";
        item.innerHTML = `
            <div class="dept-info">
                <span class="dept-name">${dept}</span>
                <span class="dept-count">${count} (${percent}%)</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${percent}%; background-color: ${color};"></div>
            </div>
        `;
        departmentProgressBars.appendChild(item);
    });
}

function updateDepartmentFilter() {
    const currentSelected = departmentFilter.value;
    const uniqueDepartments = [
        ...new Set(employees.map(e => e.department.trim()).filter(Boolean))
    ].sort((a, b) => a.localeCompare(b));

    departmentFilter.innerHTML = `<option value="">All Departments</option>`;
    uniqueDepartments.forEach(dept => {
        const option = document.createElement("option");
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });

    if (uniqueDepartments.includes(currentSelected)) {
        departmentFilter.value = currentSelected;
    }
}

// ==========================================================================
// 12. EMPLOYEE DIRECTORY TABLE (ADMIN)
// ==========================================================================

function getFilteredEmployees() {
    const query = searchInput.value.trim().toLowerCase();
    const dept = departmentFilter.value;
    const status = statusFilter.value;

    return employees.filter(emp => {
        const searchable = [
            emp.name,
            emp.id,
            emp.department,
            emp.jobTitle,
            emp.email,
            emp.phone || ""
        ].join(" ").toLowerCase();

        return (!query || searchable.includes(query)) &&
               (!dept || emp.department === dept) &&
               (!status || emp.status === status);
    });
}

function getSortedEmployees(list) {
    if (!currentSortColumn) return list;

    return [...list].sort((a, b) => {
        let valA = (a[currentSortColumn] || "").toString().toLowerCase();
        let valB = (b[currentSortColumn] || "").toString().toLowerCase();
        let cmp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
        return currentSortDirection === "asc" ? cmp : -cmp;
    });
}

function highlightMatch(text, query) {
    if (!query || !text) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp(`(${escapeRegex(escapedQuery)})`, "gi");
    return escapedText.replace(regex, `<mark class="search-highlight">$1</mark>`);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
}

function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("") || "EP";
}

function renderEmployees() {
    const rawFiltered = getFilteredEmployees();
    const sorted = getSortedEmployees(rawFiltered);
    const totalFiltered = sorted.length;
    const query = searchInput.value.trim().toLowerCase();

    clearSearchBtn.classList.toggle("hidden", query.length === 0);
    const hasActiveFilters = query.length > 0 || departmentFilter.value !== "" || statusFilter.value !== "";
    resetFiltersBtn.classList.toggle("hidden", !hasActiveFilters);

    employeeCountEl.textContent = `${totalFiltered} of ${employees.length} record${employees.length === 1 ? "" : "s"}`;
    filterSummaryNote.textContent = hasActiveFilters ? `Filtered records (${totalFiltered} found)` : "Showing all records";

    const limit = pageSize === "all" ? totalFiltered : parseInt(pageSize, 10);
    const totalPages = pageSize === "all" ? 1 : Math.max(1, Math.ceil(totalFiltered / limit));

    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = pageSize === "all" ? 0 : (currentPage - 1) * limit;
    const endIndex = pageSize === "all" ? totalFiltered : Math.min(startIndex + limit, totalFiltered);
    const pagedRecords = sorted.slice(startIndex, endIndex);

    employeeTableBody.innerHTML = "";

    if (totalFiltered === 0) {
        emptyState.classList.remove("hidden");
        document.querySelector(".table-scroll").classList.add("hidden");
        paginationButtons.innerHTML = "";
        paginationInfo.textContent = "Showing 0 of 0 entries";
        return;
    }

    emptyState.classList.add("hidden");
    document.querySelector(".table-scroll").classList.remove("hidden");

    pagedRecords.forEach(emp => {
        const tr = document.createElement("tr");
        const initials = getInitials(emp.name);
        const color = getAvatarColor(emp.name);

        tr.innerHTML = `
            <td>
                <div class="employee-cell">
                    <div class="employee-avatar" style="background-color: ${color.bg}; color: ${color.text};">
                        ${initials}
                    </div>
                    <div class="employee-text">
                        <span class="employee-name" title="Click to view full profile" data-id="${emp.id}">
                            ${highlightMatch(emp.name, query)}
                        </span>
                        <span class="employee-joined">
                            ${emp.joinDate ? `Joined ${formatDate(emp.joinDate)}` : "Staff Member"}
                        </span>
                    </div>
                </div>
            </td>
            <td><span class="id-cell">${highlightMatch(emp.id, query)}</span></td>
            <td><span class="department-badge">${highlightMatch(emp.department, query)}</span></td>
            <td><span>${highlightMatch(emp.jobTitle, query)}</span></td>
            <td><span class="employee-email">${highlightMatch(emp.email, query)}</span></td>
            <td><span class="status ${emp.status.toLowerCase()}">${emp.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button type="button" class="table-action-btn view-btn" data-id="${emp.id}" title="View Profile" aria-label="View ${emp.name}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button type="button" class="table-action-btn edit-btn" data-id="${emp.id}" title="Edit Record" aria-label="Edit ${emp.name}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button type="button" class="table-action-btn delete delete-btn" data-id="${emp.id}" title="Delete Record" aria-label="Delete ${emp.name}">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;

        employeeTableBody.appendChild(tr);
    });

    attachRowEventListeners();

    paginationInfo.textContent = totalFiltered > 0
        ? `Showing ${startIndex + 1} to ${endIndex} of ${totalFiltered} entries`
        : "Showing 0 of 0 entries";

    renderPaginationControls(totalPages);
    updateSortIndicators();
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
    } catch {}
    return dateStr;
}

function attachRowEventListeners() {
    document.querySelectorAll(".view-btn, .employee-name").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            openProfileModal(id);
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            openEditForm(id);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            openDeleteConfirmModal(id);
        });
    });
}

function renderPaginationControls(totalPages) {
    paginationButtons.innerHTML = "";
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "page-btn";
    prevBtn.disabled = currentPage === 1;
    prevBtn.innerHTML = `&lsaquo;`;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderEmployees();
        }
    });
    paginationButtons.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7) {
            if (i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 2) {
                if (i === 2 || i === totalPages - 1) {
                    const dots = document.createElement("span");
                    dots.className = "page-btn";
                    dots.style.border = "none";
                    dots.style.background = "transparent";
                    dots.textContent = "...";
                    paginationButtons.appendChild(dots);
                }
                continue;
            }
        }

        const pageBtn = document.createElement("button");
        pageBtn.type = "button";
        pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderEmployees();
        });
        paginationButtons.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "page-btn";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.innerHTML = `&rsaquo;`;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderEmployees();
        }
    });
    paginationButtons.appendChild(nextBtn);
}

function initTableSorting() {
    document.querySelectorAll("th.sortable").forEach(th => {
        th.addEventListener("click", () => {
            const col = th.getAttribute("data-sort");
            if (currentSortColumn === col) {
                currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
            } else {
                currentSortColumn = col;
                currentSortDirection = "asc";
            }
            renderEmployees();
        });
    });
}

function updateSortIndicators() {
    document.querySelectorAll("th.sortable").forEach(th => {
        const col = th.getAttribute("data-sort");
        const indicator = th.querySelector(".sort-indicator");

        th.classList.remove("sorted-asc", "sorted-desc");

        if (col === currentSortColumn) {
            th.classList.add(currentSortDirection === "asc" ? "sorted-asc" : "sorted-desc");
            indicator.textContent = currentSortDirection === "asc" ? "▲" : "▼";
        } else {
            indicator.textContent = "↕";
        }
    });
}

// ==========================================================================
// 13. FORM ACTIONS (ADD & EDIT EMPLOYEE)
// ==========================================================================

function clearFieldErrors() {
    nameError.textContent = "";
    idError.textContent = "";
    departmentError.textContent = "";
    jobTitleError.textContent = "";
    emailError.textContent = "";
    formMessage.textContent = "";
}

function openAddForm() {
    employeeForm.reset();
    clearFieldErrors();
    editingEmployeeIdInput.value = "";
    employeeIdInput.disabled = false;
    formTitle.textContent = "Add New Employee";
    formSubtitle.textContent = "Enter employee records to enroll into PeopleDesk.";
    employeeJoinDateInput.value = new Date().toISOString().split("T")[0];
    employeeModal.classList.remove("hidden");
    setTimeout(() => employeeNameInput.focus(), 100);
}

function openEditForm(id) {
    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    employeeForm.reset();
    clearFieldErrors();
    editingEmployeeIdInput.value = employee.id;
    employeeNameInput.value = employee.name;
    employeeIdInput.value = employee.id;
    employeeDepartmentInput.value = employee.department;
    employeeJobTitleInput.value = employee.jobTitle;
    employeeEmailInput.value = employee.email;
    employeePhoneInput.value = employee.phone || "";
    employeeJoinDateInput.value = employee.joinDate || "";
    employeeStatusInput.value = employee.status;
    employeeIdInput.disabled = true;

    formTitle.textContent = "Edit Employee";
    formSubtitle.textContent = `Update employee information for ${employee.name}.`;
    employeeModal.classList.remove("hidden");
    setTimeout(() => employeeNameInput.focus(), 100);
}

function closeEmployeeForm() {
    employeeForm.reset();
    clearFieldErrors();
    editingEmployeeIdInput.value = "";
    employeeIdInput.disabled = false;
    employeeModal.classList.add("hidden");
}

employeeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFieldErrors();

    const editingId = editingEmployeeIdInput.value;
    const name = employeeNameInput.value.trim();
    const id = employeeIdInput.value.trim().toUpperCase();
    const department = employeeDepartmentInput.value.trim();
    const jobTitle = employeeJobTitleInput.value.trim();
    const email = employeeEmailInput.value.trim();
    const phone = employeePhoneInput.value.trim();
    const joinDate = employeeJoinDateInput.value.trim();
    const status = employeeStatusInput.value;

    let hasError = false;

    if (!name || name.length < 2) {
        nameError.textContent = "Please enter a valid full name (min 2 characters).";
        hasError = true;
    }

    if (!id || id.length < 2) {
        idError.textContent = "Please enter a valid ID (e.g. EMP009).";
        hasError = true;
    } else {
        const idDuplicate = employees.some(emp =>
            emp.id.toLowerCase() === id.toLowerCase() && emp.id !== editingId
        );
        if (idDuplicate) {
            idError.textContent = "This Employee ID is already in use.";
            hasError = true;
        }
    }

    if (!department) {
        departmentError.textContent = "Department is required.";
        hasError = true;
    }

    if (!jobTitle) {
        jobTitleError.textContent = "Job title is required.";
        hasError = true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        hasError = true;
    } else {
        const emailDuplicate = employees.some(emp =>
            emp.email.toLowerCase() === email.toLowerCase() && emp.id !== editingId
        );
        if (emailDuplicate) {
            emailError.textContent = "Email address is already assigned to another employee.";
            hasError = true;
        }
    }

    if (hasError) return;

    const record = { id, name, department, jobTitle, email, phone, joinDate, status };

    if (editingId) {
        const index = employees.findIndex(emp => emp.id === editingId);
        if (index === -1) {
            formMessage.textContent = "Record not found. Please refresh.";
            return;
        }
        employees[index] = record;
        if (!saveEmployees()) return;
        showToast(`Updated record for ${name}`, "success", "Employee Updated");
    } else {
        employees.unshift(record);
        if (!saveEmployees()) return;
        showToast(`Added ${name} to directory`, "success", "Employee Added");
    }

    closeEmployeeForm();
    updateDashboard();
    updateDepartmentFilter();
    renderEmployees();
});

[employeeNameInput, employeeIdInput, employeeDepartmentInput, employeeJobTitleInput, employeeEmailInput].forEach(inp => {
    inp.addEventListener("input", clearFieldErrors);
});

closeFormBtn.addEventListener("click", closeEmployeeForm);
cancelFormBtn.addEventListener("click", closeEmployeeForm);
addEmployeeBtn.addEventListener("click", openAddForm);
emptyAddBtn.addEventListener("click", openAddForm);

// ==========================================================================
// 14. VIEW PROFILE & DELETE MODALS
// ==========================================================================

function openProfileModal(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    const initials = getInitials(emp.name);
    const color = getAvatarColor(emp.name);

    profileModalAvatar.textContent = initials;
    profileModalAvatar.style.backgroundColor = color.bg;
    profileModalAvatar.style.color = color.text;

    profileModalName.textContent = emp.name;
    profileModalRole.textContent = emp.jobTitle;
    profileModalStatusBadge.className = `status ${emp.status.toLowerCase()}`;
    profileModalStatusBadge.textContent = emp.status;
    profileModalIdBadge.textContent = emp.id;
    profileModalDepartment.textContent = emp.department;
    profileModalEmail.textContent = emp.email;
    profileModalPhone.textContent = emp.phone || "Not provided";
    profileModalJoinDate.textContent = emp.joinDate ? formatDate(emp.joinDate) : "Not recorded";

    const isAdmin = currentUser.role === "admin";
    profileEditBtn.classList.toggle("hidden", !isAdmin);
    profileDeleteBtn.classList.toggle("hidden", !isAdmin);

    profileEditBtn.onclick = () => {
        closeProfileModal();
        openEditForm(emp.id);
    };

    profileDeleteBtn.onclick = () => {
        closeProfileModal();
        openDeleteConfirmModal(emp.id);
    };

    viewProfileModal.classList.remove("hidden");
}

function closeProfileModal() {
    viewProfileModal.classList.add("hidden");
}

closeProfileModalBtn.addEventListener("click", closeProfileModal);
profileCloseBtn.addEventListener("click", closeProfileModal);

function openDeleteConfirmModal(id) {
    pendingDeleteId = id;
    if (id === "RESET_ALL") {
        deleteModalMessage.innerHTML = "Restore the initial sample employees? Any custom changes made will be reset.";
    } else {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;
        deleteModalMessage.innerHTML = `Are you sure you want to delete <strong>${emp.name}</strong> (${emp.id})? This action cannot be undone.`;
    }
    deleteConfirmModal.classList.remove("hidden");
}

function closeDeleteConfirmModal() {
    pendingDeleteId = null;
    deleteConfirmModal.classList.add("hidden");
}

confirmDeleteBtn.addEventListener("click", () => {
    if (!pendingDeleteId) return;

    if (pendingDeleteId === "RESET_ALL") {
        resetToSampleData();
        closeDeleteConfirmModal();
        return;
    }

    const emp = employees.find(e => e.id === pendingDeleteId);
    const empName = emp ? emp.name : "Employee";

    employees = employees.filter(e => e.id !== pendingDeleteId);
    saveEmployees();

    closeDeleteConfirmModal();
    updateDashboard();
    updateDepartmentFilter();
    renderEmployees();

    showToast(`Deleted ${empName} from the database.`, "info", "Record Removed");
});

cancelDeleteBtn.addEventListener("click", closeDeleteConfirmModal);

// ==========================================================================
// 15. CSV EXPORT & SAMPLE DATA RESET
// ==========================================================================

function exportToCsv() {
    const rawList = getFilteredEmployees();
    if (rawList.length === 0) {
        showToast("No employee records to export.", "error", "Export Failed");
        return;
    }

    const headers = ["Employee ID", "Full Name", "Department", "Job Title", "Email", "Phone", "Joining Date", "Status"];
    const rows = rawList.map(e => [
        `"${e.id}"`,
        `"${e.name.replace(/"/g, '""')}"`,
        `"${e.department.replace(/"/g, '""')}"`,
        `"${e.jobTitle.replace(/"/g, '""')}"`,
        `"${e.email.replace(/"/g, '""')}"`,
        `"${(e.phone || "").replace(/"/g, '""')}"`,
        `"${e.joinDate || ""}"`,
        `"${e.status}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `PeopleDesk_Employees_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Exported ${rawList.length} employee records to CSV`, "success", "Export Complete");
}

exportCsvBtn.addEventListener("click", exportToCsv);

function resetToSampleData() {
    employees = initialSampleEmployees.map(e => ({ ...e }));
    leaveRequests = initialSampleLeaves.map(l => ({ ...l }));
    saveEmployees();
    saveLeaveRequests();
    updateDashboard();
    updateDepartmentFilter();
    currentPage = 1;
    renderEmployees();
    renderAdminLeaveApprovals();
    showToast("Restored default sample employees and leave requests.", "info", "Sample Data Loaded");
}

resetDataBtn.addEventListener("click", () => {
    openDeleteConfirmModal("RESET_ALL");
});

// ==========================================================================
// 16. SEARCH, FILTERS & GLOBAL SHORTCUTS
// ==========================================================================

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderEmployees();
});

clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    currentPage = 1;
    renderEmployees();
    searchInput.focus();
});

departmentFilter.addEventListener("change", () => {
    currentPage = 1;
    renderEmployees();
});

statusFilter.addEventListener("change", () => {
    currentPage = 1;
    renderEmployees();
});

function resetFilters() {
    searchInput.value = "";
    departmentFilter.value = "";
    statusFilter.value = "";
    currentPage = 1;
    renderEmployees();
}

resetFiltersBtn.addEventListener("click", resetFilters);
emptyClearFiltersBtn.addEventListener("click", resetFilters);

pageSizeSelect.addEventListener("change", (e) => {
    pageSize = e.target.value;
    currentPage = 1;
    renderEmployees();
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeEmployeeForm();
        closeProfileModal();
        closeDeleteConfirmModal();
        closeAuthModal();
        closeApplyLeaveModal();
        closeSidebar();
    }
});

[employeeModal, viewProfileModal, deleteConfirmModal, authModal, applyLeaveModal].forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
            if (modal === deleteConfirmModal) pendingDeleteId = null;
        }
    });
});

// Mobile Sidebar
function openSidebar() {
    sidebar.classList.add("open");
    sidebarBackdrop.classList.add("active");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("active");
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

// Navigation Links Smooth Handling
document.querySelectorAll(".navigation .nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
        const view = link.getAttribute("data-view");
        document.querySelectorAll(".navigation .nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        closeSidebar();
    });
});

// Brand Logo click resets view
brandLogo.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentUser.role === "admin") {
        setActiveNavLink("dashboard");
    } else {
        setActiveNavLink("employeeWorkspace");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==========================================================================
// 17. APPLICATION INITIALIZATION
// ==========================================================================

function initializeApp() {
    initTheme();
    initTableSorting();
    applyUserRole();
}

initializeApp();
