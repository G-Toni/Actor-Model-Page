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
   ABOUT IMAGE SCROLL EFFECT
================================ */

window.addEventListener("scroll", function () {
    const img = document.querySelector(".section-aboutus--right img");
    if (!img) return;

    const rect = img.getBoundingClientRect();

    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        img.classList.add("visible");
    }
});


/* ===============================
   PHOTO LIBRARY — LIGHTBOX (maximized view + download + close)
   Global functions so they work with:
   - Static images (gallery.html, onclick="openLightbox(this)")
   - Images injected dynamically by the category system (index.html)
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
   Only runs on pages with .image-item + .load-more-btn (e.g. gallery.html).
   Safely does nothing on pages without these elements (e.g. index.html).
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
   DOWNLOAD ALL IMAGES
   Used by .download-all-btn (e.g. gallery.html). Harmless if the
   button doesn't exist on the current page — it just never gets called.
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
   Global functions so they work with:
   - Static videos on legacy pages (bound below via .video-item)
   - Videos injected dynamically by the category system (index.html,
     called directly via onclick="openVideoLightbox(this)")
================================ */

function openVideoLightbox(videoEl) {
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");
    const downloadBtn = document.getElementById("download-video-btn");

    if (!lightbox || !lightboxContent || !videoEl) return;

    videoEl.pause();

    const videoSrc = videoEl.currentSrc || videoEl.querySelector("source")?.src || videoEl.src;

    lightboxContent.innerHTML = `<video src="${videoSrc}" controls autoplay></video>`;

    if (downloadBtn) {
        downloadBtn.href = videoSrc;
        downloadBtn.style.display = "inline-block";
    }

    lightbox.style.display = "flex";
    lightbox.classList.add("active");
}

function closeVideoLightbox() {
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");

    if (!lightbox || !lightboxContent) return;

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
   VIDEO SECTION — LOAD MORE
   Only runs on pages with .video-item + .load-more-videos-btn present
   at page load (a static videos page). Safely does nothing otherwise —
   on index.html, videos are created only after a category is opened,
   so this finds nothing at DOMContentLoaded and simply skips.
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
   VIDEO SECTION — CLICK TO OPEN (legacy static pages)
   Binds click handlers to .video-item elements that already exist at
   page load (iframe or video), reusing the same openVideoLightbox().
   On index.html this finds nothing at DOMContentLoaded (videos are
   created later, per category) and simply skips — no conflict with
   the onclick="openVideoLightbox(this)" used there.
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
   EMAILJS CONTACT FORM + VALIDATION
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const SERVICE_ID = "service_tkya50m";
    const TEMPLATE_ID = "template_suwkkeh";
    const PUBLIC_KEY = "cSJi4V8k7ns-5DXU1";

    const form = document.getElementById("contact-form");
    const messageBox = document.querySelector(".success-message");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');

        if (!name?.value || !email?.value || !message?.value) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        if (typeof emailjs === "undefined") {
            alert("Email service is not loaded. Please try again later.");
            return;
        }

        emailjs.init(PUBLIC_KEY);

        const submitButton = form.querySelector("button");

        const templateParams = {
            from_name: name.value,
            from_email: email.value,
            message: message.value
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerText = "Sending...";
        }

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(function () {
                if (messageBox) {
                    messageBox.innerText = "Message sent successfully!";
                    messageBox.style.color = "green";
                    messageBox.classList.add("show");
                }

                form.reset();
            })
            .catch(function () {
                if (messageBox) {
                    messageBox.innerText = "Failed to send message. Try again.";
                    messageBox.style.color = "red";
                    messageBox.classList.add("show");
                }
            })
            .finally(function () {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerText = "Send Message";
                }
            });
    });
});