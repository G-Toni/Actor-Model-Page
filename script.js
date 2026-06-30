/* ===============================
   HERO VIDEO MUTE / UNMUTE
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const heroVideo = document.getElementById("hero-video");
    const muteButton = document.getElementById("muteToggle");

    if (heroVideo && muteButton) {
        muteButton.addEventListener("click", function () {
            heroVideo.muted = !heroVideo.muted;

            muteButton.innerText = heroVideo.muted
                ? "🔊 Unmute"
                : "🔇 Mute";
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
   IMAGE GALLERY LOAD MORE
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
   IMAGE LIGHTBOX
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".image-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const downloadBtn = document.getElementById("download-btn");
    const closeBtn = document.querySelector(".close");

    if (!images.length || !lightbox || !lightboxImg) return;

    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "flex";
            lightbox.classList.add("active");
            lightboxImg.src = img.src;

            if (downloadBtn) {
                downloadBtn.href = img.src;
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            lightbox.style.display = "none";
            lightbox.classList.remove("active");
        });
    }

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
            lightbox.classList.remove("active");
        }
    });
});


/* ===============================
   DOWNLOAD ALL IMAGES
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
   VIDEO SECTION LOAD MORE
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
   VIDEO LIGHTBOX
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll(".video-item");
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");
    const downloadBtn = document.getElementById("download-video-btn");

    if (!videos.length || !lightbox || !lightboxContent) return;

    videos.forEach(videoItem => {
        const iframe = videoItem.querySelector("iframe");
        const video = videoItem.querySelector("video");

        if (iframe) {
            iframe.addEventListener("click", function () {
                lightboxContent.innerHTML = `<iframe src="${iframe.src}" allowfullscreen></iframe>`;

                if (downloadBtn) {
                    downloadBtn.style.display = "none";
                }

                lightbox.classList.add("active");
            });
        }

        if (video) {
            video.addEventListener("click", function () {
                lightboxContent.innerHTML = `<video src="${video.currentSrc || video.src}" controls autoplay></video>`;

                if (downloadBtn) {
                    downloadBtn.href = video.currentSrc || video.src;
                    downloadBtn.style.display = "inline-block";
                }

                lightbox.classList.add("active");
            });
        }
    });
});


function closeVideoLightbox() {
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");

    if (!lightbox || !lightboxContent) return;

    lightbox.classList.remove("active");
    lightboxContent.innerHTML = "";
}


/* ===============================
   BASIC CONTACT FORM VALIDATION
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');

        if (!name || !email || !message) return;

        if (!name.value || !email.value || !message.value) {
            event.preventDefault();
            alert("Please fill out all fields before submitting.");
        }
    });
});


/* ===============================
   EMAILJS CONTACT FORM
================================ */

document.addEventListener("DOMContentLoaded", function () {
    const SERVICE_ID = "service_tkya50m";
    const TEMPLATE_ID = "template_suwkkeh";
    const PUBLIC_KEY = "cSJi4V8k7ns-5DXU1";

    const form = document.getElementById("contact-form");
    const messageBox = document.querySelector(".success-message");

    if (!form || typeof emailjs === "undefined") return;

    emailjs.init(PUBLIC_KEY);

    const submitButton = form.querySelector("button");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const templateParams = {
            from_name: form.name.value,
            from_email: form.email.value,
            message: form.message.value
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerText = "Sending...";
        }

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(function (response) {
                console.log("Email sent successfully", response);

                if (messageBox) {
                    messageBox.innerText = "Message sent successfully!";
                    messageBox.style.color = "green";
                    messageBox.classList.add("show");
                }

                form.reset();
            })
            .catch(function (error) {
                console.log("Error sending email", error);

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