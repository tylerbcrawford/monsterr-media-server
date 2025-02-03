// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard
    initializeDashboard();
    
    // Update data every 30 seconds
    setInterval(updateDashboard, 30000);
});

// Initialize dashboard components
function initializeDashboard() {
    updateSystemStatus();
    updateQuickStats();
    updateServiceStatus();
    updateRecentEvents();
    updateSystemHealth();
}

// Update all dashboard components
function updateDashboard() {
    updateSystemStatus();
    updateQuickStats();
    updateServiceStatus();
    updateRecentEvents();
    updateSystemHealth();
}

// Fetch data from the monitoring system
async function fetchMonitoringData() {
    try {
        const response = await fetch('/api/monitoring/status');
        return await response.json();
    } catch (error) {
        console.error('Error fetching monitoring data:', error);
        return null;
    }
}

// Update system status indicator
async function updateSystemStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.system-status');
    
    try {
        const data = await fetchMonitoringData();
        if (data && data.status === 'online') {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = 'System Status: Online';
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'System Status: Offline';
        }
    } catch (error) {
        console.error('Error updating system status:', error);
    }
}

// Update quick stats
async function updateQuickStats() {
    try {
        const data = await fetchMonitoringData();
        if (!data) return;

        // Update CPU usage
        document.getElementById('cpu-usage').textContent = `${data.cpu.usage}%`;
        
        // Update memory usage
        const memoryUsed = (data.memory.used / 1024 / 1024 / 1024).toFixed(1);
        const memoryTotal = (data.memory.total / 1024 / 1024 / 1024).toFixed(1);
        document.getElementById('memory-usage').textContent = 
            `${memoryUsed}GB / ${memoryTotal}GB`;
        
        // Update storage usage
        const storageUsed = (data.storage.used / 1024 / 1024 / 1024).toFixed(1);
        const storageTotal = (data.storage.total / 1024 / 1024 / 1024).toFixed(1);
        document.getElementById('storage-usage').textContent = 
            `${storageUsed}TB / ${storageTotal}TB`;
        
        // Update network status
        document.getElementById('network-status').textContent = 
            `${data.network.status}`;
    } catch (error) {
        console.error('Error updating quick stats:', error);
    }
}

// Update service status grid
async function updateServiceStatus() {
    try {
        const data = await fetchMonitoringData();
        if (!data) return;

        const serviceGrid = document.getElementById('service-status');
        serviceGrid.innerHTML = ''; // Clear existing services

        data.services.forEach(service => {
            const serviceCard = createServiceCard(service);
            serviceGrid.appendChild(serviceCard);
        });
    } catch (error) {
        console.error('Error updating service status:', error);
    }
}

// Create service status card
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    const statusClass = service.status === 'running' ? 'success' : 'error';
    
    card.innerHTML = `
        <h4>
            <i class="fas fa-${service.icon}"></i>
            ${service.name}
        </h4>
        <div class="status ${statusClass}">
            ${service.status}
        </div>
    `;
    
    return card;
}

// Update recent events list
async function updateRecentEvents() {
    try {
        const data = await fetchMonitoringData();
        if (!data) return;

        const eventsList = document.getElementById('recent-events');
        eventsList.innerHTML = ''; // Clear existing events

        data.events.forEach(event => {
            const eventItem = createEventItem(event);
            eventsList.appendChild(eventItem);
        });
    } catch (error) {
        console.error('Error updating recent events:', error);
    }
}

// Create event item
function createEventItem(event) {
    const item = document.createElement('div');
    item.className = 'event-item';
    
    item.innerHTML = `
        <div class="event-icon ${event.type}">
            <i class="fas fa-${getEventIcon(event.type)}"></i>
        </div>
        <div class="event-details">
            <div class="event-title">${event.title}</div>
            <div class="event-time">${formatEventTime(event.timestamp)}</div>
        </div>
    `;
    
    return item;
}

// Get icon for event type
function getEventIcon(type) {
    const icons = {
        info: 'info-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle',
        success: 'check-circle'
    };
    return icons[type] || 'info-circle';
}

// Format event timestamp
function formatEventTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

// Update system health cards
async function updateSystemHealth() {
    try {
        const data = await fetchMonitoringData();
        if (!data) return;

        // Update last backup status
        document.getElementById('last-backup').textContent = 
            formatEventTime(data.backup.lastBackup);
        
        // Update monitoring status
        document.getElementById('monitoring-status').textContent = 
            data.monitoring.status;
        
        // Update security status
        document.getElementById('security-status').textContent = 
            data.security.status;
        
        // Update available updates
        document.getElementById('updates-status').textContent = 
            `${data.updates.available} updates available`;
    } catch (error) {
        console.error('Error updating system health:', error);
    }
}

// Error handling
function handleError(error, component) {
    console.error(`Error in ${component}:`, error);
    // Add user-friendly error notification here
}