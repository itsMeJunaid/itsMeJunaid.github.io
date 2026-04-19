/* ============================================================
   spa.js — single-page portfolio interactions
   Uses: GSAP + ScrollTrigger (from CDN), Lenis (from CDN), VANTA.NET (from CDN).
   All are optional — each block guards for missing globals.
   ============================================================ */

(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch        = window.matchMedia('(hover: none)').matches;

    /* ---------------------------------------------------------
       Page loader — animates bar then fades out on window.load
    --------------------------------------------------------- */
    (function loader() {
        const wrap = document.getElementById('page-loader');
        if (!wrap) return;
        const fill = wrap.querySelector('.loader-fill');
        const pct  = wrap.querySelector('.loader-pct');
        let p = 0;
        const tick = setInterval(() => {
            p = Math.min(92, p + Math.random() * 14);
            fill.style.width = p + '%';
            pct.textContent = Math.floor(p) + '%';
        }, 120);
        window.addEventListener('load', () => {
            clearInterval(tick);
            fill.style.width = '100%';
            pct.textContent = '100%';
            setTimeout(() => wrap.classList.add('is-gone'), 350);
        });
    })();

    /* ---------------------------------------------------------
       Vanta.NET background (if loaded)
    --------------------------------------------------------- */
    window.addEventListener('load', () => {
        if (prefersReduced) return;
        if (window.VANTA && window.VANTA.NET) {
            window.VANTA.NET({
                el: '#bg-vanta',
                mouseControls: !isTouch,
                touchControls: true,
                gyroControls: false,
                minHeight: 200,
                minWidth: 200,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x6C63FF,
                backgroundColor: 0x050510,
                points: 10.0,
                maxDistance: 22.0,
                spacing: 17.0,
            });
        }
    });

    /* ---------------------------------------------------------
       Lenis smooth scroll (if loaded)
    --------------------------------------------------------- */
    let lenis = null;
    if (window.Lenis && !prefersReduced) {
        lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    /* ---------------------------------------------------------
       Custom cursor
    --------------------------------------------------------- */
    (function cursor() {
        if (isTouch) return;
        const dot  = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        if (!dot || !ring) return;

        let mx = 0, my = 0, rx = 0, ry = 0;
        window.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        });
        (function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll('a, button, .proj-card, .tech-chip, .avatar-social a, .name-card')
            .forEach(el => {
                el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
                el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
            });
    })();

    /* ---------------------------------------------------------
       Scroll progress bar
    --------------------------------------------------------- */
    (function scrollProgress() {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;
        const onScroll = () => {
            const h = document.documentElement;
            const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
            bar.style.width = pct + '%';
        };
        document.addEventListener('scroll', onScroll, { passive: true });
    })();

    /* ---------------------------------------------------------
       Nav — sliding pill indicator + active link + mobile menu
    --------------------------------------------------------- */
    (function nav() {
        const links = Array.from(document.querySelectorAll('.nav-links a'));
        const pill  = document.querySelector('.nav-pill');
        const burger = document.querySelector('.nav-burger');
        const mobile = document.querySelector('.nav-mobile');

        function movePill(el) {
            if (!pill || !el) return;
            const parent = el.parentElement; // .nav-links (pill's containing block)
            const pr = parent.getBoundingClientRect();
            const r  = el.getBoundingClientRect();
            pill.style.width = r.width + 'px';
            pill.style.transform = `translateX(${r.left - pr.left}px)`;
        }

        const activeLink = () => links.find(a => a.classList.contains('active')) || links[0];
        setTimeout(() => movePill(activeLink()), 50);
        window.addEventListener('resize', () => movePill(activeLink()));

        links.forEach(a => {
            a.addEventListener('mouseenter', () => movePill(a));
            a.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('active'));
                a.classList.add('active');
                movePill(a);
                if (mobile) mobile.classList.remove('is-open');
            });
        });
        // restore pill to active on mouseleave
        const wrap = document.querySelector('.nav-links');
        if (wrap) wrap.addEventListener('mouseleave', () => movePill(activeLink()));

        // active section detection
        const sections = links
            .map(a => a.getAttribute('href'))
            .filter(h => h && h.startsWith('#'))
            .map(h => document.querySelector(h))
            .filter(Boolean);
        if ('IntersectionObserver' in window && sections.length) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        const id = '#' + e.target.id;
                        const match = links.find(a => a.getAttribute('href') === id);
                        if (match) {
                            links.forEach(l => l.classList.remove('active'));
                            match.classList.add('active');
                            movePill(match);
                        }
                    }
                });
            }, { rootMargin: '-45% 0px -50% 0px' });
            sections.forEach(s => io.observe(s));
        }

        // mobile toggle
        if (burger && mobile) {
            burger.addEventListener('click', () => mobile.classList.toggle('is-open'));
            mobile.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => mobile.classList.remove('is-open'));
            });
        }
    })();

    /* ---------------------------------------------------------
       Typing role cycle
    --------------------------------------------------------- */
    (function typer() {
        const host = document.querySelector('[data-typer]');
        if (!host) return;
        const phrases = JSON.parse(host.getAttribute('data-typer'));
        const target = host.querySelector('.typer-text');
        let i = 0, c = 0, del = false;
        function tick() {
            const p = phrases[i];
            if (!del) {
                target.textContent = p.slice(0, ++c);
                if (c === p.length) { del = true; setTimeout(tick, 1400); return; }
            } else {
                target.textContent = p.slice(0, --c);
                if (c === 0) { del = false; i = (i + 1) % phrases.length; }
            }
            setTimeout(tick, del ? 40 : 70);
        }
        tick();
    })();

    /* ---------------------------------------------------------
       Tilt name card + avatar card
    --------------------------------------------------------- */
    (function tilt() {
        if (isTouch || prefersReduced) return;
        document.querySelectorAll('[data-tilt]').forEach(card => {
            const strength = Number(card.dataset.tiltStrength || 10);
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.style.transform =
                    `perspective(1000px) rotateX(${(0.5 - y) * strength}deg) rotateY(${(x - 0.5) * strength}deg)`;
                card.style.setProperty('--mx', (x * 100) + '%');
                card.style.setProperty('--my', (y * 100) + '%');
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    })();

    /* ---------------------------------------------------------
       Letter-by-letter reveal on section titles
    --------------------------------------------------------- */
    (function letterReveal() {
        document.querySelectorAll('.letter-reveal').forEach(node => {
            const text = node.textContent;
            node.textContent = '';
            [...text].forEach((ch, i) => {
                const span = document.createElement('span');
                span.className = 'l';
                span.style.setProperty('--i', i);
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                node.appendChild(span);
            });
        });
        if (!('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(ents => {
            ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
        }, { threshold: 0.3 });
        document.querySelectorAll('.letter-reveal').forEach(n => io.observe(n));
    })();

    /* ---------------------------------------------------------
       Scroll reveal (in-view) + stat counters + skill bars
    --------------------------------------------------------- */
    (function reveal() {
        if (!('IntersectionObserver' in window)) return;

        const io = new IntersectionObserver(ents => {
            ents.forEach(e => {
                if (!e.isIntersecting) return;
                e.target.classList.add('in-view');

                // counter
                if (e.target.hasAttribute('data-count')) {
                    animateCount(e.target, +e.target.getAttribute('data-count'));
                    e.target.removeAttribute('data-count');
                }
                // skill fill
                if (e.target.classList.contains('skill')) {
                    const pct = e.target.dataset.pct;
                    e.target.style.setProperty('--w', pct + '%');
                    const pctEl = e.target.querySelector('.pct');
                    if (pctEl) animateCount(pctEl, +pct, '%');
                }

                io.unobserve(e.target);
            });
        }, { threshold: 0.25 });

        document.querySelectorAll('.proj-card, .tl-item, .skill, [data-count]').forEach(n => io.observe(n));
    })();

    function animateCount(el, target, suffix = '') {
        const dur = 1500;
        const start = performance.now();
        function frame(t) {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(frame);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(frame);
    }

    /* ---------------------------------------------------------
       Projects filter
    --------------------------------------------------------- */
    (function projFilter() {
        const filters = document.querySelectorAll('.proj-filters button');
        const cards   = document.querySelectorAll('.proj-card');
        if (!filters.length) return;

        filters.forEach(b => {
            b.addEventListener('click', () => {
                filters.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                const f = b.dataset.filter;
                cards.forEach(c => {
                    if (f === 'all' || c.dataset.cat.includes(f)) {
                        c.classList.remove('hidden');
                        requestAnimationFrame(() => c.classList.add('in-view'));
                    } else {
                        c.classList.add('hidden');
                    }
                });
            });
        });
    })();

    /* ---------------------------------------------------------
       Timeline progress line
    --------------------------------------------------------- */
    (function timeline() {
        const tl = document.querySelector('.timeline');
        if (!tl) return;
        function update() {
            const r = tl.getBoundingClientRect();
            const total = r.height;
            const passed = Math.max(0, Math.min(total, window.innerHeight * 0.6 - r.top));
            tl.style.setProperty('--tl-h', (passed / total * 100) + '%');
        }
        update();
        document.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    })();

    /* ---------------------------------------------------------
       Contact form — floating labels + particle burst
    --------------------------------------------------------- */
    (function form() {
        document.querySelectorAll('.field input, .field textarea').forEach(inp => {
            const field = inp.closest('.field');
            const sync  = () => field.classList.toggle('has-value', !!inp.value);
            inp.addEventListener('input', sync);
            inp.addEventListener('blur',  sync);
            sync();
        });

        const btn = document.querySelector('.submit-btn');
        if (!btn) return;
        const burst = btn.querySelector('.burst');
        for (let i = 0; i < 16; i++) burst.appendChild(document.createElement('span'));
        const parts = burst.querySelectorAll('span');

        const f = document.getElementById('contact-form');
        if (f) {
            f.addEventListener('submit', e => {
                // let the native submission happen (FormSubmit handles it), but animate anyway
                parts.forEach((p, i) => {
                    const a = (i / parts.length) * Math.PI * 2;
                    const d = 60 + Math.random() * 40;
                    p.style.transition = 'transform .7s ease-out, opacity .7s ease-out';
                    p.style.opacity = '1';
                    p.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(${0.6 + Math.random()})`;
                    setTimeout(() => { p.style.opacity = '0'; p.style.transform = 'translate(0,0) scale(0)'; p.style.transition = 'none'; }, 700);
                });
            });
        }
    })();

    /* ---------------------------------------------------------
       Theme toggle (light/dark) — just flips a class
    --------------------------------------------------------- */
    (function theme() {
        const btn = document.querySelector('.nav-toggle');
        if (!btn) return;
        btn.addEventListener('click', () => {
            document.body.classList.toggle('theme-light');
            btn.textContent = document.body.classList.contains('theme-light') ? '☀' : '☾';
        });
    })();

    /* ---------------------------------------------------------
       GSAP ScrollTrigger — subtle parallax on hero orbs
    --------------------------------------------------------- */
    if (window.gsap && window.ScrollTrigger && !prefersReduced) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.gsap.utils.toArray('.bg-orbs span').forEach((el, i) => {
            window.gsap.to(el, {
                yPercent: (i % 2 === 0 ? -20 : 20),
                ease: 'none',
                scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.6 }
            });
        });
    }
})();
