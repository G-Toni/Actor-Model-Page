// All banner area for the video with the audio

document.addEventListener("DOMContentLoaded", function () {
    let video = document.querySelector(".back-video");
    
    // Create button

    if (video) {

    let button = document.createElement("button");
    button.innerText = "🔊 Unmute";
    button.style.position = "absolute";
    button.style.bottom = "20px";
    button.style.left = "20px";
    button.style.padding = "10px 20px";
    button.style.background = "#fff";
    button.style.border = "none";
    button.style.cursor = "pointer";
    
    // Append to body
    document.body.appendChild(button);

    // Toggle Mute/Unmute
    button.addEventListener("click", function () {
        if (video.muted) {
            video.muted = false;
            button.innerText = "🔇 Mute";
        } else {
            video.muted = true;
            button.innerText = "🔊 Unmute";
        }
    });
    }
});



/* === Image Effect Appearance About me === */

// Detect when the image enters the viewport
window.addEventListener('scroll', function () {
    const img = document.querySelector('.section-aboutus--right img');
    const rect = img.getBoundingClientRect();
    
    // Check if the image is in the viewport
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        img.classList.add('visible');
    }
});

/* === Image Effect Appearance Gallery === */

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".image-item");
    const loadMoreBtn = document.querySelector(".load-more-btn");
    let imagesToShow = 10; // Number of images initially displayed

    loadMoreBtn.addEventListener("click", function () {
        let hiddenImages = Array.from(images).slice(imagesToShow, imagesToShow + 10); // Load 10 more each time
        hiddenImages.forEach(img => img.style.display = "block");
        imagesToShow += 10;

        // Hide button if all images are displayed
        if (imagesToShow >= images.length) {
            loadMoreBtn.style.display = "none";
        }
    });
});

/* === Images Gallery download === */

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".image-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const downloadBtn = document.getElementById("download-btn");

    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
            downloadBtn.href = img.src;
        });
    });

    document.querySelector(".close").addEventListener("click", function () {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg && e.target !== downloadBtn) {
            lightbox.style.display = "none";
        }
    });
});

/* === Images Gallery download === */

// Open Lightbox
function openLightbox(imgElement) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const downloadBtn = document.getElementById("download-btn");

    lightboxImg.src = imgElement.src; // Set image source
    downloadBtn.href = imgElement.src; // Set download link

    lightbox.classList.add("active"); // Show lightbox
}

// Close Lightbox
function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
}

// Download All Images Function
function downloadAllImages() {
    const images = document.querySelectorAll(".image-item img");

    images.forEach((img, index) => {
        const link = document.createElement("a");
        link.href = img.src;
        link.download = `image-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

/* === Form Client-Side Validation === */

document.querySelector("form").addEventListener("submit", function(event) {
    var name = document.querySelector('input[name="name"]').value;
    var email = document.querySelector('input[name="email"]').value;
    var message = document.querySelector('textarea[name="message"]').value;

    if (!name || !email || !message) {
        event.preventDefault(); // Prevent form submission
        alert("Please fill out all fields before submitting.");
    }
});

/* === Videos Section === */

document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll(".video-item");
    const loadMoreBtn = document.querySelector(".load-more-videos-btn");
    let videosToShow = 6;
  
    // Show initial videos
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
  
    // Lightbox functionality
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");
    const downloadBtn = document.getElementById("download-video-btn");
  
    videos.forEach(videoItem => {
      const iframe = videoItem.querySelector("iframe");
      const video = videoItem.querySelector("video");
  
      if (iframe) {
        iframe.addEventListener("click", () => {
          lightboxContent.innerHTML = `<iframe src="${iframe.src}" allowfullscreen></iframe>`;
          downloadBtn.style.display = "none";
          lightbox.classList.add("active");
        });
      }
  
      if (video) {
        video.addEventListener("click", () => {
          lightboxContent.innerHTML = `<video src="${video.src}" controls autoplay></video>`;
          downloadBtn.href = video.src;
          downloadBtn.style.display = "inline-block";
          lightbox.classList.add("active");
        });
      }
    });
  });
  
  function closeVideoLightbox() {
    const lightbox = document.getElementById("video-lightbox");
    const lightboxContent = document.getElementById("video-lightbox-content");
    lightbox.classList.remove("active");
    lightboxContent.innerHTML = "";
  }
  

/* === Contact Form === */

document.addEventListener("DOMContentLoaded", function () {
    const SERVICE_ID = "service_tkya50m";
    const TEMPLATE_ID = "template_suwkkeh";
    const PUBLIC_KEY = "cSJi4V8k7ns-5DXU1";

    emailjs.init("cSJi4V8k7ns-5DXU1");

    const form = document.getElementById("contact-form");
    const messageBox = document.querySelector(".success-message");
    const submitButton = form.querySelector("button");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message
        };

        submitButton.disabled = true;
        submitButton.innerText = "Sending...";

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(function (response) {
                console.log("Email sent successfully", response);
                messageBox.innerText = "Message sent successfully!";
                messageBox.style.color = "green";
                messageBox.classList.add("show");
                form.reset();
            })
            .catch(function (error) {
                console.log("Error sending email", error);
                messageBox.innerText = "Failed to send message. Try again.";
                messageBox.style.color = "red";
                messageBox.classList.add("show");
            })
            .finally(function () {
                submitButton.disabled = false;
                submitButton.innerText = "Send Message";
            });
    });
});
