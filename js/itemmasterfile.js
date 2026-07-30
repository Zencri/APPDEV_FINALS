const API_BASE_URL = "http://127.0.0.1:8000/api";

let allItems = [];
let allCategories = [];

document.addEventListener("DOMContentLoaded", () => {
    const itemsGrid = document.getElementById("itemsGrid");
    const itemsSummary = document.getElementById("itemsSummary");
    const itemSearch = document.getElementById("itemSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const resetFilters = document.getElementById("resetFilters");

    function getStatusBadge(status) {
        if (status === "Available") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
        if (status === "Borrowed") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        if (status === "Maintenance") return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }

    function populateCategories() {
        categoryFilter.innerHTML = `<option value="">All Categories</option>`;
        allCategories.forEach(cat => {
            categoryFilter.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });
    }

    const isAdmin = localStorage.getItem("is_admin");

    function renderItems(items) {
        if (!items.length) {
            itemsGrid.innerHTML = `<div class="col-span-full py-10 text-center text-sm text-slate-500">No items found matching your criteria.</div>`;
            itemsSummary.innerHTML = `Showing <span class="font-semibold">0</span> items`;
            return;
        }

        itemsGrid.innerHTML = items.map(item => {
            const imageUrl = item.image
                ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`)
                : null;
            const photoHtml = imageUrl
                ? `<img src="${imageUrl}" alt="${item.name}" class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />`
                : `<div class="h-48 w-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"><span class="material-symbols-outlined text-6xl text-blue-200 dark:text-slate-600">inventory_2</span></div>`;

            let actionHtml = '';
            if (isAdmin === "false" && item.status === "Available") {
                actionHtml = `<div class="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800"><button type="button" class="btn-borrow w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-semibold transition-colors" data-id="${item.id}" data-name="${item.name}">Request to Borrow</button></div>`;
            }

            return `
                <div class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md shadow-black/5 dark:shadow-[0_8px_24px_rgb(0,0,0,0.35)] hover:shadow-xl dark:hover:shadow-[0_16px_40px_rgb(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                    <div class="relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
                        ${photoHtml}
                        <div class="absolute top-3 right-3">
                            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${getStatusBadge(item.status)}">
                                ${item.status}
                            </span>
                        </div>
                    </div>
                    <div class="p-5 flex-1 flex flex-col">
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-primary">${item.category_name}</span>
                            <span class="text-[10px] font-semibold text-slate-400">Cond: ${item.condition}</span>
                        </div>
                        <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 leading-tight">${item.name}</h3>
                        <p class="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">${item.description || "No description available."}</p>
                        ${actionHtml}
                    </div>
                </div>
            `;
        }).join("");

        itemsSummary.innerHTML = `Showing <span class="font-semibold">${items.length}</span> item${items.length > 1 ? "s" : ""}`;

        // Attach borrow listeners
        document.querySelectorAll(".btn-borrow").forEach(btn => {
            btn.addEventListener("click", () => openBorrowModal(btn.dataset.id, btn.dataset.name));
        });
    }

    // Modal Logic
    const borrowModal = document.getElementById("borrowModal");
    const borrowForm = document.getElementById("borrowForm");

    function openBorrowModal(id, name) {
        document.getElementById("borrowItemId").value = id;
        document.getElementById("borrowItemName").textContent = name;
        borrowModal.classList.remove("hidden");
    }

    function closeBorrowModal() {
        borrowModal.classList.add("hidden");
        borrowForm.reset();
    }

    document.getElementById("closeBorrowModal").addEventListener("click", closeBorrowModal);
    document.getElementById("cancelBorrow").addEventListener("click", closeBorrowModal);
    document.getElementById("borrowModalOverlay").addEventListener("click", closeBorrowModal);

    borrowForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById("submitBorrow");
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        const payload = {
            item: parseInt(document.getElementById("borrowItemId").value),
            expected_return_date: document.getElementById("expectedReturnDate").value,
            remarks: document.getElementById("borrowRemarks").value
        };

        try {
            const res = await fetch(`${API_BASE_URL}/borrowings/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to submit request");
            
            window.showToast("Borrowing request submitted successfully! Pending admin approval.");
            closeBorrowModal();
            loadData(); // refresh to show updated state if needed
        } catch (error) {
            console.error(error);
            window.showToast("Error submitting request.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Request";
        }
    });

    function applyFilters() {
        const searchValue = itemSearch.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedStatus = statusFilter.value;

        const filtered = allItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchValue) || 
                                  (item.category_name && item.category_name.toLowerCase().includes(searchValue));
            const matchesCat = !selectedCategory || item.category_name === selectedCategory;
            const matchesStat = !selectedStatus || item.status === selectedStatus;
            return matchesSearch && matchesCat && matchesStat;
        });
        renderItems(filtered);
    }

    async function loadData() {
        try {
            const [itemsRes, catsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/items/`),
                fetch(`${API_BASE_URL}/categories/`)
            ]);
            
            if (!itemsRes.ok || !catsRes.ok) throw new Error("Failed to fetch data");
            
            allItems = await itemsRes.json();
            allCategories = await catsRes.json();
            
            populateCategories();
            applyFilters();
        } catch (error) {
            console.error(error);
            itemsGrid.innerHTML = `<div class="col-span-full py-10 text-center text-sm text-red-500">Failed to load catalog. Please try again.</div>`;
        }
    }

    itemSearch.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    resetFilters.addEventListener("click", () => {
        itemSearch.value = ""; categoryFilter.value = ""; statusFilter.value = ""; applyFilters();
    });

    loadData();
});
