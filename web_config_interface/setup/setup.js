// Setup Wizard JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('setup-form');
    const steps = document.querySelectorAll('.setup-step');
    const progress = document.getElementById('setup-progress');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const setupComplete = document.getElementById('setup-complete');

    let currentStep = 1;
    const totalSteps = steps.length;

    // Initialize progress bar
    updateProgress();

    // Event Listeners
    prevBtn.addEventListener('click', () => navigateStep(-1));
    nextBtn.addEventListener('click', () => navigateStep(1));
    form.addEventListener('submit', handleSubmit);

    // Domain type toggle
    const domainTypeRadios = document.querySelectorAll('input[name="domain-type"]');
    const ddnsGroups = document.querySelectorAll('.ddns-group');
    const staticDomainGroup = document.getElementById('static-domain-group');

    domainTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isDynamic = radio.value === 'dynamic';
            ddnsGroups.forEach(group => group.style.display = isDynamic ? 'block' : 'none');
            staticDomainGroup.style.display = isDynamic ? 'none' : 'block';
        });
    });

    // Email configuration toggle
    const enableEmailCheckbox = document.getElementById('enable-email');
    const emailConfig = document.getElementById('email-config');

    enableEmailCheckbox.addEventListener('change', () => {
        emailConfig.style.display = enableEmailCheckbox.checked ? 'block' : 'none';
        validateStep(currentStep);
    });

    // Path validation
    const pathInputs = ['media-dir', 'downloads-dir'];
    pathInputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('blur', () => validatePath(input));
    });

    // Domain validation
    const domainInput = document.getElementById('domain');
    domainInput.addEventListener('blur', () => validateDomain(domainInput));

    // Navigation functions
    async function navigateStep(direction) {
        if (await validateStep(currentStep)) {
            const newStep = currentStep + direction;
            if (newStep >= 1 && newStep <= totalSteps) {
                showStep(newStep);
            }
        }
    }

    function showStep(step) {
        steps.forEach(s => s.style.display = 'none');
        steps[step - 1].style.display = 'block';
        
        currentStep = step;
        updateProgress();
        updateNavigation();
    }

    function updateProgress() {
        const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progress.style.width = `${percent}%`;
    }

    function updateNavigation() {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'flex';
        submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
    }

    // Validation functions
    async function validateStep(step) {
        const currentStepEl = steps[step - 1];
        const requiredInputs = currentStepEl.querySelectorAll('input[required]');
        let isValid = true;

        for (const input of requiredInputs) {
            if (!input.value) {
                showError(input, 'This field is required');
                isValid = false;
                continue;
            }

            if (input.id === 'domain') {
                isValid = await validateDomain(input);
            } else if (pathInputs.includes(input.id)) {
                isValid = await validatePath(input);
            }
        }

        return isValid;
    }

    async function validatePath(input) {
        const status = input.nextElementSibling;
        
        try {
            showLoading(true);
            const response = await fetch('/api/validate/path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: input.value })
            });
            
            const data = await response.json();
            
            if (data.exists && data.isDirectory && data.writable) {
                showSuccess(input, 'Directory is valid and writable');
                return true;
            } else {
                showError(input, 'Directory must exist and be writable');
                return false;
            }
        } catch (error) {
            showError(input, 'Failed to validate directory');
            return false;
        } finally {
            showLoading(false);
        }
    }

    async function validateDomain(input) {
        try {
            showLoading(true);
            const response = await fetch('/api/validate/domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: input.value })
            });
            
            const data = await response.json();
            
            if (data.valid) {
                showSuccess(input, data.message);
                return true;
            } else {
                showError(input, data.message);
                return false;
            }
        } catch (error) {
            showError(input, 'Failed to validate domain');
            return false;
        } finally {
            showLoading(false);
        }
    }

    // Form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        if (!await validateStep(currentStep)) {
            return;
        }

        try {
            showLoading(true);
            
            // Collect form data
            const formData = new FormData(form);
            const config = Object.fromEntries(formData.entries());

            // Add email configuration only if enabled
            if (!enableEmailCheckbox.checked) {
                delete config.AUTHELIA_NOTIFIER_SMTP_HOST;
                delete config.AUTHELIA_NOTIFIER_SMTP_PORT;
                delete config.AUTHELIA_NOTIFIER_SMTP_USERNAME;
                delete config.AUTHELIA_NOTIFIER_SMTP_PASSWORD;
                delete config.AUTHELIA_NOTIFIER_SMTP_SENDER;
            }

            // Save configuration
            const response = await fetch('/api/config/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const result = await response.json();
            
            if (result.success) {
                form.style.display = 'none';
                setupComplete.style.display = 'block';
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            alert(`Failed to save configuration: ${error.message}`);
        } finally {
            showLoading(false);
        }
    }

    // Helper functions
    function showError(input, message) {
        const status = input.nextElementSibling;
        status.className = 'validation-status invalid';
        status.innerHTML = `<i class="fas fa-times-circle"></i> ${message}`;
        input.classList.add('invalid');
    }

    function showSuccess(input, message) {
        const status = input.nextElementSibling;
        status.className = 'validation-status valid';
        status.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        input.classList.remove('invalid');
    }

    function showLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
});