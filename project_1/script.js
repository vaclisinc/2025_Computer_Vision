// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen functionality
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }, 2500);

    // Navigation functionality
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links (exclude explore button)
    navLinks.forEach(link => {
        // Skip the explore button as it's handled separately
        if (link.id === 'explore-btn') return;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fix explore button with multiple fallback methods
    function setupExploreButton() {
        const exploreBtn = document.getElementById('explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Explore button clicked');
                
                const introSection = document.getElementById('intro');
                console.log('Found intro section:', introSection);
                
                if (introSection) {
                    // Try multiple methods for better compatibility
                    
                    // Method 1: scrollIntoView
                    try {
                        introSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                        console.log('Used scrollIntoView');
                    } catch (e1) {
                        console.log('scrollIntoView failed, trying manual scroll');
                        
                        // Method 2: Manual scroll calculation
                        try {
                            const rect = introSection.getBoundingClientRect();
                            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                            const targetPosition = rect.top + scrollTop - 70;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                            console.log('Used manual scroll to:', targetPosition);
                        } catch (e2) {
                            console.log('Manual scroll failed, using basic scroll');
                            
                            // Method 3: Basic scroll without smooth behavior
                            const offsetTop = introSection.offsetTop - 70;
                            window.scrollTo(0, offsetTop);
                            console.log('Used basic scroll to:', offsetTop);
                        }
                    }
                } else {
                    console.error('Intro section not found!');
                    // Fallback: scroll to a fixed position
                    window.scrollTo({
                        top: 800,
                        behavior: 'smooth'
                    });
                }
                
                return false;
            }, true); // Use capture phase
            
            console.log('Explore button handler attached');
        } else {
            console.error('Explore button not found');
        }
    }
    
    // Setup button after a small delay to ensure DOM is ready
    setTimeout(setupExploreButton, 100);

    // Active nav link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.text-block, .result-card, .method-card, .info-card');
    animatedElements.forEach(el => observer.observe(el));

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumber = !isNaN(parseFloat(target));
            
            if (isNumber) {
                const targetValue = parseFloat(target);
                const duration = 2000;
                const step = targetValue / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < targetValue) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            }
        });
    };

    // Trigger counter animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000);
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Image loading and error handling
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        // Set default opacity to 1 so images are visible
        img.style.opacity = '1';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
            img.alt = 'Image not available';
            console.warn('Failed to load image:', img.src);
        });
    });

    // Typing animation for hero title
    const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    };

    // Enhanced image hover effects
    const resultCards = document.querySelectorAll('.result-card');
    
    resultCards.forEach(card => {
        const img = card.querySelector('img');
        const overlay = card.querySelector('.image-overlay');
        
        card.addEventListener('mouseenter', () => {
            img.style.filter = 'brightness(0.8)';
            overlay.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            img.style.filter = 'brightness(1)';
            overlay.style.opacity = '0';
        });
    });

    // Algorithm demonstration animation
    const algorithmDemo = document.querySelector('.algorithm-demo');
    
    if (algorithmDemo) {
        const demoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const channels = entry.target.querySelectorAll('.channel-box');
                    const arrows = entry.target.querySelectorAll('.alignment-arrow');
                    
                    // Animate channels and arrows in sequence
                    channels.forEach((channel, index) => {
                        setTimeout(() => {
                            channel.style.animation = `channelPulse 2s ease-in-out infinite ${index * 0.5}s`;
                        }, index * 500);
                    });
                    
                    arrows.forEach((arrow, index) => {
                        setTimeout(() => {
                            arrow.style.animation = 'arrowPulse 2s ease-in-out infinite';
                        }, index * 500 + 250);
                    });
                    
                    demoObserver.unobserve(entry.target);
                }
            });
        });
        
        demoObserver.observe(algorithmDemo);
    }

    // Performance metrics visualization
    const createMetricsChart = () => {
        const metricsData = [
            { name: 'monastery', time: 0.78, type: 'small' },
            { name: 'cathedral', time: 0.73, type: 'small' },
            { name: 'tobolsk', time: 0.82, type: 'small' },
            { name: 'emir', time: 1.84, type: 'large' },
            { name: 'church', time: 3.68, type: 'large' },
            { name: 'harvesters', time: 3.89, type: 'large' },
            { name: 'icon', time: 3.70, type: 'large' },
            { name: 'self_portrait', time: 3.83, type: 'large' },
            { name: 'three_generations', time: 3.72, type: 'large' },
            { name: 'melons', time: 3.82, type: 'large' },
            { name: 'siren', time: 3.83, type: 'large' },
            { name: 'lugano', time: 3.96, type: 'large' },
            { name: 'lastochikino', time: 3.68, type: 'large' },
            { name: 'italil', time: 3.65, type: 'large' }
        ];

        // Add visual indicators for processing times
        resultCards.forEach(card => {
            const imageName = card.dataset.image;
            const metric = metricsData.find(m => m.name === imageName);
            
            if (metric) {
                const speedIndicator = document.createElement('div');
                speedIndicator.className = 'speed-indicator';
                
                if (metric.time < 1) {
                    speedIndicator.style.background = '#51cf66';
                    speedIndicator.title = 'Fast processing';
                } else if (metric.time < 3) {
                    speedIndicator.style.background = '#ffd43b';
                    speedIndicator.title = 'Medium processing';
                } else {
                    speedIndicator.style.background = '#ff6b6b';
                    speedIndicator.title = 'Slower processing';
                }
                
                speedIndicator.style.position = 'absolute';
                speedIndicator.style.top = '10px';
                speedIndicator.style.right = '10px';
                speedIndicator.style.width = '12px';
                speedIndicator.style.height = '12px';
                speedIndicator.style.borderRadius = '50%';
                speedIndicator.style.zIndex = '10';
                
                card.style.position = 'relative';
                card.appendChild(speedIndicator);
            }
        });
    };

    // Initialize metrics visualization
    setTimeout(createMetricsChart, 1000);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });

    // Add loading progress simulation
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }

    // Easter egg: Konami code
    let konamiCode = [];
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konami.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konami.join(',')) {
            // Add special animation
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });

    // Add rainbow animation for easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Performance optimization: debounce scroll events
    let ticking = false;
    
    const debounceScroll = (callback) => {
        return (...args) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    callback.apply(this, args);
                    ticking = false;
                });
                ticking = true;
            }
        };
    };

    // Apply debounced scroll handlers
    window.addEventListener('scroll', debounceScroll(() => {
        // Navbar scroll effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Parallax effect
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }));

    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    // Skip to content functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID for skip link
    const introSection = document.getElementById('intro');
    if (introSection) {
        introSection.id = 'main-content';
    }

    // Image Modal functionality
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Function to open modal with image data
    function openImageModal(imgSrc, title, description, greenOffset, redOffset, processingTime, metric) {
        modalImage.src = imgSrc;
        modalTitle.textContent = title || 'Image Preview';
        modalDescription.textContent = description || '';
        
        // Show/hide and populate detail items
        const greenDetail = document.getElementById('green-offset-detail');
        const redDetail = document.getElementById('red-offset-detail');
        const timeDetail = document.getElementById('time-detail');
        const metricDetail = document.getElementById('metric-detail');
        
        if (greenOffset) {
            document.getElementById('modal-green-offset').textContent = greenOffset;
            greenDetail.style.display = 'block';
        } else {
            greenDetail.style.display = 'none';
        }
        
        if (redOffset) {
            document.getElementById('modal-red-offset').textContent = redOffset;
            redDetail.style.display = 'block';
        } else {
            redDetail.style.display = 'none';
        }
        
        if (processingTime) {
            document.getElementById('modal-time').textContent = processingTime;
            timeDetail.style.display = 'block';
        } else {
            timeDetail.style.display = 'none';
        }
        
        if (metric && metric !== 'NCC') {
            document.getElementById('modal-metric').textContent = metric;
            metricDetail.style.display = 'block';
        } else if (greenOffset || redOffset) { // Show NCC for result images
            document.getElementById('modal-metric').textContent = 'NCC';
            metricDetail.style.display = 'block';
        } else {
            metricDetail.style.display = 'none';
        }
        
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Function to close modal
    function closeImageModal() {
        imageModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Clear src after animation completes
        setTimeout(() => {
            if (!imageModal.classList.contains('active')) {
                modalImage.src = '';
            }
        }, 300);
    }
    
    // Add click handlers to all clickable images
    document.querySelectorAll('.result-card img, .improvement-img').forEach(img => {
        img.addEventListener('click', function() {
            const card = this.closest('.result-card') || this.closest('.improvement-section');
            let title = 'Image Preview';
            let description = '';
            let greenOffset = '';
            let redOffset = '';
            let processingTime = '';
            let metric = 'NCC';
            
            if (card) {
                const titleElement = card.querySelector('h3') || card.querySelector('h4');
                if (titleElement) {
                    title = titleElement.textContent;
                }
                
                const descElement = card.querySelector('p');
                if (descElement) {
                    description = descElement.textContent;
                }
                
                // Extract offset and timing information from result cards
                if (card.classList.contains('result-card')) {
                    const metrics = card.querySelectorAll('.metric');
                    metrics.forEach(item => {
                        const label = item.querySelector('.label');
                        const value = item.querySelector('.value');
                        if (label && value) {
                            const labelText = label.textContent.toLowerCase();
                            if (labelText.includes('green')) {
                                greenOffset = value.textContent;
                            } else if (labelText.includes('red')) {
                                redOffset = value.textContent;
                            } else if (labelText.includes('time')) {
                                processingTime = value.textContent;
                            } else if (labelText.includes('metric')) {
                                metric = value.textContent;
                            }
                        }
                    });
                }
            }
            
            openImageModal(this.src, title, description, greenOffset, redOffset, processingTime, metric);
        });
    });
    
    // Close modal handlers
    modalClose.addEventListener('click', closeImageModal);
    modalOverlay.addEventListener('click', closeImageModal);
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeImageModal();
        }
    });
    
    // Prevent modal content from closing when clicked
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    console.log('🎨 CS 180 Project 1 website loaded successfully!');
    console.log('📸 Featuring', resultCards.length, 'beautiful historical photographs');
});

// Global function for explore button (accessible from onclick)
function scrollToIntro() {
    console.log('scrollToIntro called');
    const introSection = document.getElementById('intro');
    
    if (introSection) {
        // Simple and reliable scroll
        const yOffset = -70; // Account for navbar
        const y = introSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        // Use smooth scroll if supported, otherwise instant scroll
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo(0, y);
        }
        
        console.log('Scrolled to intro section at position:', y);
        return true;
    } else {
        console.error('Intro section not found');
        return false;
    }
}