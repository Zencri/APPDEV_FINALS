const API_BASE_URL = "http://127.0.0.1:8000/api";

let activeBorrowings = [];
let allItems = [];

document.addEventListener("DOMContentLoaded", () => {
    const returnsTableBody = document.getElementById("returnsTableBody");
    const returnsSummary = document.getElementById("returnsSummary");
    const returnSearch = document.getElementById("returnSearch");

    const processReturnModal = document.getElementById("processReturnModal");
    const closeProcessReturnModal = document.getElementById("closeProcessReturnModal");
    const cancelProcessReturn = document.getElementById("cancelProcessReturn");
    const processReturnForm = document.getElementById("processReturnForm");
    const processReturnMessage = document.getElementById("processReturnMessage");
    const confirmProcessReturnButton = document.getElementById("confirmProcessReturnButton");

    const returnRecordId = document.getElementById("return_record_id");
    const returnItemId = document.getElementById("return_item_id");
    const returnItemName = document.getElementById("returnItemName");
    const returnBorrowerName = document.getElementById("returnBorrowerName");
    const actualReturnDate = document.getElementById("actual_return_date");
    const returnCondition = document.getElementById("return_condition");

    function getStatusBadge(status) {
        if (status === "Approved") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        if (status === "Overdue") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
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

    function renderReturns(requests) {
        if (!requests.length) {
            returnsTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">No active borrowed items found.</td></tr>`;
            returnsSummary.innerHTML = `Showing <span class="font-semibold">0</span> items`;
            return;
        }

        returnsTableBody.innerHTML = requests.map(req => {
            const photoHtml = req.item_image
                ? `<img src="${req.item_image}" alt="${req.item_name}" class="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />`
                : `<div class="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20"><span class="material-symbols-outlined text-lg">inventory_2</span></div>`;

            // Check if overdue based on today's date
            const expectedDate = new Date(req.expected_return_date);
            const today = new Date();
            today.setHours(0,0,0,0);
            
            let displayStatus = req.status;
            if (req.status === "Approved" && expectedDate < today) {
                displayStatus = "Overdue";
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
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        ${req.expected_return_date}
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(displayStatus)}">
                            ${displayStatus}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button class="return-btn px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors" data-id="${req.id}" data-item-id="${req.item}">
                            Process Return
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        returnsSummary.innerHTML = `Showing <span class="font-semibold">${requests.length}</span> active borrowing${requests.length > 1 ? "s" : ""}`;
        
        bindActionButtons();
    }

    function bindActionButtons() {
        document.querySelectorAll(".return-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const itemId = btn.getAttribute("data-item-id");
                
                const req = activeBorrowings.find(r => String(r.id) === String(id));
                const item = allItems.find(i => String(i.id) === String(itemId));

                if (req && item) {
                    returnRecordId.value = req.id;
                    returnItemId.value = item.id;
                    returnItemName.textContent = req.item_name;
                    returnBorrowerName.textContent = req.borrower_name;
                    
                    actualReturnDate.value = new Date().toISOString().split('T')[0];
                    returnCondition.value = item.condition; // Default to current condition

                    openModal(processReturnModal, processReturnMessage);
                }
            });
        });
    }

    function applyFilters() {
        const searchValue = returnSearch.value.trim().toLowerCase();

        const filtered = activeBorrowings.filter(req => {
            return req.item_name.toLowerCase().includes(searchValue) || 
                   req.borrower_name.toLowerCase().includes(searchValue);
        });
        renderReturns(filtered);
    }

    async function loadData() {
        try {
            const [reqsRes, itemsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/borrowings/`),
                fetch(`${API_BASE_URL}/items/`)
            ]);
            
            if (!reqsRes.ok || !itemsRes.ok) throw new Error("Failed to fetch data");
            
            const allReqs = await reqsRes.json();
            allItems = await itemsRes.json();
            
            // Only show approved/overdue that haven't been returned
            activeBorrowings = allReqs.filter(r => r.status === "Approved" || r.status === "Overdue");
            
            applyFilters();
        } catch (error) {
            console.error(error);
            returnsTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">Failed to load data.</td></tr>`;
        }
    }

    async function submitReturnForm(event) {
        event.preventDefault();
        confirmProcessReturnButton.disabled = true;
        confirmProcessReturnButton.textContent = "Processing...";
        
        try {
            const recordId = returnRecordId.value;
            const itemId = returnItemId.value;
            const returnDate = actualReturnDate.value;
            const condition = returnCondition.value;

            // 1. Update Borrowing Record
            const res1 = await fetch(`${API_BASE_URL}/borrowings/${recordId}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "Returned",
                    actual_return_date: returnDate
                })
            });

            if (!res1.ok) throw new Error("Failed to update borrowing record.");

            // 2. Update Item Status & Condition
            const res2 = await fetch(`${API_BASE_URL}/items/${itemId}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "Available",
                    condition: condition
                })
            });

            if (!res2.ok) throw new Error("Failed to update item status.");

            showFormMessage(processReturnMessage, "Item successfully returned.", "success");
            await loadData();
            setTimeout(() => closeModal(processReturnModal, processReturnForm, processReturnMessage), 800);
        } catch (error) {
            showFormMessage(processReturnMessage, error.message, "error");
        } finally {
            confirmProcessReturnButton.disabled = false;
            confirmProcessReturnButton.textContent = "Confirm Return";
        }
    }

    returnSearch.addEventListener("input", applyFilters);
    
    closeProcessReturnModal.addEventListener("click", () => closeModal(processReturnModal, processReturnForm, processReturnMessage));
    cancelProcessReturn.addEventListener("click", () => closeModal(processReturnModal, processReturnForm, processReturnMessage));
    processReturnForm.addEventListener("submit", submitReturnForm);

    loadData();
});
