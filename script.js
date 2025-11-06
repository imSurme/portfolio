// Hamburger menü toggle fonksiyonu
function toggleMenu() {
    const navContainer = document.querySelector('.nav-container');
    navContainer.classList.toggle('active');
    
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
        if (navContainer.classList.contains('active')) {
            navContainer.classList.remove('active');
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
    
    // Tüm çevrilebilir elementleri bul ve değiştir
    document.querySelectorAll('[data-tr]').forEach(element => {
        if (!element.closest('.btn') || element.tagName.toLowerCase() === 'span') {
            element.textContent = element.getAttribute(`data-${currentLang}`);
        }
    });

    // HTML lang attribute'unu güncelle
    document.documentElement.lang = currentLang;
}

// Navbar scroll efekti
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        navbar.style.background = isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = isDark ? '0 2px 10px rgba(0, 0, 0, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        navbar.style.background = isDark ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scroll için
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 0.8s ease-out';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 200);

    // Typewriter effect for name
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
                    // Yazı tamamlandı; 2 saniye sonra imleci gizle
                    setTimeout(() => {
                        tw.classList.add('done');
                    }, 2000);
                }
            }
        };
        type();
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

// Görseller için Lightbox (tam ekran önizleme)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.image-modal');
    const modalImg = document.querySelector('.image-modal-content');
    const modalClose = document.querySelector('.image-modal-close');
    const images = document.querySelectorAll('.project-card .project-image');

    if (!modal || !modalImg || !modalClose) return;

    images.forEach(img => {
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
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

function setPreference() {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
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
    // Navbar arka planını yeni temaya göre güncelle
    window.dispatchEvent(new Event('scroll'));
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

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Bir kez görününce gözlemi durdur
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Aktif bölümü belirlemek için scroll event listener
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Scroll pozisyonuna göre aktif bölümü belirle
        if (scrollY >= sectionTop - 150 && scrollY <= sectionTop + sectionHeight - 150) {
            current = section.getAttribute('id');
        }
    });
    
    // Sayfanın en altında olup olmadığını kontrol et
    if ((window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 100) {
        current = 'iletisim';
    }
    
    // Tüm linklerdeki active sınıfını kaldır ve aktif olana ekle
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.querySelector('.terminal');
    const terminalToggle = document.querySelector('.terminal-toggle');
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
  cv          - CV'mi indir`,
            about: `Merhaba! Ben İbrahim Mert Sürme.
22 yaşındayım ve İstanbul Teknik Üniversitesi'nde Bilgisayar Mühendisliği 3. sınıf öğrencisiyim.
Genellikle web geliştirme, veritabanları ve yapay zeka ile ilgileniyorum ve bu alanlarda projeler geliştiriyorum.`,
            education: `Eğitim:
• İstanbul Teknik Üniversitesi
  - Bilgisayar Mühendisliği
  - GNO: 3.31/4.00
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
  cv          - Download my CV`,
            about: `Hello! I'm İbrahim Mert Sürme.
I'm 22 years old and a 3rd-year Computer Engineering student at Istanbul Technical University.
I'm mainly interested in web development, databases, and artificial intelligence, and I build projects in these areas.`,
            education: `Education:
• Istanbul Technical University
  - Computer Engineering
  - GPA: 3.31/4.00
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

    const commands = {
        help: () => terminalTexts[currentLang].help,
        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        },
        cv: () => {
            const link = document.createElement('a');
            link.href = 'cv.pdf';
            link.download = 'ibrahim_mert_surme_cv.pdf';
            link.click();
            return terminalTexts[currentLang].cvDownloading;
        },
        about: () => terminalTexts[currentLang].about,
        education: () => terminalTexts[currentLang].education,
        experience: () => terminalTexts[currentLang].experience,
        skills: () => terminalTexts[currentLang].skills,
        projects: () => terminalTexts[currentLang].projects,
        contact: () => terminalTexts[currentLang].contact
    };

    // Terminal toggle
    terminalToggle.addEventListener('click', () => {
        if (terminal.classList.contains('active')) {
            terminal.classList.add('closing');
            setTimeout(() => {
                terminal.classList.remove('active');
                terminal.classList.remove('closing');
            }, 300);
        } else {
            terminal.classList.toggle('active');
            terminalInput.focus();
            
            // İlk açılışta karşılama mesajı göster
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
    });

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

    // Kapatma butonu
    closeButton.addEventListener('click', () => {
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

    // Terminal dışına tıklandığında kapanma
    document.addEventListener('click', (e) => {
        if (terminal.classList.contains('active') && 
            !terminal.contains(e.target) && 
            !terminalToggle.contains(e.target)) {
            terminal.classList.add('closing');
            setTimeout(() => {
                terminal.classList.remove('active');
                terminal.classList.remove('closing');
            }, 300);
        }
    });
}); 
