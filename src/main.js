
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        const heroSection = document.querySelector('.hero');
        const realizationSlides = [...document.querySelectorAll('.realization-slide')];
        const realizationTrack = document.getElementById('realizationTrack');
        const realizationSliderTitle = document.getElementById('realizationSliderTitle');
        const realizationCounter = document.getElementById('realizationCounter');
        const realizationPrev = document.getElementById('realizationPrev');
        const realizationNext = document.getElementById('realizationNext');

        const updateHeaderBrandVisibility = () => {
            if (!heroSection) {
                document.body.classList.add('header-brand-visible');
                return;
            }

            const revealThreshold = Math.max(180, heroSection.offsetHeight * 0.42);
            document.body.classList.toggle('header-brand-visible', window.scrollY > revealThreshold);
        };

        window.addEventListener('scroll', updateHeaderBrandVisibility, { passive: true });
        window.addEventListener('resize', updateHeaderBrandVisibility);
        updateHeaderBrandVisibility();

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });

        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });

        const updateRealizationSlider = (index) => {
            if (!realizationSlides.length || !realizationTrack) {
                return;
            }

            const safeIndex = (index + realizationSlides.length) % realizationSlides.length;
            const activeSlide = realizationSlides[safeIndex];
            const title = activeSlide.dataset.title || 'Realizacja';

            realizationTrack.style.transform = 'translateX(-' + (safeIndex * 100) + '%)';
            realizationSliderTitle.textContent = title;
            realizationCounter.textContent = String(safeIndex + 1).padStart(2, '0') + ' / ' + String(realizationSlides.length).padStart(2, '0');
        };

        if (realizationPrev) {
            realizationPrev.addEventListener('click', () => {
                const activeTitle = realizationSliderTitle ? realizationSliderTitle.textContent : '';
                const activeIndex = realizationSlides.findIndex((slide) => slide.dataset.title === activeTitle);
                updateRealizationSlider(activeIndex - 1);
            });
        }

        if (realizationNext) {
            realizationNext.addEventListener('click', () => {
                const activeTitle = realizationSliderTitle ? realizationSliderTitle.textContent : '';
                const activeIndex = realizationSlides.findIndex((slide) => slide.dataset.title === activeTitle);
                updateRealizationSlider(activeIndex + 1);
            });
        }

        updateRealizationSlider(0);

        document.querySelectorAll('.faq-item').forEach((item) => {
            const trigger = item.querySelector('.faq-question');
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach((entry) => entry.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

        // Parallax Ambient Elements Logic
        const ambientElements = document.querySelectorAll('.ambient-element');
        if (ambientElements.length > 0 && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                // Only animate if hero is in view
                if (scrolled < window.innerHeight) {
                    ambientElements.forEach(el => {
                        const speed = el.getAttribute('data-speed');
                        if (speed) {
                            const yPos = -(scrolled * parseFloat(speed));
                            // Use transform, but don't overwrite the CSS animation
                            // Actually, CSS animation applies to transform, so we should wrap the element
                            // OR we can just apply a CSS variable that the transform uses, but for now we'll translate it.
                            // CSS animations will override inline transforms unless we wrap it or use a variable.
                            el.style.setProperty('--scroll-y', `${yPos}px`);
                        }
                    });
                }
            }, { passive: true });
        }

        // 3D Card Hover & Glowing Border Logic
        if (window.matchMedia("(pointer: fine)").matches) {
            const cards = document.querySelectorAll('.service-card, .price-card, .work-card, .process-card');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Update CSS variables for the glowing border position
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);

                    // Calculate 3D tilt
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    // Max rotation of 4 degrees
                    const rotateX = ((y - centerY) / centerY) * -4;
                    const rotateY = ((x - centerX) / centerX) * 4;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                });
            });
        }