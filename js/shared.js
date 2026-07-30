// Shared UI interactions used across all pages
document.addEventListener("DOMContentLoaded", () => {
    // Sidebar accordion menu toggles
    document.querySelectorAll(".menu-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const targetMenu = document.getElementById(targetId);
            const arrow = button.querySelector(".menu-arrow");
            if (!targetMenu) return;

            const isExpanded = button.getAttribute("aria-expanded") === "true";
            if (isExpanded) {
                button.setAttribute("aria-expanded", "false");
                targetMenu.classList.add("hidden");
                if (arrow) arrow.textContent = "expand_more";
            } else {
                button.setAttribute("aria-expanded", "true");
                targetMenu.classList.remove("hidden");
                if (arrow) arrow.textContent = "expand_less";
            }
        });
    });

    // Display logged-in username in navbar
    const usernameEl = document.getElementById("currentUsername");
    if (usernameEl) {
        usernameEl.textContent = localStorage.getItem("username") || "Admin";
    }
});

// Global Toast Notification System
function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toastContainer";
        toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-3";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    
    // Styling based on type
    let bgClass = "bg-emerald-500 dark:bg-emerald-600";
    let icon = "check_circle";
    if (type === "error") {
        bgClass = "bg-red-500 dark:bg-red-600";
        icon = "error";
    } else if (type === "info") {
        bgClass = "bg-blue-500 dark:bg-blue-600";
        icon = "info";
    }

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg shadow-black/10 dark:shadow-[0_4px_20px_rgb(0,0,0,0.5)] text-white transform transition-all duration-300 translate-y-10 opacity-0 ${bgClass}`;
    
    toast.innerHTML = `
        <span class="material-symbols-outlined">${icon}</span>
        <span class="text-sm font-medium">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove("translate-y-10", "opacity-0");
    });

    // Remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-x-10");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Attach to window so it is accessible from all other scripts
window.showToast = showToast;

