document.addEventListener('DOMContentLoaded', function() {
    // overriding the dafault behaivour of the anchor tag that acts as a logout button
    const signOutLink = document.getElementById('sign-out-link');
    // const contactForm = document.getElementById('contact-form');
    if (signOutLink) { // it is only there when a user is signed in
        signOutLink.addEventListener('click', function (event) {
            event.preventDefault();
    
            // create a form element dynamically
            var form = document.createElement('form');
            form.method = 'POST';
            form.action = '/signout';
    
            // optionally add CSRF token for security
            // var csrfTokenInput = document.createElement('input');
            // csrfTokenInput.type = 'hidden';
            // csrfTokenInput.name = '_csrf';
            // csrfTokenInput.value = '<%= csrfToken %>';
            // form.appendChild(csrfTokenInput);
    
            // append the form to the body and submit it
            document.body.appendChild(form);
            form.submit();
        });
    }

    // if (contactForm) {
    //     const name = contactForm.elements[]
    // } else {
    //     console.log("Form not found.")
    // }
    document.getElementById('add-employee-btn').addEventListener('click', () => {
        const employeeSection = document.getElementById('employees-section');
        const newIndex = document.querySelectorAll('.employee-input').length;
        const newEmployee = document.querySelector('.employee-input').cloneNode(true);

        // Update input names to match the new index
        newEmployee.querySelectorAll('input, textarea').forEach(input => {
            input.name = input.name.replace(/\[\d+\]/, `[${newIndex}]`);
            input.value = ''; // Clear input values
        });

        newEmployee.querySelector('img')?.remove(); // Remove the image preview
        employeeSection.appendChild(newEmployee);
    });

});
