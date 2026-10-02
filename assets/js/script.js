// Hamburger menü toggle fonksiyonu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    navLinks.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
}

function closeMenu() {
    document.querySelector('.nav-links')?.classList.remove('active');
    document.querySelector('.hamburger-menu')?.classList.remove('active');
}

// Menü linklerine tıklandığında menüyü kapat
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Sayfa dışına tıklandığında menüyü kapat
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburgerMenu.contains(e.target)) {
        closeMenu();
    }
});

// Dil değiştirme fonksiyonu
let currentLang = 'tr';

function toggleLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';

    document.querySelectorAll('.current-lang').forEach(langButton => {
        langButton.textContent = currentLang.toUpperCase();
    });

    // Fade-out → içeriği değiştir → fade-in
    document.querySelectorAll('[data-tr]').forEach(element => element.classList.add('fade-out'));

    setTimeout(() => {
        document.querySelectorAll('[data-tr]').forEach(element => {
            element.textContent = element.getAttribute(`data-${currentLang}`);
            element.classList.remove('fade-out');
            element.classList.add('fade-in');
        });
        setTimeout(() => {
            document.querySelectorAll('[data-tr]').forEach(element => element.classList.remove('fade-in'));
        }, 300);
    }, 150);

    document.documentElement.lang = currentLang;
}

// Navbar: kaydırınca alt çizgi
const navbar = document.querySelector('.navbar');
function updateNavbarAppearance() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', updateNavbarAppearance, { passive: true });
updateNavbarAppearance();

// Smooth scroll — hedef bölüm navbar'ın hemen altına hizalanır
const getScrollOffset = () => navbar ? navbar.offsetHeight : 64;
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const y = href === '#hakkimda' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - getScrollOffset();
        window.scrollTo({ top: y, behavior: 'smooth' });
    });
});

// Typewriter — isim
document.addEventListener('DOMContentLoaded', () => {
    const tw = document.querySelector('.typewriter');
    if (!tw) return;
    const fullText = tw.getAttribute('data-text') || tw.textContent.trim();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        tw.classList.add('done');
        return;
    }
    tw.textContent = '';
    let i = 0;
    const baseSpeed = 90;

    const type = () => {
        tw.textContent = fullText.slice(0, i);
        i += 1;
        if (i <= fullText.length) {
            setTimeout(type, Math.max(40, baseSpeed + (Math.random() * 60 - 30)));
        } else {
            setTimeout(() => tw.classList.add('done'), 2000);
        }
    };
    setTimeout(type, 500);
});

// Görünme animasyonu
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

    // Aynı kapsayıcıdaki kardeş öğeler sırayla gelsin
    items.forEach(el => {
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
        io.observe(el);
    });
});

// Projeler: mobil karusel noktaları
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.projects-grid');
    const dotsContainer = document.querySelector('.projects-dots');
    if (!track || !dotsContainer) return;

    // Kartlar mobilde CSS "order" ile sıralanıyor; noktalar da aynı sırayı izlesin
    const orderOf = (card) => parseInt(card.style.getPropertyValue('--order'), 10) || 0;
    const cards = Array.from(track.querySelectorAll('.project-card')).sort((a, b) => orderOf(a) - orderOf(b));
    const dots = cards.map((card, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'projects-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Proje ${idx + 1}`);
        dot.addEventListener('click', () => {
            track.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
        return dot;
    });

    const updateActiveDot = () => {
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        let nearest = 0;
        let minDelta = Infinity;
        cards.forEach((card, idx) => {
            const delta = Math.abs(card.offsetLeft - 16 - track.scrollLeft);
            if (delta < minDelta) { minDelta = delta; nearest = idx; }
        });
        if (atEnd) nearest = cards.length - 1;
        dots.forEach((d, i) => d.classList.toggle('active', i === nearest));
    };

    track.addEventListener('scroll', () => requestAnimationFrame(updateActiveDot), { passive: true });
});

// Görseller için Lightbox (tam ekran önizleme)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.image-modal');
    const modalImg = document.querySelector('.image-modal-content');
    const modalClose = document.querySelector('.image-modal-close');
    if (!modal || !modalImg || !modalClose) return;

    document.querySelectorAll('.project-card .project-image').forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.getAttribute('src');
            modalImg.alt = img.alt;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
});

// Tema değiştirici (sun & moon toggle)
const storageKey = 'theme-preference';
const theme = { value: getColorPreference() };

function getColorPreference() {
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored) return stored;
    } catch (e) {}
    return 'dark';
}

function setPreference() {
    try { localStorage.setItem(storageKey, theme.value); } catch (e) {}
    reflectPreference();
}

function reflectPreference() {
    document.documentElement.setAttribute('data-theme', theme.value);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.setAttribute('aria-label', theme.value);
    });
}

reflectPreference();
document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        setPreference();
    });
});

// Sistem teması değişirse uy
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isDark }) => {
        theme.value = isDark ? 'dark' : 'light';
        setPreference();
    });
}

// Aktif bölüm: viewport ortası hangi section içindeyse o aktif; en üst/en alt öncelikli
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const viewportCenter = window.innerHeight / 2;
    const scrollBottom = window.pageYOffset + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    let current = '';

    if (scrollBottom >= docHeight - 60) {
        current = 'iletisim';
    } else if (window.pageYOffset < 80) {
        current = 'hakkimda';
    } else {
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                current = section.id;
                break;
            }
        }
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.querySelector('.terminal');
    const terminalWrapper = document.querySelector('.terminal-wrapper');
    const terminalInput = document.querySelector('.terminal-input');
    const terminalOutput = document.querySelector('.terminal-output');
    const closeButton = document.querySelector('.terminal-button.close');
    const minimizeButton = document.querySelector('.terminal-button.minimize');
    const maximizeButton = document.querySelector('.terminal-button.maximize');

    // Terminal komutları
    const terminalTexts = {
        tr: {
            help: `Kullanılabilir komutlar:
  help        - Kullanılabilir komutları gösterir
  clear       - Terminal ekranını temizler
  about       - Hakkımda bilgisi gösterir
  education   - Eğitim bilgilerimi gösterir
  experience  - Deneyim bilgilerimi gösterir
  skills      - Yeteneklerimi listeler
  projects    - Projelerimi listeler
  contact     - İletişim bilgilerimi gösterir
  cv          - CV'mi indir
  snake       - Snake oyununu başlatır`,
            about: `Merhaba! Ben İbrahim Mert Sürme.
22 yaşındayım ve İstanbul Teknik Üniversitesi'nde Bilgisayar Mühendisliği 4. sınıf öğrencisiyim.
Genellikle web geliştirme, veritabanları ve yapay zeka ile ilgileniyorum ve bu alanlarda projeler geliştiriyorum.`,
            education: `Eğitim:
• İstanbul Teknik Üniversitesi
  - Bilgisayar Mühendisliği
  - GNO: 3.22/4.00
  - 2022 - Devam Ediyor`,
            experience: `Deneyim:
• Yazılım Mühendisliği Stajyeri — Intertech Bilgi Teknolojileri
  - Ağustos – Eylül 2025
  - InterChat: LLM odaklı akıllı bankacılık asistanı uygulaması
  - React + Vite ile frontend, FastAPI ile backend
  - LangChain + MCP ile araç orkestrasyonu ve veri maskeleme
  - GitHub: <a href="https://github.com/imSurme/interchat-banking-assistant" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">github.com/imSurme/interchat-banking-assistant</a>`,
            skills: `Yeteneklerim:
• Programlama: C, C++, Python
• Web Geliştirme: HTML, CSS, JavaScript, React
• Veritabanı: MySQL, SQLite
• Donanım: Verilog, Assembly`,
            projects: `Projelerim:
1. YemekMetre - İTÜ Yemek Takip Sistemi
   - İTÜ öğrencileri için geliştirilmiş, yemek menüsü takip ve değerlendirme platformu
   - Demo: <a href="https://ituyemekmetre.com" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">ituyemekmetre.com</a>

2. Restoran Yönetim Sistemi
   - Restoranlar için yönetim ve sipariş takibi yapabilecekleri bir platform
   - GitHub: <a href="https://github.com/imSurme/FDManagementSystem" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">github.com/imSurme/FDManagementSystem</a>`,
            contact: `İletişim Bilgileri:
• Email: <a href="mailto:mrtsrm27@gmail.com" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">mrtsrm27@gmail.com</a>
• GitHub: <a href="https://github.com/imSurme" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">github.com/imSurme</a>
• LinkedIn: <a href="https://linkedin.com/in/imsurme" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">linkedin.com/in/imsurme</a>
• Instagram: <a href="https://instagram.com/mrtsrm27" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">instagram.com/mrtsrm27</a>`,
            cvDownloading: 'CV indiriliyor...',
            commandNotFound: 'Komut bulunamadı. Kullanılabilir komutları görmek için "help" yazın.'
        },
        en: {
            help: `Available commands:
  help        - Shows available commands
  clear       - Clear terminal screen
  about       - Show about me
  education   - Show education information
  experience  - Show experience information
  skills      - List my skills
  projects    - Show my projects
  contact     - Show contact information
  cv          - Download my CV
  snake       - Start Snake game`,
            about: `Hello! I'm İbrahim Mert Sürme.
I'm 22 years old and a 4th-year Computer Engineering student at Istanbul Technical University.
I'm mainly interested in web development, databases, and artificial intelligence, and I build projects in these areas.`,
            education: `Education:
• Istanbul Technical University
  - Computer Engineering
  - GPA: 3.22/4.00
  - 2022 - Present`,
            experience: `Experience:
• Software Engineer Intern — Intertech Information Technologies
  - Aug – Sep 2025
  - InterChat: LLM-centric smart banking assistant application
  - Frontend with React + Vite, Backend with FastAPI
  - LangChain + MCP for tool orchestration and data masking
  - GitHub: <a href="https://github.com/imSurme/interchat-banking-assistant" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">github.com/imSurme/interchat-banking-assistant</a>`,
            skills: `My Skills:
• Programming: C, C++, Python
• Web Development: HTML, CSS, JavaScript, React
• Database: MySQL, SQLite
• Hardware: Verilog, Assembly`,
            projects: `My Projects:
1. YemekMetre - ITU Food Tracking System
   - A food menu tracking and rating platform developed for ITU students
   - Demo: <a href="https://ituyemekmetre.com" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">ituyemekmetre.com</a>

2. Restaurant Management System
   - A platform for restaurants to manage and track orders
   - GitHub: <a href="https://github.com/imSurme/FDManagementSystem" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">github.com/imSurme/FDManagementSystem</a>`,
            contact: `Contact Information:
• Email: <a href="mailto:mrtsrm27@gmail.com" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">mrtsrm27@gmail.com</a>
• GitHub: <a href="https://github.com/imSurme" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">github.com/imSurme</a>
• LinkedIn: <a href="https://linkedin.com/in/imsurme" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">linkedin.com/in/imsurme</a>
• Instagram: <a href="https://instagram.com/mrtsrm27" target="_blank" style="color: #00ff9d; text-decoration: none;" onmouseover="this.style.color='#ff9d00'" onmouseout="this.style.color='#00ff9d'">instagram.com/mrtsrm27</a>`,
            cvDownloading: 'Downloading CV...',
            commandNotFound: 'Command not found. Type "help" to see available commands.'
        }
    };

    // Snake oyunu
    let snakeGame = null;
    let snakeGameInterval = null;

    // Oyunu tamamen temizleme fonksiyonu
    function cleanupSnakeGame() {
        if (snakeGameInterval) {
            clearInterval(snakeGameInterval);
            snakeGameInterval = null;
        }
        if (snakeGame && snakeGame.handleKeyPress) {
            document.removeEventListener('keydown', snakeGame.handleKeyPress);
        }
        terminalInput.disabled = false;
        
        // Skor span'ini kaldır
        const scoreSpan = document.getElementById('snake-score');
        if (scoreSpan) {
            scoreSpan.remove();
        }
        
        // Canvas ve gameContainer'ı kaldır
        const canvas = document.getElementById('snake-canvas');
        if (canvas) {
            const gameContainer = canvas.closest('div');
            if (gameContainer && gameContainer.parentNode === terminalOutput) {
                gameContainer.remove();
            } else {
                canvas.remove();
            }
        }
        
        // Mobil kontrolleri kaldır
        const controlsContainer = document.getElementById('snake-controls');
        if (controlsContainer) {
            controlsContainer.remove();
        }
        
        snakeGame = null;
    }

    function startSnakeGame() {
        // Eğer oyun zaten çalışıyorsa durdur
        if (snakeGameInterval) {
            clearInterval(snakeGameInterval);
        }

        // Terminal output'u temizle ve oyun alanını oluştur
        terminalOutput.innerHTML = '';
        
        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = 'text-align: center; margin: 10px 0; position: relative;';
        
        const canvas = document.createElement('canvas');
        canvas.id = 'snake-canvas';
        canvas.width = 280;
        canvas.height = 196; // 14px'lik karelerle tam dolsun (20 x 14)
        canvas.style.cssText = 'box-sizing: content-box; border: 2px solid #27c93f; border-radius: 4px; background: #0a0a0a; display: block; margin: 10px auto;';
        
        const instructions = document.createElement('div');
        instructions.style.cssText = 'color: #999; font-size: 12px; margin: 5px 0;';
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        instructions.textContent = isMobile
            ? (currentLang === 'tr' 
                ? 'Ok butonları ile oynayın. Oyunu durdurmak için "q" tuşuna basın.'
                : 'Use arrow buttons to play. Press "q" to quit.')
            : (currentLang === 'tr' 
                ? 'Ok tuşları ile oynayın. Oyunu durdurmak için "q" tuşuna basın.'
                : 'Use arrow keys to play. Press "q" to quit.');
        
        gameContainer.appendChild(instructions);
        gameContainer.appendChild(canvas);
        
        // Mobil için ok butonları
        if (isMobile) {
            // Canvas'ın gerçek pozisyonunu almak için bir frame bekleyelim
            setTimeout(() => {
                const controlsContainer = document.createElement('div');
                controlsContainer.id = 'snake-controls';
                // Canvas'ın gerçek pozisyonunu al
                const canvasRect = canvas.getBoundingClientRect();
                const containerRect = gameContainer.getBoundingClientRect();
                const canvasTop = canvasRect.top - containerRect.top;
                const canvasLeft = canvasRect.left - containerRect.left;
                
                controlsContainer.style.cssText = `position: absolute; width: ${canvas.width}px; height: ${canvas.height}px; top: ${canvasTop + 2}px; left: ${canvasLeft + 2}px; pointer-events: none;`;
            
                // Yukarı ok - üst kenarda ortada
                const upBtn = document.createElement('button');
                upBtn.innerHTML = '↑';
                upBtn.className = 'snake-control-btn';
                upBtn.style.cssText = 'position: absolute; top: 5px; left: 50%; transform: translateX(-50%); background: rgba(39, 201, 63, 0.3); border: 2px solid #27c93f; color: #27c93f; border-radius: 4px; font-size: 16px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; pointer-events: auto; width: 28px; height: 28px; line-height: 1;';
                upBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const currentDy = nextDy !== 0 ? nextDy : dy;
                    if (currentDy !== 1) {
                        nextDx = 0;
                        nextDy = -1;
                    }
                }, { passive: false });
                
                // Sol ok - sol kenarda ortada
                const leftBtn = document.createElement('button');
                leftBtn.innerHTML = '←';
                leftBtn.className = 'snake-control-btn';
                leftBtn.style.cssText = 'position: absolute; left: 5px; top: 50%; transform: translateY(-50%); background: rgba(39, 201, 63, 0.3); border: 2px solid #27c93f; color: #27c93f; border-radius: 4px; font-size: 16px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; pointer-events: auto; width: 28px; height: 28px; line-height: 1;';
                leftBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const currentDx = nextDx !== 0 ? nextDx : dx;
                    if (currentDx !== 1) {
                        nextDx = -1;
                        nextDy = 0;
                    }
                }, { passive: false });
                
                // Aşağı ok - alt kenarda ortada (biraz aşağı kaydırılmış)
                const downBtn = document.createElement('button');
                downBtn.innerHTML = '↓';
                downBtn.className = 'snake-control-btn';
                downBtn.style.cssText = 'position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); background: rgba(39, 201, 63, 0.3); border: 2px solid #27c93f; color: #27c93f; border-radius: 4px; font-size: 16px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; pointer-events: auto; width: 28px; height: 28px; line-height: 1;';
                downBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const currentDy = nextDy !== 0 ? nextDy : dy;
                    if (currentDy !== -1) {
                        nextDx = 0;
                        nextDy = 1;
                    }
                }, { passive: false });
                
                // Sağ ok - sağ kenarda ortada (biraz sağa kaydırılmış)
                const rightBtn = document.createElement('button');
                rightBtn.innerHTML = '→';
                rightBtn.className = 'snake-control-btn';
                rightBtn.style.cssText = 'position: absolute; right: 2px; top: 50%; transform: translateY(-50%); background: rgba(39, 201, 63, 0.3); border: 2px solid #27c93f; color: #27c93f; border-radius: 4px; font-size: 16px; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; pointer-events: auto; width: 28px; height: 28px; line-height: 1;';
                rightBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const currentDx = nextDx !== 0 ? nextDx : dx;
                    if (currentDx !== -1) {
                        nextDx = 1;
                        nextDy = 0;
                    }
                }, { passive: false });
            
                controlsContainer.appendChild(upBtn);
                controlsContainer.appendChild(leftBtn);
                controlsContainer.appendChild(downBtn);
                controlsContainer.appendChild(rightBtn);
                gameContainer.appendChild(controlsContainer);
            }, 0);
        }
        
        terminalOutput.appendChild(gameContainer);
        
        // Skor yazısını terminal prompt'unun yanına ekle
        const terminalPrompt = document.querySelector('.terminal-prompt');
        let scoreSpan = document.getElementById('snake-score');
        
        // Eğer skor span'i yoksa oluştur
        if (!scoreSpan) {
            scoreSpan = document.createElement('span');
            scoreSpan.id = 'snake-score';
            scoreSpan.style.cssText = 'color: #27c93f; font-family: Consolas, monospace; margin-left: 10px;';
            terminalPrompt.parentNode.insertBefore(scoreSpan, terminalPrompt.nextSibling);
        }
        
        scoreSpan.textContent = currentLang === 'tr' ? 'Skor: 0' : 'Score: 0';

        const ctx = canvas.getContext('2d');
        const gridSize = 14;
        const tileCountX = Math.floor(canvas.width / gridSize);
        const tileCountY = Math.floor(canvas.height / gridSize);

        let dx = 0;
        let dy = 0;
        let nextDx = 0;
        let nextDy = 0;
        let score = 0;
        let snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
        let food = { x: Math.floor(tileCountX / 2) + 3, y: Math.floor(tileCountY / 2) };

        function drawGame() {
            // Ekranı temizle
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Yemek çiz
            ctx.fillStyle = '#ff5f56';
            ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);

            // Yılan çiz
            ctx.fillStyle = '#27c93f';
            snake.forEach((segment, index) => {
                if (index === 0) {
                    // Kafa için daha parlak renk
                    ctx.fillStyle = '#4ade80';
                } else {
                    ctx.fillStyle = '#27c93f';
                }
                ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
            });
        }

        function moveSnake() {
            // Yön değişikliğini uygula (her frame'de bir kez)
            if (nextDx !== 0 || nextDy !== 0) {
                // Ters yöne gidemez kontrolü
                if (!(dx === -nextDx && dy === -nextDy) && !(dx === nextDx && dy === nextDy)) {
                    dx = nextDx;
                    dy = nextDy;
                }
                nextDx = 0;
                nextDy = 0;
            }
            
            // Eğer yılan henüz hareket etmemişse (dx=0, dy=0), hareket etme
            if (dx === 0 && dy === 0) {
                return;
            }

            let head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Wrap-around: Duvarın diğer tarafından çık
            if (head.x < 0) {
                head.x = tileCountX - 1;
            } else if (head.x >= tileCountX) {
                head.x = 0;
            }
            
            if (head.y < 0) {
                head.y = tileCountY - 1;
            } else if (head.y >= tileCountY) {
                head.y = 0;
            }

            // Kendine çarpma kontrolü (sadece kuyruk kısmını kontrol et, kafayı hariç tut)
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    endGame();
                    return;
                }
            }

            snake.unshift(head);

            // Yemek yeme kontrolü
            if (head.x === food.x && head.y === food.y) {
                score++;
                const scoreSpan = document.getElementById('snake-score');
                if (scoreSpan) {
                    scoreSpan.textContent = currentLang === 'tr' ? `Skor: ${score}` : `Score: ${score}`;
                }
                generateFood();
            } else {
                snake.pop();
            }

            drawGame();
        }

        function generateFood() {
            food.x = Math.floor(Math.random() * tileCountX);
            food.y = Math.floor(Math.random() * tileCountY);
            
            // Yemek yılanın üzerinde olmamalı
            for (let segment of snake) {
                if (food.x === segment.x && food.y === segment.y) {
                    generateFood();
                    return;
                }
            }
        }

        function endGame() {
            clearInterval(snakeGameInterval);
            snakeGameInterval = null;
            
            // Event listener'ı kaldır
            if (snakeGame && snakeGame.handleKeyPress) {
                document.removeEventListener('keydown', handleKeyPress);
            }
            
            // Skor span'ini kaldır
            const scoreSpan = document.getElementById('snake-score');
            if (scoreSpan) {
                scoreSpan.remove();
            }
            
            // Terminal çıktısı olarak game over mesajı
            const gameOverOutput = document.createElement('div');
            gameOverOutput.style.cssText = 'margin-top: 10px;';
            gameOverOutput.innerHTML = `<span class="terminal-prompt">guest@portfolio:~$</span> <span style="color: #ff5f56;">${currentLang === 'tr' ? `Oyun Bitti! Final Skoru: ${score}` : `Game Over! Final Score: ${score}`}</span>`;
            
            terminalOutput.appendChild(gameOverOutput);
            
            // Input'u tekrar aktif et
            terminalInput.disabled = false;
            terminalInput.focus();
            
            // En alta kaydır
            setTimeout(() => {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }, 0);
        }

        // Klavye kontrolleri
        const handleKeyPress = (e) => {
            if (!snakeGameInterval) return;

            if (e.key === 'q' || e.key === 'Q') {
                e.preventDefault(); // Terminal input'una yazılmasını engelle
                endGame();
                return;
            }

            // Yön değiştirme (nextDirection'a kaydet, ters yöne gidemez)
            // Mevcut yönü veya bekleyen yönü kontrol et
            const currentDy = nextDy !== 0 ? nextDy : dy;
            const currentDx = nextDx !== 0 ? nextDx : dx;
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentDy !== 1) { // Aşağıdan yukarıya geçiş yapabilir
                    nextDx = 0;
                    nextDy = -1;
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentDy !== -1) { // Yukarıdan aşağıya geçiş yapabilir
                    nextDx = 0;
                    nextDy = 1;
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (currentDx !== 1) { // Sağdan sola geçiş yapabilir
                    nextDx = -1;
                    nextDy = 0;
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (currentDx !== -1) { // Soldan sağa geçiş yapabilir
                    nextDx = 1;
                    nextDy = 0;
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        snakeGame = { handleKeyPress, endGame };

        // Oyunu başlat
        drawGame();
        snakeGameInterval = setInterval(moveSnake, 150);
        
        // Input'u geçici olarak devre dışı bırak
        terminalInput.disabled = true;
        
        return currentLang === 'tr' 
            ? 'Snake oyunu başlatıldı! Ok tuşları ile oynayın, "q" ile çıkın.'
            : 'Snake game started! Use arrow keys to play, press "q" to quit.';
    }

    const commands = {
        help: () => terminalTexts[currentLang].help,
        clear: () => {
            // Oyun çalışıyorsa tamamen temizle
            cleanupSnakeGame();
            terminalOutput.innerHTML = '';
            return '';
        },
        cv: () => {
            const link = document.createElement('a');
            link.href = 'assets/docs/cv.pdf';
            link.download = 'ibrahim_mert_surme_cv.pdf';
            link.click();
            return terminalTexts[currentLang].cvDownloading;
        },
        snake: () => startSnakeGame(),
        about: () => terminalTexts[currentLang].about,
        education: () => terminalTexts[currentLang].education,
        experience: () => terminalTexts[currentLang].experience,
        skills: () => terminalTexts[currentLang].skills,
        projects: () => terminalTexts[currentLang].projects,
        contact: () => terminalTexts[currentLang].contact
    };

    function openTerminal() {
        if (terminal.classList.contains('active')) return;
        // Terminal ekranın ortasında açılır (boyutlar CSS ile aynı)
        if (terminalWrapper) {
            var isSmall = window.matchMedia('(max-width: 640px)').matches;
            var tw = isSmall ? window.innerWidth - 24 : 660;
            var th = isSmall ? window.innerHeight * 0.6 : 440;
            var gap = 12;
            var left = Math.max(gap, (window.innerWidth - tw) / 2);
            var top = Math.max(gap, (window.innerHeight - th) / 2);
            terminalWrapper.style.left = left + 'px';
            terminalWrapper.style.top = top + 'px';
            terminalWrapper.style.right = 'auto';
            terminalWrapper.style.bottom = 'auto';
        }
        terminal.classList.add('active');
        terminalInput.focus();
        const canvas = document.getElementById('snake-canvas');
        if (canvas) {
            cleanupSnakeGame();
            terminalOutput.innerHTML = '';
        }
        if (!terminalOutput.innerHTML) {
            const welcomeMessage = {
                tr: `[${new Date().toLocaleString('tr-TR')}] Terminal başlatıldı...

Hoş geldiniz! İbrahim Mert'in portfolyo terminaline bağlandınız.
Kullanılabilir komutları görmek için "help" yazın.`,
                en: `[${new Date().toLocaleString('en-US')}] Terminal started...

Welcome! Connected to İbrahim Mert's portfolio terminal.
Type "help" to see available commands.`
            };
            const output = document.createElement('div');
            output.innerHTML = welcomeMessage[currentLang];
            terminalOutput.appendChild(output);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }

    function closeTerminal() {
        if (!terminal.classList.contains('active')) return;
        cleanupSnakeGame();
        terminal.classList.add('closing');
        setTimeout(() => {
            terminal.classList.remove('active');
            terminal.classList.remove('closing');
            terminal.classList.remove('maximized');
            isMaximized = false;
        }, 300);
    }

    const heroTerminalTrigger = document.querySelector('.hero-terminal-trigger');
    if (heroTerminalTrigger) {
        heroTerminalTrigger.addEventListener('click', () => {
            if (terminal.classList.contains('active')) closeTerminal();
            else openTerminal();
        });
    }

    // Maximize/Minimize işlevleri
    let isMaximized = false;

    maximizeButton.addEventListener('click', () => {
        if (!isMaximized) {
            terminal.classList.add('maximized');
            isMaximized = true;
        }
    });

    minimizeButton.addEventListener('click', () => {
        if (isMaximized) {
            terminal.classList.remove('maximized');
            isMaximized = false;
        }
    });

    // Header'dan sürükleyerek terminali taşıma
    const terminalHeader = document.querySelector('.terminal-header');
    if (terminalHeader && terminalWrapper) {
        terminalHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.terminal-button')) return;
            if (isMaximized) return;
            const rect = terminalWrapper.getBoundingClientRect();
            let startX = e.clientX - rect.left;
            let startY = e.clientY - rect.top;

            function onMouseMove(e) {
                document.body.style.cursor = 'grabbing';
                let left = e.clientX - startX;
                let top = e.clientY - startY;
                const gap = 8;
                left = Math.max(gap, Math.min(left, window.innerWidth - rect.width - gap));
                top = Math.max(gap, Math.min(top, window.innerHeight - rect.height - gap));
                terminalWrapper.style.left = left + 'px';
                terminalWrapper.style.top = top + 'px';
                terminalWrapper.style.right = 'auto';
                terminalWrapper.style.bottom = 'auto';
            }
            function onMouseUp() {
                document.body.style.cursor = '';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // Kapatma butonu
    closeButton.addEventListener('click', () => {
        // Oyun çalışıyorsa tamamen temizle
        cleanupSnakeGame();
        terminal.classList.add('closing');
        setTimeout(() => {
            terminal.classList.remove('active');
            terminal.classList.remove('closing');
            terminal.classList.remove('maximized');
            isMaximized = false;
        }, 300);
    });

    // Komut işleme
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            
            if (command === 'clear') {
                terminalOutput.innerHTML = '';
            } else {
                const output = document.createElement('div');
                
                // Komut satırını göster
                output.innerHTML = `<span class="terminal-prompt">guest@portfolio:~$</span> ${command}`;
                
                // Komutu işle
                if (command in commands) {
                    output.innerHTML += '\n' + commands[command]();
                } else if (command !== '') {
                    output.innerHTML += '\n' + terminalTexts[currentLang].commandNotFound;
                }
                
                terminalOutput.appendChild(output);
            }
            
            // Input'u temizle
            terminalInput.value = '';
            
            // En alta kaydır
            setTimeout(() => {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                terminalInput.focus();
            }, 0);
        }
    });

    // Terminal açıldığında input'a odaklan
    terminal.addEventListener('click', () => {
        terminalInput.focus();
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });

    // Terminal dışına tıklandığında kapanma (hero ikonu hariç)
    document.addEventListener('click', (e) => {
        if (terminal.classList.contains('active') && 
            !terminal.contains(e.target) && 
            !(heroTerminalTrigger && heroTerminalTrigger.contains(e.target))) {
            // Oyun çalışıyorsa tamamen temizle
            cleanupSnakeGame();
            terminal.classList.add('closing');
            setTimeout(() => {
                terminal.classList.remove('active');
                terminal.classList.remove('closing');
            }, 300);
        }
    });
});

// Footer yılını otomatik güncelle
(function () {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
})();
