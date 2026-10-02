// Hamburger menü toggle fonksiyonu
function toggleMenu() {
    const navContainer = document.querySelector('.nav-container');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    navContainer.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
    
    // Menü açıkken mouse wheel eventini engelle
    if (navContainer.classList.contains('active')) {
        navContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
    } else {
        navContainer.removeEventListener('wheel', (e) => {
            e.preventDefault();
        });
    }
}

// Menü linklerine tıklandığında menüyü kapat
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navContainer = document.querySelector('.nav-container');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        if (navContainer.classList.contains('active')) {
            navContainer.classList.remove('active');
            hamburgerMenu.classList.remove('active');
            navContainer.removeEventListener('wheel', (e) => {
                e.preventDefault();
            });
        }
    });
});

// Sayfa dışına tıklandığında menüyü kapat
document.addEventListener('click', (e) => {
    const navContainer = document.querySelector('.nav-container');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (!navContainer.contains(e.target) && !hamburgerMenu.contains(e.target) && navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        navContainer.removeEventListener('wheel', (e) => {
            e.preventDefault();
        });
    }
});

// Dil değiştirme fonksiyonu
let currentLang = 'tr';

function toggleLanguage() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    
    // Tüm dil butonlarını güncelle
    document.querySelectorAll('.current-lang').forEach(langButton => {
        langButton.textContent = currentLang.toUpperCase();
    });
    
    // Fade-out animasyonu: Tüm çevrilebilir elementleri fade-out yap
    document.querySelectorAll('[data-tr]').forEach(element => {
        if (!element.closest('.btn') || element.tagName.toLowerCase() === 'span') {
            element.classList.add('fade-out');
        }
    });
    
    // Fade-out sonrası içeriği değiştir ve fade-in yap
    setTimeout(() => {
        document.querySelectorAll('[data-tr]').forEach(element => {
            if (!element.closest('.btn') || element.tagName.toLowerCase() === 'span') {
                element.textContent = element.getAttribute(`data-${currentLang}`);
                element.classList.remove('fade-out');
                element.classList.add('fade-in');
            }
        });
        
        // Fade-in animasyonunu başlat
        setTimeout(() => {
            document.querySelectorAll('[data-tr]').forEach(element => {
                element.classList.remove('fade-in');
            });
        }, 300);
    }, 150);
    
    // HTML lang attribute'unu güncelle
    document.documentElement.lang = currentLang;
}

// Navbar görünümü (scroll + tema)
const navbar = document.querySelector('.navbar');
function updateNavbarAppearance() {
    if (!navbar) return;
    if (window.scrollY > 50) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        navbar.style.background = isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = isDark ? '0 2px 10px rgba(0, 0, 0, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        navbar.style.background = isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}
window.addEventListener('scroll', updateNavbarAppearance);

// Hero kod ikonu: profil resminin etrafında yörüngede döner — aşağı kaydır = saat yönü, yukarı = tersi
const heroBadge = document.querySelector('.hero-avatar-badge');
function updateHeroBadgeOrbit() {
    if (!heroBadge) return;
    var deg = window.scrollY * 0.4;
    heroBadge.style.setProperty('--orbit-angle', deg + 'deg');
}
window.addEventListener('scroll', updateHeroBadgeOrbit);
updateHeroBadgeOrbit();

// Smooth scroll için — tüm bölümler (Eğitim, Deneyim, vb.) aynı üst boşlukla hizalanır
// Mobilde navbar 70px; başlık hemen navbar altında
// Desktop'ta biraz DAHA FAZLA kaydırma için offset'i küçülttük (daha aşağı iner)
const getScrollOffset = () => window.matchMedia('(max-width: 768px)').matches ? 36 : 48;
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            // Nav'dan tıklanınca hedef bölüm hemen visible olsun (mobilde IntersectionObserver gecikebiliyor)
            target.classList.add('visible');
            const y = target.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: y - getScrollOffset(), behavior: 'smooth' });
        }
    });
});

// Skill kartları için hover efekti
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Sayfa yüklendiğinde animasyon
document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content') || document.querySelector('.hero-modern .hero-grid');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }

    // Typewriter effect for name — "Merhaba ben" göründükten sonra başlasın (0.6s)
    const tw = document.querySelector('.typewriter');
    if (tw) {
        const fullText = tw.getAttribute('data-text') || tw.textContent.trim();
        tw.textContent = '';
        let i = 0;
        const baseSpeed = 110; // ms per char (daha hızlı yazım)

        const type = () => {
            if (i <= fullText.length) {
                tw.textContent = fullText.slice(0, i);
                i += 1;
                if (i <= fullText.length) {
                    const jitter = Math.max(40, baseSpeed + (Math.random() * 60 - 30));
                    setTimeout(type, jitter);
                } else {
                    tw.classList.add('typed');
                    // Yazı tamamlandı; 2 saniye sonra imleci gizle
                    setTimeout(() => {
                        tw.classList.add('done');
                    }, 2000);
                }
            }
        };
        setTimeout(type, 600);
    }
    // Eğitim bölümü görününce timeline animasyonu
    const educationSection = document.getElementById('egitim');
    if (educationSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('education-visible');
                }
            });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0.2 });
        observer.observe(educationSection);
    }
    // Tema başlangıcı: aşağıdaki global tema yöneticisi early reflect yapıyor
});

// Projeler: yatay kaydırma (sadece oklar; sürükle-bırak devre dışı)
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.projects-track');
    const leftBtn = document.querySelector('.projects-arrow.left');
    const rightBtn = document.querySelector('.projects-arrow.right');
    const dotsContainer = document.querySelector('.projects-dots');

    if (!track) return;

    const scrollByAmount = () => Math.min(track.clientWidth * 0.9, 600);

    const updateArrowVisibility = () => {
        if (!leftBtn || !rightBtn) return;
        // Mobilde oklar daima gizli kalsın (CSS'le uyumlu)
        if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
            leftBtn.style.display = 'none';
            rightBtn.style.display = 'none';
            return;
        }
        const maxScroll = track.scrollWidth - track.clientWidth - 1; // tolerans
        const atStart = track.scrollLeft <= 0;
        const atEnd = track.scrollLeft >= maxScroll;
        leftBtn.style.display = atStart ? 'none' : 'flex';
        rightBtn.style.display = atEnd ? 'none' : 'flex';
    };

    leftBtn?.addEventListener('click', () => {
        track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
        updateArrowVisibility();
    });
    rightBtn?.addEventListener('click', () => {
        track.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
        updateArrowVisibility();
    });

    // Mobil dots/pagination
    if (dotsContainer) {
        const cards = Array.from(track.querySelectorAll('.project-card'));
        // Dots oluştur
        dotsContainer.innerHTML = '';
        cards.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = 'projects-dot' + (idx === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Kart ${idx + 1}`);
            dot.setAttribute('role', 'tab');
            dot.addEventListener('click', () => {
                const target = cards[idx];
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                }
            });
            dotsContainer.appendChild(dot);
        });

        const updateActiveDot = () => {
            const scrollLeft = track.scrollLeft;
            // En yakın kartın indeksini bul
            let nearestIdx = 0;
            let minDelta = Number.POSITIVE_INFINITY;
            cards.forEach((card, idx) => {
                const delta = Math.abs(card.offsetLeft - scrollLeft);
                if (delta < minDelta) { minDelta = delta; nearestIdx = idx; }
            });
            const dots = Array.from(dotsContainer.querySelectorAll('.projects-dot'));
            dots.forEach((d, i) => d.classList.toggle('active', i === nearestIdx));
        };

        track.addEventListener('scroll', () => {
            // Scroll sonunda aktif noktayı güncelle
            window.requestAnimationFrame(updateActiveDot);
            window.requestAnimationFrame(updateArrowVisibility);
        }, { passive: true });

        // İlk durum
        updateActiveDot();
    }

    // İlk açılışta ok görünürlüğünü ayarla ve resize'da güncelle
    updateArrowVisibility();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateArrowVisibility, 150);
    });
});

// Projeler: filtreleme + tıklayınca kartı çevir (flip)
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.projects-modern');
    if (!section) return;
    const track = section.querySelector('.projects-track');
    const cards = track ? Array.from(track.querySelectorAll('.project-card')) : [];
    const filterBtns = section.querySelectorAll('.projects-filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                const show = filter === 'all' || category === filter;
                card.style.display = show ? '' : 'none';
            });
        });
    });

    const isMobile = () => window.matchMedia('(max-width: 639px)').matches;
    cards.forEach(card => {
        const inner = card.querySelector('.project-card-inner');
        const front = card.querySelector('.project-card-front');
        const back = card.querySelector('.project-card-back');
        if (!inner || !front || !back) return;

        front.addEventListener('click', () => {
            if (isMobile()) return;
            card.classList.toggle('flipped', true);
        });
        back.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            e.preventDefault();
            if (isMobile()) return;
            card.classList.remove('flipped');
        });
    });
});

// Görseller için Lightbox (tam ekran önizleme)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.image-modal');
    const modalImg = document.querySelector('.image-modal-content');
    const modalClose = document.querySelector('.image-modal-close');
    const images = document.querySelectorAll('.project-card .project-image');

    if (!modal || !modalImg || !modalClose) return;

    images.forEach(img => {
        if (img.closest('.project-card-front')) return;
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            modalImg.src = img.getAttribute('src');
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
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
    const stored = localStorage.getItem(storageKey);
    if (stored) return stored;
    return 'dark';
}

function setPreference() {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
    updateNavbarAppearance();
}

function reflectPreference() {
    document.documentElement.setAttribute('data-theme', theme.value);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.setAttribute('aria-label', theme.value);
    });
}

function onThemeToggleClick() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    setPreference();
}

// early reflect to avoid flash
reflectPreference();

window.addEventListener('load', () => {
    reflectPreference();
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', onThemeToggleClick);
    });
});

// sync with system changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isDark }) => {
        theme.value = isDark ? 'dark' : 'light';
        setPreference();
    });
}

// Scroll Animasyonu için Intersection Observer
const sections = document.querySelectorAll('section:not(.hero)');

// Mobilde daha toleranslı ayarlar: küçük ekranda rootMargin ve threshold tetiklemeyi engelleyebiliyor
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
const observerOptions = {
    root: null,
    rootMargin: isMobile() ? '-60px 0px -60px 0px' : '-110px 0px -110px 0px',
    threshold: isMobile() ? 0.1 : 0.45
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.id === 'projeler') {
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach(card => {
                    card.style.animationDelay = (Math.random() * 0.7).toFixed(2) + 's';
                });
            }
            observer.unobserve(entry.target); // Bir kez görününce gözlemi durdur
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Aktif bölüm: viewport merkezi hangi section içindeyse o aktif; en üst/en alt öncelikli
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const viewportCenter = window.innerHeight / 2;
    const scrollBottom = window.pageYOffset + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    let current = '';

    // En alttayken her zaman İletişim (kısa section için viewport ortası Projeler'de kalabiliyor)
    if (scrollBottom >= docHeight - 60) {
        current = 'iletisim';
    } else if (window.pageYOffset < 80) {
        current = 'hakkimda';
    } else {
        for (let i = 0; i < sections.length; i++) {
            const rect = sections[i].getBoundingClientRect();
            if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                current = sections[i].getAttribute('id') || '';
                break;
            }
        }
        if (!current) current = sections[0] ? (sections[0].getAttribute('id') || 'hakkimda') : 'hakkimda';
    }

    const currentNorm = (current || '').trim();
    navLinks.forEach(link => {
        const id = (link.getAttribute('href') || '').replace(/^#/, '').trim();
        link.classList.toggle('active', id === currentNorm);
    });
}

window.addEventListener('scroll', updateActiveNavLink);
// Sayfa ilk açıldığında Hakkımda aktif olsun
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateActiveNavLink);
} else {
    updateActiveNavLink();
}

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
        canvas.height = 200;
        canvas.style.cssText = 'border: 2px solid #27c93f; background: #0a0a0a; display: block; margin: 10px auto; max-width: 100%;';
        
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
                
                controlsContainer.style.cssText = `position: absolute; width: ${canvas.width}px; height: ${canvas.height}px; top: ${canvasTop}px; left: ${canvasLeft}px; pointer-events: none;`;
            
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
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

            // Yılan çiz
            ctx.fillStyle = '#27c93f';
            snake.forEach((segment, index) => {
                if (index === 0) {
                    // Kafa için daha parlak renk
                    ctx.fillStyle = '#4ade80';
                } else {
                    ctx.fillStyle = '#27c93f';
                }
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
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
            link.href = '../assets/docs/cv.pdf';
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
        var trigger = document.querySelector('.hero-terminal-trigger');
        if (trigger && terminalWrapper) {
            var r = trigger.getBoundingClientRect();
            var tw = 660;
            var th = 440;
            var gap = 10;
            var left = r.left - tw - gap;
            var top = r.bottom + gap;
            if (left < gap) left = gap;
            if (top + th > window.innerHeight - gap) top = window.innerHeight - th - gap;
            if (top < gap) top = gap;
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
