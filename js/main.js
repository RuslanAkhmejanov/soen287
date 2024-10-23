// document.addEventListener("DOMContentLoaded", function() {
//     if (window.location.pathname.includes('admin')) {
//         initAdminDashboard();
//     } else if (window.location.pathname.includes('auth')) {
//         initAuthPage();
//     } else if (window.location.pathname.includes('client-side')) {
//         initClientPage();
//     }
// });

// function initAdminDashboard() {
//     // Admin dashboard logic here
// }

// function initAuthPage() {
//     // Authentication logic here
//     const path = window.location.pathname;

//     if (path.includes('sign-in')) {
//         initSignInPage();
//     } else if (path.includes('sign-up')) {
//         initSignUpPage();
//     }
// }

// function initSignInPage() {
//     // Sign In page logic
//     console.log("Sign In page logic here");
// }

// function initSignUpPage() {
//     // Sign Up page logic
//     console.log("Sign Up page logic here");

// }

// function initClientPage() {
//     // Client-side logic here
// }


document.addEventListener("DOMContentLoaded", function () {
    console.log("Dom loaded");
    // Hard-code an admin user into localStorage (this is just for development)
    const predefinedAdmins = [
      { username: "admin", password: "admin", role: "admin" }
    ];

    // Store predefined admins in localStorage (if not already stored)
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some(user => user.role === "admin")) {
      users = users.concat(predefinedAdmins);
      localStorage.setItem("users", JSON.stringify(users));
    }
  
    // Sign-up form submission
    const signupForm = document.getElementById("sign-up-form");
    if (signupForm) {
      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        // All sign-ups are regular users by default
        let users = JSON.parse(localStorage.getItem("users")) || [];
  
        // Check if username already exists
        const userExists = users.some(user => user.username === username);
        if (userExists) {
          alert("Username already taken.");
          return;
        }
  
        // Add new regular user
        users.push({ username, password, role: "user" });
        localStorage.setItem("users", JSON.stringify(users));
  
        alert("Sign-up successful! You can now sign in.");
        window.location.href = "signin.html"; // Redirect to sign-in page
      });
    }
  
    // Sign-in form submission
    const signinForm = document.getElementById("sign-in-form");
    if (signinForm) {
      signinForm.addEventListener("submit", function (e) {
        console.log("submit clicked");
        e.preventDefault();
  
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        // Retrieve stored users
        const users = JSON.parse(localStorage.getItem("users")) || [];
  
        // Validate user credentials
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          alert("Sign-in successful!");
  
          // Redirect based on user role
          if (user.role === "admin") {
            window.location.href = "../admin/dashboard.html"; // Redirect to admin dashboard
          } else if (user.role === "user") {
            window.location.href = "../client-side/index.html"; // Redirect to client-side index
          }
        } else {
          alert("Invalid username or password.");
        }
      });
    }
  
    // Handle sign-out
    const signOutButton = document.getElementById("signOutButton");
    if (signOutButton) {
      signOutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        alert("You have been signed out.");
        window.location.href = "../auth/signin.html"; // Redirect to sign-in page
      });
    }
  
    // Restrict access to admin dashboard if not signed in or not an admin
    if (window.location.pathname.includes("admin/dashboard.html")) {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser || loggedInUser.role !== "admin") {
        alert("You must be signed in as an admin to access the admin dashboard.");
        window.location.href = "../auth/signin.html"; // Redirect to sign-in page
      }
    }
  
    // Restrict access to client-side index if not signed in as a regular user
    if (window.location.pathname.includes("client-side/index.html")) {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser || loggedInUser.role !== "user") {
        alert("You must be signed in as a regular user to access the client side.");
        window.location.href = "../auth/signin.html"; // Redirect to sign-in page
      }
    }
  });
