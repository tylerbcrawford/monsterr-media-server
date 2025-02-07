**Comprehensive Implementation Plan for Secure VNC Integration**

### **1. Overview**
This document outlines the steps to integrate a secure VNC setup into the existing media server infrastructure, utilizing **NGINX, Fail2Ban, and Authelia**.

### **2. Objectives**
- Enable VNC access over a **secure web-based** interface.
- Require **Authelia authentication (2FA)** for access.
- Restrict unauthorized access using **NGINX reverse proxy**.
- Implement **SSH tunneling** as a secure alternative for emergency access.
- Harden security with **Fail2Ban and UFW firewall rules**.

---

### **3. Implementation Steps**

#### **3.1 Install and Configure noVNC**
1. Install necessary packages:
   ```bash
   sudo apt install -y novnc websockify
   ```
2. Run Websockify to forward VNC traffic to a web-accessible port:
   ```bash
   websockify --web /usr/share/novnc/ 6080 localhost:5901 &
   ```
3. Verify that noVNC is accessible at:
   ```
   http://localhost:6080
   ```

#### **3.2 Configure NGINX Reverse Proxy**
1. Create a new NGINX configuration file for VNC:
   ```bash
   sudo nano /etc/nginx/sites-available/vnc
   ```
2. Add the following configuration:
   ```nginx
   server {
       listen 443 ssl;
       server_name vnc.example.com;

       ssl_certificate /etc/letsencrypt/live/vnc.example.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/vnc.example.com/privkey.pem;

       location / {
           auth_request /authelia;
           error_page 401 =302 https://auth.example.com;

           proxy_pass http://localhost:6080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
       }
   }
   ```
3. Enable the configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/vnc /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

#### **3.3 Enforce Authentication with Authelia**
1. Edit the **Authelia configuration file** (`configuration.yml`):
   ```yaml
   access_control:
     rules:
       - domain: "vnc.example.com"
         policy: two_factor
   ```
2. Restart Authelia:
   ```bash
   sudo systemctl restart authelia
   ```

#### **3.4 Implement Firewall Rules (UFW)**
1. Restrict VNC access to localhost:
   ```bash
   sudo ufw deny 5901
   sudo ufw allow from 192.168.1.0/24 to any port 443 proto tcp
   sudo ufw enable
   ```

#### **3.5 Enable SSH Tunnel for Emergency Access**
1. Run VNC in **local mode** to restrict direct external access:
   ```bash
   vncserver -localhost :1
   ```
2. Establish an SSH tunnel from a remote client:
   ```bash
   ssh -L 5901:localhost:5901 user@your-server-ip
   ```
3. Connect the **VNC client** to:
   ```
   localhost:5901
   ```

#### **3.6 Configure Fail2Ban for SSH and VNC**
1. Edit Fail2Ban jail configuration:
   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```
2. Add the following rules:
   ```ini
   [sshd]
   enabled = true
   maxretry = 3
   bantime = 1h
   findtime = 10m

   [vnc]
   enabled = true
   port = 5901
   filter = vnc
   logpath = /var/log/auth.log
   maxretry = 3
   ```
3. Restart Fail2Ban:
   ```bash
   sudo systemctl restart fail2ban
   ```

#### **3.7 Ensure VNC Only Binds to Localhost**
1. Edit the VNC systemd service:
   ```bash
   sudo nano /etc/systemd/system/vncserver@.service
   ```
2. Modify the `ExecStart` line:
   ```ini
   ExecStart=/usr/bin/vncserver -localhost :%i
   ```
3. Restart the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart vncserver@1
   ```

---

### **4. Security Best Practices**
- **Require Authelia authentication for web-based VNC access**.
- **Restrict SSH access to trusted IPs**:
  ```bash
  sudo ufw allow from YOUR-TRUSTED-IP to any port 22 proto tcp
  ```
- **Monitor logs for unauthorized attempts**:
  ```bash
  sudo journalctl -u nginx --since "1 hour ago"
  sudo tail -f /var/log/auth.log
  ```
- **Consider implementing WireGuard VPN for an extra security layer**.

---

### **5. Conclusion**
This plan ensures **secure access to VNC** while leveraging existing **NGINX, Authelia, and Fail2Ban** security controls. The **NGINX reverse proxy with Authelia protects VNC behind 2FA**, while **SSH tunneling remains as a secure backup method**. All unnecessary exposure is mitigated through **firewall rules, Fail2Ban protections, and localhost-only VNC binding**.

Proceed with implementation and verify security using penetration testing tools like `nmap` and `fail2ban-client`.

