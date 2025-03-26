// ========================
// Part 2: Sidebar Advertisement
// ========================
let sidebarAdState = 0;
let sidebarInterval;

function animateSidebar() {
    const sidebar = document.getElementById('sidebar-animation');
    const scenes = sidebar.querySelectorAll('.sidebar-scene');
    const studentInfo = document.querySelector('.sidebar-ad .student-info');
    const replayButton = document.querySelector('.replay-btn');

    // Reset all scenes
    scenes.forEach(scene => {
        scene.style.opacity = 0;
        scene.style.transform = 'translateX(100%)';
    });
    studentInfo.style.opacity = 0;
    replayButton.style.display = 'none'; // Hide replay button initially

    // Scene 1: Discover More Adventures
    if (sidebarAdState === 0) {
        scenes[0].style.opacity = 1;
        animateText(scenes[0].querySelector('.sidebar-text'), 20, 28, '#0000FF', '#00FF00', 3000);
        sidebarAdState++;
    } else if (sidebarAdState === 1) {
        // Scene 2: Explore and Book Today
        scenes[1].style.opacity = 1;
        scenes[1].style.transform = 'translateX(0)';
        animateText(scenes[1].querySelector('.sidebar-text'), 28, 22, '#FFA500', '#FFFFFF', 3000);
        sidebarAdState++;
    }

    // Show student info and replay button after animations
    if (sidebarAdState === 2) {
        studentInfo.style.opacity = 1;
        replayButton.style.display = 'block'; // Show replay button
        clearInterval(sidebarInterval); // Stop the animation loop
    }
}

function replaySidebarAd() {
    sidebarAdState = 0;
    animateSidebar(); // Restart the animation
}

function animateText(element, startSize, endSize, startColor, endColor, duration) {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);

        // Update text size and color
        element.style.fontSize = `${startSize + (endSize - startSize) * percentage}px`;
        element.style.color = interpolateColor(startColor, endColor, percentage);

        if (percentage < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function interpolateColor(startColor, endColor, percentage) {
    // Convert hex to RGB
    const start = hexToRgb(startColor);
    const end = hexToRgb(endColor);
    const r = start.r + (end.r - start.r) * percentage;
    const g = start.g + (end.g - start.g) * percentage;
    const b = start.b + (end.b - start.b) * percentage;
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Initialize sidebar animation
window.addEventListener('DOMContentLoaded', () => {
    // Start the sidebar animation
    sidebarInterval = setInterval(() => {
        if (sidebarAdState === 2) {
            sidebarAdState = 0; // Reset to Scene 1
        }
        animateSidebar();
    }, 6000); // Total animation duration: 6 seconds (3s per scene)

    // Add event listener to the replay button
    document.querySelector('.replay-btn').addEventListener('click', replaySidebarAd);
});

// ========================
// Part 3: Ticket Booking System
// ========================
let currentStep = 1;
const formData = {};

function updateProgress() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index < currentStep);
    });
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(formStep => {
        formStep.style.display = 'none';
    });
    document.querySelector(`.form-step[data-step="${step}"]`).style.display = 'block';
}

function nextStep() {
    if (currentStep < 4) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function submitBooking() {
    // Collect form data
    formData.date = document.getElementById('date').value;
    formData.adults = document.getElementById('adults').value;
    formData.children = document.getElementById('children').value;
    formData.name = document.getElementById('name').value;
    formData.email = document.getElementById('email').value;
    formData.ticketType = document.getElementById('ticket-type').value;
    formData.locker = document.querySelector('input[name="locker"]:checked').value;

    // Display summary
    document.getElementById('summary-date').textContent = formData.date;
    document.getElementById('summary-adults').textContent = formData.adults;
    document.getElementById('summary-children').textContent = formData.children;
    document.getElementById('summary-name').textContent = formData.name;
    document.getElementById('summary-email').textContent = formData.email;
    document.getElementById('summary-ticket-type').textContent = formData.ticketType;
    document.getElementById('summary-locker').textContent = formData.locker;

    // Hide form and show summary
    document.querySelector('.form-step.active').style.display = 'none';
    document.getElementById('booking-summary').style.display = 'block';
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', nextStep);
    });
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', prevStep);
    });

    // Submit button
    document.getElementById('submit-btn').addEventListener('click', submitBooking);

    // Show the first step
    showStep(currentStep);
    updateProgress();
});