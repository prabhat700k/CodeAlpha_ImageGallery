
const gallery = document.getElementById("gallery");
const items = [...document.querySelectorAll(".gallery-item")];
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const caption = document.getElementById("caption");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let visibleItems = [...items];
let currentIndex = 0;
let lastFocusedElement = null;

// Filter gallery by category
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        visibleItems = items.filter(item => {
            const matches =
                filter === "all" ||
                item.dataset.category === filter;

            item.classList.toggle("hide", !matches);
            return matches;
        });
    });
});

// Open image in lightbox
function openLightbox(index) {
    if (!visibleItems.length) return;

    currentIndex = index;
    lastFocusedElement = document.activeElement;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    showImage();
    closeBtn.focus();
}

// Display current image
function showImage() {
    const item = visibleItems[currentIndex];
    if (!item) return;

    const img = item.querySelector("img");
    const title = item.querySelector("h3");
    const category = item.querySelector(".overlay p");

    lightboxImg.style.opacity = "0";

    lightboxImg.onload = () => {
        lightboxImg.style.opacity = "1";
    };

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    caption.textContent =
        `${title.textContent} — ${category.textContent}`;

    // Handle already cached images
    if (lightboxImg.complete) {
        lightboxImg.style.opacity = "1";
    }
}

// Open image when gallery item is clicked
items.forEach(item => {
    item.addEventListener("click", () => {
        const index = visibleItems.indexOf(item);

        if (index !== -1) {
            openLightbox(index);
        }
    });

    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");

    item.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            item.click();
        }
    });
});

// Next image
function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showImage();
}

// Previous image
function prevImage() {
    currentIndex =
        (currentIndex - 1 + visibleItems.length) %
        visibleItems.length;

    showImage();
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);
closeBtn.addEventListener("click", closeLightbox);

// Close when clicking the dark background
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowRight") {
        nextImage();
    } else if (event.key === "ArrowLeft") {
        prevImage();
    }
});
