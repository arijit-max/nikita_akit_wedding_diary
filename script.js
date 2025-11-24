document.addEventListener("DOMContentLoaded", () => {
    /* ========= EVENT CARDS FADE-IN ========= */
    const cards = document.querySelectorAll(".event-card");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));

    /* ========= COUPLE CAROUSEL ========= */
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dots .dot");
    const prevBtn = carousel.querySelector(".carousel-arrow.prev");
    const nextBtn = carousel.querySelector(".carousel-arrow.next");

    let currentIndex = 0;
    let autoPlayTimer = null;
    const AUTO_PLAY_INTERVAL = 3000; // 3 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
        currentIndex = index;
    }

    function goToNext() {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function goToPrev() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(goToNext, AUTO_PLAY_INTERVAL);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    // Arrow events
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            goToNext();
            startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            goToPrev();
            startAutoPlay();
        });
    }

    // Dot events
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    // Pause autoplay on hover (desktop) / focus
    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);
    carousel.addEventListener("focusin", stopAutoPlay);
    carousel.addEventListener("focusout", startAutoPlay);

    // Basic swipe support for mobile
    let startX = 0;
    let isTouching = false;

    carousel.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isTouching = true;
            startX = e.touches[0].clientX;
            stopAutoPlay();
        }
    });

    carousel.addEventListener("touchmove", (e) => {
        if (!isTouching) return;
        const diffX = e.touches[0].clientX - startX;
        // You could add visual drag effect here if you want
        if (Math.abs(diffX) > 60) {
            if (diffX < 0) {
                goToNext();
            } else {
                goToPrev();
            }
            isTouching = false;
            startAutoPlay();
        }
    });

    carousel.addEventListener("touchend", () => {
        isTouching = false;
    });

    // Init
    showSlide(0);
    startAutoPlay();
});
