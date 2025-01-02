// Validation functions
const validateDomain = (domain) => {
    // Basic domain validation regex
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
};

const validatePort = (port) => {
    const portNum = parseInt(port);
    return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
};

const validatePath = (path) => {
    // Basic path validation
    return path && path.startsWith('/') && !path.includes('..') && path.length > 1;
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateImdbId = (id) => {
    // IMDB user ID format: ur12345678
    const imdbRegex = /^ur[0-9]{7,8}$/;
    return imdbRegex.test(id);
};

// Function to show validation feedback
const showValidationFeedback = (element, isValid, message) => {
    const feedback = element.parentElement.querySelector('.validation-feedback');
    if (!feedback) {
        const div = document.createElement('div');
        div.className = `validation-feedback ${isValid ? 'valid' : 'invalid'}`;
        div.textContent = message;
        element.parentElement.appendChild(div);
    } else {
        feedback.className = `validation-feedback ${isValid ? 'valid' : 'invalid'}`;
        feedback.textContent = message;
    }
    element.classList.toggle('invalid', !isValid);
};

// Function to check domain availability
const checkDomain = async (domain) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`/check-domain?domain=${encodeURIComponent(domain)}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Domain check failed');
        }
        const data = await response.json();
        return {
            success: true,
            available: data.available,
            message: data.available ? 'Domain is available' : 'Domain may not be accessible'
        };
    } catch (error) {
        console.error('Domain check error:', error);
        return {
            success: false,
            available: false,
            message: error.name === 'AbortError' 
                ? 'Domain check timed out. Please try again.'
                : 'Unable to verify domain. Please check your internet connection.'
        };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('config-form');
    const ipTypeRadios = document.getElementsByName('ip-type');
    const staticDomainSection = document.getElementById('static-domain-section');
    const ddnsSection = document.getElementById('ddns-section');
    const ddnsServiceSection = document.getElementById('ddns-service-section');
    const customSshCheckbox = document.getElementById('custom-ssh');
    const sshPortInput = document.getElementById('ssh-port-input');
    const enableUfwCheckbox = document.getElementById('enable-ufw');
    const sshSection = document.getElementById('ssh-section');

    // Handle IP type selection
    ipTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'static') {
                staticDomainSection.classList.remove('hidden');
                ddnsSection.classList.add('hidden');
                ddnsServiceSection.classList.add('hidden');
            } else {
                staticDomainSection.classList.add('hidden');
                ddnsSection.classList.remove('hidden');
                ddnsServiceSection.classList.remove('hidden');
            }
        });
    });

    // Add validation for SSH port input
    const sshPortField = document.getElementById('ssh-port');
    if (sshPortField) {
        sshPortField.addEventListener('input', function() {
            const isValid = validatePort(this.value);
            showValidationFeedback(
                this,
                isValid,
                isValid ? 'Valid port number' : 'Port must be between 1 and 65535'
            );
        });
    }

    // Add validation for domain
    const domainInput = document.getElementById('domain');
    if (domainInput) {
        let domainCheckTimeout;
        domainInput.addEventListener('input', function() {
            const isValid = validateDomain(this.value);
            showValidationFeedback(
                this,
                isValid,
                isValid ? 'Valid domain format' : 'Invalid domain format'
            );

            // Debounce domain availability check
            clearTimeout(domainCheckTimeout);
            if (isValid) {
                showValidationFeedback(this, true, 'Checking domain availability...');
                domainCheckTimeout = setTimeout(async () => {
                    const result = await checkDomain(this.value);
                    showValidationFeedback(
                        this,
                        result.success && result.available,
                        result.message
                    );
                    
                    // Add warning class for network errors
                    if (!result.success) {
                        const feedback = this.parentElement.querySelector('.validation-feedback');
                        if (feedback) {
                            feedback.classList.add('warning');
                        }
                    }
                }, 500);
            }
        });
    }

    // Add validation for DDNS hostname
    const ddnsHostnameInput = document.getElementById('ddns-hostname');
    if (ddnsHostnameInput) {
        ddnsHostnameInput.addEventListener('input', function() {
            const isValid = validateDomain(this.value);
            showValidationFeedback(
                this,
                isValid,
                isValid ? 'Valid DDNS hostname format' : 'Invalid DDNS hostname format'
            );
        });
    }

    // Add validation for media and downloads paths
    const pathInputs = ['media-dir', 'downloads-dir'].map(id => document.getElementById(id));
    pathInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                const isValid = validatePath(this.value);
                showValidationFeedback(
                    this,
                    isValid,
                    isValid ? 'Valid path format' : 'Path must start with / and be absolute'
                );
            });
        }
    });

    // Add validation for email
    const emailInput = document.getElementById('smtp-sender');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const isValid = validateEmail(this.value);
            showValidationFeedback(
                this,
                isValid,
                isValid ? 'Valid email format' : 'Invalid email format'
            );
        });
    }

    // Add validation for SMTP port
    const smtpPortInput = document.getElementById('smtp-port');
    if (smtpPortInput) {
        smtpPortInput.addEventListener('input', function() {
            const isValid = validatePort(this.value);
            showValidationFeedback(
                this,
                isValid,
                isValid ? 'Valid port number' : 'Port must be between 1 and 65535'
            );
        });
    }

    // Add validation for IMDB User ID
    const imdbUserIdInput = document.getElementById('imdb-user-id');
    if (imdbUserIdInput) {
        imdbUserIdInput.addEventListener('input', function() {
            const isValid = validateImdbId(this.value);
            showValidationFeedback(
                this,
                isValid,
                isValid ? 'Valid IMDB User ID format' : 'Must be in format ur12345678'
            );
        });
    }

    // Handle custom SSH port checkbox with validation
    customSshCheckbox.addEventListener('change', function() {
        sshPortField.classList.toggle('hidden', !this.checked);
        if (this.checked && sshPortField.value) {
            const isValid = validatePort(sshPortField.value);
            showValidationFeedback(
                sshPortField,
                isValid,
                isValid ? 'Valid port number' : 'Port must be between 1 and 65535'
            );
        }
    });

    // Enhanced UFW checkbox with additional warnings
    enableUfwCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            const confirm = window.confirm(
                'Warning: Disabling UFW firewall will leave your server without basic firewall protection.\n\n' +
                'Before proceeding, ensure you have:\n' +
                '1. Alternative firewall solution\n' +
                '2. Proper network security measures\n' +
                '3. Understanding of security implications\n\n' +
                'Are you sure you want to disable UFW?'
            );
            if (!confirm) {
                this.checked = true;
            }
        }
    });

    // Enhanced form submission with validation
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Collect form data
        const formData = {
            // System Settings
            timezone: document.getElementById('timezone').value,
            puid: document.getElementById('puid').value,
            pgid: document.getElementById('pgid').value,

            // Domain Configuration
            use_ddns: document.getElementById('dynamic-ip').checked,
            domain: document.getElementById('dynamic-ip').checked 
                ? document.getElementById('ddns-hostname').value 
                : document.getElementById('domain').value,
            ddns_api_key: document.getElementById('ddns-api-key').value,

            // Security Configuration
            enable_ufw: document.getElementById('enable-ufw').checked,
            enable_fail2ban: document.getElementById('enable-fail2ban').checked,
            custom_ssh: document.getElementById('custom-ssh').checked,
            ssh_port: document.getElementById('ssh-port').value || '22',

            // Media Paths
            media_dir: document.getElementById('media-dir').value,
            downloads_dir: document.getElementById('downloads-dir').value,

            // Service Configuration
            plex_claim: document.getElementById('plex-claim').value,
            vpn_username: document.getElementById('vpn-username').value,
            vpn_password: document.getElementById('vpn-password').value,
            grafana_password: document.getElementById('grafana-password').value,

            // Email Configuration
            smtp_host: document.getElementById('smtp-host').value,
            smtp_port: document.getElementById('smtp-port').value,
            smtp_username: document.getElementById('smtp-username').value,
            smtp_password: document.getElementById('smtp-password').value,
            smtp_sender: document.getElementById('smtp-sender').value,

            // Watchlistarr Configuration
            sonarr_api_key: document.getElementById('sonarr-api-key').value,
            radarr_api_key: document.getElementById('radarr-api-key').value,
            trakt_client_id: document.getElementById('trakt-client-id').value,
            trakt_client_secret: document.getElementById('trakt-client-secret').value,
            imdb_user_id: document.getElementById('imdb-user-id').value
        };

        // Validate all required fields before submission
        const requiredFields = {
            timezone: document.getElementById('timezone'),
            puid: document.getElementById('puid'),
            pgid: document.getElementById('pgid')
        };

        let hasErrors = false;
        for (const [field, element] of Object.entries(requiredFields)) {
            if (!element.value) {
                showValidationFeedback(element, false, `${field} is required`);
                hasErrors = true;
            }
        }

        // Validate domain configuration
        if (document.getElementById('static-ip').checked) {
            const domain = document.getElementById('domain').value;
            if (!validateDomain(domain)) {
                showValidationFeedback(document.getElementById('domain'), false, 'Invalid domain format');
                hasErrors = true;
            }
        } else {
            const ddnsHostname = document.getElementById('ddns-hostname').value;
            if (!validateDomain(ddnsHostname)) {
                showValidationFeedback(document.getElementById('ddns-hostname'), false, 'Invalid DDNS hostname format');
                hasErrors = true;
            }
            if (!document.getElementById('ddns-api-key').value) {
                showValidationFeedback(document.getElementById('ddns-api-key'), false, 'API key is required for DDNS');
                hasErrors = true;
            }
        }

        // Validate custom SSH port if enabled
        if (document.getElementById('custom-ssh').checked) {
            const sshPort = document.getElementById('ssh-port').value;
            if (!validatePort(sshPort)) {
                showValidationFeedback(document.getElementById('ssh-port'), false, 'Invalid SSH port');
                hasErrors = true;
            }
        }

        // Validate paths
        const paths = ['media-dir', 'downloads-dir'];
        for (const pathId of paths) {
            const path = document.getElementById(pathId).value;
            if (!validatePath(path)) {
                showValidationFeedback(document.getElementById(pathId), false, 'Invalid path format');
                hasErrors = true;
            }
        }

        // Validate SMTP configuration if provided
        const smtpHost = document.getElementById('smtp-host').value;
        if (smtpHost) {
            const smtpPort = document.getElementById('smtp-port').value;
            const smtpSender = document.getElementById('smtp-sender').value;
            
            if (!validatePort(smtpPort)) {
                showValidationFeedback(document.getElementById('smtp-port'), false, 'Invalid SMTP port');
                hasErrors = true;
            }
            if (!validateEmail(smtpSender)) {
                showValidationFeedback(document.getElementById('smtp-sender'), false, 'Invalid email format');
                hasErrors = true;
            }
        }

        // Validate watchlistarr configuration if any fields are filled
        const watchlistarrFields = {
            'sonarr-api-key': 'Sonarr API key',
            'radarr-api-key': 'Radarr API key',
            'trakt-client-id': 'Trakt Client ID',
            'trakt-client-secret': 'Trakt Client Secret',
            'imdb-user-id': 'IMDB User ID'
        };

        let hasWatchlistarrConfig = false;
        for (const [id, label] of Object.entries(watchlistarrFields)) {
            if (document.getElementById(id).value) {
                hasWatchlistarrConfig = true;
                break;
            }
        }

        if (hasWatchlistarrConfig) {
            for (const [id, label] of Object.entries(watchlistarrFields)) {
                const value = document.getElementById(id).value;
                if (!value) {
                    showValidationFeedback(document.getElementById(id), false, `${label} is required for watchlistarr`);
                    hasErrors = true;
                }
            }

            // Validate IMDB User ID format
            const imdbUserId = document.getElementById('imdb-user-id').value;
            if (!validateImdbId(imdbUserId)) {
                showValidationFeedback(document.getElementById('imdb-user-id'), false, 'Invalid IMDB User ID format (must be ur12345678)');
                hasErrors = true;
            }
        }

        if (hasErrors) {
            e.preventDefault();
            return;
        }

        try {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';

            // Send configuration to backend
            const response = await fetch('/save-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save configuration');
            }

            const result = await response.json();
            if (result.success) {
                // Show success message with next steps
                const message = 
                    'Configuration saved successfully!\n\n' +
                    'Next Steps:\n' +
                    '1. Review the configuration in config.env\n' +
                    '2. Run the post-installation checks\n' +
                    '3. Configure your services\n\n' +
                    'Would you like to proceed with the installation?';
                
                if (confirm(message)) {
                    window.location.href = '/setup-complete';
                }
            } else {
                throw new Error(result.error || 'Failed to save configuration');
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            alert(`Failed to save configuration: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Save Configuration';
        }
    });

    // Set default values
    document.getElementById('puid').value = '1000';
    document.getElementById('pgid').value = '1000';
    document.getElementById('media-dir').value = '/opt/media-server/media';
    document.getElementById('downloads-dir').value = '/opt/media-server/downloads';
    document.getElementById('ssh-port').value = '22';
    document.getElementById('smtp-port').value = '587';
});
