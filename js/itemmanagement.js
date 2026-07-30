const API_BASE_URL = "http://127.0.0.1:8000/api";

let allItems = [];
let allCategories = [];

document.addEventListener("DOMContentLoaded", () => {
    const itemsTableBody = document.getElementById("itemsTableBody");
    const itemsSummary = document.getElementById("itemsSummary");
    const itemSearch = document.getElementById("itemSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const resetFilters = document.getElementById("resetFilters");

    const openAddItemModal = document.getElementById("openAddItemModal");
    const addItemModal = document.getElementById("addItemModal");
    const closeAddItemModal = document.getElementById("closeAddItemModal");
    const cancelAddItem = document.getElementById("cancelAddItem");
    const addItemForm = document.getElementById("addItemForm");
    const addItemMessage = document.getElementById("addItemMessage");
    const saveItemButton = document.getElementById("saveItemButton");

    const openAddCategoryModal = document.getElementById("openAddCategoryModal");
    const addCategoryModal = document.getElementById("addCategoryModal");
    const closeAddCategoryModal = document.getElementById("closeAddCategoryModal");
    const cancelAddCategory = document.getElementById("cancelAddCategory");
    const addCategoryForm = document.getElementById("addCategoryForm");
    const addCategoryMessage = document.getElementById("addCategoryMessage");
    const saveCategoryButton = document.getElementById("saveCategoryButton");

    const itemCategorySelect = document.getElementById("item_category");
    const editItemCategorySelect = document.getElementById("edit_category");

    const editItemModal = document.getElementById("editItemModal");
    const closeEditItemModal = document.getElementById("closeEditItemModal");
    const cancelEditItem = document.getElementById("cancelEditItem");
    const editItemForm = document.getElementById("editItemForm");
    const editItemMessage = document.getElementById("editItemMessage");
    const updateItemButton = document.getElementById("updateItemButton");

    const editItemId = document.getElementById("edit_item_id");
    const editName = document.getElementById("edit_name");
    const editDescription = document.getElementById("edit_description");
    const editStatus = document.getElementById("edit_status");
    const editCondition = document.getElementById("edit_condition");
    const editImage = document.getElementById("edit_image");

    const deleteItemModal = document.getElementById("deleteItemModal");
    const closeDeleteItemModal = document.getElementById("closeDeleteItemModal");
    const cancelDeleteItem = document.getElementById("cancelDeleteItem");
    const confirmDeleteItemButton = document.getElementById("confirmDeleteItemButton");
    const deleteItemId = document.getElementById("delete_item_id");
    const deleteItemName = document.getElementById("deleteItemName");
    const deleteItemMessage = document.getElementById("deleteItemMessage");

    function getStatusBadge(status) {
        if (status === "Available") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
        if (status === "Borrowed") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        if (status === "Maintenance") return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
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

    // Modal Toggles
    function openModal(modal, msgContainer) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        if(msgContainer) clearFormMessage(msgContainer);
    }
    function closeModal(modal, form, msgContainer) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        if(form) form.reset();
        if(msgContainer) clearFormMessage(msgContainer);
    }

    function populateCategories() {
        itemCategorySelect.innerHTML = `<option value="">Select category</option>`;
        editItemCategorySelect.innerHTML = `<option value="">Select category</option>`;
        categoryFilter.innerHTML = `<option value="">All Categories</option>`;
        
        allCategories.forEach(cat => {
            itemCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            editItemCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            categoryFilter.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });
    }

    function renderItems(items) {
        if (!items.length) {
            itemsTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">No items found.</td></tr>`;
            itemsSummary.innerHTML = `Showing <span class="font-semibold">0</span> items`;
            return;
        }

        itemsTableBody.innerHTML = items.map(item => {
            const imageUrl = item.image
                ? (item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`)
                : null;
            const photoHtml = imageUrl
                ? `<img src="${imageUrl}" alt="${item.name}" class="h-11 w-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm" />`
                : `<div class="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center border border-blue-100 dark:border-blue-900/30 flex-shrink-0"><span class="material-symbols-outlined text-[20px]">inventory_2</span></div>`;

            return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            ${photoHtml}
                            <div>
                                <p class="font-bold text-slate-900 dark:text-slate-100">${item.name}</p>
                                <p class="text-xs text-slate-500 truncate max-w-[200px]">${item.description || "No description"}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        ${item.category_name}
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}">
                            ${item.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        ${item.condition}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button class="edit-item-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-id="${item.id}">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="delete-item-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-id="${item.id}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        itemsSummary.innerHTML = `Showing <span class="font-semibold">${items.length}</span> item${items.length > 1 ? "s" : ""}`;
        bindEditButtons();
        bindDeleteButtons();
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-item-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = Number(btn.getAttribute("data-id"));
                const item = allItems.find(i => i.id === id);
                if (item) {
                    editItemId.value = item.id;
                    editName.value = item.name;
                    editItemCategorySelect.value = item.category;
                    editDescription.value = item.description || "";
                    editStatus.value = item.status;
                    editCondition.value = item.condition;
                    openModal(editItemModal, editItemMessage);
                }
            });
        });
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-item-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = Number(btn.getAttribute("data-id"));
                const item = allItems.find(i => i.id === id);
                if (item) {
                    deleteItemId.value = item.id;
                    deleteItemName.textContent = item.name;
                    openModal(deleteItemModal, deleteItemMessage);
                }
            });
        });
    }

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
            itemsTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">Failed to load data.</td></tr>`;
        }
    }

    async function submitCategoryForm(event) {
        event.preventDefault();
        saveCategoryButton.disabled = true;
        saveCategoryButton.textContent = "Saving...";
        
        try {
            const formData = new FormData(addCategoryForm);
            const response = await fetch(`${API_BASE_URL}/categories/`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error("Failed to add category");
            
            showFormMessage(addCategoryMessage, "Category added successfully.");
            await loadData();
            setTimeout(() => closeModal(addCategoryModal, addCategoryForm, addCategoryMessage), 800);
        } catch (error) {
            showFormMessage(addCategoryMessage, error.message, "error");
        } finally {
            saveCategoryButton.disabled = false;
            saveCategoryButton.textContent = "Save";
        }
    }

    async function submitItemForm(event) {
        event.preventDefault();
        saveItemButton.disabled = true;
        saveItemButton.textContent = "Saving...";
        
        try {
            const formData = new FormData(addItemForm);
            if (!formData.get("image").name) formData.delete("image");

            const response = await fetch(`${API_BASE_URL}/items/`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error("Failed to add item");
            
            showFormMessage(addItemMessage, "Item added successfully.");
            await loadData();
            setTimeout(() => closeModal(addItemModal, addItemForm, addItemMessage), 800);
        } catch (error) {
            showFormMessage(addItemMessage, error.message, "error");
        } finally {
            saveItemButton.disabled = false;
            saveItemButton.textContent = "Save Item";
        }
    }

    async function submitEditItemForm(event) {
        event.preventDefault();
        updateItemButton.disabled = true;
        updateItemButton.textContent = "Updating...";
        
        try {
            const id = editItemId.value;
            const formData = new FormData(editItemForm);
            if (!editImage.files.length) formData.delete("image");

            const response = await fetch(`${API_BASE_URL}/items/${id}/`, {
                method: "PATCH",
                body: formData
            });

            if (!response.ok) throw new Error("Failed to update item");
            
            showFormMessage(editItemMessage, "Item updated successfully.");
            await loadData();
            setTimeout(() => closeModal(editItemModal, editItemForm, editItemMessage), 800);
        } catch (error) {
            showFormMessage(editItemMessage, error.message, "error");
        } finally {
            updateItemButton.disabled = false;
            updateItemButton.textContent = "Update Item";
        }
    }

    async function confirmDeleteItem() {
        confirmDeleteItemButton.disabled = true;
        confirmDeleteItemButton.textContent = "Deleting...";
        
        try {
            const id = deleteItemId.value;
            const response = await fetch(`${API_BASE_URL}/items/${id}/delete/`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete item");
            
            showFormMessage(deleteItemMessage, "Item deleted.");
            await loadData();
            setTimeout(() => closeModal(deleteItemModal, null, deleteItemMessage), 800);
        } catch (error) {
            showFormMessage(deleteItemMessage, error.message, "error");
        } finally {
            confirmDeleteItemButton.disabled = false;
            confirmDeleteItemButton.textContent = "Delete Item";
        }
    }

    // Event Listeners
    itemSearch.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    resetFilters.addEventListener("click", () => {
        itemSearch.value = ""; categoryFilter.value = ""; statusFilter.value = ""; applyFilters();
    });

    openAddCategoryModal.addEventListener("click", () => openModal(addCategoryModal, addCategoryMessage));
    closeAddCategoryModal.addEventListener("click", () => closeModal(addCategoryModal, addCategoryForm, addCategoryMessage));
    cancelAddCategory.addEventListener("click", () => closeModal(addCategoryModal, addCategoryForm, addCategoryMessage));
    addCategoryForm.addEventListener("submit", submitCategoryForm);

    openAddItemModal.addEventListener("click", () => openModal(addItemModal, addItemMessage));
    closeAddItemModal.addEventListener("click", () => closeModal(addItemModal, addItemForm, addItemMessage));
    cancelAddItem.addEventListener("click", () => closeModal(addItemModal, addItemForm, addItemMessage));
    addItemForm.addEventListener("submit", submitItemForm);

    closeEditItemModal.addEventListener("click", () => closeModal(editItemModal, editItemForm, editItemMessage));
    cancelEditItem.addEventListener("click", () => closeModal(editItemModal, editItemForm, editItemMessage));
    editItemForm.addEventListener("submit", submitEditItemForm);

    closeDeleteItemModal.addEventListener("click", () => closeModal(deleteItemModal, null, deleteItemMessage));
    cancelDeleteItem.addEventListener("click", () => closeModal(deleteItemModal, null, deleteItemMessage));
    confirmDeleteItemButton.addEventListener("click", confirmDeleteItem);

    loadData();
});
