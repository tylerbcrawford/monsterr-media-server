#!/bin/bash

# Create Authelia configuration file
cat <<EOL > authelia/configuration.yml
# Authelia configuration

server:
  host: 0.0.0.0
  port: 9091

jwt_secret: '${AUTHELIA_JWT_SECRET}'

default_redirection_url: 'https://${DOMAIN}'

totp:
  issuer: 'Your Organization'

authentication_backend:
  file:
    path: '/config/users_database.yml'

access_control:
  default_policy: deny
  rules:
    - domain:
        - '*.${DOMAIN}'
      policy: two_factor

session:
  name: authelia_session
  secret: '${AUTHELIA_SESSION_SECRET}'
  expiration: 3600
  inactivity: 300
  remember_me_duration: 1M
  domain: '${DOMAIN}'
  redis:
    host: authelia-redis
    port: 6379

storage:
  encryption_key: '${AUTHELIA_STORAGE_ENCRYPTION_KEY}'
  local:
    path: /config/db.sqlite3

notifier:
  smtp:
    host: '${AUTHELIA_NOTIFIER_SMTP_HOST}'
    port: ${AUTHELIA_NOTIFIER_SMTP_PORT}
    username: '${AUTHELIA_NOTIFIER_SMTP_USERNAME}'
    password: '${AUTHELIA_NOTIFIER_SMTP_PASSWORD}'
    sender: '${AUTHELIA_NOTIFIER_SMTP_SENDER}'
    starttls: true

tls:
  key: /etc/letsencrypt/live/auth.${DOMAIN}/privkey.pem
  certificate: /etc/letsencrypt/live/auth.${DOMAIN}/fullchain.pem
EOL

# Create users_database.yml
cat <<EOL > authelia/users_database.yml
users:
  your_username:
    password: '$argon2id$v=19$m=65536,t=2,p=1$...'  # Replace with your hashed password
    displayname: 'Your Name'
    email: 'your-email@example.com'
EOL
