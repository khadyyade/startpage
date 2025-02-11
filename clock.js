document.addEventListener('DOMContentLoaded', () => {
    const clockContainers = document.querySelectorAll('#clockContainer');

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const date = now.toLocaleDateString('es-ES');

        clockContainers.forEach(clockContainer => {
            clockContainer.querySelector('#hour').textContent = hours;
            clockContainer.querySelector('#minute').textContent = minutes;
            clockContainer.querySelector('#date').textContent = date;
        });
    }

    function checkBubbleOverlap() {
        const activeClock = document.querySelector('#clockContainerWrapper.left').style.opacity === '1'
            ? document.querySelector('#clockContainerWrapper.left #clockContainer')
            : document.querySelector('#clockContainerWrapper.right #clockContainer');

        const activeClockRect = activeClock.getBoundingClientRect();
        const bubbles = document.querySelectorAll('.bubble');

        bubbles.forEach(bubble => {
            const bubbleRect = bubble.getBoundingClientRect();
            const overlap = !(bubbleRect.right < activeClockRect.left ||
                              bubbleRect.left > activeClockRect.right ||
                              bubbleRect.bottom < activeClockRect.top ||
                              bubbleRect.top > activeClockRect.bottom);

            bubble.style.opacity = overlap ? '0.4' : '1';
        });
    }

    updateClock();
    setInterval(updateClock, 1000);

    // Hide clock on mobile devices
    if (window.innerWidth <= 768) {
        document.querySelectorAll('#clockContainerWrapper').forEach(wrapper => {
            wrapper.style.display = 'none';
        });
    }

    // Show appropriate clock based on mouse position with gradual fade effect
    document.addEventListener('mousemove', (event) => {
        const leftClock = document.querySelector('#clockContainerWrapper.left');
        const rightClock = document.querySelector('#clockContainerWrapper.right');
        if (event.clientX > window.innerWidth / 2) {
            if (leftClock.style.opacity !== '1') {
                rightClock.style.transition = 'opacity 0.5s ease-in-out';
                rightClock.style.opacity = '0';
                setTimeout(() => {
                    leftClock.style.transition = 'opacity 0.5s ease-in-out';
                    leftClock.style.opacity = '1';
                    checkBubbleOverlap();
                }, 250); // Adjust the duration as needed
            }
        } else {
            if (rightClock.style.opacity !== '1') {
                leftClock.style.transition = 'opacity 0.5s ease-in-out';
                leftClock.style.opacity = '0';
                setTimeout(() => {
                    rightClock.style.transition = 'opacity 0.5s ease-in-out';
                    rightClock.style.opacity = '1';
                    checkBubbleOverlap();
                }, 250); // Adjust the duration as needed
            }
        }
    });

    // Periodically check mouse position and ensure only one clock is visible
    setInterval(() => {
        const leftClock = document.querySelector('#clockContainerWrapper.left');
        const rightClock = document.querySelector('#clockContainerWrapper.right');
        const mouseX = window.mouseX || 0;

        if (mouseX > window.innerWidth / 2) {
            leftClock.style.opacity = '1';
            rightClock.style.opacity = '0';
        } else {
            leftClock.style.opacity = '0';
            rightClock.style.opacity = '1';
        }
        checkBubbleOverlap();
    }, 1000); // Adjust the interval as needed

    // Track mouse position
    document.addEventListener('mousemove', (event) => {
        window.mouseX = event.clientX;
    });

    // Ensure only one clock is visible at a time
    document.addEventListener('mouseleave', () => {
        const leftClock = document.querySelector('#clockContainerWrapper.left');
        const rightClock = document.querySelector('#clockContainerWrapper.right');
        leftClock.style.opacity = '0';
        rightClock.style.opacity = '0';
    });

    // Check bubble overlap initially
    checkBubbleOverlap();
});
