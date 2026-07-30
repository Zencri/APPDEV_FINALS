const API_BASE_URL = "http://127.0.0.1:8000/api";
const PSGC_API_BASE_URL = "https://psgc.gitlab.io/api";

let allStudents = [];
let allColleges = [];
let allDepartments = [];
let allCourses = [];
let allRegions = [];

document.addEventListener("DOMContentLoaded", () => {
    const studentsTableBody = document.getElementById("studentsTableBody");
    const studentsSummary = document.getElementById("studentsSummary");
    const studentSearch = document.getElementById("studentSearch");
    const collegeFilter = document.getElementById("collegeFilter");
    const departmentFilter = document.getElementById("departmentFilter");
    const genderFilter = document.getElementById("genderFilter");
    const resetFilters = document.getElementById("resetFilters");

    const openAddStudentModal = document.getElementById("openAddStudentModal");
    const addStudentModal = document.getElementById("addStudentModal");
    const closeAddStudentModal = document.getElementById("closeAddStudentModal");
    const cancelAddStudent = document.getElementById("cancelAddStudent");
    const addStudentForm = document.getElementById("addStudentForm");
    const addStudentMessage = document.getElementById("addStudentMessage");
    const saveStudentButton = document.getElementById("saveStudentButton");

    const modalCollege = document.getElementById("modalCollege");
    const modalDepartment = document.getElementById("modalDepartment");
    const courseSelect = document.getElementById("course");

    const regionSelect = document.getElementById("region_code");
    const provinceSelect = document.getElementById("province_code");
    const citySelect = document.getElementById("city_municipality_code");
    const barangaySelect = document.getElementById("barangay_code");
    const provinceHint = document.getElementById("provinceHint");

    const viewStudentModal = document.getElementById("viewStudentModal");
    const closeViewStudentModal = document.getElementById("closeViewStudentModal");
    const viewStudentDoneButton = document.getElementById("viewStudentDoneButton");

    const viewStudentPhotoWrapper = document.getElementById("viewStudentPhotoWrapper");
    const viewFullName = document.getElementById("viewFullName");
    const viewStudentNumber = document.getElementById("viewStudentNumber");
    const viewGenderBadge = document.getElementById("viewGenderBadge");
    const viewStatusBadge = document.getElementById("viewStatusBadge");
    const viewRoleBadge = document.getElementById("viewRoleBadge");

    const viewFirstName = document.getElementById("viewFirstName");
    const viewLastName = document.getElementById("viewLastName");
    const viewMiddleInitial = document.getElementById("viewMiddleInitial");
    const viewBirthdate = document.getElementById("viewBirthdate");
    const viewGenderText = document.getElementById("viewGenderText");

    const viewCollege = document.getElementById("viewCollege");
    const viewDepartment = document.getElementById("viewDepartment");
    const viewCourse = document.getElementById("viewCourse");
    const viewRoleText = document.getElementById("viewRoleText");
    const viewStatusText = document.getElementById("viewStatusText");

    const viewEmail = document.getElementById("viewEmail");
    const viewPhone = document.getElementById("viewPhone");

    const viewRegionCode = document.getElementById("viewRegionCode");
    const viewProvinceCode = document.getElementById("viewProvinceCode");
    const viewCityCode = document.getElementById("viewCityCode");
    const viewBarangayCode = document.getElementById("viewBarangayCode");
    const viewStreetAddress = document.getElementById("viewStreetAddress");

    const editStudentModal = document.getElementById("editStudentModal");
    const closeEditStudentModal = document.getElementById("closeEditStudentModal");
    const cancelEditStudent = document.getElementById("cancelEditStudent");
    const editStudentForm = document.getElementById("editStudentForm");
    const editStudentMessage = document.getElementById("editStudentMessage");
    const updateStudentButton = document.getElementById("updateStudentButton");

    const editStudentId = document.getElementById("edit_student_id");
    const editStudentNumber = document.getElementById("edit_student_number");
    const editLastName = document.getElementById("edit_last_name");
    const editFirstName = document.getElementById("edit_first_name");
    const editMiddleInitial = document.getElementById("edit_middle_initial");
    const editBirthdate = document.getElementById("edit_birthdate");
    const editGender = document.getElementById("edit_gender");
    const editEmail = document.getElementById("edit_email");
    const editPhone = document.getElementById("edit_phone");
    const editPhoto = document.getElementById("edit_photo");
    const editStreetAddress = document.getElementById("edit_street_address");

    const editModalCollege = document.getElementById("edit_modalCollege");
    const editModalDepartment = document.getElementById("edit_modalDepartment");
    const editCourse = document.getElementById("edit_course");

    const editRegionCode = document.getElementById("edit_region_code");
    const editProvinceCode = document.getElementById("edit_province_code");
    const editCityCode = document.getElementById("edit_city_municipality_code");
    const editBarangayCode = document.getElementById("edit_barangay_code");
    const editProvinceHint = document.getElementById("editProvinceHint");

    const deleteStudentModal = document.getElementById("deleteStudentModal");
    const closeDeleteStudentModal = document.getElementById("closeDeleteStudentModal");
    const cancelDeleteStudent = document.getElementById("cancelDeleteStudent");
    const confirmDeleteStudentButton = document.getElementById("confirmDeleteStudentButton");
    const deleteStudentId = document.getElementById("delete_student_id");
    const deleteStudentName = document.getElementById("deleteStudentName");
    const deleteStudentNumber = document.getElementById("deleteStudentNumber");
    const deleteStudentMessage = document.getElementById("deleteStudentMessage");

    function getInitials(firstName = "", lastName = "") {
        const first = firstName.charAt(0).toUpperCase();
        const last = lastName.charAt(0).toUpperCase();
        return `${last}${first}`;
    }

    function getGenderBadge(gender) {
        if (gender === "Male") {
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        }
        if (gender === "Female") {
            return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
        }
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
        addStudentModal.classList.remove("hidden");
        addStudentModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(addStudentMessage);
    }

    function closeModal() {
        addStudentModal.classList.add("hidden");
        addStudentModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        addStudentForm.reset();
        clearFormMessage(addStudentMessage);
        resetAcademicDropdowns();
        resetPsgcDropdowns();
    }

    function openViewModal() {
        viewStudentModal.classList.remove("hidden");
        viewStudentModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    }

    function closeViewModal() {
        viewStudentModal.classList.add("hidden");
        viewStudentModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
    }

    function openEditModal() {
        editStudentModal.classList.remove("hidden");
        editStudentModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(editStudentMessage);
    }

    function closeEditModal() {
        editStudentModal.classList.add("hidden");
        editStudentModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        editStudentForm.reset();
        clearFormMessage(editStudentMessage);
        resetEditAcademicDropdowns();
        resetEditPsgcDropdowns();
    }

    function openDeleteModal() {
        deleteStudentModal.classList.remove("hidden");
        deleteStudentModal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
        clearFormMessage(deleteStudentMessage);
    }

    function closeDeleteModal() {
        deleteStudentModal.classList.add("hidden");
        deleteStudentModal.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");
        deleteStudentId.value = "";
        deleteStudentName.textContent = "-";
        deleteStudentNumber.textContent = "-";
        clearFormMessage(deleteStudentMessage);
    }

    function populateFilters(students) {
        const colleges = [...new Set(students.map(student =>
            student.college_name).filter(Boolean))].sort();
        const departments = [...new Set(students.map(student =>
            student.department_name).filter(Boolean))].sort();

        collegeFilter.innerHTML = `<option value="">All Colleges</option>`;
        departmentFilter.innerHTML = `<option value="">All Departments</option>`;

        colleges.forEach(college => {
            collegeFilter.innerHTML += `<option value="${college}">${college}</option>`;
        });

        departments.forEach(department => {
            departmentFilter.innerHTML += `<option value="${department}">${department}</option>`;
        });
    }

    function populateModalColleges() {
        modalCollege.innerHTML = `<option value="">Select college</option>`;
        editModalCollege.innerHTML = `<option value="">Select college</option>`;

        allColleges.forEach(college => {
            modalCollege.innerHTML += `<option value="${college.id}">${college.college_name}</option>`;
            editModalCollege.innerHTML += `<option value="${college.id}">${college.college_name}</option>`;
        });
    }

    function populateModalDepartments(collegeId) {
        modalDepartment.innerHTML = `<option value="">Select department</option>`;
        modalDepartment.disabled = true;
        courseSelect.innerHTML = `<option value="">Select department first</option>`;
        courseSelect.disabled = true;

        if (!collegeId) {
            modalDepartment.innerHTML = `<option value="">Select college first</option>`;
            return;
        }

        const filteredDepartments = allDepartments.filter(
            department => String(department.college) === String(collegeId)
        );

        filteredDepartments.forEach(department => {
            modalDepartment.innerHTML += `<option value="${department.id}">${department.department_name}</option>`;
        });

        modalDepartment.disabled = false;
    }

    function populateModalCourses(departmentId) {
        courseSelect.innerHTML = `<option value="">Select course</option>`;
        courseSelect.disabled = true;

        if (!departmentId) {
            courseSelect.innerHTML = `<option value="">Select department first</option>`;
            return;
        }

        const filteredCourses = allCourses.filter(
            course => String(course.department) === String(departmentId)
        );

        filteredCourses.forEach(course => {
            courseSelect.innerHTML += `<option value="${course.id}">${course.course_name}</option>`;
        });

        courseSelect.disabled = false;
    }

    function populateEditDepartments(collegeId) {
        editModalDepartment.innerHTML = `<option value="">Select department</option>`;
        editModalDepartment.disabled = true;
        editCourse.innerHTML = `<option value="">Select department first</option>`;
        editCourse.disabled = true;

        if (!collegeId) {
            editModalDepartment.innerHTML = `<option value="">Select college first</option>`;
            return [];
        }

        const filteredDepartments = allDepartments.filter(
            department => String(department.college) === String(collegeId)
        );

        filteredDepartments.forEach(department => {
            editModalDepartment.innerHTML += `<option value="${department.id}">${department.department_name}</option>`;
        });

        editModalDepartment.disabled = false;
        return filteredDepartments;
    }

    function populateEditCourses(departmentId) {
        editCourse.innerHTML = `<option value="">Select course</option>`;
        editCourse.disabled = true;

        if (!departmentId) {
            editCourse.innerHTML = `<option value="">Select department first</option>`;
            return [];
        }

        const filteredCourses = allCourses.filter(
            course => String(course.department) === String(departmentId)
        );

        filteredCourses.forEach(course => {
            editCourse.innerHTML += `<option value="${course.id}">${course.course_name}</option>`;
        });

        editCourse.disabled = false;
        return filteredCourses;
    }

    function resetAcademicDropdowns() {
        modalCollege.value = "";
        modalDepartment.innerHTML = `<option value="">Select college first</option>`;
        modalDepartment.disabled = true;
        courseSelect.innerHTML = `<option value="">Select department first</option>`;
        courseSelect.disabled = true;
    }

    function resetEditAcademicDropdowns() {
        editModalCollege.value = "";
        editModalDepartment.innerHTML = `<option value="">Select college first</option>`;
        editModalDepartment.disabled = true;
        editCourse.innerHTML = `<option value="">Select department first</option>`;
        editCourse.disabled = true;
    }

    function resetPsgcDropdowns() {
        provinceSelect.innerHTML = `<option value="">Select region first</option>`;
        provinceSelect.disabled = true;
        citySelect.innerHTML = `<option value="">Select region or province first</option>`;
        citySelect.disabled = true;
        barangaySelect.innerHTML = `<option value="">Select city/municipality first</option>`;
        barangaySelect.disabled = true;
        provinceHint.classList.add("hidden");
    }

    function resetEditPsgcDropdowns() {
        editProvinceCode.innerHTML = `<option value="">Select region first</option>`;
        editProvinceCode.disabled = true;
        editCityCode.innerHTML = `<option value="">Select region or province first</option>`;
        editCityCode.disabled = true;
        editBarangayCode.innerHTML = `<option value="">Select city/municipality first</option>`;
        editBarangayCode.disabled = true;
        editProvinceHint.classList.add("hidden");
    }

    function sortRegionsWithNcrFirst(regions) {
        const sorted = [...regions].sort((a, b) => a.name.localeCompare(b.name));
        const ncrIndex = sorted.findIndex(region => region.code === "130000000");

        if (ncrIndex > -1) {
            const [ncr] = sorted.splice(ncrIndex, 1);
            sorted.unshift(ncr);
        }

        return sorted;
    }

    function renderStudents(students) {
        if (!students.length) {
            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-slate-500">
                        No student records found.
                    </td>
                </tr>
            `;
            studentsSummary.innerHTML = `Showing <span class="font-semibold">0</span> students`;
            return;
        }

        studentsTableBody.innerHTML = students.map(student => {
            const photoHtml = student.photo
                ? `<img src="${student.photo}" alt="${student.first_name} ${student.last_name}" class="size-10 rounded-full bg-slate-100 object-cover" />`
                : `<div class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${getInitials(student.first_name, student.last_name)}</div>`;

            return `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            ${photoHtml}
                            <div>
                                <p class="font-bold text-slate-900 dark:text-slate-100">
                                    ${student.last_name}, ${student.first_name}${student.middle_initial ? ` ${student.middle_initial}.` : ""}
                                </p>
                                <p class="text-xs text-slate-500">ID: ${student.student_number}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="font-semibold text-slate-700 dark:text-slate-200">${student.college_name ?? "-"}</p>
                            <p class="text-xs text-slate-500">${student.course_name ?? "-"}</p>
                            <p class="text-xs text-slate-400 mt-1">${student.department_name ?? "-"}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <p class="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">phone</span>
                                ${student.phone ?? "-"}
                            </p>
                            <p class="text-xs text-slate-500">${student.email ?? "-"}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadge(student.gender)}">
                            ${student.gender}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button class="view-student-btn p-2 text-slate-400 hover:text-primary transition-colors" title="View" data-student-id="${student.id}">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="edit-student-btn p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Edit" data-student-id="${student.id}">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="delete-student-btn p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete" data-student-id="${student.id}">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        studentsSummary.innerHTML = `Showing <span class="font-semibold">${students.length}</span> student${students.length > 1 ? "s" : ""}`;

        bindViewButtons();
        bindEditButtons();
        bindDeleteButtons();
    }

    function fillViewModal(student) {
        const fullName = `${student.last_name}, ${student.first_name}${student.middle_initial ? ` ${student.middle_initial}.` : ""}`;
        viewFullName.textContent = fullName;
        viewStudentNumber.textContent = `Student Number: ${student.student_number ?? "-"}`;

        viewFirstName.textContent = student.first_name ?? "-";
        viewLastName.textContent = student.last_name ?? "-";
        viewMiddleInitial.textContent = student.middle_initial ?? "-";
        viewBirthdate.textContent = student.birthdate ?? "-";
        viewGenderText.textContent = student.gender ?? "-";

        viewCollege.textContent = student.college_name ?? "-";
        viewDepartment.textContent = student.department_name ?? "-";
        viewCourse.textContent = student.course_name ?? "-";
        viewRoleText.textContent = student.role_name ?? "-";
        viewStatusText.textContent = student.status_name ?? "-";

        viewEmail.textContent = student.email ?? "-";
        viewPhone.textContent = student.phone ?? "-";

        viewRegionCode.textContent = student.region_code ?? "-";
        viewProvinceCode.textContent = student.province_code || "No province / N/A";
        viewCityCode.textContent = student.city_municipality_code ?? "-";
        viewBarangayCode.textContent = student.barangay_code ?? "-";
        viewStreetAddress.textContent = student.street_address ?? "-";

        viewGenderBadge.className = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getGenderBadge(student.gender)}`;
        viewGenderBadge.textContent = student.gender ?? "-";

        viewStatusBadge.className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700";
        viewStatusBadge.textContent = student.status_name ?? "-";

        viewRoleBadge.className = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary";
        viewRoleBadge.textContent = student.role_name ?? "-";

        if (student.photo) {
            viewStudentPhotoWrapper.innerHTML = `
                <img src="${student.photo}" alt="${student.first_name} ${student.last_name}" class="h-full w-full object-cover" />
            `;
        } else {
            viewStudentPhotoWrapper.innerHTML = getInitials(student.first_name, student.last_name);
        }
    }

    function bindViewButtons() {
        document.querySelectorAll(".view-student-btn").forEach(button => {
            button.addEventListener("click", () => {
                const studentId = Number(button.getAttribute("data-student-id"));
                const selectedStudent = allStudents.find(student => student.id === studentId);

                if (!selectedStudent) return;

                fillViewModal(selectedStudent);
                openViewModal();
            });
        });
    }

    async function loadEditCitiesForRegion(regionCode, selectedCityCode = "") {
        resetEditPsgcDropdowns();

        if (!regionCode) return false;

        if (regionCode === "130000000") {
            editProvinceCode.innerHTML = `<option value="">No province for NCR</option>`;
            editProvinceCode.disabled = true;
            editProvinceHint.classList.remove("hidden");

            editCityCode.innerHTML = `<option value="">Loading cities/municipalities...</option>`;
            editCityCode.disabled = false;

            const response = await fetch(`${PSGC_API_BASE_URL}/regions/${regionCode}/cities-municipalities/`);
            const cities = await response.json();

            editCityCode.innerHTML = `<option value="">Select city/municipality</option>`;
            cities.sort((a, b) => a.name.localeCompare(b.name)).forEach(city => {
                editCityCode.innerHTML += `<option value="${city.code}">${city.name}</option>`;
            });

            if (selectedCityCode) {
                editCityCode.value = selectedCityCode;
            }

            return true;
        }

        return false;
    }

    async function loadEditProvinces(regionCode, selectedProvinceCode = "") {
        resetEditPsgcDropdowns();

        if (!regionCode || regionCode === "130000000") return;

        editProvinceHint.classList.add("hidden");
        editProvinceCode.disabled = false;
        editProvinceCode.innerHTML = `<option value="">Loading provinces...</option>`;

        const response = await fetch(`${PSGC_API_BASE_URL}/regions/${regionCode}/provinces/`);
        const provinces = await response.json();

        editProvinceCode.innerHTML = `<option value="">Select province</option>`;
        provinces.sort((a, b) => a.name.localeCompare(b.name)).forEach(province => {
            editProvinceCode.innerHTML += `<option value="${province.code}">${province.name}</option>`;
        });

        if (selectedProvinceCode) {
            editProvinceCode.value = selectedProvinceCode;
        }
    }

    async function loadEditCitiesFromProvince(provinceCode, selectedCityCode = "") {
        editCityCode.innerHTML = `<option value="">Select province first</option>`;
        editCityCode.disabled = true;
        editBarangayCode.innerHTML = `<option value="">Select city/municipality first</option>`;
        editBarangayCode.disabled = true;

        if (!provinceCode) return;

        editCityCode.disabled = false;
        editCityCode.innerHTML = `<option value="">Loading cities/municipalities...</option>`;

        const response = await fetch(`${PSGC_API_BASE_URL}/provinces/${provinceCode}/cities-municipalities/`);
        const cities = await response.json();

        editCityCode.innerHTML = `<option value="">Select city/municipality</option>`;
        cities.sort((a, b) => a.name.localeCompare(b.name)).forEach(city => {
            editCityCode.innerHTML += `<option value="${city.code}">${city.name}</option>`;
        });

        if (selectedCityCode) {
            editCityCode.value = selectedCityCode;
        }
    }

    async function loadEditBarangays(cityCode, selectedBarangayCode = "") {
        editBarangayCode.innerHTML = `<option value="">Select city/municipality first</option>`;
        editBarangayCode.disabled = true;

        if (!cityCode) return;

        editBarangayCode.disabled = false;
        editBarangayCode.innerHTML = `<option value="">Loading barangays...</option>`;

        const response = await fetch(`${PSGC_API_BASE_URL}/cities-municipalities/${cityCode}/barangays/`);
        const barangays = await response.json();

        editBarangayCode.innerHTML = `<option value="">Select barangay</option>`;
        barangays.sort((a, b) => a.name.localeCompare(b.name)).forEach(barangay => {
            editBarangayCode.innerHTML += `<option value="${barangay.code}">${barangay.name}</option>`;
        });

        if (selectedBarangayCode) {
            editBarangayCode.value = selectedBarangayCode;
        }
    }

    async function fillEditModal(student) {
        editStudentId.value = student.id;
        editStudentNumber.value = student.student_number ?? "";
        editLastName.value = student.last_name ?? "";
        editFirstName.value = student.first_name ?? "";
        editMiddleInitial.value = student.middle_initial ?? "";
        editBirthdate.value = student.birthdate ?? "";
        editGender.value = student.gender ?? "";
        editEmail.value = student.email ?? "";
        editPhone.value = student.phone ?? "";
        editStreetAddress.value = student.street_address ?? "";

        const selectedCourse = allCourses.find(course => course.id === student.course);
        let selectedDepartment = null;
        let selectedCollegeId = "";

        if (selectedCourse) {
            selectedDepartment = allDepartments.find(department => department.id === selectedCourse.department);
            if (selectedDepartment) {
                selectedCollegeId = selectedDepartment.college;
            }
        }

        editModalCollege.value = selectedCollegeId ? String(selectedCollegeId) : "";
        populateEditDepartments(selectedCollegeId);

        if (selectedDepartment) {
            editModalDepartment.value = String(selectedDepartment.id);
            populateEditCourses(selectedDepartment.id);
        }

        if (student.course) {
            editCourse.value = String(student.course);
        }

        editRegionCode.value = student.region_code ?? "";

        if (student.region_code === "130000000") {
            await loadEditCitiesForRegion(student.region_code, student.city_municipality_code ?? "");
            if (student.city_municipality_code) {
                await loadEditBarangays(student.city_municipality_code, student.barangay_code ?? "");
            }
        } else {
            await loadEditProvinces(student.region_code ?? "", student.province_code ?? "");
            if (student.province_code) {
                await loadEditCitiesFromProvince(student.province_code, student.city_municipality_code ?? "");
            }
            if (student.city_municipality_code) {
                await loadEditBarangays(student.city_municipality_code, student.barangay_code ?? "");
            }
        }
    }

    function bindEditButtons() {
        document.querySelectorAll(".edit-student-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const studentId = Number(button.getAttribute("data-student-id"));
                const selectedStudent = allStudents.find(student => student.id === studentId);

                if (!selectedStudent) return;

                await fillEditModal(selectedStudent);
                openEditModal();
            });
        });
    }

    function fillDeleteModal(student) {
        deleteStudentId.value = student.id;
        deleteStudentName.textContent = `${student.last_name}, ${student.first_name}${student.middle_initial ? ` ${student.middle_initial}.` : ""}`;
        deleteStudentNumber.textContent = `Student Number: ${student.student_number ?? "-"}`;
    }

    function bindDeleteButtons() {
        document.querySelectorAll(".delete-student-btn").forEach(button => {
            button.addEventListener("click", () => {
                const studentId = Number(button.getAttribute("data-student-id"));
                const selectedStudent = allStudents.find(student => student.id === studentId);

                if (!selectedStudent) return;

                fillDeleteModal(selectedStudent);
                openDeleteModal();
            });
        });
    }

    function applyFilters() {
        const searchValue = studentSearch.value.trim().toLowerCase();
        const selectedCollege = collegeFilter.value;
        const selectedDepartment = departmentFilter.value;
        const selectedGender = genderFilter.value;

        const filtered = allStudents.filter(student => {
            const fullName = `${student.last_name} ${student.first_name} ${student.middle_initial ?? ""}`.toLowerCase();
            const studentNumber = (student.student_number ?? "").toLowerCase();

            const matchesSearch =
                fullName.includes(searchValue) ||
                studentNumber.includes(searchValue);

            const matchesCollege = !selectedCollege || student.college_name === selectedCollege;
            const matchesDepartment = !selectedDepartment || student.department_name === selectedDepartment;
            const matchesGender = !selectedGender || student.gender === selectedGender;

            return matchesSearch && matchesCollege && matchesDepartment && matchesGender;
        });

        renderStudents(filtered);
    }

    async function loadStudents() {
        try {
            const response = await fetch(`${API_BASE_URL}/students/`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch students: ${response.status}`);
            }

            allStudents = await response.json();
            populateFilters(allStudents);
            renderStudents(allStudents);
        } catch (error) {
            console.error("Students error:", error);
            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-sm text-red-500">
                        Failed to load students.
                    </td>
                </tr>
            `;
            studentsSummary.innerHTML = `Showing <span class="font-semibold">0</span> students`;
        }
    }

    async function loadAcademicData() {
        try {
            const [collegesResponse, departmentsResponse, coursesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/colleges/`),
                fetch(`${API_BASE_URL}/departments/`),
                fetch(`${API_BASE_URL}/courses/`)
            ]);

            if (!collegesResponse.ok || !departmentsResponse.ok || !coursesResponse.ok) {
                throw new Error("Failed to load academic dropdown data.");
            }

            allColleges = await collegesResponse.json();
            allDepartments = await departmentsResponse.json();
            allCourses = await coursesResponse.json();

            populateModalColleges();
        } catch (error) {
            console.error("Academic dropdown error:", error);
            modalCollege.innerHTML = `<option value="">Failed to load colleges</option>`;
            modalDepartment.innerHTML = `<option value="">Failed to load departments</option>`;
            courseSelect.innerHTML = `<option value="">Failed to load courses</option>`;
        }
    }

    async function loadRegions() {
        try {
            const response = await fetch(`${PSGC_API_BASE_URL}/regions/`);

            if (!response.ok) {
                throw new Error("Failed to load regions.");
            }

            allRegions = await response.json();
            const sortedRegions = sortRegionsWithNcrFirst(allRegions);

            regionSelect.innerHTML = `<option value="">Select region</option>`;
            editRegionCode.innerHTML = `<option value="">Select region</option>`;

            sortedRegions.forEach(region => {
                regionSelect.innerHTML += `<option value="${region.code}">${region.name}</option>`;
                editRegionCode.innerHTML += `<option value="${region.code}">${region.name}</option>`;
            });

        } catch (error) {
            console.error("Regions error:", error);
            regionSelect.innerHTML = `<option value="">Failed to load regions</option>`;
            editRegionCode.innerHTML = `<option value="">Failed to load regions</option>`;
        }
    }

    async function loadProvincesOrCitiesFromRegion(regionCode) {
        resetPsgcDropdowns();

        if (!regionCode) return;

        if (regionCode === "130000000") {
            provinceSelect.innerHTML = `<option value="">No province for NCR</option>`;
            provinceSelect.disabled = true;
            provinceHint.classList.remove("hidden");

            citySelect.innerHTML = `<option value="">Loading cities/municipalities...</option>`;
            citySelect.disabled = false;

            try {
                const response = await fetch(`${PSGC_API_BASE_URL}/regions/${regionCode}/cities-municipalities/`);
                const cities = await response.json();

                citySelect.innerHTML = `<option value="">Select city/municipality</option>`;
                cities.sort((a, b) => a.name.localeCompare(b.name)).forEach(city => {
                    citySelect.innerHTML += `<option value="${city.code}">${city.name}</option>`;
                });
            } catch (error) {
                console.error("NCR cities error:", error);
                citySelect.innerHTML = `<option value="">Failed to load cities/municipalities</option>`;
            }
            return;
        }

        provinceHint.classList.add("hidden");
        provinceSelect.disabled = false;
        provinceSelect.innerHTML = `<option value="">Loading provinces...</option>`;

        try {
            const response = await fetch(`${PSGC_API_BASE_URL}/regions/${regionCode}/provinces/`);
            const provinces = await response.json();

            provinceSelect.innerHTML = `<option value="">Select province</option>`;
            provinces.sort((a, b) => a.name.localeCompare(b.name)).forEach(province => {
                provinceSelect.innerHTML += `<option value="${province.code}">${province.name}</option>`;
            });
        } catch (error) {
            console.error("Provinces error:", error);
            provinceSelect.innerHTML = `<option value="">Failed to load provinces</option>`;
        }
    }

    async function loadCitiesFromProvince(provinceCode) {
        citySelect.innerHTML = `<option value="">Select province first</option>`;
        citySelect.disabled = true;
        barangaySelect.innerHTML = `<option value="">Select city/municipality first</option>`;
        barangaySelect.disabled = true;

        if (!provinceCode) return;

        citySelect.disabled = false;
        citySelect.innerHTML = `<option value="">Loading cities/municipalities...</option>`;

        try {
            const response = await fetch(`${PSGC_API_BASE_URL}/provinces/${provinceCode}/cities-municipalities/`);
            const cities = await response.json();

            citySelect.innerHTML = `<option value="">Select city/municipality</option>`;
            cities.sort((a, b) => a.name.localeCompare(b.name)).forEach(city => {
                citySelect.innerHTML += `<option value="${city.code}">${city.name}</option>`;
            });
        } catch (error) {
            console.error("Cities error:", error);
            citySelect.innerHTML = `<option value="">Failed to load cities/municipalities</option>`;
        }
    }

    async function loadBarangays(cityCode) {
        barangaySelect.innerHTML = `<option value="">Select city/municipality first</option>`;
        barangaySelect.disabled = true;

        if (!cityCode) return;

        barangaySelect.disabled = false;
        barangaySelect.innerHTML = `<option value="">Loading barangays...</option>`;

        try {
            const response = await fetch(`${PSGC_API_BASE_URL}/cities-municipalities/${cityCode}/barangays/`);
            const barangays = await response.json();

            barangaySelect.innerHTML = `<option value="">Select barangay</option>`;
            barangays.sort((a, b) => a.name.localeCompare(b.name)).forEach(barangay => {
                barangaySelect.innerHTML += `<option value="${barangay.code}">${barangay.name}</option>`;
            });
        } catch (error) {
            console.error("Barangays error:", error);
            barangaySelect.innerHTML = `<option value="">Failed to load barangays</option>`;
        }
    }

    async function submitStudentForm(event) {
        event.preventDefault();
        clearFormMessage(addStudentMessage);

        saveStudentButton.disabled = true;
        saveStudentButton.textContent = "Saving...";

        try {
            const formData = new FormData(addStudentForm);

            if (regionSelect.value === "130000000") {
                formData.set("province_code", "");
            }

            const response = await fetch(`${API_BASE_URL}/students/`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to save student.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to save student. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(addStudentMessage, "Student added successfully.", "success");
            await loadStudents();

            setTimeout(() => {
                closeModal();
            }, 800);

        } catch (error) {
            console.error("Add student error:", error);
            showFormMessage(addStudentMessage, error.message, "error");
        } finally {
            saveStudentButton.disabled = false;
            saveStudentButton.textContent = "Save Student";
        }
    }

    async function submitEditStudentForm(event) {
        event.preventDefault();
        clearFormMessage(editStudentMessage);

        updateStudentButton.disabled = true;
        updateStudentButton.textContent = "Updating...";

        try {
            const studentId = editStudentId.value;
            const formData = new FormData(editStudentForm);

            if (!editPhoto.files.length) {
                formData.delete("photo");
            }

            if (editRegionCode.value === "130000000") {
                formData.set("province_code", "");
            }

            const response = await fetch(`${API_BASE_URL}/students/${studentId}/`, {
                method: "PATCH",
                body: formData
            });

            if (!response.ok) {
                let errorMessage = "Failed to update student.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to update student. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(editStudentMessage, "Student updated successfully.", "success");
            await loadStudents();

            setTimeout(() => {
                closeEditModal();
            }, 800);

        } catch (error) {
            console.error("Edit student error:", error);
            showFormMessage(editStudentMessage, error.message, "error");
        } finally {
            updateStudentButton.disabled = false;
            updateStudentButton.textContent = "Update Student";
        }
    }

    async function confirmDeleteStudent() {
        clearFormMessage(deleteStudentMessage);
        confirmDeleteStudentButton.disabled = true;
        confirmDeleteStudentButton.textContent = "Deleting...";

        try {
            const studentId = deleteStudentId.value;
            const response = await fetch(`${API_BASE_URL}/students/${studentId}/delete/`, {
                method: "DELETE"
            });

            if (!response.ok) {
                let errorMessage = "Failed to delete student.";
                try {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                } catch {
                    errorMessage = `Failed to delete student. Status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            showFormMessage(deleteStudentMessage, "Student deleted successfully.", "success");
            await loadStudents();

            setTimeout(() => {
                closeDeleteModal();
            }, 800);

        } catch (error) {
            console.error("Delete student error:", error);
            showFormMessage(deleteStudentMessage, error.message, "error");
        } finally {
            confirmDeleteStudentButton.disabled = false;
            confirmDeleteStudentButton.textContent = "Delete Student";
        }
    }

    studentSearch.addEventListener("input", applyFilters);
    collegeFilter.addEventListener("change", applyFilters);
    departmentFilter.addEventListener("change", applyFilters);
    genderFilter.addEventListener("change", applyFilters);

    resetFilters.addEventListener("click", () => {
        studentSearch.value = "";
        collegeFilter.value = "";
        departmentFilter.value = "";
        genderFilter.value = "";
        renderStudents(allStudents);
    });

    openAddStudentModal.addEventListener("click", openModal);
    closeAddStudentModal.addEventListener("click", closeModal);
    cancelAddStudent.addEventListener("click", closeModal);

    addStudentModal.addEventListener("click", (event) => {
        if (event.target === addStudentModal) {
            closeModal();
        }
    });

    closeViewStudentModal.addEventListener("click", closeViewModal);
    viewStudentDoneButton.addEventListener("click", closeViewModal);

    viewStudentModal.addEventListener("click", (event) => {
        if (event.target === viewStudentModal) {
            closeViewModal();
        }
    });

    closeEditStudentModal.addEventListener("click", closeEditModal);
    cancelEditStudent.addEventListener("click", closeEditModal);

    editStudentModal.addEventListener("click", (event) => {
        if (event.target === editStudentModal) {
            closeEditModal();
        }
    });

    closeDeleteStudentModal.addEventListener("click", closeDeleteModal);
    cancelDeleteStudent.addEventListener("click", closeDeleteModal);
    confirmDeleteStudentButton.addEventListener("click", confirmDeleteStudent);

    deleteStudentModal.addEventListener("click", (event) => {
        if (event.target === deleteStudentModal) {
            closeDeleteModal();
        }
    });

    modalCollege.addEventListener("change", () => {
        populateModalDepartments(modalCollege.value);
    });

    modalDepartment.addEventListener("change", () => {
        populateModalCourses(modalDepartment.value);
    });

    editModalCollege.addEventListener("change", () => {
        populateEditDepartments(editModalCollege.value);
    });

    editModalDepartment.addEventListener("change", () => {
        populateEditCourses(editModalDepartment.value);
    });

    regionSelect.addEventListener("change", async () => {
        await loadProvincesOrCitiesFromRegion(regionSelect.value);
    });

    provinceSelect.addEventListener("change", async () => {
        await loadCitiesFromProvince(provinceSelect.value);
    });

    citySelect.addEventListener("change", async () => {
        await loadBarangays(citySelect.value);
    });

    editRegionCode.addEventListener("change", async () => {
        const isNcr = await loadEditCitiesForRegion(editRegionCode.value);
        if (!isNcr && editRegionCode.value) {
            await loadEditProvinces(editRegionCode.value);
        }
    });

    editProvinceCode.addEventListener("change", async () => {
        await loadEditCitiesFromProvince(editProvinceCode.value);
    });

    editCityCode.addEventListener("change", async () => {
        await loadEditBarangays(editCityCode.value);
    });

    addStudentForm.addEventListener("submit", submitStudentForm);
    editStudentForm.addEventListener("submit", submitEditStudentForm);

    loadStudents();
    loadAcademicData();
    loadRegions();
});
