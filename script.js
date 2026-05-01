document.addEventListener('DOMContentLoaded', () => {

    /* ── Orange Particle Background ── */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];
        function resizeCanvas(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        class Particle {
            constructor(){ this.reset(); }
            reset(){
                this.x = Math.random() * W; this.y = Math.random() * H;
                this.r = Math.random() * 1.2 + .3;
                this.dx = (Math.random() - .5) * .3; this.dy = (Math.random() - .5) * .3;
                this.alpha = Math.random() * .35 + .08;
            }
            draw(){
                ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(234,88,12,${this.alpha})`;
                ctx.shadowBlur = 4; ctx.shadowColor = 'rgba(234,88,12,.25)';
                ctx.fill();
            }
            update(){
                this.x += this.dx; this.y += this.dy;
                if (this.x < 0 || this.x > W) this.dx *= -1;
                if (this.y < 0 || this.y > H) this.dy *= -1;
            }
        }
        for (let i = 0; i < 70; i++) particles.push(new Particle());
        function drawLines(){
            for (let i = 0; i < particles.length; i++){
                for (let j = i + 1; j < particles.length; j++){
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 100){
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(234,88,12,${.06 * (1 - dist/100)})`;
                        ctx.lineWidth = .4; ctx.stroke();
                    }
                }
            }
        }
        (function animateParticles(){
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animateParticles);
        })();
    }

    /* ── Sticky Header ── */
    const header = document.getElementById('header');
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        if(backBtn) backBtn.classList.toggle('visible', window.scrollY > 400);
    });
    if(backBtn) backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ── Mobile hamburger ── */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');
    if(hamburger && navMenu){
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    /* ── Active nav ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 200) current = sec.id; });
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    });

    /* ── Scroll Reveal ── */
    const revealEls = document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.reveal-right');
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); revealObs.unobserve(entry.target); }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));

    /* ── Typing Effect ── */
    const typed = document.getElementById('typed');
    const words = ['Frontend Developer', 'Backend Developer', 'Problem Solver'];
    let wi = 0, ci = 0, deleting = false;
    function type() {
        const word = words[wi];
        typed.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
        if (!deleting && ci > word.length)  { deleting = true; setTimeout(type, 1400); return; }
        if (deleting && ci < 0)             { deleting = false; wi = (wi + 1) % words.length; }
        setTimeout(type, deleting ? 55 : 95);
    }
    if (typed) type();

    /* ── Counter Animation ── */
    const statsEl = document.querySelector('.about-stats');
    if (statsEl) {
        const statsObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.querySelectorAll('.stat-num').forEach(el => {
                    const target = +el.dataset.target;
                    const step   = target > 100 ? 40 : 1;
                    let cur      = 0;
                    const timer  = setInterval(() => {
                        cur += step;
                        if (cur >= target) { cur = target; clearInterval(timer); }
                        el.textContent = cur;
                    }, target > 100 ? 18 : 55);
                });
                statsObs.unobserve(entry.target);
            });
        }, { threshold: .4 });
        statsObs.observe(statsEl);
    }

    /* ── Technical Skills Animation Logic ── */
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillWraps = document.querySelectorAll('.skill-circle-wrap');
        
        const animateSkill = (wrap) => {
            const progress = wrap.querySelector('.progress');
            const pctDisplay = wrap.querySelector('.pct');
            const targetPct = wrap.dataset.pct;
            const circumference = 2 * Math.PI * 45; // radius 45
            
            // Set SVG stroke
            progress.style.strokeDasharray = circumference;
            const offset = circumference - (targetPct / 100) * circumference;
            progress.style.strokeDashoffset = offset;

            // Animate Number
            let current = 0;
            const duration = 2000;
            const step = targetPct / (duration / 16);
            
            const counter = setInterval(() => {
                current += step;
                if (current >= targetPct) {
                    pctDisplay.textContent = targetPct + '%';
                    clearInterval(counter);
                } else {
                    pctDisplay.textContent = Math.floor(current) + '%';
                }
            }, 16);
        };

        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillWraps.forEach(wrap => animateSkill(wrap));
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillsObserver.observe(skillsSection);
    }

    /* ── Project image fallback ── */
    document.querySelectorAll('.project-img img').forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            img.parentElement.classList.add('no-img');
        });
        // Also trigger for cached errors
        if (img.complete && img.naturalWidth === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });

    /* ── Contact Form ── */
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.textContent = 'Sending…'; btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                btn.disabled  = false;
                if(success){ success.classList.add('show'); form.reset(); setTimeout(() => success.classList.remove('show'), 5000); }
            }, 1500);
        });
    }

    /* ── Smooth scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    /* ── Mouse Parallax for Background Blobs ── */
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length > 0) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 50;
            const y = (e.clientY / window.innerHeight - 0.5) * 50;
            blobs.forEach((blob, i) => {
                const speed = (i + 1) * 0.4;
                blob.style.setProperty('--mx', `${x * speed}px`);
                blob.style.setProperty('--my', `${y * speed}px`);
            });
        });
    }

    /* ── 3D Tilt Hover Effect ── */
    const tiltElements = document.querySelectorAll('.project-card, .category-card, .profile-3d-wrap');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Adjust maximum tilt based on element size, smaller elements tilt more
            const intensity = el.classList.contains('profile-3d-wrap') ? 15 : 8;
            const tiltX = ((y - centerY) / centerY) * -intensity;
            const tiltY = ((x - centerX) / centerX) * intensity;
            
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

});
