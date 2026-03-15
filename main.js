document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // スクロール時のフェードイン効果
    // --------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // 初回表示時に既に画面内にあるもの
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // --------------------------------------------------------
    // 背景パーティクル（火の粉・花びら）エフェクト
    // --------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 200; // 画面下から発生
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = -(Math.random() * 1.5 + 0.5); // 上へ昇る
                this.size = Math.random() * 3 + 1;
                this.alpha = Math.random() * 0.5 + 0.3;

                // 色を赤〜金でランダムに
                const colors = [
                    'rgba(201, 23, 30, {a})',  // 赤
                    'rgba(212, 175, 55, {a})'  // 金
                ];
                this.colorTemplate = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // ゆらぎ効果
                this.vx += (Math.random() - 0.5) * 0.1;

                if (this.y < -50 || this.x < -50 || this.x > width + 50) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.colorTemplate.replace('{a}', this.alpha);
                ctx.fill();
            }
        }

        function createParticles() {
            particles = [];
            // パーティクル数は画面幅に応じて調整
            const pCount = Math.floor(window.innerWidth / 15);
            for (let i = 0; i < pCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParts() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParts);
        }

        window.addEventListener('resize', () => {
            initCanvas();
            createParticles();
        });

        initCanvas();
        createParticles();
        animateParts();
    }
});
