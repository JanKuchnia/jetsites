
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
    