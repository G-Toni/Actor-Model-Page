/* ===============================
   MOBILE MENU TOGGLE
   Centralised here so it works on every page (index.html, resume.html).
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("menu-toggle");
    const navItems = document.getElementById("nav-items");

    if (toggleBtn && navItems) {
        toggleBtn.addEventListener("click", function () {
            navItems.classList.toggle("show");
        });
    }
});


/* ===============================
   HERO VIDEO MUTE / UNMUTE
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const heroVideo = document.getElementById("hero-video");
    const muteButton = document.getElementById("muteToggle");

    if (heroVideo && muteButton) {
        const iconMuted = muteButton.querySelector(".icon-muted");
        const iconUnmuted = muteButton.querySelector(".icon-unmuted");

        muteButton.addEventListener("click", function () {
            heroVideo.muted = !heroVideo.muted;

            const isMuted = heroVideo.muted;
            muteButton.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");

            if (iconMuted && iconUnmuted) {
                iconMuted.style.display = isMuted ? "block" : "none";
                iconUnmuted.style.display = isMuted ? "none" : "block";
            }
        });
    }
});


/* ===============================
   HERO VIDEO — LOAD + PAUSE WHEN OFF-SCREEN
   - The video file is attached here (not in the HTML) so it can be skipped
     for visitors with "data saver" or "reduce motion" on: they just see the
     poster image, and no video bandwidth is spent.
   - The video pauses when scrolled out of view, freeing the browser to
     render the rest of the page smoothly (avoids blank blocks) and saving
     battery. It resumes when the visitor scrolls back up.
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const heroVideo = document.getElementById("hero-video");
    if (!heroVideo) return;

    const source = heroVideo.querySelector("source[data-src]");
    const connection = navigator.connection || {};
    const saveData = connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType || "");
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (saveData || reduceMotion) {
        heroVideo.removeAttribute("autoplay");
        const muteButton = document.getElementById("muteToggle");
        if (muteButton) muteButton.style.display = "none";
        return; /* poster only */
    }

    if (source) {
        source.src = source.dataset.src;
        source.removeAttribute("data-src");
        heroVideo.load();
    }

    function tryPlay() {
        const playPromise = heroVideo.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () { /* autoplay blocked: poster stays */ });
        }
    }

    if (!("IntersectionObserver" in window)) {
        tryPlay();
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                tryPlay();
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.05 });

    observer.observe(heroVideo);
});


/* ===============================
   ABOUT IMAGE SCROLL EFFECT
   IntersectionObserver instead of a scroll listener: the browser tells us
   once when the image comes into view (no work on every scroll tick).
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const img = document.querySelector(".section-aboutus--right img");
    if (!img) return;

    if (!("IntersectionObserver" in window)) {
        img.classList.add("visible");
        return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                img.classList.add("visible");
                obs.disconnect();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(img);
});


/* ===============================
   LAZY BACKGROUND IMAGES
   Elements with data-bg="image.jpg" only download their background
   when they get close to the screen (testimonials, contact header).
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("[data-bg]");
    if (!elements.length) return;

    function applyBackground(el) {
        el.style.backgroundImage = "url('" + el.dataset.bg + "')";
        el.removeAttribute("data-bg");
    }

    if (!("IntersectionObserver" in window)) {
        elements.forEach(applyBackground);
        return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                applyBackground(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: "400px 0px" });

    elements.forEach(function (el) { observer.observe(el); });
});


/* ===============================
   PHOTO LIBRARY — LIGHTBOX (maximized view + download + close)
================================ */

function openLightbox(imgEl) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const downloadBtn = document.getElementById("lightbox-download-btn");

    if (!lightbox || !lightboxImg || !imgEl) return;

    lightboxImg.src = imgEl.src;
    if (downloadBtn) downloadBtn.href = imgEl.src;

    lightbox.style.display = "flex";
    lightbox.classList.add("active");
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    lightbox.style.display = "none";
    lightbox.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
    });
});


/* ===============================
   IMAGE GALLERY — LOAD MORE
   With loading="lazy" on the <img> tags, hidden images are NOT
   downloaded until "Load More" reveals them.
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".image-item");
    const loadMoreBtn = document.querySelector(".load-more-btn");

    if (!images.length || !loadMoreBtn) return;

    let imagesToShow = 10;

    images.forEach((img, index) => {
        img.style.display = index < imagesToShow ? "block" : "none";
    });

    loadMoreBtn.addEventListener("click", function () {
        imagesToShow += 10;

        images.forEach((img, index) => {
            img.style.display = index < imagesToShow ? "block" : "none";
        });

        if (imagesToShow >= images.length) {
            loadMoreBtn.style.display = "none";
        }
    });
});


/* ===============================
   DOWNLOAD ALL IMAGES (gallery.html)
================================ */

function downloadAllImages() {
    const images = document.querySelectorAll(".image-item img");

    images.forEach((img, index) => {
        const link = document.createElement("a");
        link.href = img.src;
        link.download = `gerson-toni-image-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}


/* ===============================
   VIDEO LIBRARY — LIGHTBOX (maximized view + download + close)

   The video file is only requested HERE, when the visitor clicks
   to watch. Thumbnails in the grid are static images, so browsing
   categories costs no video bandwidth.

   Accepts:
   - a URL string:            openVideoLightbox("https://.../clip.mp4")
   - a <video> element:       openVideoLightbox(videoEl)   (legacy pages)
   - options.youtube = "ID":  plays a YouTube embed instead (no bandwidth
                              cost to the site; download button is hidden)
================================ */

function openVideoLightbox(source, options) {
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");
    const downloadBtn = document.getElementById("download-video-btn");

    if (!lightbox || !lightboxContent || !source) return;

    options = options || {};

    let videoSrc = "";
    if (typeof source === "string") {
        videoSrc = source;
    } else {
        if (typeof source.pause === "function") source.pause();
        const inner = source.querySelector ? source.querySelector("source") : null;
        videoSrc = source.currentSrc || (inner && inner.src) || source.src || "";
    }

    stopLightboxVideo();
    lightboxContent.innerHTML = "";

    if (options.youtube) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" +
            encodeURIComponent(options.youtube) + "?autoplay=1&rel=0&modestbranding=1";
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        iframe.allowFullscreen = true;
        lightboxContent.appendChild(iframe);

        if (downloadBtn) downloadBtn.style.display = "none";
    } else {
        if (!videoSrc) return;

        const video = document.createElement("video");
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        lightboxContent.appendChild(video);

        if (downloadBtn) {
            downloadBtn.href = videoSrc;
            downloadBtn.style.display = "inline-block";
        }
    }

    lightbox.style.display = "flex";
    lightbox.classList.add("active");
}

/* Fully stops the video so the browser stops downloading it */
function stopLightboxVideo() {
    const lightboxContent = document.getElementById("video-lightbox-content");
    if (!lightboxContent) return;

    const video = lightboxContent.querySelector("video");
    if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
    }
}

function closeVideoLightbox() {
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");

    if (!lightbox || !lightboxContent) return;

    stopLightboxVideo();

    lightbox.style.display = "none";
    lightbox.classList.remove("active");
    lightboxContent.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    const videoLightbox = document.getElementById("video-lightbox");
    if (!videoLightbox) return;

    videoLightbox.addEventListener("click", function (e) {
        if (e.target === videoLightbox) closeVideoLightbox();
    });
});


/* ===============================
   VIDEO SECTION — LOAD MORE (legacy static pages only)
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll(".video-item");
    const loadMoreBtn = document.querySelector(".load-more-videos-btn");

    if (!videos.length || !loadMoreBtn) return;

    let videosToShow = 6;

    function displayVideos() {
        videos.forEach((vid, index) => {
            vid.style.display = index < videosToShow ? "block" : "none";
        });

        if (videosToShow >= videos.length) {
            loadMoreBtn.style.display = "none";
        }
    }

    displayVideos();

    loadMoreBtn.addEventListener("click", function () {
        videosToShow += 6;
        displayVideos();
    });
});


/* ===============================
   VIDEO SECTION — CLICK TO OPEN (legacy static pages only)
   On index.html nothing exists at load time, so this skips.
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll(".video-item");
    const lightbox = document.getElementById("video-lightbox");

    if (!videos.length || !lightbox) return;

    videos.forEach(videoItem => {
        const iframe = videoItem.querySelector("iframe");
        const video = videoItem.querySelector("video");

        if (iframe) {
            iframe.addEventListener("click", function () {
                const lightboxContent = document.getElementById("video-lightbox-content");
                const downloadBtn = document.getElementById("download-video-btn");

                if (lightboxContent) {
                    lightboxContent.innerHTML = `<iframe src="${iframe.src}" allowfullscreen></iframe>`;
                }
                if (downloadBtn) downloadBtn.style.display = "none";

                lightbox.style.display = "flex";
                lightbox.classList.add("active");
            });
        }

        if (video) {
            video.addEventListener("click", function () {
                openVideoLightbox(video);
            });
        }
    });
});


/* ===============================
   CLOSE LIGHTBOXES WITH ESC KEY
================================ */

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeLightbox();
        closeVideoLightbox();
    }
});


/* ===============================
   CONTACT FORM — NETLIFY FORMS
   Submissions appear in the Netlify dashboard (Forms > contact).
   Email notifications are configured there too.
   Note: only works on the published Netlify site, not when the
   file is opened locally.
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const messageBox = document.querySelector(".success-message");

    if (!form) return;

    function showMessage(text, color) {
        if (!messageBox) return;
        messageBox.innerText = text;
        messageBox.style.color = color;
        messageBox.classList.add("show");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');

        if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerText = "Sending...";
        }

        const body = new URLSearchParams(new FormData(form)).toString();

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body
        })
            .then(function (response) {
                if (!response.ok) throw new Error("Status " + response.status);
                showMessage("Message sent successfully!", "#d4af37");
                form.reset();
            })
            .catch(function () {
                showMessage("Failed to send message. Please try again or email directly.", "red");
            })
            .finally(function () {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerText = "Send Message";
                }
            });
    });
});
