// document.addEventListener("DOMContentLoaded", function () {
//     const admins = [
//               { username: "admin", password: "admin"}
//     ];

//     if (!localStorage.getItem('admins')) {
//         localStorage.setItem('admins', JSON.stringify(admins));
//     }

//     document.getElementById('sign-in-form').addEventListener('submit', function(event) {
//         event.preventDefault();
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;

//         const storedAdmins = JSON.parse(localStorage.getItem('admins'));

//         const admin = storedAdmins.find(admin => admin.username === username && admin.password === password);

//         if (admin) {
//             // Redirect to the admin dashboard
//             window.location.href = '../index.html';
//         }
//     });
// });
