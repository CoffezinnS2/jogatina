require('dotenv').config();

const bola = process.env.BOLA;
console.log(bola)

document.getElementById('cardDiscord')?.addEventListener('click', (e) => {
    const { mouseX, mouseY } = angle(e, cardDiscord);
    let ripples = document.createElement('span');
    ripples.classList.add('ripples')
    ripples.style.left = mouseX + 'px'
    ripples.style.top = mouseY + 'px'
    cardDiscord.appendChild(ripples)

    setTimeout(() => {
        ripples.remove()
    }, 1000);
})

const circleCursor = document.querySelector('.circleCursor');
const mouse = { x: 0, y: 0 };
const previousMouse = { x: 0, y: 0 };
const ball = { x: 0, y: 0 };
let currentScale = 0;
let currentAngle = 0;

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
})

const speed = 0.17;

const tick = () => {
    ball.x += (mouse.x - ball.x) * speed;
    ball.y += (mouse.y - ball.y) * speed;

    const translateTransform = `translate(${ball.x}px, ${ball.y}px)`
    const deltaMouseX = mouse.x - previousMouse.x;
    const deltaMouseY = mouse.y - previousMouse.y;
    previousMouse.x = mouse.x;
    previousMouse.y = mouse.y;

    const mouseVelocity = Math.min(Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4, 150);
    const scaleValue = (mouseVelocity / 150) * 0.5;
    currentScale += (scaleValue - currentScale) * speed;

    const scaleTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;
    const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;

    if (mouseVelocity > 20) currentAngle = angle;

    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            circleCursor.style.setProperty('--circle-size', '80px');
        });
        link.addEventListener('mouseout', () => {
            circleCursor.style.setProperty('--circle-size', '40px');
        });
    });

    const rotateTransform = `rotate(${angle}deg)`;

    circleCursor.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;
    window.requestAnimationFrame(tick);
}
tick();

function angle(e, element) {
    const rect = element.getBoundingClientRect();
    // Posição do mouse relativa ao container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Multiplica para controlar a intensidade da rotação
    const xRotation = (mouseX / rect.width) * Math.PI * 0.2; // Inclina para frente/trás
    const zRotation = (mouseY / rect.height) * Math.PI * 0.2;  // Gira para os lados

    return { xRotation, zRotation, mouseX, mouseY };
}