// Utility Functions

// Notification system
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove notification after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 400);
        }
    }, 4000);
}

// Add slideOutRight animation to CSS if not already present
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Format date utility
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate macro percentages
function calculateMacroPercentages(calories, protein, carbs, fat) {
    const proteinCals = protein * 4;
    const carbCals = carbs * 4;
    const fatCals = fat * 9;
    const totalCals = proteinCals + carbCals + fatCals;
    
    return {
        protein: totalCals > 0 ? Math.round((proteinCals / totalCals) * 100) : 0,
        carbs: totalCals > 0 ? Math.round((carbCals / totalCals) * 100) : 0,
        fat: totalCals > 0 ? Math.round((fatCals / totalCals) * 100) : 0
    };
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number format
function isValidPhone(phone) {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
}

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Deep clone object
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage utilities
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// API request utility
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Form validation utilities
const validators = {
    required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    minLength(value, length) {
        return value && value.toString().length >= length;
    },
    
    maxLength(value, length) {
        return !value || value.toString().length <= length;
    },
    
    email(value) {
        return !value || isValidEmail(value);
    },
    
    phone(value) {
        return !value || isValidPhone(value);
    },
    
    number(value) {
        return !value || !isNaN(Number(value));
    },
    
    positiveNumber(value) {
        return !value || (!isNaN(Number(value)) && Number(value) > 0);
    }
};

// Form validation function
function validateForm(formData, rules) {
    const errors = {};
    
    for (const field in rules) {
        const fieldRules = rules[field];
        const value = formData[field];
        
        for (const rule of fieldRules) {
            if (typeof rule === 'string') {
                if (!validators[rule](value)) {
                    errors[field] = errors[field] || [];
                    errors[field].push(`${field} ${rule} validation failed`);
                }
            } else if (typeof rule === 'object') {
                const { type, params, message } = rule;
                if (!validators[type](value, ...params)) {
                    errors[field] = errors[field] || [];
                    errors[field].push(message || `${field} ${type} validation failed`);
                }
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Export data utilities
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                ? `"${value.replace(/"/g, '""')}"` 
                : value;
        }).join(','))
    ].join('\n');
    
    downloadFile(csvContent, filename, 'text/csv');
}

function exportToJSON(data, filename = 'export.json') {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Date utilities
const dateUtils = {
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    subDays(date, days) {
        return this.addDays(date, -days);
    },
    
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    },
    
    getWeekStart(date) {
        const result = new Date(date);
        const day = result.getDay();
        const diff = result.getDate() - day;
        return new Date(result.setDate(diff));
    },
    
    getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }
};

// Initialize utility styles
document.addEventListener('DOMContentLoaded', function() {
    addNotificationStyles();
});

// Error handling utility
function handleError(error, userMessage = 'An error occurred') {
    console.error('Error:', error);
    showNotification(userMessage, 'error');
    
    // In production, you might want to send errors to a logging service
    // logErrorToService(error);
}

// Loading state utility
function setLoadingState(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        element.classList.add('loading');
        const originalText = element.textContent;
        element.dataset.originalText = originalText;
        element.textContent = 'Loading...';
    } else {
        element.disabled = false;
        element.classList.remove('loading');
        if (element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
            delete element.dataset.originalText;
        }
    }
}
