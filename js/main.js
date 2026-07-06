/* ==================== MENU & NAV ==================== */
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if(navToggle) { navToggle.addEventListener('click', () => navMenu.classList.add('show-menu')); }
if(navClose) { navClose.addEventListener('click', () => navMenu.classList.remove('show-menu')); }

const navLink = document.querySelectorAll('.nav__link');
function linkAction() { navMenu.classList.remove('show-menu'); }
navLink.forEach(n => n.addEventListener('click', linkAction));

/* ==================== SCROLL PROGRESS BAR ==================== */
function initScrollProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.style.cssText = `
        position: fixed; top: 0; left: 0; width: 0%; height: 3px; z-index: 9999;
        background: linear-gradient(90deg, #1d4ed8, #0ea5e9);
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(14, 165, 233, 0.6);
    `;
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
        const total = document.body.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        bar.style.width = pct + '%';
    });
}

/* ==================== ACTIVE LINK ON SCROLL ==================== */
const sections = document.querySelectorAll('section[id]');
function scrollActiveLink() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector('.nav__link[href*="' + sectionId + '"]');
        if(link) {
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActiveLink);

/* ==================== TYPEWRITER ==================== */
const text = "Redes · Infraestructura · Automatización";
let charIndex = 0;
function typeWriter() {
    const typewriterElement = document.getElementById("typewriter");
    if (typewriterElement && charIndex < text.length) {
        typewriterElement.innerHTML += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 80);
    }
}

/* ==================== CURSOR ==================== */
const cursor = document.getElementById("custom-cursor");
if(window.innerWidth > 768) {
    document.addEventListener("mousemove", (e) => {
        if(cursor) {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        }
    });
}

/* ==================== FLOATING PARTICLES ==================== */
function createFloatingParticles() {
    const container = document.getElementById('floating-particles');
    if(!container) return;
    const numParticles = 18;
    for(let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('floating-particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 12 + 's';
        particle.style.animationDuration = (8 + Math.random() * 8) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

/* ==================== PARALLAX SCROLL (ADIA STYLE) ==================== */
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const parallaxBg = document.querySelector('.about-parallax__bg');
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
        // Efecto parallax en el hero content (se mueve más lento que el scroll)
        const heroContent = document.querySelector('.hero__content');
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }
    });
}

/* ==================== CANVAS 2D EARTH GLOBE ==================== */
function initEarth() {
    const canvas = document.getElementById('earth-canvas');
    if (!canvas) return;

    let displaySize, dpr, cx, cy, R;
    const ctx = canvas.getContext('2d');

    function resize() {
        displaySize = Math.min(window.innerWidth > 968 ? 500 : (window.innerWidth - 40), 520);
        dpr = window.devicePixelRatio || 1;

        canvas.width  = displaySize * dpr;
        canvas.height = displaySize * dpr;
        canvas.style.width  = displaySize + 'px';
        canvas.style.height = displaySize + 'px';

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        cx = displaySize / 2;
        cy = displaySize / 2;
        R  = displaySize * 0.42;
    }

    window.addEventListener('resize', resize);
    resize();

    const img = new Image();
    let offset = 0;       // rotación horizontal (px de la textura)
    let imgLoaded = false;

    img.onload  = () => { imgLoaded = true; };
    img.onerror = () => { imgLoaded = false; };
    img.src = 'img/earth.jpg';

    function drawGlobe() {
        ctx.clearRect(0, 0, displaySize, displaySize);

        /* ── CLIP: todo lo que pintemos quedará dentro del círculo ── */
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();

        if (imgLoaded) {
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;

            // Proyección esférica 3D por re-mapeo de rebanadas verticales (Slices)
            const slices = 50;
            const sliceW = (R * 2) / slices;

            for (let i = 0; i < slices; i++) {
                const x1 = -R + i * sliceW;
                
                // Normalizamos a [-1, 1]
                const nx1 = x1 / R;
                const nx2 = Math.min(1, (x1 + sliceW) / R);

                // Ángulo esférico (longitud en la esfera de -PI/2 a PI/2)
                const theta1 = Math.asin(nx1);
                const theta2 = Math.asin(nx2);

                // Proporción visible del mapa [0, 1]
                const u1 = (theta1 + Math.PI / 2) / Math.PI;
                const u2 = (theta2 + Math.PI / 2) / Math.PI;

                // Mapeo a las coordenadas de textura
                const tx1 = ((offset + u1 * (iw / 2)) % iw + iw) % iw;
                const tx2 = ((offset + u2 * (iw / 2)) % iw + iw) % iw;

                let srcW = tx2 - tx1;
                if (srcW < 0) {
                    srcW += iw;
                }

                // Dibujar rebanada vertical con ligero solape (0.5px) para evitar brechas de subpíxeles
                ctx.drawImage(img,
                    tx1, 0, srcW, ih,
                    cx + x1, cy - R, sliceW + 0.6, R * 2
                );
            }
        } else {
            /* Fallback bonito si la imagen no carga */
            const g = ctx.createRadialGradient(cx - R*0.3, cy - R*0.25, R*0.05, cx, cy, R);
            g.addColorStop(0,   '#5bc4f5');
            g.addColorStop(0.3, '#1a6fa4');
            g.addColorStop(0.7, '#0a3d62');
            g.addColorStop(1,   '#051e33');
            ctx.fillStyle = g;
            ctx.fillRect(cx - R, cy - R, R*2, R*2);
            
            ctx.fillStyle = 'rgba(34,139,34,0.7)';
            [[cx-R*0.1, cy-R*0.1, R*0.32, R*0.26, -0.3],
             [cx+R*0.33, cy+R*0.05, R*0.2, R*0.35, 0.4],
             [cx-R*0.38, cy+R*0.22, R*0.26, R*0.17, -0.5],
             [cx+R*0.08, cy-R*0.38, R*0.22, R*0.13, 0.2]
            ].forEach(([ex,ey,rx,ry,rot]) => {
                ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, rot, 0, Math.PI*2); ctx.fill();
            });
        }

        /* ── Oscurecimiento esférico en los bordes (vignette) ── */
        const vignette = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R);
        vignette.addColorStop(0,    'rgba(0,0,0,0)');
        vignette.addColorStop(0.7,  'rgba(0,0,0,0.10)');
        vignette.addColorStop(0.92, 'rgba(0,0,0,0.45)');
        vignette.addColorStop(1,    'rgba(0,0,0,0.70)');
        ctx.fillStyle = vignette;
        ctx.fillRect(cx - R, cy - R, R*2, R*2);

        /* ── Reflejo especular (luz en la esquina superior izquierda) ── */
        const specular = ctx.createRadialGradient(
            cx - R*0.38, cy - R*0.38, 0,
            cx - R*0.28, cy - R*0.28, R*0.52
        );
        specular.addColorStop(0,   'rgba(255,255,255,0.22)');
        specular.addColorStop(0.45,'rgba(255,255,255,0.05)');
        specular.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = specular;
        ctx.fillRect(cx - R, cy - R, R*2, R*2);

        ctx.restore(); // Fin del clip del globo

        /* ── Atmósfera exterior brillante (muy sutil) ── */
        const atmo = ctx.createRadialGradient(cx, cy, R * 0.94, cx, cy, R * 1.20);
        atmo.addColorStop(0,    'rgba(14,165,233,0.25)');
        atmo.addColorStop(0.35, 'rgba(14,165,233,0.08)');
        atmo.addColorStop(0.7,  'rgba(56,189,248,0.02)');
        atmo.addColorStop(1,    'rgba(14,165,233,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.20, 0, Math.PI * 2);
        ctx.fillStyle = atmo;
        ctx.fill();

        /* ── Rim light (lado izquierdo) ── */
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2);
        ctx.arc(cx, cy, R * 0.94, 0, Math.PI * 2, true);
        const rimGrad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
        rimGrad.addColorStop(0,    'rgba(56,189,248,0.30)');
        rimGrad.addColorStop(0.25, 'rgba(56,189,248,0.10)');
        rimGrad.addColorStop(0.6,  'rgba(56,189,248,0.01)');
        rimGrad.addColorStop(1,    'rgba(56,189,248,0)');
        ctx.fillStyle = rimGrad;
        ctx.fill();
        ctx.restore();

        /* ── Anillo orbital decorativo (muy atenuado) ── */
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.32);
        ctx.scale(1, 0.28);
        ctx.beginPath();
        ctx.arc(0, 0, R * 1.30, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(14,165,233,0.06)';
        ctx.lineWidth = 2.5 / 0.28;
        ctx.stroke();
        ctx.restore();

        offset += 0.35;   // velocidad de rotación
        requestAnimationFrame(drawGlobe);
    }

    img.complete ? drawGlobe() : img.addEventListener('load', drawGlobe);
}


/* ==================== STARFIELD ==================== */
const starCanvas = document.getElementById('starfield');
if(starCanvas) {
    const starCtx = starCanvas.getContext('2d');
    let stars = []; const numStars = 200;

    function resizeStarCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeStarCanvas);
    resizeStarCanvas();

    function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * window.innerWidth - window.innerWidth / 2,
                y: Math.random() * window.innerHeight - window.innerHeight / 2,
                z: Math.random() * window.innerWidth
            });
        }
    }
    createStars();

    function animateStars() {
        starCtx.fillStyle = "rgba(9, 14, 26, 1)";
        starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
        starCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
        let scrollSpeed = 1.5 + (window.scrollY * 0.03);
        stars.forEach(star => {
            star.z -= scrollSpeed;
            if (star.z <= 0) {
                star.z = window.innerWidth;
                star.x = Math.random() * window.innerWidth - window.innerWidth / 2;
                star.y = Math.random() * window.innerHeight - window.innerHeight / 2;
            }
            const x = (star.x / star.z) * window.innerWidth / 2 + window.innerWidth / 2;
            const y = (star.y / star.z) * window.innerHeight / 2 + window.innerHeight / 2;
            const size = Math.max(0.1, (1 - star.z / window.innerWidth) * 2.5);
            if (x >= 0 && x <= starCanvas.width && y >= 0 && y <= starCanvas.height) {
                starCtx.beginPath();
                starCtx.arc(x, y, size, 0, Math.PI * 2);
                starCtx.fill();
            }
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();
}

/* ==================== SCROLL REVEAL (ADIA STAGGER) ==================== */
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay para efecto escalonado
                const delay = entry.target.dataset.delay || (i * 80);
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach((el, i) => {
        el.dataset.delay = i * 80;
        observer.observe(el);
    });
}

/* ==================== TILT EFFECT ON SKILL CARDS ==================== */
function initTiltEffect() {
    const cards = document.querySelectorAll('.skill-card, .cert-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx2 = rect.width / 2;
            const cy2 = rect.height / 2;
            const rotX = ((y - cy2) / cy2) * -8;
            const rotY = ((x - cx2) / cx2) * 8;
            card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ==================== COUNTER ANIMATION ==================== */
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.dataset.count;
                let current = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = '+' + Math.floor(current);
                }, 25);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

/* ==================== SMOOTH SECTION TRANSITIONS (ADIA style) ==================== */
function initSectionFade() {
    const sectionEls = document.querySelectorAll('.section, .about-fullwidth');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section--visible');
            }
        });
    }, { threshold: 0.08 });
    sectionEls.forEach(s => {
        s.classList.add('section--hidden');
        obs.observe(s);
    });
}

/* ==================== PROJECTS DATA ==================== */
const projectsData = [
    {
        title: "Storm Runner",
        description: "Juego de acción y estrategia donde controlas un corredor en un mundo post-apocalíptico. Esquiva obstáculos, recoge potenciadores y desafía tus límites.",
        tech: "HTML5 · CSS3 · JavaScript",
        link: "https://hmarabtto.github.io/juego.io/",
        image: "img/storm_runner.png",
        isNew: true
    }
];

/* ==================== CERTS DATA ==================== */
const certsData = [
    { title: "Fundamentos de Redes", issuer: "Cisco Networking Academy", icon: "fas fa-network-wired" },
    { title: "Python para Todos", issuer: "University of Michigan", icon: "fab fa-python" },
    { title: "Desarrollo Web", issuer: "freeCodeCamp", icon: "fas fa-code" },
    { title: "Ciberseguridad", issuer: "IBM", icon: "fas fa-shield-alt" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Cargar Proyectos
    const pContainer = document.getElementById('projects-container');
    if(pContainer) {
        pContainer.innerHTML = '';
        if (projectsData.length === 1) {
            const p = projectsData[0];
            const techTags = p.tech.split(' · ').map(t => `<span class="tech-tag">${t}</span>`).join('');
            pContainer.innerHTML = `
            <article class="featured-project scroll-reveal">
                <div class="featured-project__badge-container">
                    <span class="featured-project__badge">
                        <i class="fas fa-star"></i> Proyecto Destacado
                    </span>
                </div>
                <div class="featured-project__image-side">
                    <img src="${p.image}" class="featured-project__img" alt="${p.title}">
                    <div class="featured-project__image-overlay"></div>
                </div>
                <div class="featured-project__content-side">
                    <div class="featured-project__tech-tags">${techTags}</div>
                    <h2 class="featured-project__title">${p.title}</h2>
                    <p class="featured-project__description">${p.description}</p>
                    <div class="featured-project__features">
                        <span class="feature-pill"><i class="fas fa-gamepad"></i> Modo Campaña</span>
                        <span class="feature-pill"><i class="fas fa-infinity"></i> Modo Infinito</span>
                        <span class="feature-pill"><i class="fas fa-trophy"></i> Progresión</span>
                    </div>
                    <div class="featured-project__actions">
                        <a href="${p.link}" target="_blank" class="btn btn--glow btn--lg">
                            <i class="fas fa-play"></i> Jugar Ahora
                        </a>
                        <a href="${p.link}" target="_blank" class="btn btn--secondary">
                            <i class="fas fa-external-link-alt"></i> Ver Demo
                        </a>
                    </div>
                </div>
            </article>
            <div class="coming-soon scroll-reveal">
                <div class="coming-soon__icon">
                    <i class="fas fa-rocket"></i>
                </div>
                <p>Más proyectos en desarrollo<span class="loading-dots"></span></p>
            </div>`;
        } else {
            pContainer.classList.add('projects__grid');
            projectsData.forEach((p) => {
                const badgeHTML = p.isNew ? '<span class="project__badge">Nuevo</span>' : '';
                pContainer.insertAdjacentHTML('beforeend', `
                <article class="project-card scroll-reveal">
                    <div class="project__image-container">
                        ${badgeHTML}
                        <img src="${p.image}" class="project__img" alt="${p.title}">
                    </div>
                    <div class="project__content">
                        <h3 class="project__tags">${p.tech}</h3>
                        <h2 class="project__title">${p.title}</h2>
                        <p class="project__description">${p.description}</p>
                        <a href="${p.link}" target="_blank" class="project__link">Ver Proyecto <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>`);
            });
        }
    }

    // Cargar Certificaciones
    const cContainer = document.getElementById('certs-container');
    if(cContainer) {
        cContainer.innerHTML = '';
        certsData.forEach(c => {
            cContainer.insertAdjacentHTML('beforeend', `
            <div class="cert-card scroll-reveal">
                <div class="cert__icon"><i class="${c.icon}"></i></div>
                <div class="cert__content">
                    <h3 class="cert__title">${c.title}</h3>
                    <span class="cert__issuer">${c.issuer}</span>
                </div>
            </div>`);
        });
    }

    // Inicializar todo
    initScrollProgressBar();
    typeWriter();
    createFloatingParticles();
    initScrollReveal();
    animateCounters();
    initParallax();
    initSectionFade();
    setTimeout(() => {
        initEarth();
        initTiltEffect();
    }, 200);

    /* ==================== FORM AJAX ==================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        console.log("Contact form found, attaching submit listener inside DOMContentLoaded.");
        contactForm.addEventListener('submit', async function(e) {
            console.log("Form submit event triggered. Calling preventDefault().");
            e.preventDefault();
            const btn = document.getElementById('form-btn');
            const txt = document.getElementById('btn-text');
            btn.disabled = true; txt.innerHTML = 'Enviando...';
            try {
                console.log("Sending fetch request to: ", contactForm.action);
                const response = await fetch(contactForm.action, { 
                    method: 'POST', 
                    body: new FormData(contactForm), 
                    headers: {'Accept': 'application/json'} 
                });
                console.log("Response received status: ", response.status);
                txt.innerHTML = '¡Enviado! ✅';
                contactForm.reset();
                setTimeout(() => { txt.innerHTML = 'Enviar <i class="fas fa-paper-plane"></i>'; btn.disabled = false; }, 3000);
            } catch (error) {
                console.error("Fetch request failed: ", error);
                txt.innerHTML = 'Error ❌'; btn.disabled = false;
            }
        });
    } else {
        console.error("Contact form element not found in DOM!");
    }
});