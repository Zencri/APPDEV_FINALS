const API_BASE_URL = "http://127.0.0.1:8000/api";

let allRequests = [];
let allItems = [];
let allStudents = [];
let allEmployees = [];

document.addEventListener("DOMContentLoaded", () => {
    const requestsTableBody = document.getElementById("requestsTableBody");
    const requestsSummary = document.getElementById("requestsSummary");
    const requestSearch = document.getElementById("requestSearch");
    const statusFilter = document.getElementById("statusFilter");
    const resetFilters = document.getElementById("resetFilters");

    const openAddRequestModal = document.getElementById("openAddRequestModal");
    const addRequestModal = document.getElementById("addRequestModal");
    const closeAddRequestModal = document.getElementById("closeAddRequestModal");
    const cancelAddRequest = document.getElementById("cancelAddRequest");
    const addRequestForm = document.getElementById("addRequestForm");
    const addRequestMessage = document.getElementById("addRequestMessage");
    const saveRequestButton = document.getElementById("saveRequestButton");

    const borrowerTypeSelect = document.getElementById("borrower_type");
    const borrowerIdSelect = document.getElementById("borrower_id");
    const itemIdSelect = document.getElementById("item_id");

    function getStatusBadge(status) {
        if (status === "Pending") return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
        if (status === "Approved") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        if (status === "Returned") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
        if (status === "Overdue") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        if (status === "Rejected") return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }

    function showFormMessage(container, message, type = "success") {
        container.className = "rounded-lg px-4 py-3 text-sm";
        container.classList.remove("hidden");
        if (type === "error") {
            container.classList.add("bg-red-100", "text-red-700", "border", "border-red-200");
        } else {
            container.classList.add("bg-emerald-100", "text-emerald-700", "border", "border-emerald-200");
        }
        container.textContent = message;
    }

    function clearFormMessage(container) {
        container.classList.add("hidden");
        container.textContent = "";
    }

    function openModal(modal, msgContainer) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        if (msgContainer) clearFormMessage(msgContainer);
    }
    
    function closeModal(modal, form, msgContainer) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        if (form) form.reset();
        if (msgContainer) clearFormMessage(msgContainer);
    }

    function populateBorrowerSelect() {
        const type = borrowerTypeSelect.value;
        borrowerIdSelect.innerHTML = `<option value="">Select borrower</option>`;
        
        if (!type) {
            borrowerIdSelect.disabled = true;
            borrowerIdSelect.innerHTML = `<option value="">Select type first</option>`;
            return;
        }

        borrowerIdSelect.disabled = false;
        
        if (type === "student") {
            allStudents.forEach(s => {
                borrowerIdSelect.innerHTML += `<option value="${s.id}">${s.student_number} - ${s.last_name}, ${s.first_name}</option>`;
            });
        } else {
            allEmployees.forEach(e => {
                borrowerIdSelect.innerHTML += `<option value="${e.id}">${e.employee_number} - ${e.last_name}, ${e.first_name}</option>`;
            });
        }
    }

    function populateItemSelect() {
        itemIdSelect.innerHTML = `<option value="">Select available item</option>`;
        const availableItems = allItems.filter(i => i.status === "Available");
        availableItems.forEach(i => {
            itemIdSelect.innerHTML += `<option value="${i.id}">${i.name} (${i.category_name})</option>`;
        });
    }

    function renderRequests(requests) {
        if (!requests.length) {
            requestsTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">No requests found.</td></tr>`;
            requestsSummary.innerHTML = `Showing <span class="font-semibold">0</span> requests`;
            return;
        }

        requestsTableBody.innerHTML = requests.map(req => {
            const photoHtml = req.item_image
                ? `<img src="${req.item_image}" alt="${req.item_name}" class="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />`
                : `<div class="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20"><span class="material-symbols-outlined text-lg">inventory_2</span></div>`;

            let actionsHtml = "";
            if (req.status === "Pending") {
                actionsHtml = `
                    <button class="approve-btn px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors" data-id="${req.id}">Approve</button>
                    <button class="reject-btn px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors" data-id="${req.id}">Reject</button>
                `;
            } else if (req.status === "Approved") {
                actionsHtml = `<span class="text-xs text-slate-400">See Returns tab</span>`;
            } else {
                actionsHtml = `<span class="text-xs text-slate-400">Closed</span>`;
            }

            return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            ${photoHtml}
                            <p class="font-bold text-slate-900 dark:text-slate-100">${req.item_name}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        ${req.borrower_name}
                        ${req.student ? '<span class="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-1 text-slate-500">Student</span>' : '<span class="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-1 text-slate-500">Employee</span>'}
                    </td>
                    <td class="px-6 py-4">
                        <p class="text-xs text-slate-500">Req: ${req.borrow_date}</p>
                        <p class="text-xs font-medium text-slate-700 dark:text-slate-300">Due: ${req.expected_return_date}</p>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(req.status)}">
                            ${req.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2 items-center">
                            ${actionsHtml}
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        requestsSummary.innerHTML = `Showing <span class="font-semibold">${requests.length}</span> request${requests.length > 1 ? "s" : ""}`;
        
        bindActionButtons();
    }

    function bindActionButtons() {
        document.querySelectorAll(".approve-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await updateRequestStatus(id, "Approved");
            });
        });
        document.querySelectorAll(".reject-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await updateRequestStatus(id, "Rejected");
            });
        });
    }

    async function updateRequestStatus(id, newStatus) {
        try {
            const reqData = allRequests.find(r => String(r.id) === String(id));
            if (!reqData) return;

            const response = await fetch(`${API_BASE_URL}/borrowings/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error("Failed to update status");
            
            // If approved, we should also update the Item status to "Borrowed"
            if (newStatus === "Approved") {
                await fetch(`${API_BASE_URL}/items/${reqData.item}/`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Borrowed" })
                });
            }

            await loadData();
        } catch (error) {
            console.error("Error updating status:", error);
            window.showToast("Error updating status.", "error");
        }
    }

    function applyFilters() {
        const searchValue = requestSearch.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;

        const filtered = allRequests.filter(req => {
            const matchesSearch = req.item_name.toLowerCase().includes(searchValue) || 
                                  req.borrower_name.toLowerCase().includes(searchValue);
            const matchesStat = !selectedStatus || req.status === selectedStatus;
            return matchesSearch && matchesStat;
        });
        renderRequests(filtered);
    }

    async function loadData() {
        try {
            const [reqsRes, itemsRes, stuRes, empRes] = await Promise.all([
                fetch(`${API_BASE_URL}/borrowings/`),
                fetch(`${API_BASE_URL}/items/`),
                fetch(`${API_BASE_URL}/students/`),
                fetch(`${API_BASE_URL}/employees/`)
            ]);
            
            if (!reqsRes.ok || !itemsRes.ok || !stuRes.ok || !empRes.ok) throw new Error("Failed to fetch data");
            
            allRequests = await reqsRes.json();
            allItems = await itemsRes.json();
            allStudents = await stuRes.json();
            allEmployees = await empRes.json();
            
            populateItemSelect();
            applyFilters();
        } catch (error) {
            console.error(error);
            requestsTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">Failed to load data.</td></tr>`;
        }
    }

    async function submitRequestForm(event) {
        event.preventDefault();
        saveRequestButton.disabled = true;
        saveRequestButton.textContent = "Saving...";
        
        try {
            const formData = new FormData(addRequestForm);
            
            const payload = {
                item: formData.get("item"),
                expected_return_date: formData.get("expected_return_date"),
                status: "Pending"
            };

            const type = borrowerTypeSelect.value;
            const borrowerId = borrowerIdSelect.value;

            if (type === "student") {
                payload.student = borrowerId;
            } else if (type === "employee") {
                payload.employee = borrowerId;
            }

            const response = await fetch(`${API_BASE_URL}/borrowings/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to add request");
            
            showFormMessage(addRequestMessage, "Request added successfully.");
            await loadData();
            setTimeout(() => closeModal(addRequestModal, addRequestForm, addRequestMessage), 800);
        } catch (error) {
            showFormMessage(addRequestMessage, error.message, "error");
        } finally {
            saveRequestButton.disabled = false;
            saveRequestButton.textContent = "Submit Request";
        }
    }

    requestSearch.addEventListener("input", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    resetFilters.addEventListener("click", () => {
        requestSearch.value = ""; statusFilter.value = ""; applyFilters();
    });

    borrowerTypeSelect.addEventListener("change", populateBorrowerSelect);

    openAddRequestModal.addEventListener("click", () => openModal(addRequestModal, addRequestMessage));
    closeAddRequestModal.addEventListener("click", () => closeModal(addRequestModal, addRequestForm, addRequestMessage));
    cancelAddRequest.addEventListener("click", () => closeModal(addRequestModal, addRequestForm, addRequestMessage));
    addRequestForm.addEventListener("submit", submitRequestForm);

    loadData();
});
