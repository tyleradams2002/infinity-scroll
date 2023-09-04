const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray;

// Unsplash API
let isInitialLoad = true
let count = 5;
const apiKey = '5MYUBiBLrQEk6bOCfwLACWgiC2eoefA1DbZ6pfh9HRE';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Updates API after initial load

function updateAPIWithNewCount(count) {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`
}

// Check if all images were loaded
function imageLoaded(){
    imagesLoaded ++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true; // this forces the loader to only show on initial start up, once the images are loaded, the loader will not show again.
    }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

// Create elements for links and photos, and add to dom
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
       // Create <a> element to link to Unsplash
       const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        })
       // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        })
        // Event listener, check when eac is finished loading
        img.addEventListener('load', imageLoaded)
        // put <img> inside <a>, then put both inside image container element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl)
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad) {
            updateAPIWithNewCount(30)
            isInitialLoad = false
        }
    } catch (error) {
        // Catch Error Here
    }
}

// Check to see if scrolling is near bottom of page, load more photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})

// On load
getPhotos();
