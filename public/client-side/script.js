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
    
            // append the form to the body and submit it
            document.body.appendChild(form);
            form.submit();
        });
    }

    // delete time inputs if the business is closed
    const statusInputs = document.querySelectorAll('input[type="text"].form-control.mr-2');

    statusInputs.forEach(input => {
        input.addEventListener('input', function () {
            const parentDiv = this.closest('.d-flex'); // Find the parent container of the inputs
            const timeInputs = parentDiv.querySelectorAll('input[type="time"]'); // Select time inputs within the same section

            if (this.value.toLowerCase() === 'closed') {
                this.value = 'Closed';
                // Remove time inputs if status is Closed
                timeInputs.forEach(timeInput => timeInput.remove());
            } else if (this.value.toLowerCase() === 'open') {
                this.value = 'Open';
                // Add time inputs if not present and status is Open
                if (timeInputs.length === 0) {
                    const startTimeInput = document.createElement('input');
                    startTimeInput.type = 'time';
                    startTimeInput.className = 'form-control mr-2';
                    startTimeInput.name = input.name;
                    startTimeInput.required = true;

                    const endTimeInput = document.createElement('input');
                    endTimeInput.type = 'time';
                    endTimeInput.className = 'form-control mr-2';
                    endTimeInput.name = input.name;
                    endTimeInput.required = true;

                    // Insert the new inputs into the parent container
                    this.after(startTimeInput, endTimeInput);
                }
            }
        });
    });

    const addStaffMemberButton = document.getElementById('add-staff-member');
    let newStaffMemberTemplate = null; // This will hold the initial cloned template

    if (addStaffMemberButton) {
        // Clone the template once before any clicks
        const firstStaffMember = document.querySelector('.staff-member-input');
        if (firstStaffMember) {
            newStaffMemberTemplate = firstStaffMember.cloneNode(true);
        }

        addStaffMemberButton.addEventListener('click', () => {
            const staffSection = document.getElementById('staff-members-section');
            
            // Get the current number of staff member inputs to calculate the new index
            const newIndex = document.querySelectorAll('.staff-member-input').length || 0;

            // Use the cloned template (if it exists) to create a new staff member input
            if (newStaffMemberTemplate) {
                const newStaffMember = newStaffMemberTemplate.cloneNode(true); // Clone it again each time

                // Update input names and values for the new staff member
                newStaffMember.querySelectorAll('input, textarea').forEach(input => {
                    // Update the name attributes to use the correct index
                    input.name = input.name.replace(/\[\d+\]/, `[${newIndex}]`);
                    input.value = ''; // Clear input values
                    input.required = true; // Make input required
                });

                // Optionally remove any image preview (if there was one)
                newStaffMember.querySelector('img')?.remove();

                // Add the new staff member input above the "add staff member" button
                staffSection.insertBefore(newStaffMember, addStaffMemberButton);
            }
            const staffInputs = document.querySelectorAll('.staff-member-input');

            // If there are 10 or more staff members, hide the "Add Staff Member" button
            if (staffInputs.length >= 10) {
                addStaffMemberButton.style.display = 'none'; // Hide the button
            }
        });
    }

    // Remove staff member
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-staff-member')) {
            event.target.closest('.staff-member-input').remove();

            const staffInputs = document.querySelectorAll('.staff-member-input');

            // If the number of staff inputs is less than 10, show the "Add Staff Member" button
            const addStaffMemberButton = document.getElementById('add-staff-member');
            if (staffInputs.length < 10) {
                addStaffMemberButton.style.display = '';  // Show the button again
            }
        }
    });

    // Add new service
    const addServiceButton = document.getElementById('add-service');
    let serviceTemplate = null; // This will hold the initial cloned template

    if (addServiceButton) {
        // Clone the template once before any clicks
        const firstService = document.querySelector('.service-input');
        if (firstService) {
            serviceTemplate = firstService.cloneNode(true);
        }
        addServiceButton.addEventListener('click', () => {
            const serviceSection = document.getElementById('services-section');
            const newIndex = document.querySelectorAll('.service-input').length || 0;

            // Use the cloned template (if it exists) to create a new staff member input
            if (serviceTemplate) {
                const newService = serviceTemplate.cloneNode(true); // Clone it again each time

                // Update input names and values for the new staff member
                newService.querySelectorAll('input, textarea').forEach(input => {
                    // Update the name attributes to use the correct index
                    input.name = input.name.replace(/\[\d+\]/, `[${newIndex}]`);
                    input.value = ''; // Clear input values
                    input.required = true; // Make input required
                });

                // Optionally remove any image preview (if there was one)
                newService.querySelector('img')?.remove();

                // Add the new staff member input above the "add staff member" button
                serviceSection.insertBefore(newService, addServiceButton);
            }

            const serviceInputs = document.querySelectorAll('.service-input');
            if (serviceInputs.length >= 10) {
                addServiceButton.style.display = 'none'; // Hide the button
            }
        });
    }

    // Remove service
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-service')) {
            event.target.closest('.service-input').remove();

            const serviceInputs = document.querySelectorAll('.service-input');
            // If the number of staff inputs is less than 10, show the "Add Staff Member" button
            const addServiceButton = document.getElementById('add-service');
            if (serviceInputs.length < 10) {
                addServiceButton.style.display = '';  // Show the button again
            }
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
