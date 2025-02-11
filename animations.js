document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    addSearchBarEffects();
    animateBubbles();
    bubbleInterval = setInterval(emitBubbles, 1000); // Emit bubbles every 1000ms

    // Set initial button images
    document.getElementById('resetButton').src = 'reset.png';
    document.getElementById('toggleAnimationsButton').src = 'animacionesOn.png';
    document.getElementById('changeBackgroundButton').src = 'changeBackground.png'; // Set initial image for the new button
});

let animationsEnabled = true;
let bubbleInterval;
let currentBackgroundIndex = 0;
const backgrounds = ['fondo1.jpg', 'fondo2.jpg', 'fondo3.png', 'fondo4.png', 'fondo5.jpg'];

function toggleAnimations() {
    animationsEnabled = !animationsEnabled;
    const bubbles = document.querySelectorAll('.bubble, .floating-bubble');
    bubbles.forEach(bubble => {
        if (bubble.classList.contains('floating-bubble')) {
            bubble.style.display = animationsEnabled ? 'block' : 'none';
        } else {
            bubble.style.animationPlayState = animationsEnabled ? 'running' : 'paused';
        }
    });

    if (animationsEnabled) {
        bubbleInterval = setInterval(emitBubbles, 1000);
        document.getElementById('toggleAnimationsButton').src = 'animacionesOn.png';
    } else {
        clearInterval(bubbleInterval);
        document.getElementById('toggleAnimationsButton').src = 'animacionesOff.png';
    }
}

function changeBackground() {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
}

function createBubbles() {
    let positions = [];
    const colors = [
        'hsl(0, 70%, 80%)',
        'hsl(120, 70%, 80%)',
        'hsl(240, 70%, 80%)',
        'hsl(60, 70%, 80%)',
        'hsl(300, 70%, 80%)',
        'hsl(30, 70%, 80%)',
        'hsl(90, 70%, 80%)',
        'hsl(150, 70%, 80%)',
        'hsl(210, 70%, 80%)',
        'hsl(270, 70%, 80%)',
        'hsl(330, 70%, 80%)',
        'hsl(45, 70%, 80%)',
        'hsl(75, 70%, 80%)',
        'hsl(195, 70%, 80%)',
        'hsl(255, 70%, 80%)'
    ];
    const images = [
        'youtube.png',
        'image1.png',       // WhatsApp
        'image3.png',       // Gmail
        'drive.png',
        'copilot.png',
        'github.png',
        'spotify.png',
        'chatgpt.png',
        'onedrive.png',
        'image10.png',
        'image11.png',
        'image2.png',
        'image13.png',      // Campus Virtual URV
        'outlook.png',
        'image15.png'
    ];
    const links = [
        'https://www.youtube.com/',
        'https://web.whatsapp.com/',
        'https://mail.google.com/',
        'https://drive.google.com/drive/home',
        'https://copilot.microsoft.com/',
        'https://github.com/garcilaso05',
        'https://open.spotify.com/',
        'https://chatgpt.com/',
        'https://rovira-my.sharepoint.com/',
        'https://example.com/page10',
        'https://example.com/page11',
        'https://campusvirtual.urv.cat/my/',
        'https://example.com/page13',
        'https://outlook.office.com/mail/',
        'https://example.com/page15'
    ];
    const bubbleCount = window.innerWidth < 768 ? 8 : 15; // Reduce bubble count on smaller screens
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    const margin = 0.1 * Math.min(window.innerWidth, window.innerHeight); // 10% margin

    for (let i = 0; i < bubbleCount; i++) {
        let bubble = document.createElement('a');
        bubble.classList.add('bubble');
        bubble.href = links[i];
        bubble.target = '_blank';
        bubble.style.setProperty('--bubble-color', colors[i]); // Set CSS variable for bubble color
        let size = window.innerWidth < 768 ? Math.random() * 20 + 40 : Math.random() * 30 + 65; // Smaller size range for smaller screens
        let x, y, overlapping;

        do {
            x = Math.random() * (window.innerWidth - size - 2 * margin) + margin;
            y = Math.random() * (window.innerHeight - size - 2 * margin) + margin;
            overlapping = positions.some(pos => Math.hypot(pos.x - x, pos.y - y) < (size + pos.size) / 2);
        } while (overlapping || (y > containerRect.top - size && y < containerRect.bottom + size));

        const relativeX = x - centerX;
        const relativeY = y - centerY;
        positions.push({ x, y, relativeX, relativeY, size });

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.background = colors[i]; // Ensure unique colors
        bubble.style.borderColor = colors[i]; // Set border color to match bubble color
        bubble.style.top = `${y}px`;
        bubble.style.left = `${x}px`;
        bubble.style.transition = 'top 1s ease-in-out, left 1s ease-in-out'; // Add transition for smooth movement
        bubble.style.animation = `float ${Math.random() * 5 + 5}s ease-in-out infinite`; // Randomize animation duration
        let img = document.createElement('img');
        img.src = images[i];
        bubble.appendChild(img);
        document.body.appendChild(bubble);
    }

    // Reposition bubbles on window resize
    window.addEventListener('resize', () => {
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        let availablePositions = [];

        positions.forEach((pos, index) => {
            const bubble = document.querySelectorAll('.bubble')[index];
            if (bubble) {
                let newX = centerX + pos.relativeX;
                let newY = centerY + pos.relativeY;

                // Ensure bubbles stay within the window bounds
                newX = Math.max(margin, Math.min(newX, window.innerWidth - pos.size - margin));
                newY = Math.max(margin, Math.min(newY, window.innerHeight - pos.size - margin));

                // Ensure bubbles do not overlap
                let overlapping = availablePositions.some(ap => Math.hypot(ap.x - newX, ap.y - newY) < (pos.size + ap.size) / 2);
                if (!overlapping) {
                    bubble.style.top = `${newY}px`;
                    bubble.style.left = `${newX}px`;
                    bubble.style.display = 'block';
                    availablePositions.push({ x: newX, y: newY, size: pos.size });
                } else {
                    bubble.style.display = 'none';
                }
            }
        });
    });
}

function resetBubbles() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        const size = parseFloat(bubble.style.width);
        let x, y, overlapping;
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        const margin = 0.1 * Math.min(window.innerWidth, window.innerHeight); // 10% margin

        do {
            x = Math.random() * (window.innerWidth - size - 2 * margin) + margin;
            y = Math.random() * (window.innerHeight - size - 2 * margin) + margin;
            overlapping = Array.from(bubbles).some(pos => {
                if (pos === bubble) return false;
                const posX = parseFloat(pos.style.left);
                const posY = parseFloat(pos.style.top);
                return Math.hypot(posX - x, posY - y) < (size + parseFloat(pos.style.width)) / 2;
            });
        } while (overlapping || (y > containerRect.top - size && y < containerRect.bottom + size));

        bubble.style.transition = 'top 1s ease-in-out, left 1s ease-in-out';
        bubble.style.top = `${y}px`;
        bubble.style.left = `${x}px`;
    });
}

function addSearchBarEffects() {
    const searchBar = document.getElementById('search');
    const container = document.querySelector('.container');

    searchBar.addEventListener('input', (event) => {
        if (event.key !== 'Enter') {
            container.classList.add('highlight');
            setTimeout(() => {
                container.classList.remove('highlight');
            }, 100); // Faster highlight effect
            emitBubbles();
        }
    });

    searchBar.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchBar.value;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    });

    searchBar.addEventListener('click', () => {
        container.classList.add('highlight');
        setTimeout(() => {
            container.classList.remove('highlight');
        }, 100); // Faster highlight effect
    });
}

function emitBubbles() {
    if (!animationsEnabled) return; // Check if animations are enabled

    const bubbleCount = 3; // Reduce the number of bubbles
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('floating-bubble');
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`; // Randomize starting position
        bubble.style.width = `${Math.random() * 20 + 10}px`; // Randomize size
        bubble.style.height = bubble.style.width;
        document.body.appendChild(bubble);
        setTimeout(() => {
            bubble.remove();
        }, 3000); // Remove bubble after 3 seconds
    }
}

function animateBubbles() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        const randomDuration = Math.random() * 4 + 6; // Random duration between 5 and 10 seconds
        const randomX = Math.random() * 20 - 10; // Random movement between -10 and 10 pixels
        const randomY = Math.random() * 20 - 10;
        bubble.style.animation = `float ${randomDuration}s ease-in-out infinite`;
        bubble.style.setProperty('--randomX', `${randomX}px`);
        bubble.style.setProperty('--randomY', `${randomY}px`);
    });
}