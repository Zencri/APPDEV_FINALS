const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("myBorrowingsTable");
    const statusFilter = document.getElementById("statusFilter");
    
    // In our simplified demo auth, 'user' is the username mapped to Juan Miguel Dela Cruz
    const currentUsername = localStorage.getItem("username") || "user";

    let allBorrowings = [];

    function getStatusBadge(status) {
        if (!status) return "";
        if (status === "Pending") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        if (status === "Approved") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
        if (status === "Active") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        if (status === "Returned") return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
        if (status === "Rejected") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }

    function formatDate(dateStr) {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function renderTable(borrowings) {
        if (borrowings.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-500">No borrowing records found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = borrowings.map(record => {
            const statusName = typeof record.status === 'object' ? record.status.status_name : record.status;
            const imageUrl = record.item_image
                ? (record.item_image.startsWith('http') ? record.item_image : `http://127.0.0.1:8000${record.item_image}`)
                : null;

            const photoHtml = imageUrl
                ? `<img src="${imageUrl}" alt="${record.item_name}" class="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />`
                : `<div class="h-10 w-10 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center"><span class="material-symbols-outlined text-xl text-blue-200 dark:text-slate-600">inventory_2</span></div>`;

            return `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            ${photoHtml}
                            <div>
                                <p class="font-bold text-slate-900 dark:text-slate-100">${record.item_name}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">${formatDate(record.borrow_date)}</td>
                    <td class="px-6 py-4">${formatDate(record.expected_return_date)}</td>
                    <td class="px-6 py-4">${formatDate(record.actual_return_date)}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(statusName)}">
                            ${statusName || 'Unknown'}
                        </span>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function applyFilter() {
        const filterVal = statusFilter.value;
        if (!filterVal) {
            renderTable(allBorrowings);
        } else {
            const filtered = allBorrowings.filter(b => {
                const statusName = typeof b.status === 'object' ? b.status.status_name : b.status;
                return statusName === filterVal;
            });
            renderTable(filtered);
        }
    }

    statusFilter.addEventListener("change", applyFilter);

    async function loadBorrowings() {
        try {
            const res = await fetch(`${API_BASE_URL}/borrowings/`);
            if (!res.ok) throw new Error("Failed to fetch borrowings");
            
            const data = await res.json();
            
            // Filter by the currently logged-in pseudo user's mapped student name
            // In a real app this would be filtered by the backend based on auth token
            const mappedName = currentUsername === "user" ? "Juan Miguel Dela Cruz" : currentUsername;
            allBorrowings = data.filter(b => b.borrower_name === mappedName);
            
            applyFilter();
        } catch (error) {
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-red-500">Failed to load borrowing history.</td></tr>`;
        }
    }

    loadBorrowings();
});
