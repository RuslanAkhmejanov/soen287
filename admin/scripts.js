// Toggle sisdebar

var sidebarOpen
var sidebar = document.getElementById("sidebar");

function openSidebar() {

    if (!sidebarOpen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true;
    }
}

function closeSidebar() {

    if (sidebarOpen) {
        sidebar.classList.remove("sidebar-responsive")
        sidebarOpen = false;
    }
}

// Function to add services and to make them appear in a list

function addService() {
    const serviceInput = document.getElementById("new-service");
    const serviceName = serviceInput.value.trim();

    if (serviceName) {
        // Create a new list item
        const listItem = document.createElement("li");
        
        // Set the list item's text content
        listItem.textContent = serviceName;

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        // Add delete functionality
        deleteButton.onclick = function() {
            listItem.remove();
        };

        // Append delete button to list item
        listItem.appendChild(deleteButton);

        // Add the new list item to the services list
        document.getElementById("services-list").appendChild(listItem);

        // Clear the input
        serviceInput.value = "";
    } else {
        alert("Please enter a service name.");
    }
}
  

function saveSalonInfo() {
    // Get input values
    const salonName = document.getElementById("salon-name").value;
    const logoInput = document.getElementById("logo");
    const address = document.getElementById("address").value;
    const telephone = document.getElementById("telephone").value;

    // Check if a file was uploaded
    if (logoInput.files.length > 0) {
        const logoFile = logoInput.files[0];
        const logoUrl = URL.createObjectURL(logoFile); // Create a URL for the image

        // Populate modal content
        document.getElementById("modal-logo-url").innerHTML = `<img src="${logoUrl}" alt="Logo" style="width: 100%; height: auto;">`;
    } else {
        document.getElementById("modal-logo-url").textContent = "No logo uploaded";
    }

    // Populate content, name, address, phone
    document.getElementById("modal-salon-name").textContent = salonName;
    document.getElementById("modal-address").textContent = address;
    document.getElementById("modal-telephone").textContent = telephone;

    // Show modal
    document.getElementById("salon-info-modal").style.display = "block";
}

// Function to close the modal ppop up
function closeModal() {
    document.getElementById("salon-info-modal").style.display = "none";
}

// Close modal if the user clicks outside of it
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
    // Logic to confirm the service execution
    alert("Service confirmed successfully!");
    closeConfirmationModal();
}
