document.addEventListener('DOMContentLoaded', () => {
    // We are using Vanta.js (NET effect) which is built on top of Three.js
    // to create a stunning, interactive 3D particle network background.
    
    // Ensure Vanta is loaded
    if (window.VANTA) {
        VANTA.NET({
            el: "#bg-canvas",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x64ffda, // The accent color
            backgroundColor: 0x0a192f, // The deep background color
            points: 15.00,
            maxDistance: 20.00,
            spacing: 15.00
        });
    } else {
        console.error("Vanta.js is not loaded.");
    }
});
