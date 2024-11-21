document.addEventListener('DOMContentLoaded', function() {

    // // to update the UI based on the logged-in user
    // function updateButtons() {
    //     const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    //     const authButtons = document.getElementById('authentication-buttons');
    //     const accountButtons = document.getElementById('account-buttons');

    //     if (loggedInUser) {
    //         authButtons.classList.add('hidden-buttons');
    //         accountButtons.classList.remove('hidden-buttons');
    //     } else {
    //         authButtons.classList.remove('hidden-buttons');
    //         accountButtons.classList.add('hidden-buttons');
    //     }
    // }

    // function handleSignOut(event) {
    //     event.preventDefault();
    //     localStorage.removeItem('loggedInUser');
    //     updateButtons();
    //     window.location.href = "../auth/signin.html"; // Redirect to sign in page
    // }

    // const signOutLink = document.getElementById('sign-out-link');
    // if (signOutLink) {
    //     signOutLink.addEventListener('click', handleSignOut);
    // }

    // updateButtons();
    document.getElementById('sign-out-link').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default anchor tag behavior

        // Create a form element dynamically
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = '/signout'; // POST request to the logout route

        // Optionally add CSRF token for security (optional but recommended)
        // var csrfTokenInput = document.createElement('input');
        // csrfTokenInput.type = 'hidden';
        // csrfTokenInput.name = '_csrf';  // CSRF token field (depends on your CSRF library)
        // csrfTokenInput.value = '<%= csrfToken %>'; // CSRF token value injected by the server
        // form.appendChild(csrfTokenInput);

        // Append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
    });
});
