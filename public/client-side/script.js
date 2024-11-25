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
            form.action = signOutLink.getAttribute('href');

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


    // Add new staff member
    const addStaffMemberButton = document.getElementById('add-staff-member');
    if (addStaffMemberButton) {
        addStaffMemberButton.addEventListener('click', () => {
            const staffSection = document.getElementById('staff-members-section');
            const newIndex = document.querySelectorAll('.staff-member-input').length;
            const newStaffMember = document.querySelector('.staff-member-input').cloneNode(true);

            // Update input names to match the new index
            newStaffMember.querySelectorAll('input, textarea').forEach(input => {
                input.name = input.name.replace(/\[\d+\]/, `[${newIndex}]`);
                input.value = ''; // Clear input values
            });

            newStaffMember.querySelector('img')?.remove(); // Remove the image preview
            staffSection.insertBefore(newStaffMember, addStaffMemberButton);
        });
    }

    // Remove staff member
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-staff-member')) {
            event.target.closest('.staff-member-input').remove();
        }
    });

    // Add new service
    const addServiceButton = document.getElementById('add-service');
    if (addServiceButton) {
        addServiceButton.addEventListener('click', () => {
            const serviceSection = document.getElementById('services-section');
            const newIndex = document.querySelectorAll('.service-input').length;
            const newService = document.querySelector('.service-input').cloneNode(true);

            // Update input names to match the new index
            newService.querySelectorAll('input, textarea').forEach(input => {
                input.name = input.name.replace(/\[\d+\]/, `[${newIndex}]`);
                input.value = ''; // Clear input values
            });

            serviceSection.insertBefore(newService, addServiceButton);
        });
    }

    // Remove service
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-service')) {
            event.target.closest('.service-input').remove();
        }
    });

    // Update form data before submission
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        // Ensure all dynamically added/removed elements are included in the form data
        const staffMembers = document.querySelectorAll('.staff-member-input');
        staffMembers.forEach((staffMember, index) => {
            staffMember.querySelectorAll('input, textarea').forEach(input => {
                input.name = input.name.replace(/\[\d+\]/, `[${index}]`);
            });
        });

        const services = document.querySelectorAll('.service-input');
        services.forEach((service, index) => {
            service.querySelectorAll('input, textarea').forEach(input => {
                input.name = input.name.replace(/\[\d+\]/, `[${index}]`);
            });
        });
    });
});
