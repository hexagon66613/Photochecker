// Add your OpenCV.js script in your HTML file for this to work
document.getElementById('verify-button').addEventListener('click', async () => {
    const input = document.getElementById('file-input');
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    for (const file of input.files) {
        const img = await loadImage(file);
        const metadata = await getMetadata(file); // Extract metadata

        const isCheating = verifyImage(img, metadata); // Call the verification logic
        resultsDiv.innerHTML += `<p>${file.name}: ${isCheating ? 'Cheating' : 'Not Cheating'}</p>`;
    }
});

// Function to load the image
function loadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Verification logic
function verifyImage(img, metadata) {
    // Check metadata for signs of editing
    if (metadataIsEdited(metadata)) {
        return true; // It's cheating
    }

    // Analyze image properties using OpenCV
    const hasEditingArtifacts = analyzeImageForEdits(img);
    return hasEditingArtifacts; // Return true if artifacts suggest editing
}

// Placeholder function to extract metadata
async function getMetadata(file) {
    // Replace this with actual metadata extraction logic
    return {
        cameraMake: "Canon",
        cameraModel: "EOS 80D",
        dateTaken: "2024-01-01T10:00:00Z",
        software: "Adobe Photoshop", // Example of software used to edit
        modificationDate: "2024-01-02T10:00:00Z", // Add modification date for checking
    };
}

// Function to check metadata for edits
function metadataIsEdited(metadata) {
    // Check for missing important fields
    if (!metadata.cameraMake || !metadata.cameraModel || !metadata.dateTaken) {
        return true; // Missing metadata can indicate editing
    }

    // Check for known editing software
    const editingSoftwareList = ["Adobe Photoshop", "GIMP", "Paint.NET"];
    if (editingSoftwareList.includes(metadata.software)) {
        return true; // If known editing software is detected, consider it cheating
    }

    // Check if modification date is after the date taken
    if (new Date(metadata.modificationDate) > new Date(metadata.dateTaken)) {
        return true; // The image may have been edited recently
    }

    return false; // No signs of editing found
}

// Function for analyzing the image for artifacts using OpenCV
function analyzeImageForEdits(img) {
    // Create a canvas to process the image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Use OpenCV to analyze the image
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    
    // Convert to grayscale and apply edge detection
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
    cv.Canny(src, dst, 50, 100);

    // Analyze edges for irregularities (could indicate editing)
    const nonZeroCount = cv.countNonZero(dst);
    
    // Basic thresholding: if too many edges detected, it could indicate editing
    const threshold = Math.floor(src.rows * src.cols * 0.05); // Adjust threshold to a percentage of total pixels
    src.delete(); // Clean up memory
    dst.delete();

    return nonZeroCount > threshold; // Adjust this logic based on real tests
}
