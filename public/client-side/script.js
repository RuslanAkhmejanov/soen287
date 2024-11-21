document.addEventListener('DOMContentLoaded', function() {

    // to update the UI based on the logged-in user
    function updateButtons() {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        const authButtons = document.getElementById('authentication-buttons');
        const accountButtons = document.getElementById('account-buttons');

        if (loggedInUser) {
            authButtons.classList.add('hidden-buttons');
            accountButtons.classList.remove('hidden-buttons');
        } else {
            authButtons.classList.remove('hidden-buttons');
            accountButtons.classList.add('hidden-buttons');
        }
    }

    function handleSignOut(event) {
        event.preventDefault();
        localStorage.removeItem('loggedInUser');
        updateButtons();
        window.location.href = "../auth/signin.html"; // Redirect to sign in page
    }

    const signOutLink = document.getElementById('sign-out-link');
    if (signOutLink) {
        signOutLink.addEventListener('click', handleSignOut);
    }

    updateButtons();
});
