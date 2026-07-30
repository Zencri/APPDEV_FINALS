const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("signinForm");
    const loginMessage = document.getElementById("loginMessage");
    const loginBtn = document.getElementById("loginBtn");

    if (signinForm) {
        signinForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            
            loginBtn.disabled = true;
            loginBtn.innerHTML = `<span>Signing in...</span><span class="material-symbols-outlined text-sm animate-spin">sync</span>`;
            
            loginMessage.classList.add("hidden");
            
            try {
                // CSRF token is usually required for sessions, but since we are not using Django templates, 
                // we might need to handle it or rely on DRF's CSRF exemption if configured. 
                // For this simple implementation, we'll assume the API allows it or we configure DRF to ignore CSRF for login.
                
                const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Login failed");
                }

                // Store role locally for UI logic
                localStorage.setItem("is_admin", data.is_admin);
                localStorage.setItem("username", data.username);
                
                // Redirect to dashboard
                if (data.is_admin) {
                    window.location.href = "admindashboard.html";
                } else {
                    window.location.href = "itemmasterfile.html"; // Normal users go to catalog
                }
                
            } catch (error) {
                loginMessage.classList.remove("hidden");
                loginMessage.classList.add("bg-red-100", "text-red-700", "border", "border-red-200", "dark:bg-red-900/30", "dark:border-red-800", "dark:text-red-400");
                loginMessage.textContent = error.message;
                
                loginBtn.disabled = false;
                loginBtn.innerHTML = `<span>Sign In</span><span class="material-symbols-outlined text-sm">arrow_forward</span>`;
            }
        });
    }
});
