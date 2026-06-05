// ============ TYPED TEXT EFFECT ============
const words = ["build things.", "write code.", "solve problems.", "create experiences."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedElement = document.getElementById("typed");

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }
    
    const speed = isDeleting ? 100 : 150;
    setTimeout(typeEffect, speed);
}

// Start typing effect
if (typedElement) typeEffect();

// ============ COUNTER ANIMATION FOR STATS ============
const statNumbers = document.querySelectorAll(".stat-number");
let animated = false;

function animateNumbers() {
    if (animated) return;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute("data-target"));
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
    
    animated = true;
}

// Intersection Observer for Stats
const aboutSection = document.querySelector("#about");
if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(aboutSection);
}

// ============ MOBILE MENU TOGGLE ============
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-links .nav-item").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    });
});

// ============ SMOOTH SCROLL FOR NAVIGATION ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ============ ACTIVE NAVIGATION HIGHLIGHT ON SCROLL ============
function updateActiveNav() {
    const sections = document.querySelectorAll(".section");
    const navItems = document.querySelectorAll(".nav-item");
    
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

// ============ FORM SUBMISSION WITH FORMSPREE ============
const contactForm = document.querySelector(".contact-form");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showFormStatus("Please fill in all fields", "error");
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormStatus("Please enter a valid email address", "error");
            return;
        }
        
        // Show sending status
        showFormStatus("Sending message...", "success");
        
        // Send to Formspree
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormStatus("✅ Message sent successfully! I'll get back to you soon.", "success");
                contactForm.reset(); // Clear the form
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 5000);
            } else {
                const errorData = await response.json();
                console.error("Formspree error:", errorData);
                showFormStatus("❌ Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            console.error("Network error:", error);
            showFormStatus("❌ Network error. Please check your connection.", "error");
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = "block";
    
    // Auto-hide after 5 seconds for success/error messages
    if (type !== "success" || message !== "Sending message...") {
        setTimeout(() => {
            if (formStatus.style.display === "block") {
                formStatus.style.display = "none";
            }
        }, 5000);
    }
}

// ============ SETTINGS SYSTEM ============

// Load saved settings from localStorage
function loadSettings() {
    // Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Font size
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    setFontSize(savedFontSize);
    
    // Animations
    const animationsEnabled = localStorage.getItem('animations') !== 'false';
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
        animationToggle.checked = animationsEnabled;
    }
    if (!animationsEnabled) {
        document.body.classList.add('reduce-motion');
    }
    
    // Accent color
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent', savedColor);
        document.documentElement.style.setProperty('--accent-dark', savedColor);
        const accentColorPicker = document.getElementById('accentColor');
        if (accentColorPicker) {
            accentColorPicker.value = savedColor;
        }
    }
}

// Set theme
function setTheme(theme) {
    const body = document.body;
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    if (theme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    } else if (theme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    } else if (theme === 'auto') {
        // Auto: follow system preference
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
    }
    
    // Update active button
    themeBtns.forEach(btn => {
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    localStorage.setItem('theme', theme);
}

// Set font size
function setFontSize(size) {
    const body = document.body;
    body.classList.remove('font-small', 'font-large');
    
    if (size === 'small') {
        body.classList.add('font-small');
    } else if (size === 'large') {
        body.classList.add('font-large');
    }
    // medium = no class
    
    localStorage.setItem('fontSize', size);
}

// Set accent color
function setAccentColor(color) {
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-dark', color);
    localStorage.setItem('accentColor', color);
}

// Reset all settings
function resetAllSettings() {
    localStorage.removeItem('theme');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('animations');
    localStorage.removeItem('accentColor');
    
    // Reset to defaults
    setTheme('dark');
    setFontSize('medium');
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
        animationToggle.checked = true;
    }
    document.body.classList.remove('reduce-motion');
    setAccentColor('#00d4ff');
    const accentColorPicker = document.getElementById('accentColor');
    if (accentColorPicker) {
        accentColorPicker.value = '#00d4ff';
    }
    
    // Show confirmation
    const statusMsg = document.createElement('div');
    statusMsg.textContent = '✓ All settings reset to default!';
    statusMsg.style.position = 'fixed';
    statusMsg.style.bottom = '20px';
    statusMsg.style.right = '20px';
    statusMsg.style.background = 'var(--accent)';
    statusMsg.style.color = 'var(--bg-primary)';
    statusMsg.style.padding = '10px 20px';
    statusMsg.style.borderRadius = '10px';
    statusMsg.style.zIndex = '9999';
    document.body.appendChild(statusMsg);
    setTimeout(() => statusMsg.remove(), 2000);
}

// Initialize settings event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
        });
    });
    
    // Font size buttons
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.size === 'reset') {
                setFontSize('medium');
            } else {
                setFontSize(btn.dataset.size);
            }
        });
    });
    
    // Animation toggle
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
        animationToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.remove('reduce-motion');
                localStorage.setItem('animations', 'true');
            } else {
                document.body.classList.add('reduce-motion');
                localStorage.setItem('animations', 'false');
            }
        });
    }
    
    // Color picker
    const accentColorPicker = document.getElementById('accentColor');
    if (accentColorPicker) {
        accentColorPicker.addEventListener('input', (e) => {
            setAccentColor(e.target.value);
        });
    }
    
    // Reset color button
    const resetColorBtn = document.getElementById('resetColor');
    if (resetColorBtn) {
        resetColorBtn.addEventListener('click', () => {
            setAccentColor('#00d4ff');
            if (accentColorPicker) {
                accentColorPicker.value = '#00d4ff';
            }
        });
    }
    
    // Reset all settings button
    const resetAllBtn = document.getElementById('resetAllSettings');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', resetAllSettings);
    }
    
    // Listen to system theme changes (for auto mode)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') {
            setTheme('auto');
        }
    });
});

// Update color preview when accent changes
const observerForColor = new MutationObserver(() => {
    const preview = document.querySelector('.color-preview');
    if (preview) {
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        preview.style.background = accent;
    }
});
observerForColor.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

// ============ CONSOLE GREETING (just for fun) ============
console.log("%c🚀 Personal website loaded! Built with vanilla HTML/CSS/JS + Settings panel", "color: #00d4ff; font-size: 16px; font-weight: bold;");
console.log("%c💡 Tip: Check out the Settings page to customize your experience!", "color: #a0a0a0; font-size: 12px;");