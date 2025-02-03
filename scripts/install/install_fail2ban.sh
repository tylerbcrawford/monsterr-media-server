#!/bin/bash

# Install Fail2Ban
apt install -y fail2ban

# Configure Fail2Ban
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Restart Fail2Ban service
systemctl restart fail2ban
