document.addEventListener('DOMContentLoaded', () => {
    // Vanta.js (NET effect) on top of Three.js
    // Creates an interactive 3D particle network background
    const bgElem = document.getElementById('bg-canvas');
    if (!bgElem) return;

    // Check if WebGL is supported
    const isWebGLAvailable = () => {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    };

    if (window.VANTA && window.THREE && isWebGLAvailable()) {
        try {
            window._vantaEffect = VANTA.NET({
                el: "#bg-canvas",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 0.85,
                color: 0x64ffda,
                backgroundColor: 0x0a192f,
                points: window.innerWidth < 768 ? 9.00 : 14.00,
                maxDistance: 22.00,
                spacing: 16.00
            });
        } catch (err) {
            console.warn("Could not initialize Vanta background:", err);
        }
    } else {
        console.log("3D WebGL background skipped or not supported.");
    }
});
