const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let shootingStars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 3800);
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + 0.2,
            alpha: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.018 + 0.004,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
        });
    }
}

function spawnShootingStar() {
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
    shootingStars.push({
        x: Math.random() * canvas.width * 0.75,
        y: Math.random() * canvas.height * 0.45,
        len: Math.random() * 140 + 70,
        speed: Math.random() * 9 + 5,
        alpha: 1,
        angle,
    });
}

function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#080b0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const g1 = ctx.createRadialGradient(
        canvas.width * 0.25, canvas.height * 0.2, 0,
        canvas.width * 0.25, canvas.height * 0.2, canvas.width * 0.55
    );
    g1.addColorStop(0, 'rgba(0, 217, 196, 0.04)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const g2 = ctx.createRadialGradient(
        canvas.width * 0.78, canvas.height * 0.65, 0,
        canvas.width * 0.78, canvas.height * 0.65, canvas.width * 0.45
    );
    g2.addColorStop(0, 'rgba(0, 217, 196, 0.025)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 1) { star.alpha = 1; star.twinkleDir = -1; }
        if (star.alpha <= 0.1) { star.alpha = 0.1; star.twinkleDir = 1; }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 235, ${star.alpha})`;
        ctx.fill();
    }

    shootingStars = shootingStars.filter(s => s.alpha > 0.02);
    for (const s of shootingStars) {
        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(0, 217, 196, ${s.alpha})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.018;
    }

    requestAnimationFrame(drawFrame);
}

resizeCanvas();
initStars();
drawFrame();
setInterval(spawnShootingStar, 3800);
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

const phrases = [
    'Software Engineering',
    'Electrical Engineering',
    'Blue Origin Intern',
    'GN&C Enthusiast',
    'Control Systems',
    'Embedded Systems',
    'Flight Software',

];

let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeLoop, 2200);
            return;
        }
        setTimeout(typeLoop, 95);
    } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(typeLoop, 400);
            return;
        }
        setTimeout(typeLoop, 55);
    }
}

setTimeout(typeLoop, 1600);

const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById('panel-' + btn.dataset.tab);
        if (target) {
            target.classList.add('active');
            target.querySelectorAll('.reveal').forEach((el, i) => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), i * 90);
            });
        }
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 85);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

lucide.createIcons();
