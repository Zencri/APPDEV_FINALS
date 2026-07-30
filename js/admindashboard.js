const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    // Check if we are on the dashboard page specifically
    const isDashboardPage = document.getElementById("statTotalItems") !== null;

    if (isDashboardPage) {
        loadDashboardData();
    }
});

async function loadDashboardData() {
    try {
        const [itemsRes, reqsRes, stuRes, empRes] = await Promise.all([
            fetch(`${API_BASE_URL}/items/`),
            fetch(`${API_BASE_URL}/borrowings/`),
            fetch(`${API_BASE_URL}/students/`),
            fetch(`${API_BASE_URL}/employees/`)
        ]);

        if (!itemsRes.ok || !reqsRes.ok || !stuRes.ok || !empRes.ok) {
            throw new Error("Failed to fetch dashboard data");
        }

        const items = await itemsRes.json();
        const requests = await reqsRes.json();
        const students = await stuRes.json();
        const employees = await empRes.json();

        updateDashboardStats(items, requests, students, employees);
        renderRecentItems(items);
    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

function updateDashboardStats(items, requests, students, employees) {
    // Items stats
    const totalItems = items.length;
    const available = items.filter(i => i.status === "Available").length;
    const borrowed = items.filter(i => i.status === "Borrowed").length;
    const maintenance = items.filter(i => i.status === "Maintenance").length;

    document.getElementById("statTotalItems").textContent = totalItems;
    document.getElementById("statAvailable").textContent = `${available} Available`;
    document.getElementById("statBorrowed").textContent = `${borrowed} Borrowed`;
    document.getElementById("statMaintenance").textContent = `${maintenance} Maintenance`;

    // Bar chart width calculations
    if (totalItems > 0) {
        document.getElementById("barAvailable").style.width = `${(available / totalItems) * 100}%`;
        document.getElementById("barBorrowed").style.width = `${(borrowed / totalItems) * 100}%`;
        document.getElementById("barMaintenance").style.width = `${(maintenance / totalItems) * 100}%`;
    }

    // Requests stats
    const pendingRequests = requests.filter(r => r.status === "Pending").length;
    document.getElementById("statPendingRequests").textContent = pendingRequests;

    // Overdue stats
    const today = new Date();
    today.setHours(0,0,0,0);
    const overdue = requests.filter(r => {
        if (r.status !== "Approved") return false;
        const expectedDate = new Date(r.expected_return_date);
        return expectedDate < today;
    }).length;
    document.getElementById("statOverdue").textContent = overdue;

    // Users
    const totalUsers = students.length + employees.length;
    document.getElementById("statTotalUsers").textContent = totalUsers;
}

function getStatusBadge(status) {
    if (status === "Available") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    if (status === "Borrowed") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    if (status === "Maintenance") return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
}

function renderRecentItems(items) {
    const tbody = document.getElementById("recentItemsTableBody");
    
    // Sort items by ID descending to get newest first, take top 5
    const recent = [...items].sort((a, b) => b.id - a.id).slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">No items found.</td></tr>`;
        return;
    }

    tbody.innerHTML = recent.map(item => {
        const imageUrl = item.image
            ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`)
            : null;
        const photoHtml = imageUrl
            ? `<img src="${imageUrl}" alt="${item.name}" class="h-11 w-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0" />`
            : `<div class="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center border border-blue-100 dark:border-blue-900/30 flex-shrink-0"><span class="material-symbols-outlined text-[20px]">inventory_2</span></div>`;

        return `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="px-6 py-3.5">
                    <div class="flex items-center gap-3">
                        ${photoHtml}
                        <p class="font-bold text-sm text-slate-900 dark:text-slate-100">${item.name}</p>
                    </div>
                </td>
                <td class="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-400">
                    ${item.category_name || '—'}
                </td>
                <td class="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-400">
                    ${item.condition}
                </td>
                <td class="px-6 py-3.5">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(item.status)}">
                        ${item.status}
                    </span>
                </td>
                <td class="px-6 py-3.5 text-right text-xs text-slate-400 font-medium">
                    New
                </td>
            </tr>
        `;
    }).join("");
}


// Sidebar toggles are handled by shared.js

