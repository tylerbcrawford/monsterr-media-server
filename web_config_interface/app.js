document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('config-form');
    const ipTypeRadios = document.getElementsByName('ip-type');
    const staticDomainSection = document.getElementById('static-domain-section');
    const ddnsSection = document.getElementById('ddns-section');
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
            } else {
                staticDomainSection.classList.add('hidden');
                ddnsSection.classList.remove('hidden');
            }
        });
    });

    // Handle custom SSH port checkbox
    customSshCheckbox.addEventListener('change', function() {
        sshPortInput.classList.toggle('hidden', !this.checked);
    });

    // Handle UFW checkbox
    enableUfwCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            const confirm = window.confirm(
                'Warning: Disabling UFW firewall will leave your server without basic firewall protection. ' +
                'Make sure you have alternative security measures in place.\n\n' +
                'Are you sure you want to disable UFW?'
            );
            if (!confirm) {
                this.checked = true;
            }
        }
    });

    // Form submission
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
            vpn_password: document.getElementById('vpn-password').value
        };

        try {
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

            // Show success message
            alert('Configuration saved successfully!');
            
            // Redirect to next step or refresh
            window.location.href = '/setup-complete';
        } catch (error) {
            console.error('Error saving configuration:', error);
            alert('Failed to save configuration. Please try again.');
        }
    });

    // Set default values
    document.getElementById('puid').value = '1000';
    document.getElementById('pgid').value = '1000';
    document.getElementById('media-dir').value = '/opt/media-server/media';
    document.getElementById('downloads-dir').value = '/opt/media-server/downloads';
    document.getElementById('ssh-port').value = '22';
});
