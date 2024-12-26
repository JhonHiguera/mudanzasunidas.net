document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const inputs = {
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        correo: document.getElementById('correo'),
        telefono: document.getElementById('telefono'),
    };
    const errors = {
        nombre: document.getElementById('nombreError'),
        apellido: document.getElementById('apellidoError'),
        correo: document.getElementById('correoError'),
        telefono: document.getElementById('telefonoError'),
    };
    const successMessage = document.getElementById('successMessage');

    const regex = {
        correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        telefono: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    };

    const validateField = (input, errorElement, regex = null) => {
        const value = input.value.trim();
        const isValid = regex ? regex.test(value) : value !== '';
        errorElement.style.display = isValid ? 'none' : 'block';
        input.style.boxShadow = isValid
            ? 'inset 2px 2px 5px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light)'
            : 'inset 2px 2px 5px #ff6b6b, inset -2px -2px 5px #ff6b6b';
        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isValid = Object.keys(inputs).every((key) =>
            validateField(inputs[key], errors[key], regex[key])
        );
        if (isValid) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                form.reset();
                successMessage.style.display = 'none';
                Object.values(inputs).forEach(input => input.style.boxShadow = '');
            }, 3000);
        }
    });

    Object.keys(inputs).forEach((key) => {
        inputs[key].addEventListener('input', () =>
            validateField(inputs[key], errors[key], regex[key])
        );
    });
});
