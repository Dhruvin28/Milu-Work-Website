const folderListDiv = document.getElementById('folder-list');
const imageDisplayDiv = document.getElementById('image-display');

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

        // Optionally, display images from the first folder on page load
        if (folders.length > 0) {
            displayImages(folders[0]);
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

        if (images && images.length > 0) {
            images.forEach(imagePath => {
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `Image from ${folderName}`;
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