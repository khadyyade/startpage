document.addEventListener('DOMContentLoaded', () => {
    initializeBubbles();
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

function initializeBubbles() {
    if (!localStorage.getItem('bubbles')) {
        const initialBubbles = [
            {
                "name": "YouTube",
                "backgroundColor": "hsl(0, 70%, 80%)",
                "link": "https://www.youtube.com/",
                "image": "youtube.png"
            },
            {
                "name": "WhatsApp",
                "backgroundColor": "hsl(120, 70%, 80%)",
                "link": "https://web.whatsapp.com/",
                "image": "whatsapp.png"
            },
            {
                "name": "Gmail",
                "backgroundColor": "hsl(240, 70%, 80%)",
                "link": "https://mail.google.com/",
                "image": "gmail.png"
            },
            {
                "name": "Google Drive",
                "backgroundColor": "hsl(60, 70%, 80%)",
                "link": "https://drive.google.com/drive/home",
                "image": "drive.png"
            },
            {
                "name": "Copilot",
                "backgroundColor": "hsl(300, 70%, 80%)",
                "link": "https://copilot.microsoft.com/",
                "image": "copilot.png"
            },
            {
                "name": "GitHub",
                "backgroundColor": "hsl(30, 70%, 80%)",
                "link": "https://github.com/garcilaso05",
                "image": "github.png"
            },
            {
                "name": "Spotify",
                "backgroundColor": "hsl(90, 70%, 80%)",
                "link": "https://open.spotify.com/",
                "image": "spotify.png"
            },
            {
                "name": "ChatGPT",
                "backgroundColor": "hsl(150, 70%, 80%)",
                "link": "https://chatgpt.com/",
                "image": "chatgpt.png"
            },
            {
                "name": "OneDrive",
                "backgroundColor": "hsl(210, 70%, 80%)",
                "link": "https://rovira-my.sharepoint.com/",
                "image": "onedrive.png"
            },
            {
                "name": "Deepl",
                "backgroundColor": "hsl(182, 37.80%, 64.70%)",
                "link": "https://www.deepl.com/es/translator",
                "image": "deepl.png"
            },
            {
                "name": "SoftCatala",
                "backgroundColor": "hsl(327, 69.20%, 87.30%)",
                "link": "https://www.softcatala.org/corrector/",
                "image": "softcatala.png"
            },
            {
                "name": "Campus Virtual URV",
                "backgroundColor": "hsl(45, 70%, 80%)",
                "link": "https://campusvirtual.urv.cat/my/",
                "image": "moodle.png"
            },
            {
                "name": "Outlook",
                "backgroundColor": "hsl(75, 70%, 80%)",
                "link": "https://outlook.office.com/mail/",
                "image": "outlook.png"
            },
            {
                "name": "Linkedin",
                "backgroundColor": "hsl(195, 70%, 80%)",
                "link": "https://www.linkedin.com/feed/",
                "image": "linkedin.png"
            }
        ];
        localStorage.setItem('bubbles', JSON.stringify(initialBubbles));
    }
}

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
    const bubbles = JSON.parse(localStorage.getItem('bubbles')) || [];
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    const margin = 0.1 * Math.min(window.innerWidth, window.innerHeight); // 10% margin

    bubbles.forEach((bubble, i) => {
        let bubbleElement = document.createElement('a');
        bubbleElement.classList.add('bubble');
        bubbleElement.href = bubble.link;
        bubbleElement.target = '_blank';
        bubbleElement.style.setProperty('--bubble-color', bubble.backgroundColor); // Set CSS variable for bubble color
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

        bubbleElement.style.width = `${size}px`;
        bubbleElement.style.height = `${size}px`;
        bubbleElement.style.background = bubble.backgroundColor; // Ensure unique colors
        bubbleElement.style.borderColor = bubble.backgroundColor; // Set border color to match bubble color
        bubbleElement.style.top = `${y}px`;
        bubbleElement.style.left = `${x}px`;
        bubbleElement.style.transition = 'top 1s ease-in-out, left 1s ease-in-out, box-shadow 0.5s'; // Add transition for smooth movement and box-shadow
        let img = document.createElement('img');
        img.src = bubble.image;
        bubbleElement.appendChild(img);

        // Add delete button
        let deleteButton = document.createElement('div');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '×';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteBubble(i);
        };
        bubbleElement.appendChild(deleteButton);

        bubbleElement.onmouseover = () => {
            deleteButton.style.opacity = '1';
            deleteButton.style.visibility = 'visible';
        };
        bubbleElement.onmouseout = () => {
            setTimeout(() => {
                if (!deleteButton.matches(':hover')) {
                    deleteButton.style.opacity = '0';
                    deleteButton.style.visibility = 'hidden';
                }
            }, 400); // Delay the disappearance by 500ms
        };

        document.body.appendChild(bubbleElement);
    });

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

function deleteBubble(index) {
    const bubbles = JSON.parse(localStorage.getItem('bubbles')) || [];
    bubbles.splice(index, 1);
    localStorage.setItem('bubbles', JSON.stringify(bubbles));
    location.reload();
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

function openAddBubbleWindow() {
    document.getElementById('addBubbleWindow').style.display = 'block';
}

function addBubble() {
    const name = document.getElementById('bubbleName').value;
    const link = document.getElementById('bubbleLink').value;
    const color = document.getElementById('bubbleColor').value;
    const imageInput = document.getElementById('bubbleImage');
    const imageFile = imageInput.files[0];
    let imagePath = '';

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imagePath = event.target.result;
            saveBubble(name, link, color, imagePath);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveBubble(name, link, color, '');
    }
}

function initBubble() {
    saveBubble("YouTube", "https://www.youtube.com/", "hsl(0, 70%, 80%)", "youtube.png");
    saveBubble("WhatsApp", "https://web.whatsapp.com/", "hsl(120, 70%, 80%)", "whatsapp.png");
    saveBubble("Gmail", "https://mail.google.com/", "hsl(240, 70%, 80%)", "gmail.png");
    saveBubble("Google Drive", "https://drive.google.com/drive/home", "hsl(60, 70%, 80%)", "drive.png");
    saveBubble("Copilot", "https://copilot.microsoft.com/", "hsl(300, 70%, 80%)", "copilot.png");
    saveBubble("GitHub", "https://github.com/garcilaso05", "hsl(30, 70%, 80%)", "github.png");
    saveBubble("Spotify", "https://open.spotify.com/", "hsl(90, 70%, 80%)", "spotify.png");
    saveBubble("ChatGPT", "https://chatgpt.com/", "hsl(150, 70%, 80%)", "chatgpt.png");
    saveBubble("OneDrive", "https://rovira-my.sharepoint.com/", "hsl(210, 70%, 80%)", "onedrive.png");
    saveBubble("Deepl", "https://www.deepl.com/es/translator", "hsl(182, 37.80%, 64.70%)", "deepl.png");
    saveBubble("SoftCatala", "https://www.softcatala.org/corrector/", "hsl(327, 69.20%, 87.30%)", "softcatala.png");
    saveBubble("Campus Virtual URV", "https://campusvirtual.urv.cat/my/", "hsl(45, 70%, 80%)", "moodle.png");
    saveBubble("Outlook", "https://outlook.office.com/mail/", "hsl(75, 70%, 80%)", "outlook.png");
    saveBubble("LinkedIn", "https://www.linkedin.com/feed/", "hsl(195, 70%, 80%)", "linkedin.png");
}

function saveBubble(name, link, color, imagePath) {
    const bubbles = JSON.parse(localStorage.getItem('bubbles')) || [];
    
    // Check for duplicate name or link
    const duplicate = bubbles.some(bubble => bubble.name === name || bubble.link === link);
    if (duplicate) {
        return;
    }

    const newBubble = {
        name: name,
        backgroundColor: color,
        link: link,
        image: imagePath || ''
    };
    bubbles.push(newBubble);
    localStorage.setItem('bubbles', JSON.stringify(bubbles));
    document.getElementById('addBubbleWindow').style.display = 'none';
    location.reload();
}