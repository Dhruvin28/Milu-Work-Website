const folderListDiv = document.getElementById('folder-list');
const imageDisplayDiv = document.getElementById('image-display');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeButton = document.querySelector('.close-button');
const prevArrow = document.querySelector('.prev-arrow');
const nextArrow = document.querySelector('.next-arrow');

let currentImages = []; // Stores the paths of images in the current folder
let currentIndex = 0;   // Index of the currently displayed image in the lightbox

// Function to open the lightbox
function openLightbox(imagePath, index) {
    lightbox.classList.remove('hidden');
    lightboxImg.src = imagePath;
    currentIndex = index;
}

// Function to close the lightbox
function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = ''; // Clear image source
}

// Function to show next image
function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex];
}

// Function to show previous image
function showPrevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex];
}

// Event listeners for lightbox controls
closeButton.addEventListener('click', closeLightbox);
prevArrow.addEventListener('click', showPrevImage);
nextArrow.addEventListener('click', showNextImage);

// Allow closing with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
    }
});


async function fetchFolders() {
    try {
        const response = await fetch('/api/folders');
        const folders = await response.json();

        folders.forEach(folderName => {
            const link = document.createElement('a');
            link.href = '#';
            link.classList.add('folder-link');
            link.textContent = folderName;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                displayImages(folderName);
            });
            folderListDiv.appendChild(link);
        });

        if (folders.length > 0) {
            displayImages(folders[0]); // Display images from the first folder on load
        }

    } catch (error) {
        console.error('Error fetching folders:', error);
        folderListDiv.innerHTML = '<p>Could not load folders.</p>';
    }
}

async function displayImages(folderName) {
    imageDisplayDiv.innerHTML = ''; // Clear previous images
    try {
        const response = await fetch(`/api/images/${folderName}`);
        const images = await response.json();
        currentImages = images; // Store images for lightbox navigation

        if (images && images.length > 0) {
            images.forEach((imagePath, index) => {
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `Image from ${folderName}`;
                img.addEventListener('click', () => openLightbox(imagePath, index)); // Add click listener
                imageDisplayDiv.appendChild(img);
            });
        } else {
            imageDisplayDiv.innerHTML = `<p>No images found in ${folderName}.</p>`;
        }
    } catch (error) {
        console.error(`Error fetching images for ${folderName}:`, error);
        imageDisplayDiv.innerHTML = `<p>Could not load images for ${folderName}.</p>`;
    }
}

fetchFolders(); // Call this on page load to populate the folders