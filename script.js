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

    // Analyze image properties
    const hasEditingArtifacts = analyzeImageForEdits(img);
    return hasEditingArtifacts; // Return true if artifacts suggest editing
}

// Placeholder function to extract metadata
async function getMetadata(file) {
    // Ideally, you would implement this function to extract actual metadata
    return {
        cameraMake: "Canon",
        cameraModel: "EOS 80D",
        dateTaken: "2024-01-01T10:00:00Z",
        software: "Adobe Photoshop", // Example of software used to edit
        // Include other metadata fields as needed
    };
}

// Function to check metadata for edits
function metadataIsEdited(metadata) {
    // Check for missing important fields
    if (!metadata.cameraMake || !metadata.cameraModel || !metadata.dateTaken) {
        return true; // Missing metadata can indicate editing
    }

    // Check for editing software
    const editingSoftwareList = ["Adobe Photoshop", "GIMP", "Paint.NET"];
    if (editingSoftwareList.includes(metadata.software)) {
        return true; // If known editing software is detected, consider it cheating
    }

    // Check if the date taken is unusually recent compared to the modification date
    // This requires having a modification date field
    // if (metadata.modificationDate && new Date(metadata.modificationDate) > new Date(metadata.dateTaken)) {
    //     return true; // The image may have been edited recently
    // }

    return false; // No signs of editing found
}

// Function for analyzing the image for artifacts
function analyzeImageForEdits(img) {
    // Simple analysis: Check dimensions and some basic characteristics
    if (img.width < 100 || img.height < 100) {
        return true; // An image that is too small might be suspicious
    }

    // Example: Check for uniformity in pixel colors
    // (This would require more complex analysis, possibly using OpenCV)

    // More advanced analysis can be added here
    // For example, checking for unusual pixel patterns or edge artifacts
    return false; // Placeholder; adjust based on your analysis
}
