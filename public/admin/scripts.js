// Toggle sidebar
let sidebarOpen = false;
const sidebar = document.getElementById("sidebar");

function openSidebar() {
    if (!sidebarOpen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if (sidebarOpen) {
        sidebar.classList.remove("sidebar-responsive");
        sidebarOpen = false;
    }
}

// Add service dynamically to the UI and send to the server
document.getElementById('add-service-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const serviceName = document.getElementById("new-service").value.trim();

    if (serviceName) {
        try {
            const response = await fetch('/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: serviceName })
            });

            if (response.ok) {
                addServiceToList(serviceName);
                document.getElementById("new-service").value = ''; // Clear the input
            } else {
                alert('Error adding service. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding service. Please check the console for more information.');
        }
    } else {
        alert("Please enter a service name.");
    }
});

function addServiceToList(serviceName) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    listItem.innerHTML = `
        <span>${serviceName}</span>
        <button class="btn btn-danger btn-sm" onclick="deleteService(this)">Delete</button>
    `;
    document.getElementById("services-list").appendChild(listItem);
}

async function deleteService(button) {
    const listItem = button.parentElement;
    const serviceId = listItem.dataset.serviceId;

    try {
        const response = await fetch(`/services/${serviceId}/delete`, {
            method: 'POST'
        });

        if (response.ok) {
            listItem.remove();
        } else {
            alert('Error deleting service. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting service. Please check the console for more information.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addEmployeeButton = document.getElementById('add-employee');
    const employeesSection = document.getElementById('employees-section');

    if (addEmployeeButton) {
        addEmployeeButton.addEventListener('click', function () {
            const employeeCount = employeesSection.children.length;

            const employeeHtml = `
                <div class="employee-input mb-4">
                    <label for="employee-name-${employeeCount}">Name</label>
                    <input type="text" name="employees[${employeeCount}][name]" class="form-control mb-2" placeholder="Enter employee name" required>
                    <label for="employee-bio-${employeeCount}">Bio</label>
                    <textarea name="employees[${employeeCount}][bio]" class="form-control mb-2" rows="3" required></textarea>
                    <label for="employee-image-${employeeCount}">Image</label>
                    <input type="file" name="employees[${employeeCount}][image]" class="form-control mb-2" accept="image/*">
                </div>
            `;
            employeesSection.insertAdjacentHTML('beforeend', employeeHtml);
        });
    }

    fetchBusinessInfo();
});

async function fetchBusinessInfo() {
    try {
        const response = await fetch('/business-info');
        if (response.ok) {
            const data = await response.json();
            document.getElementById("business-name").textContent = data.name;
            document.getElementById("business-address").textContent = data.address;
            document.getElementById("business-telephone").textContent = data.telephone;
        } else {
            alert('Error fetching business information. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching business information. Please check the console for more information.');
    }
}

// Save Salon Information
function saveSalonInfo() {
    const salonName = document.getElementById("salon-name").value;
    const logoInput = document.getElementById("logo");
    const address = document.getElementById("address").value;
    const telephone = document.getElementById("telephone").value;

    if (logoInput.files.length > 0) {
        const logoFile = logoInput.files[0];
        const logoUrl = URL.createObjectURL(logoFile);
        document.getElementById("modal-logo-url").innerHTML = `<img src="${logoUrl}" alt="Logo" style="width: 100%; height: auto;">`;
    } else {
        document.getElementById("modal-logo-url").textContent = "No logo uploaded";
    }

    document.getElementById("modal-salon-name").textContent = salonName;
    document.getElementById("modal-address").textContent = address;
    document.getElementById("modal-telephone").textContent = telephone;

    document.getElementById("salon-info-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("salon-info-modal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("salon-info-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openConfirmationModal() {
    document.getElementById("confirmation-modal").style.display = "block";
}

function closeConfirmationModal() {
    document.getElementById("confirmation-modal").style.display = "none";
}

document.getElementById("confirm-button").onclick = function() {
    confirmService();
};

function confirmService() {
    alert("Service confirmed successfully!");
    closeConfirmationModal();
}
