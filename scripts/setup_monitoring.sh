#!/bin/bash

# Create Prometheus configuration
cat <<EOL > prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
EOL

# Move prometheus.yml to the prometheus directory
mv prometheus.yml ./prometheus/prometheus.yml
