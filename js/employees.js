const API_BASE_URL = "http://127.0.0.1:8000/api";

let allEmployees = [];
let allDepartments = [];

document.addEventListener("DOMContentLoaded", () => {
    const employeesTableBody = document.getElementById("employeesTableBody");
    const employeesSummary = document.getElementById("employeesSummary");
    const employeeSearch = document.getElementById("employeeSearch");
    const departmentFilter = document.getElementById("departmentFilter");
    const genderFilter = document.getElementById("genderFilter");
    const resetFilters = document.getElementById("resetFilters");

    const openAddEmployeeModal = document.getElementById("openAddEmployeeModal");
    const addEmployeeModal = document.getElementById("addEmployeeModal");
    const closeAddEmployeeModal = document.getElementById("closeAddEmployeeModal");
    const cancelAddEmployee = document.getElementById("cancelAddEmployee");
    const addEmployeeForm = document.getElementById("addEmployeeForm");
    const addEmployeeMessage = document.getElementById("addEmployeeMessage");
    const saveEmployeeButton = document.getElementById("saveEmployeeButton");

    const modalDepartment = document.getElementById("department");

    const viewEmployeeModal = document.getElementById("viewEmployeeModal");
    const closeViewEmployeeModal = document.getElementById("closeViewEmployeeModal");
    const viewEmployeeDoneButton = document.getElementById("viewEmployeeDoneButton");

    const viewEmployeePhotoWrapper = document.getElementById("viewEmployeePhotoWrapper");
    const viewFullName = document.getElementById("viewFullName");
    const viewEmployeeNumber = document.getElementById("viewEmployeeNumber");
    const viewGenderBadge = document.getElementById("viewGenderBadge");
    const viewStatusBadge = document.getElementById("viewStatusBadge");
    const viewRoleBadge = document.getElementById("viewRoleBadge");

    const viewFirstName = document.getElementById("viewFirstName");
    const viewLastName = document.getElementById("viewLastName");
    const viewMiddleInitial = document.getElementById("viewMiddleInitial");
    const viewBirthdate = document.getElementById("viewBirthdate");
    const viewGenderText = document.getElementById("viewGenderText");

    const viewDepartment = document.getElementById("viewDepartment");
    const viewPosition = document.getElementById("viewPosition");
    const viewRoleText = document.getElementById("viewRoleText");
    const viewStatusText = document.getElementById("viewStatusText");

    const viewEmail = document.getElementById("viewEmail");
    const viewPhone = document.getElementById("viewPhone");

    const editEmployeeModal = document.getElementById("editEmployeeModal");
    const closeEditEmployeeModal = document.getElementById("closeEditEmployeeModal");
    const cancelEditEmployee = document.getElementById("cancelEditEmployee");
    const editEmployeeForm = document.getElementById("editEmployeeForm");
    const editEmployeeMessage = document.getElementById("editEmployeeMessage");
    const updateEmployeeButton = document.getElementById("updateEmployeeButton");

    const editEmployeeId = document.getElementById("edit_employee_id");
    const editEmployeeNumber = document.getElementById("edit_employee_number");
    const editLastName = document.getElementById("edit_last_name");
    const editFirstName = document.getElementById("edit_first_name");
    const editMiddleInitial = document.getElementById("edit_middle_initial");
    const editBirthdate = document.getElementById("edit_birthdate");
    const editGender = document.getElementById("edit_gender");
    const editEmail = document.getElementById("edit_email");
    const editPhone = document.getElementById("edit_phone");
    const editPhoto = document.getElementById("edit_photo");
    
    const editModalDepartment = document.getElementById("edit_department");
    const editPosition = document.getElementById("edit_position");

    const deleteEmployeeModal = document.getElementById("deleteEmployeeModal");
    const closeDeleteEmployeeModal = document.getElementById("closeDeleteEmployeeModal");
    const cancelDeleteEmployee = document.getElementById("cancelDeleteEmployee");
    const confirmDeleteEmployeeButton = document.getElementById("confirmDeleteEmployeeButton");
    const deleteEmployeeId = document.getElementById("delete_employee_id");
    const deleteEmployeeName = document.getElementById("deleteEmployeeName");
    const deleteEmployeeNumber = document.getElementById("deleteEmployeeNumber");
    const deleteEmployeeMessage = document.getElementById("deleteEmployeeMessage");

    function getInitials(firstName = "", lastName = "") {
        const first = firstName.charAt(0).toUpperCase();
        const last = lastName.charAt(0).toUpperCase();
        return `${last}${first}`;
    }

    function getGenderBadge(gender) {
        if (gender === "Male") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        if (gender === "Female") return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
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

    function openModal() {
        addEmployeeModal.classList.remove("hidden");
        addEmployeeModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(addEmployeeMessage);
    }

    function closeModal() {
        addEmployeeModal.classList.add("hidden");
        addEmployeeModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        addEmployeeForm.reset();
        clearFormMessage(addEmployeeMessage);
    }

    function openViewModal() {
        viewEmployeeModal.classList.remove("hidden");
        viewEmployeeModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeViewModal() {
        viewEmployeeModal.classList.add("hidden");
        viewEmployeeModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    function openEditModal() {
        editEmployeeModal.classList.remove("hidden");
        editEmployeeModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(editEmployeeMessage);
    }

    function closeEditModal() {
        editEmployeeModal.classList.add("hidden");
        editEmployeeModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        editEmployeeForm.reset();
        clearFormMessage(editEmployeeMessage);
    }

    function openDeleteModal() {
        deleteEmployeeModal.classList.remove("hidden");
        deleteEmployeeModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(deleteEmployeeMessage);
    }

    function closeDeleteModal() {
        deleteEmployeeModal.classList.add("hidden");
        deleteEmployeeModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        deleteEmployeeId.value = "";
        deleteEmployeeName.textContent = "-";
        deleteEmployeeNumber.textContent = "-";
        clearFormMessage(deleteEmployeeMessage);
    }

    function populateFilters(employees) {
        const departments = [...new Set(employees.map(e => e.department_name).filter(Boolean))].sort();
        departmentFilter.innerHTML = `<option value="">All Departments</option>`;
        departments.forEach(department => {
            departmentFilter.innerHTML += `<option value="${department}">${department}</option>`;
        });
    }

    function populateModalDepartments() {
        modalDepartment.innerHTML = `<option value="">Select department</option>`;
        editModalDepartment.innerHTML = `<option value="">Select department</option>`;
        allDepartments.forEach(department => {
            modalDepartment.innerHTML += `<option value="${department.id}">${department.department_name}</option>`;
            editModalDepartment.innerHTML += `<option value="${department.id}">${department.department_name}</option>`;
        });
    }

    function renderEmployees(employees) {
        if (!employees.length) {
            employeesTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                        No employee records found.
                    </td>
                </tr>
            `;
            employeesSummary.innerHTML = `Showing <span class="font-semibold">0</span> employees`;
            return;
        }

        employeesTableBody.innerHTML = employees.map(employee => {
            const photoHtml = employee.photo
                ? `<img src="${employee.photo}" alt="${employee.first_name} ${employee.last_name}" class="size-10 rounded-full bg-slate-100 object-cover" />`
                : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${getInitials(employee.first_name, employee.last_name)}</div>`;

            return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            ${photoHtml}
                            <div>
                                <p class="font-bold text-slate-900 dark:text-slate-100">
                                    ${employee.last_name}, ${employee.first_name}${employee.middle_initial ? ` ${employee.middle_initial}.` : ""}
                                </p>
                                <p class="text-xs text-slate-500">ID: ${employee.employee_number}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="font-semibold text-slate-700 dark:text-slate-200">${employee.position ?? "-"}</p>
                            <p class="text-xs text-slate-500">${employee.department_name ?? "-"}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">phone</span>
                                ${employee.phone ?? "-"}
                            </p>
                            <p class="text-xs text-slate-500">${employee.email ?? "-"}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(employee.gender)}">
                            ${employee.gender}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button class="view-employee-btn p-2 text-slate-400 hover:text-primary transition-colors" title="View" data-employee-id="${employee.id}">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="edit-employee-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-employee-id="${employee.id}">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="delete-employee-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-employee-id="${employee.id}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        employeesSummary.innerHTML = `Showing <span class="font-semibold">${employees.length}</span> employee${employees.length > 1 ? "s" : ""}`;

        bindViewButtons();
        bindEditButtons();
        bindDeleteButtons();
    }

    function fillViewModal(employee) {
        const fullName = `${employee.last_name}, ${employee.first_name}${employee.middle_initial ? ` ${employee.middle_initial}.` : ""}`;
        viewFullName.textContent = fullName;
        viewEmployeeNumber.textContent = `Employee Number: ${employee.employee_number ?? "-"}`;

        viewFirstName.textContent = employee.first_name ?? "-";
        viewLastName.textContent = employee.last_name ?? "-";
        viewMiddleInitial.textContent = employee.middle_initial ?? "-";
        viewBirthdate.textContent = employee.birthdate ?? "-";
        viewGenderText.textContent = employee.gender ?? "-";

        viewDepartment.textContent = employee.department_name ?? "-";
        viewPosition.textContent = employee.position ?? "-";
        viewRoleText.textContent = employee.role_name ?? "-";
        viewStatusText.textContent = employee.status_name ?? "-";

        viewEmail.textContent = employee.email ?? "-";
        viewPhone.textContent = employee.phone ?? "-";

        viewGenderBadge.className = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGenderBadge(employee.gender)}`;
        viewGenderBadge.textContent = employee.gender ?? "-";

        viewStatusBadge.className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700";
        viewStatusBadge.textContent = employee.status_name ?? "-";

        viewRoleBadge.className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary";
        viewRoleBadge.textContent = employee.role_name ?? "-";

        if (employee.photo) {
            viewEmployeePhotoWrapper.innerHTML = `
                <img src="${employee.photo}" alt="${employee.first_name} ${employee.last_name}" class="h-full w-full object-cover" />
            `;
        } else {
            viewEmployeePhotoWrapper.innerHTML = getInitials(employee.first_name, employee.last_name);
        }
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-employee-btn").forEach(button => {
            button.addEventListener("click", () => {
                const employeeId = Number(button.getAttribute("data-employee-id"));
                const selectedEmployee = allEmployees.find(e => e.id === employeeId);
                if (selectedEmployee) {
                    fillViewModal(selectedEmployee);
                    openViewModal();
                }
            });
        });
    }

    function fillEditModal(employee) {
        editEmployeeId.value = employee.id;
        editEmployeeNumber.value = employee.employee_number ?? "";
        editLastName.value = employee.last_name ?? "";
        editFirstName.value = employee.first_name ?? "";
        editMiddleInitial.value = employee.middle_initial ?? "";
        editBirthdate.value = employee.birthdate ?? "";
        editGender.value = employee.gender ?? "";
        editEmail.value = employee.email ?? "";
        editPhone.value = employee.phone ?? "";
        editPosition.value = employee.position ?? "";
        
        if (employee.department) {
            editModalDepartment.value = String(employee.department);
        } else {
            editModalDepartment.value = "";
        }
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-employee-btn").forEach(button => {
            button.addEventListener("click", () => {
                const employeeId = Number(button.getAttribute("data-employee-id"));
                const selectedEmployee = allEmployees.find(e => e.id === employeeId);
                if (selectedEmployee) {
                    fillEditModal(selectedEmployee);
                    openEditModal();
                }
            });
        });
    }

    function fillDeleteModal(employee) {
        deleteEmployeeId.value = employee.id;
        deleteEmployeeName.textContent = `${employee.last_name}, ${employee.first_name}${employee.middle_initial ? ` ${employee.middle_initial}.` : ""}`;
        deleteEmployeeNumber.textContent = `Employee Number: ${employee.employee_number ?? "-"}`;
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-employee-btn").forEach(button => {
            button.addEventListener("click", () => {
                const employeeId = Number(button.getAttribute("data-employee-id"));
                const selectedEmployee = allEmployees.find(e => e.id === employeeId);
                if (selectedEmployee) {
                    fillDeleteModal(selectedEmployee);
                    openDeleteModal();
                }
            });
        });
    }

    function applyFilters() {
        const searchValue = employeeSearch.value.trim().toLowerCase();
        const selectedDepartment = departmentFilter.value;
        const selectedGender = genderFilter.value;

        const filtered = allEmployees.filter(employee => {
            const fullName = `${employee.last_name} ${employee.first_name} ${employee.middle_initial ?? ""}`.toLowerCase();
            const employeeNumber = (employee.employee_number ?? "").toLowerCase();

            const matchesSearch = fullName.includes(searchValue) || employeeNumber.includes(searchValue);
            const matchesDepartment = !selectedDepartment || employee.department_name === selectedDepartment;
            const matchesGender = !selectedGender || employee.gender === selectedGender;

            return matchesSearch && matchesDepartment && matchesGender;
        });

        renderEmployees(filtered);
    }

    async function loadEmployees() {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/`);
            if (!response.ok) throw new Error(`Failed to fetch employees: ${response.status}`);
            allEmployees = await response.json();
            populateFilters(allEmployees);
            renderEmployees(allEmployees);
        } catch (error) {
            console.error("Employees error:", error);
            employeesTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">Failed to load employees.</td></tr>`;
            employeesSummary.innerHTML = `Showing <span class="font-semibold">0</span> employees`;
        }
    }

    async function loadAcademicData() {
        try {
            const response = await fetch(`${API_BASE_URL}/departments/`);
            if (!response.ok) throw new Error("Failed to load departments.");
            allDepartments = await response.json();
            populateModalDepartments();
        } catch (error) {
            console.error("Academic dropdown error:", error);
            modalDepartment.innerHTML = `<option value="">Failed to load departments</option>`;
        }
    }

    async function submitEmployeeForm(event) {
        event.preventDefault();
        clearFormMessage(addEmployeeMessage);
        saveEmployeeButton.disabled = true;
        saveEmployeeButton.textContent = "Saving...";

        try {
            const formData = new FormData(addEmployeeForm);
            const response = await fetch(`${API_BASE_URL}/employees/`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to save employee.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(addEmployeeMessage, "Employee added successfully.", "success");
            await loadEmployees();
            setTimeout(() => closeModal(), 800);
        } catch (error) {
            showFormMessage(addEmployeeMessage, error.message, "error");
        } finally {
            saveEmployeeButton.disabled = false;
            saveEmployeeButton.textContent = "Save Employee";
        }
    }

    async function submitEditEmployeeForm(event) {
        event.preventDefault();
        clearFormMessage(editEmployeeMessage);
        updateEmployeeButton.disabled = true;
        updateEmployeeButton.textContent = "Updating...";

        try {
            const employeeId = editEmployeeId.value;
            const formData = new FormData(editEmployeeForm);
            if (!editPhoto.files.length) {
                formData.delete("photo");
            }

            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/`, {
                method: "PATCH",
                body: formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to update employee.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(editEmployeeMessage, "Employee updated successfully.", "success");
            await loadEmployees();
            setTimeout(() => closeEditModal(), 800);
        } catch (error) {
            showFormMessage(editEmployeeMessage, error.message, "error");
        } finally {
            updateEmployeeButton.disabled = false;
            updateEmployeeButton.textContent = "Update Employee";
        }
    }

    async function confirmDeleteEmployee() {
        clearFormMessage(deleteEmployeeMessage);
        confirmDeleteEmployeeButton.disabled = true;
        confirmDeleteEmployeeButton.textContent = "Deleting...";

        try {
            const employeeId = deleteEmployeeId.value;
            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/delete/`, {
                method: "DELETE"
            });

            if (!response.ok) {
                let errorMessage = "Failed to delete employee.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(deleteEmployeeMessage, "Employee deleted successfully.", "success");
            await loadEmployees();
            setTimeout(() => closeDeleteModal(), 800);
        } catch (error) {
            showFormMessage(deleteEmployeeMessage, error.message, "error");
        } finally {
            confirmDeleteEmployeeButton.disabled = false;
            confirmDeleteEmployeeButton.textContent = "Delete Employee";
        }
    }

    employeeSearch.addEventListener("input", applyFilters);
    departmentFilter.addEventListener("change", applyFilters);
    genderFilter.addEventListener("change", applyFilters);
    resetFilters.addEventListener("click", () => {
        employeeSearch.value = "";
        departmentFilter.value = "";
        genderFilter.value = "";
        renderEmployees(allEmployees);
    });

    openAddEmployeeModal.addEventListener("click", openModal);
    closeAddEmployeeModal.addEventListener("click", closeModal);
    cancelAddEmployee.addEventListener("click", closeModal);
    addEmployeeModal.addEventListener("click", (event) => { if (event.target === addEmployeeModal) closeModal(); });

    closeViewEmployeeModal.addEventListener("click", closeViewModal);
    viewEmployeeDoneButton.addEventListener("click", closeViewModal);
    viewEmployeeModal.addEventListener("click", (event) => { if (event.target === viewEmployeeModal) closeViewModal(); });

    closeEditEmployeeModal.addEventListener("click", closeEditModal);
    cancelEditEmployee.addEventListener("click", closeEditModal);
    editEmployeeModal.addEventListener("click", (event) => { if (event.target === editEmployeeModal) closeEditModal(); });

    closeDeleteEmployeeModal.addEventListener("click", closeDeleteModal);
    cancelDeleteEmployee.addEventListener("click", closeDeleteModal);
    confirmDeleteEmployeeButton.addEventListener("click", confirmDeleteEmployee);
    deleteEmployeeModal.addEventListener("click", (event) => { if (event.target === deleteEmployeeModal) closeDeleteModal(); });

    addEmployeeForm.addEventListener("submit", submitEmployeeForm);
    editEmployeeForm.addEventListener("submit", submitEditEmployeeForm);

    loadEmployees();
    loadAcademicData();
});
