document.addEventListener('DOMContentLoaded', function() {
    // overriding the dafault behaivour of the anchor tag that acts as a logout button
    document.getElementById('sign-out-link').addEventListener('click', function (event) {
        event.preventDefault();

        // create a form element dynamically
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = '/signout';

        // Optionally add CSRF token for security (optional but recommended)
        // var csrfTokenInput = document.createElement('input');
        // csrfTokenInput.type = 'hidden';
        // csrfTokenInput.name = '_csrf';  // CSRF token field (depends on your CSRF library)
        // csrfTokenInput.value = '<%= csrfToken %>'; // CSRF token value injected by the server
        // form.appendChild(csrfTokenInput);

        // append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
    });
});
