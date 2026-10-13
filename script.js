
"use strict";

/* =========================================
   DAILY RITUAL — REGISTRATION VALIDATION
========================================= */

const registerForm = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const togglePassword = document.getElementById("togglePassword");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* -----------------------------------------
   1. Common error handling
----------------------------------------- */

function setFieldError(input, errorElement, message) {
    errorElement.textContent = message;

    const hasError = message.length > 0;

    input.classList.toggle("invalid", hasError);
    input.setAttribute("aria-invalid", String(hasError));
}


/* -----------------------------------------
   2. Name validation
----------------------------------------- */

function validateName() {
    const name = nameInput.value.trim();

    let message = "";

    if (name.length === 0) {
        message = "Please enter your name.";
    }

    setFieldError(nameInput, nameError, message);

    return message === "";
}


/* -----------------------------------------
   3. Email validation
----------------------------------------- */

function validateEmail() {
    const email = emailInput.value.trim();

    let message = "";

    if (email.length === 0) {
        message = "Please enter your email address.";
    } else if (!emailPattern.test(email)) {
        message = "Please enter a valid email address.";
    }

    setFieldError(emailInput, emailError, message);

    return message === "";
}


/* -----------------------------------------
   4. Password validation
----------------------------------------- */

function validatePassword() {
    const password = passwordInput.value;

    let message = "";

    if (password.length === 0) {
        message = "Please create a password.";
    } else if (password.length < 6) {
        message = "Password must contain at least 6 characters.";
    }

    setFieldError(passwordInput, passwordError, message);

    return message === "";
}


/* -----------------------------------------
   5. Password strength indicator

   Under 6 characters = Too short.
   Otherwise, score the password using:
   - Uppercase and lowercase letters
   - Numbers
   - Special characters
----------------------------------------- */

function updatePasswordStrength() {
    const password = passwordInput.value;

    if (password.length === 0) {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "#b7a18a";
        strengthBar.setAttribute("aria-valuenow", "0");
        strengthText.textContent = "Use at least 6 characters.";
        return;
    }

    if (password.length < 6) {
        strengthBar.style.width = "15%";
        strengthBar.style.backgroundColor = "#b94a43";
        strengthBar.setAttribute("aria-valuenow", "0");
        strengthText.textContent = "Too short — use at least 6 characters.";
        return;
    }

    const checks = [
        /[a-z]/.test(password) && /[A-Z]/.test(password),
        /\d/.test(password),
        /[^A-Za-z0-9]/.test(password)
    ];

    const score = 1 + checks.filter(Boolean).length;

    const levels = {
        1: {
            label: "Weak",
            width: "25%",
            color: "#b94a43"
        },
        2: {
            label: "Fair",
            width: "50%",
            color: "#d18a42"
        },
        3: {
            label: "Good",
            width: "75%",
            color: "#8b9652"
        },
        4: {
            label: "Strong",
            width: "100%",
            color: "#477b50"
        }
    };

    const level = levels[score];

    strengthBar.style.width = level.width;
    strengthBar.style.backgroundColor = level.color;
    strengthBar.setAttribute("aria-valuenow", String(score));

    strengthText.textContent = `Password strength: ${level.label}`;
}


/* -----------------------------------------
   6. Submit button state
----------------------------------------- */

function updateSubmitButton() {
    const nameIsValid = nameInput.value.trim().length > 0;
    const emailIsValid = emailPattern.test(emailInput.value.trim());
    const passwordIsValid = passwordInput.value.length >= 6;

    submitBtn.disabled = !(
        nameIsValid &&
        emailIsValid &&
        passwordIsValid
    );
}


/* -----------------------------------------
   7. Live validation
----------------------------------------- */

function handleInput() {
    // Hide an old success message when details change.
    successMessage.hidden = true;

    validateName();
    validateEmail();
    validatePassword();

    updatePasswordStrength();
    updateSubmitButton();
}

nameInput.addEventListener("input", handleInput);
emailInput.addEventListener("input", handleInput);
passwordInput.addEventListener("input", handleInput);


/* -----------------------------------------
   8. Show / hide password
----------------------------------------- */

togglePassword.addEventListener("click", function () {
    const shouldShowPassword = passwordInput.type === "password";

    passwordInput.type = shouldShowPassword ? "text" : "password";

    togglePassword.textContent = shouldShowPassword ? "Hide" : "Show";

    togglePassword.setAttribute(
        "aria-label",
        shouldShowPassword ? "Hide password" : "Show password"
    );

    togglePassword.setAttribute(
        "aria-pressed",
        String(shouldShowPassword)
    );
});


/* -----------------------------------------
   9. Form submission
----------------------------------------- */

registerForm.addEventListener("submit", function (event) {
    // This is a front-end demonstration, not a real account system.
    event.preventDefault();

    const nameIsValid = validateName();
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();

    updatePasswordStrength();
    updateSubmitButton();

    if (!nameIsValid || !emailIsValid || !passwordIsValid) {
        successMessage.hidden = true;

        const firstInvalidField = [
            nameInput,
            emailInput,
            passwordInput
        ].find(function (input) {
            return input.getAttribute("aria-invalid") === "true";
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;
    }

    successMessage.textContent =
        "Registration successful! All fields are valid.";

    successMessage.hidden = false;
    successMessage.focus();
});


/* -----------------------------------------
   10. Initial state
----------------------------------------- */

[nameInput, emailInput, passwordInput].forEach(function (input) {
    input.setAttribute("aria-invalid", "false");
});

submitBtn.disabled = true;
successMessage.hidden = true;

updatePasswordStrength();
