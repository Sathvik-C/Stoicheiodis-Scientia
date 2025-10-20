THERAPY IMAGES FOLDER - INSTRUCTIONS
=====================================

This folder contains background images for the Therapy landing page.

HOW TO ADD IMAGES:
------------------
1. Add your therapy-related images to this folder
2. Name them as: image1.jpg, image2.jpg, image3.jpg, image4.jpg
   (You can add more by editing the script in therapy.html)

SUPPORTED FORMATS:
------------------
- .jpg / .jpeg
- .png
- .webp

RECOMMENDED IMAGE SPECIFICATIONS:
---------------------------------
- Resolution: 1920x1080 or higher
- Aspect Ratio: 16:9 (landscape)
- File Size: Under 500KB for faster loading
- Content: High-quality images related to therapy, rehabilitation, hand exercises, etc.

HOW IT WORKS:
-------------
The images will automatically cycle through in a smooth sliding animation every 5 seconds on the therapy.html landing page background.

EDITING THE IMAGE LIST:
-----------------------
To add or change images, edit the therapyImages array in therapy.html:
    const therapyImages = [
        'therapy images/image1.jpg',
        'therapy images/image2.jpg',
        'therapy images/image3.jpg',
        'therapy images/image4.jpg'
        // Add more images here
    ];

NOTE:
-----
- If no images are found, the page will display a gradient background as fallback
- Images are displayed with an overlay for better text readability
- The animation is optimized for performance
