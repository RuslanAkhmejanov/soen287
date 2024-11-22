const currentPage = window.location.pathname;

let form;

document.addEventListener('DOMContentLoaded', () => {

    const username = document.getElementById('username'); // present in both forms
    const password = document.getElementById('password'); // present in both forms
    const eyeIcon = document.getElementById('eye-icon') // present in both forms

    if (currentPage === '/signin' || currentPage === '/admin/signin') {
        form = document.getElementById('sign-in-form');

        if (form) {
            // there is not such functionality on the admin signin form
            if (currentPage === '/signin') {
                displayPassword(password, null, eyeIcon);
            }

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                validInfo = validateSignInForm(username, password);
                if (validInfo) {
                    // actually submit the form
                    event.target.submit();
                }
            });

        } else {
            console.log("Form not found.");
        }

    } else if (currentPage === '/signup') {
        form = document.getElementById('sign-up-form');
        const name = document.getElementById('name');
        const passwordConfirmation = document.getElementById('password-confirmation');

        if (form) {

            displayPassword(password, passwordConfirmation, eyeIcon);

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                validInfo = validateSignUpForm(name, username, password, passwordConfirmation);
                if (validInfo) {
                    // actually submit the form
                    event.target.submit();
                }
            });
        } else {
            console.log("Form not found.");
        }

    }

});

function displayPassword(password, passwordConfirmation, eyeIcon) {

    eyeIcon.addEventListener('click', () => {
        if (password.type === 'password') {
            password.type = 'text';
            eyeIcon.src = './assets/show-icon.svg'

            if (passwordConfirmation) {
                passwordConfirmation.type = 'text';
            }

        } else {
            password.type = 'password';
            eyeIcon.src = './assets/hide-icon.svg'

            if (passwordConfirmation) {
                passwordConfirmation.type = 'password';
            }

        }
    });

}

function setDefaultError(username, password) {
    const usernameContainer = username.parentElement;
    const usernameError = usernameContainer.querySelector('.input-error');

    const formContainer = password.parentElement;
    const errorDisplay = formContainer.querySelector('.input-error');

    errorDisplay.innerText = '';
    usernameError.innerText = '';

    if (currentPage === '/signin') {
        password.style.border = '7px outset rgba(12, 230, 254, 0.2)';
        username.style.border = '7px outset rgba(12, 230, 254, 0.2)';
    } else if (currentPage === '/admin/signin') {
        password.style.border = '1px solid silver';
        username.style.border = '1px solid silver';
    }
}

function setSuccess(element) {
    const formContainer = element.parentElement;
    const errorDisplay = formContainer.querySelector('.input-error');

    errorDisplay.innerText = '';
    element.style.border = '4px solid green';
}

function setError(element, message) {
    const formContainer = element.parentElement;
    const errorDisplay = formContainer.querySelector('.input-error');

    errorDisplay.innerText = message;
    element.style.border = '4px solid red';
}

function isValidEmail(email) {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return regex.test(email.toLowerCase());
}

function isValidPhone(phone) {
    // Regex to match US/Canada phone numbers
    const regex = /^\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return regex.test(phone);
}

function validateSignInForm(username, password) {
    let isValid = true;

    usernameValue = username.value.trim();
    passwordValue = password.value.trim();

    if (usernameValue === '') {
        setError(username, '*username is required');
        isValid = false;
    } else {
        console.log("I am here");
        setDefaultError(username, password);
    }

    if (passwordValue === '') {
        setError(password, '*password is required');
        isValid = false;
    } else {
        setDefaultError(username, password);
    }

    return isValid;

}

function validateSignUpForm(name, username, password, passwordConfirmation) {

    let isValid = true;

    nameValue = name.value.trim();
    usernameValue = username.value.trim();
    passwordValue = password.value.trim();
    passwordConfirmationValue = passwordConfirmation.value.trim();

    if (nameValue === '') {
        setError(name, '*name is required');
        isValid = false;
    } else {
        setSuccess(name);
    }

    if (usernameValue === '') {
        setError(username, '*username is required');
        isValid = false;
    }
    else if (!(isValidEmail(usernameValue) || isValidPhone(usernameValue))) {
        setError(username, '*phone or email must be valid');
        isValid = false;
    } else {
        setSuccess(username);
    }

    if (passwordValue === '') {
        setError(password, '*password is required');
        isValid = false;
    } else if (passwordValue.length < 8) {
        setError(password, '*password must be at least 8 characters');
        isValid = false;
    } else {
        setSuccess(password);
    }

    if (passwordConfirmationValue === '') {
        setError(passwordConfirmation, '*type your password again');
        isValid = false;
    } else if (passwordValue != passwordConfirmationValue) {
        setError(passwordConfirmation, '*passwords do not match');
        isValid = false;
    } else {
        setSuccess(passwordConfirmation);
    }

    return isValid;

}
