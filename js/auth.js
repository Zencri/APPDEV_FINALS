document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem("is_admin");
    const currentPage = window.location.pathname.split("/").pop() || "admindashboard.html";

    // Pages that should ALWAYS redirect to signin if not logged in
    const protectedPages = [
        "admindashboard.html",
        "students.html",
        "employees.html",
        "itemmanagement.html",
        "returns.html",
        "borrowingrequests.html",
        "itemmasterfile.html"
    ];

    const isProtected = protectedPages.includes(currentPage);

    if (isProtected && isAdmin === null) {
        window.location.href = "signin.html";
        return;
    }

    // Display current username and role in top bar
    const usernameEl = document.getElementById("currentUsername");
    if (usernameEl) {
        usernameEl.textContent = localStorage.getItem("username") || "User";
    }
    
    const roleEl = document.getElementById("currentUserRole");
    if (roleEl) {
        roleEl.textContent = isAdmin === "true" ? "Super Administrator" : "Student / Staff";
    }

    if (isAdmin === "false") {
        // Normal user: hide admin-only sidebar items
        document.querySelectorAll("a, button").forEach(el => {
            const href = el.getAttribute("href");
            const target = el.getAttribute("data-target");

            if (
                href === "admindashboard.html" ||
                href === "students.html" ||
                href === "employees.html" ||
                href === "itemmanagement.html" ||
                href === "returns.html" ||
                href === "borrowingrequests.html"
            ) {
                el.style.setProperty("display", "none", "important");
            }
            
            if (target === "userManagementMenu") {
                el.style.setProperty("display", "none", "important");
                const menu = document.getElementById("userManagementMenu");
                if (menu) menu.style.setProperty("display", "none", "important");
            }
        });

        // Hard-block admin-only pages for normal users
        const restrictedPages = ["admindashboard.html", "students.html", "employees.html", "itemmanagement.html", "returns.html", "borrowingrequests.html"];
        if (restrictedPages.includes(currentPage)) {
            window.location.href = "itemmasterfile.html";
            return;
        }
    } else {
        // Admin user: hide normal-user-only sidebar items
        document.querySelectorAll("a, button").forEach(el => {
            const href = el.getAttribute("href");
            if (href === "myborrowings.html") {
                el.style.setProperty("display", "none", "important");
            }
        });
        
        // Hard-block normal-user-only pages for admin
        if (currentPage === "myborrowings.html") {
            window.location.href = "admindashboard.html";
            return;
        }
    }

    // Logout button wiring
    document.querySelectorAll('a[href="signin.html"]').forEach(btn => {
        if (btn.innerHTML.includes("logout") || btn.textContent.includes("Sign Out")) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("is_admin");
                localStorage.removeItem("username");
                window.location.href = "signin.html";
            });
        }
    });
});
