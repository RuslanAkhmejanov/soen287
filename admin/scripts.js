// toggle sisdebar

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
