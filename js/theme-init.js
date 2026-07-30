(function () {
    const savedTheme = localStorage.getItem("theme");
    // Default to dark theme if no preference is saved
    if (savedTheme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
    } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function updateIcon() {
        if (!themeIcon) return;
        if (document.documentElement.classList.contains("dark")) {
            themeIcon.textContent = "light_mode";
        } else {
            themeIcon.textContent = "dark_mode";
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark = document.documentElement.classList.contains("dark");
            if (isDark) {
                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
                localStorage.setItem("theme", "light");
            } else {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
                localStorage.setItem("theme", "dark");
            }
            updateIcon();
        });
    }

    updateIcon();
});
