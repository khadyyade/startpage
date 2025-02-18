// Este archivo contiene las funciones para manejar el reloj en la página de inicio, incluyendo la actualización de la hora y la fecha, y la gestión de la visibilidad del reloj.

document.addEventListener('DOMContentLoaded', () => {
    const clockContainers = document.querySelectorAll('#clockContainer');

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // Formatea las horas con dos dígitos
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Formatea los minutos con dos dígitos
        const date = now.toLocaleDateString('es-ES'); // Obtiene la fecha en formato español

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

            bubble.style.opacity = overlap ? '0.4' : '1'; // Reduce la opacidad de las burbujas que se superponen con el reloj
        });
    }

    updateClock();
    setInterval(updateClock, 1000); // Actualiza el reloj cada segundo

    // Oculta el reloj en dispositivos móviles
    if (window.innerWidth <= 768) {
        document.querySelectorAll('#clockContainerWrapper').forEach(wrapper => {
            wrapper.style.display = 'none';
        });
    }

    // Muestra el reloj apropiado según la posición del ratón con un efecto de desvanecimiento gradual
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
                }, 250); // Ajusta la duración según sea necesario
            }
        } else {
            if (rightClock.style.opacity !== '1') {
                leftClock.style.transition = 'opacity 0.5s ease-in-out';
                leftClock.style.opacity = '0';
                setTimeout(() => {
                    rightClock.style.transition = 'opacity 0.5s ease-in-out';
                    rightClock.style.opacity = '1';
                    checkBubbleOverlap();
                }, 250); // Ajusta la duración según sea necesario
            }
        }
    });

    // Verifica periódicamente la posición del ratón y asegura que solo un reloj sea visible
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
    }, 1000); // Ajusta el intervalo según sea necesario

    // Rastrea la posición del ratón
    document.addEventListener('mousemove', (event) => {
        window.mouseX = event.clientX;
    });

    // Asegura que solo un reloj sea visible a la vez
    document.addEventListener('mouseleave', () => {
        const leftClock = document.querySelector('#clockContainerWrapper.left');
        const rightClock = document.querySelector('#clockContainerWrapper.right');
        leftClock.style.opacity = '0';
        rightClock.style.opacity = '0';
    });

    // Verifica la superposición de burbujas inicialmente
    checkBubbleOverlap();
});
