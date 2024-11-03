#!/bin/bash

# Configure UFW Firewall
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
