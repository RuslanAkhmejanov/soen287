document.addEventListener("DOMContentLoaded", function() {

    // to update the UI based on the logged-in user
    function updateButtons() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        const authButtons = document.getElementById("authentication-buttons");
        const signOutButton = document.getElementById("sign-out-button");

        if (loggedInUser) {
            authButtons.classList.add('hidden-auth-button');
            signOutButton.classList.remove('hidden-auth-button');
        } else {
            authButtons.classList.remove('hidden-auth-button');
            signOutButton.classList.add('hidden-auth-button');
        }
    }

    function handleSignOut(event) {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        updateButtons();
        window.location.href = "../auth/signin.html"; // Redirect to sign in page
    }

    const signOutLink = document.getElementById("sign-out-link");
    if (signOutLink) {
        signOutLink.addEventListener("click", handleSignOut);
    }

    updateButtons();
});
