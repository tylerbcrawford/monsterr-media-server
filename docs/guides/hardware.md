# Hardware Guide

## Overview

This guide helps you choose the right hardware for your Monsterr Media Server based on your specific needs and usage patterns.

## Use Case Profiles

### Basic Home Server

*   **Ideal for:** Single user or small family, mainly 1080p content, minimal transcoding.

#### Requirements

*   **CPU:** 4 cores (Intel i3/Ryzen 3 or better)
    *   Example: Intel i3-10100 or AMD Ryzen 3 3300X
    *   Passmark score: 7,000+
*   **RAM:** 8GB DDR4
*   **Storage:**
    *   System: 120GB SSD
    *   Media: 2TB+ HDD
*   **Network:** 100Mbps+
*   **Estimated Cost:** \$400-600

#### Performance Expectations

*   1-2 simultaneous 1080p streams
*   Basic media management
*   Minimal transcoding
*   Quick library scanning

### Medium Home Server

*   **Ideal for:** Family use, mixed 1080p/4K content, moderate transcoding.

#### Requirements

*   **CPU:** 6-8 cores (Intel i5/Ryzen 5 or better)
    *   Example: Intel i5-11600K or AMD Ryzen 5 5600X
    *   Passmark score: 15,000+
*   **RAM:** 16GB DDR4
*   **Storage:**
    *   System: 250GB NVMe SSD
    *   Media: 4-8TB HDD (Consider RAID)
*   **Network:** Gigabit
*   **Estimated Cost:** \$800-1200

#### Performance Expectations

*   3-4 simultaneous streams
*   1-2 4K transcodes
*   Fast library scanning
*   Smooth media management

### Power User Setup

*   **Ideal for:** Multiple users, heavy 4K content, frequent transcoding.

#### Requirements

*   **CPU:** 8+ cores (Intel i7/i9 or Ryzen 7/9)
    *   Example: Intel i7-12700K or AMD Ryzen 9 5900X
    *   Passmark score: 20,000+
*   **RAM:** 32GB DDR4
*   **Storage:**
    *   System: 500GB NVMe SSD
    *   Cache: 1TB SSD (for transcoding)
    *   Media: 12TB+ HDD (RAID recommended)
*   **Network:** Gigabit (2.5GbE preferred)
*   **Estimated Cost:** \$1500-2500

#### Performance Expectations

*   5+ simultaneous streams
*   Multiple 4K transcodes
*   Instant library scanning
*   Heavy automation handling

## Component Selection Guide

### CPU Considerations

*   **Transcoding Support:**
    *   Intel QuickSync (recommended for Plex)
    *   Hardware acceleration support
    *   High single-thread performance

*   **Recommended CPUs by Budget:**
    *   Entry: Intel i3-10100 / Ryzen 3 3300X
    *   Mid: Intel i5-11600K / Ryzen 5 5600X
    *   High: Intel i7-12700K / Ryzen 9 5900X

### Memory Configuration

*   **8GB Setup:**
    *   2x4GB DDR4-3200
    *   Minimal Docker containers
    *   Basic monitoring

*   **16GB Setup:**
    *   2x8GB DDR4-3200
    *   Multiple containers
    *   Full monitoring suite

*   **32GB Setup:**
    *   2x16GB DDR4-3200
    *   Heavy automation
    *   Extensive monitoring
    *   Large Plex libraries

### Storage Architecture

*   **System Drive (OS + Docker):**
    *   Minimum: 120GB SATA SSD
    *   Recommended: 250GB NVMe SSD
    *   Optimal: 500GB NVMe SSD

*   **Media Storage:**
    *   Single Drive: WD Red Plus/Seagate IronWolf
    *   RAID 1: Redundancy for important media
    *   RAID 5/6: Large collections with redundancy

*   **Cache Drive (Optional):**
    *   Used for: Transcoding, Docker images
    *   Recommended: SATA/NVMe SSD
    *   Size: 250GB-1TB

### Network Requirements

*   **Minimum:** 100Mbps Ethernet
*   **Recommended:** Gigabit Ethernet
*   **Optimal:** 2.5GbE/10GbE for large setups

## Performance Optimization

### Transcoding

*   Enable hardware transcoding if available.
*   Use an appropriate CPU for the expected load.
*   Consider a GPU for heavy transcoding.
*   Use an SSD cache for transcoding temporary files.

### Storage Performance

*   Separate OS and media drives.
*   Use SSDs for system and cache.
*   Consider RAID for large libraries.
*   Regular SMART monitoring.

### Memory Usage

*   Monitor Docker container limits.
*   Adjust Plex memory settings.
*   Configure swap space.
*   Monitor memory pressure.

### Network Optimization

*   Use wired connections.
*   Use quality network equipment.
*   Proper VLAN setup.
*   QoS configuration.

## Upgrade Paths

### Basic → Medium

1.  CPU upgrade
2.  Add RAM (16GB)
3.  Expand storage
4.  Improve networking

### Medium → Power

1.  CPU/motherboard upgrade
2.  Increase RAM (32GB)
3.  Add cache drive
4.  Implement RAID
5.  Network upgrade

## Maintenance Considerations

### Cooling

*   Adequate case airflow
*   CPU cooler sizing
*   Drive temperatures
*   Regular cleaning

### Power

*   Quality PSU
*   UPS recommended
*   Power consumption monitoring
*   Surge protection

### Backup

*   Redundant storage
*   UPS for safe shutdown
*   Offsite backup strategy
*   Regular testing

## Cost-Saving Tips

1.  Use previous-gen CPUs.
2.  Start with single drives, expand later.
3.  Prioritize CPU over RAM initially.
4.  Reuse existing components.
5.  Consider refurbished enterprise gear.

## Future-Proofing

1.  Choose an expandable platform.
2.  Plan for storage growth.
3.  Consider upgrade paths.
4.  Allow performance headroom.
5.  Select quality components.