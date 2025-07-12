// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        if (sectionId === 'home') {
            // For home section, scroll to the very top to show from navigation bar
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
}

function setLoading(isLoading) {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (isLoading) {
        form.classList.add('loading');
        submitBtn.innerHTML = 'Generating API Key...';
        submitBtn.disabled = true;
    } else {
        form.classList.remove('loading');
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m15 2 4 4-4 4M3 9v6h4l4-4 4 4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Generate API Key
        `;
        submitBtn.disabled = false;
    }
}

function showModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formData) {
    let isValid = true;
    clearAllErrors();

    // Validate name
    if (!formData.name || formData.name.trim() === '') {
        showError('name', 'Name is required');
        isValid = false;
    }

    // Validate email
    if (!formData.email || formData.email.trim() === '') {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate WhatsApp token
    if (!formData.whatsapp_token || formData.whatsapp_token.trim() === '') {
        showError('whatsappToken', 'WhatsApp token is required');
        isValid = false;
    }

    // Validate phone number ID
    if (!formData.phone_number_id || formData.phone_number_id.trim() === '') {
        showError('phoneNumberId', 'Phone Number ID is required');
        isValid = false;
    }

    // Validate recipient number
    if (!formData.recipient_number || formData.recipient_number.trim() === '') {
        showError('recipientNumber', 'Recipient number is required');
        isValid = false;
    }

    // Validate terms
    if (!formData.terms) {
        showError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }

    return isValid;
}

// API calls
async function submitRegistration(formData) {
    const response = await fetch('https://zapform-api.onrender.com/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.detail || result.message || 'Registration failed');
    }
    
    return result;
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }
}

// Form submission handler
function initFormSubmission() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                whatsapp_token: formData.get('whatsapp_token'),
                phone_number_id: formData.get('phone_number_id'),
                recipient_number: formData.get('recipient_number'),
                terms: formData.get('terms') === 'on'
            };
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            setLoading(true);
            
            try {
                const result = await submitRegistration(data);
                
                if (result.success) {
                    // Reset form
                    form.reset();
                    
                    // Show success modal
                    showModal();
                } else {
                    throw new Error(result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert(error.message || 'Failed to register. Please try again.');
            } finally {
                setLoading(false);
            }
        });
    }
}

// Modal event handlers
function initModal() {
    const modal = document.getElementById('successModal');
    
    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Real-time form validation
function initRealTimeValidation() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                const fieldName = input.name;
                const value = input.value.trim();
                
                // Clear previous errors
                hideError(fieldName === 'whatsapp_token' ? 'whatsappToken' : 
                         fieldName === 'phone_number_id' ? 'phoneNumberId' :
                         fieldName === 'recipient_number' ? 'recipientNumber' : fieldName);
                
                // Validate based on field type
                if (fieldName === 'email' && value && !validateEmail(value)) {
                    showError('email', 'Please enter a valid email address');
                } else if (!value && input.required) {
                    const fieldLabel = input.previousElementSibling?.textContent || fieldName;
                    showError(fieldName === 'whatsapp_token' ? 'whatsappToken' : 
                             fieldName === 'phone_number_id' ? 'phoneNumberId' :
                             fieldName === 'recipient_number' ? 'recipientNumber' : fieldName, 
                             `${fieldLabel} is required`);
                }
            });
        });
        
        // Terms checkbox validation
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                if (termsCheckbox.checked) {
                    hideError('terms');
                }
            });
        }
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = 'var(--shadow-lg)';
            } else {
                navbar.style.boxShadow = 'var(--shadow-sm)';
            }
        });
    }
}

function initScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFormSubmission();
    initModal();
    initSmoothScrolling();
    initRealTimeValidation();
    initNavbarScroll();
    initScrollTopButton();
    
    // Make scroll function available globally
    window.scrollToSection = scrollToSection;
    window.closeModal = closeModal;
});

// Handle form errors from server response
function handleServerErrors(errors) {
    if (errors && Array.isArray(errors)) {
        errors.forEach(error => {
            const field = error.loc?.[error.loc.length - 1];
            if (field) {
                const fieldName = field === 'whatsapp_token' ? 'whatsappToken' : 
                                field === 'phone_number_id' ? 'phoneNumberId' :
                                field === 'recipient_number' ? 'recipientNumber' : field;
                showError(fieldName, error.msg);
            }
        });
    }
}

// Utility for copying code examples
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Could add a toast notification here
        console.log('Code copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Add copy buttons to code examples (optional enhancement)
function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-example pre');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = 'Copy';
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: var(--gray-600);
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(button);
        
        block.parentElement.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });
        
        block.parentElement.addEventListener('mouseleave', () => {
            button.style.opacity = '0';
        });
        
        button.addEventListener('click', () => {
            const code = block.textContent;
            copyToClipboard(code);
            button.innerHTML = 'Copied!';
            setTimeout(() => {
                button.innerHTML = 'Copy';
            }, 2000);
        });
    });
}

// Initialize copy buttons after DOM load
document.addEventListener('DOMContentLoaded', () => {
    initCodeCopyButtons();
});
