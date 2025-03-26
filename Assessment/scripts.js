// Part 2: Sidebar Advertisement
let sidebarAnimationTimeout;

// Reset all animation elements to initial state
function resetSidebarAnimation() {
    clearTimeout(sidebarAnimationTimeout);
    
    const scenes = document.querySelectorAll('.sidebar-scene');
    scenes[0].style.opacity = '0';
    scenes[0].style.transform = 'translateX(0)';
    scenes[1].style.opacity = '0';
    scenes[1].style.transform = 'translateX(100%)';
    
    document.querySelector('.sidebar-ad .student-info').style.opacity = '0';
}

// Animate text properties
function animateText(element, startSize, endSize, startColor, endColor, duration) {
    let startTime = null;
    const textElement = element;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);

        // Calculate intermediate values
        const currentSize = startSize + (endSize - startSize) * percentage;
        const currentColor = interpolateColor(startColor, endColor, percentage);
        
        // Apply styles
        textElement.style.fontSize = `${currentSize}px`;
        textElement.style.color = currentColor;

        if (percentage < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

// Convert hex color to RGB for interpolation
function interpolateColor(startHex, endHex, percentage) {
    const start = hexToRgb(startHex);
    const end = hexToRgb(endHex);
    
    const r = Math.round(start.r + (end.r - start.r) * percentage);
    const g = Math.round(start.g + (end.g - start.g) * percentage);
    const b = Math.round(start.b + (end.b - start.b) * percentage);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Main animation sequence
function runSidebarAnimation() {
    resetSidebarAnimation();
    
    const scenes = document.querySelectorAll('.sidebar-scene');
    const studentInfo = document.querySelector('.sidebar-ad .student-info');
    
    // Scene 1: Fade in with text animation
    scenes[0].style.opacity = '1';
    animateText(scenes[0].querySelector('.sidebar-text'), 20, 28, '#0000FF', '#00FF00', 3000);
    
    // Scene 2: Slide in after delay
    sidebarAnimationTimeout = setTimeout(() => {
        scenes[1].style.opacity = '1';
        scenes[1].style.transform = 'translateX(0)';
        animateText(scenes[1].querySelector('.sidebar-text'), 28, 22, '#FFA500', '#FFFFFF', 3000);
        
        // Show final elements
        sidebarAnimationTimeout = setTimeout(() => {
            studentInfo.style.opacity = '1';
        }, 3000);
    }, 3000);
}

// Part 3: Booking System
let currentStep = 1;
const formData = {};

// Update progress indicator dots
function updateProgress() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index < currentStep);
    });
}

// Show specific form step
function showStep(step) {
    document.querySelectorAll('.form-step').forEach(formStep => {
        formStep.style.display = 'none';
    });
    document.querySelector(`.form-step[data-step="${step}"]`).style.display = 'block';
}

// Validate current step before proceeding
function validateStep(step) {
    if (step === 1 && !document.getElementById('date').value) {
        alert('Please select a date');
        return false;
    }
    if (step === 2 && !document.getElementById('email').value.includes('@')) {
        alert('Please enter a valid email');
        return false;
    }
    if (step === 3 && !document.getElementById('ticket-type').value) {
        alert('Please select a ticket type');
        return false;
    }
    return true;
}

// Save data from current step
function saveStepData(step) {
    if (step === 1) {
        formData.date = document.getElementById('date').value;
        formData.adults = document.getElementById('adults').value;
        formData.children = document.getElementById('children').value;
    } else if (step === 2) {
        formData.name = document.getElementById('name').value;
        formData.email = document.getElementById('email').value;
    } else if (step === 3) {
        formData.ticketType = document.getElementById('ticket-type').value;
        formData.locker = document.querySelector('input[name="locker"]:checked').value;
    }
}

// Show booking summary
function showSummary() {
    document.getElementById('summary-date').textContent = formData.date;
    document.getElementById('summary-adults').textContent = formData.adults;
    document.getElementById('summary-children').textContent = formData.children;
    document.getElementById('summary-name').textContent = formData.name;
    document.getElementById('summary-email').textContent = formData.email;
    document.getElementById('summary-ticket-type').textContent = 
        formData.ticketType === 'general' ? 'General Admission' : 'Fast Pass';
    document.getElementById('summary-locker').textContent = 
        formData.locker === 'yes' ? 'Yes' : 'No';
    
    document.querySelector('.form-step.active').style.display = 'none';
    document.getElementById('booking-summary').style.display = 'block';
}

// Move to next step
function nextStep() {
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        if (currentStep < 4) {
            currentStep++;
            showStep(currentStep);
            updateProgress();
        }
    }
}

// Move to previous step
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

// Initialise everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialise sidebar animation
    runSidebarAnimation();
    
    // Set up replay button
    document.querySelector('.replay-btn').addEventListener('click', () => {
        runSidebarAnimation();
    });
    
    // Set up booking system navigation
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', nextStep);
    });
    
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', prevStep);
    });
    
    // Set up form submission
    document.getElementById('submit-btn').addEventListener('click', () => {
        if (document.getElementById('terms').checked) {
            saveStepData(4);
            showSummary();
        } else {
            alert('Please accept the terms and conditions');
        }
    });
    
    // Show first step
    showStep(currentStep);
    updateProgress();
});