
// ===== LOADING =====
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if(loading) {
        setTimeout(() => loading.classList.add('hidden'), 500);
    }
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

mobileToggle?.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if(scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== SCROLL REVEAL =====
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

scrollRevealElements.forEach(el => revealObserver.observe(el));

// ===== TOAST =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if(!toast) return;

    toast.querySelector('h4').textContent = type === 'success' ? 'Berhasil' : 'Error';
    toast.querySelector('p').textContent = message;
    toast.className = 'toast toast-' + type + ' show';

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== ORDER PRODUCT =====
function orderProduct(name, price) {
    const orderData = { name: name, price: price, timestamp: new Date().toISOString() };
    localStorage.setItem('sllowly_order', JSON.stringify(orderData));

    // Add to cart/products list
    let products = JSON.parse(localStorage.getItem('sllowly_products') || '[]');
    products.push(orderData);
    localStorage.setItem('sllowly_products', JSON.stringify(products));

    showToast('Produk ditambahkan: ' + name);

    // Redirect to checkout after short delay
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 800);
}

// ===== TESTIMONIALS =====
const testimonialData = [
    {name:'Ahmad Rizky',initial:'AR',text:'Admin cepat respon, hasil edit foto sangat memuaskan. Recommended!',date:'2 hari lalu'},
    {name:'Siti Nurhaliza',initial:'SN',text:'Order TikTok views prosesnya cepat banget. Langsung masuk dalam 10 menit.',date:'5 hari lalu'},
    {name:'Budi Santoso',initial:'BS',text:'Logo yang dibuat sesuai request saya. Revisi juga cepat. Terima kasih!',date:'1 minggu lalu'},
    {name:'Dewi Lestari',initial:'DL',text:'Prompt AI nya sangat detail dan berguna. Bantu banget untuk kerjaan saya.',date:'3 hari lalu'},
    {name:'Fajar Pratama',initial:'FP',text:'Edit foto wisuda hasilnya bagus banget. Background premium keren.',date:'1 minggu lalu'},
    {name:'Indah Permata',initial:'IP',text:'YouTube Premium invite berhasil aktif. Nonton jadi lebih nyaman tanpa iklan.',date:'4 hari lalu'},
    {name:'Joko Widodo',initial:'JW',text:'Caption untuk konten TikTok saya jadi lebih menarik. Views naik signifikan!',date:'6 hari lalu'},
    {name:'Kartika Sari',initial:'KS',text:'Landing page HTML simple tapi elegan. Sesuai kebutuhan bisnis saya.',date:'2 minggu lalu'},
    {name:'Lukman Hakim',initial:'LH',text:'Face swap natural banget, nggak kelihatan editan. Teman-teman pada kaget.',date:'3 hari lalu'},
    {name:'Maya Anggraini',initial:'MA',text:'Old photo restore foto kakek saya jadi HD dan berwarna. Keluarga pada senang.',date:'1 minggu lalu'},
    {name:'Nanda Putra',initial:'NP',text:'Paket Creator sangat worth it. Dapat prompt, caption, dan ide konten sekaligus.',date:'5 hari lalu'},
    {name:'Olivia Chen',initial:'OC',text:'Perbaikan foto blur hasilnya tajam. Foto lamaku jadi bisa dipakai lagi.',date:'4 hari lalu'},
    {name:'Pandu Wicaksono',initial:'PW',text:'TikTok followers real dan stabil. Nggak drop sama sekali. Mantap!',date:'2 minggu lalu'},
    {name:'Rina Amelia',initial:'RA',text:'Script video affiliate yang dibuat converting banget. Penjualan naik 30%.',date:'1 minggu lalu'},
    {name:'Samsul Hidayat',initial:'SH',text:'Edit AI Basic udah cukup buat kebutuhan saya. Harga terjangkau hasil bagus.',date:'3 hari lalu'},
    {name:'Tina Melati',initial:'TM',text:'Foto couple kami jadi lebih romantis dengan editan AI. Suka banget!',date:'6 hari lalu'},
    {name:'Udin Saputra',initial:'US',text:'Background wisuda premium banyak pilihan. Bisa request juga. Top!',date:'5 hari lalu'},
    {name:'Vina Panduwinata',initial:'VP',text:'HD enhance foto produk jadi lebih jualan. Customer pada nanya edit dimana.',date:'1 minggu lalu'},
    {name:'Wawan Setiawan',initial:'WS',text:'Paket viral TikTok worth it. Video saya FYP dan dapat banyak followers baru.',date:'4 hari lalu'},
    {name:'Yuni Shara',initial:'YS',text:'Logo esport untuk tim saya keren banget. Revisi sampai puas. Thank you!',date:'2 minggu lalu'},
    {name:'Zainal Abidin',initial:'ZA',text:'Jas wisuda AI nya realistis. Nggak ada yang nyangka itu editan.',date:'3 hari lalu'},
    {name:'Anisa Rahma',initial:'AN',text:'Foto keluarga kami jadi lebih harmonis dengan sentuhan edit AI. Bagus!',date:'1 minggu lalu'},
    {name:'Bayu Aji',initial:'BA',text:'Ide konten TikTok nya fresh dan viral-worthy. Saya dapat 3 ide sekaligus.',date:'5 hari lalu'},
    {name:'Citra Kirana',initial:'CK',text:'AI beauty edit natural, nggak over. Wajah saya tetap terlihat asli.',date:'4 hari lalu'},
    {name:'Doni Salmanan',initial:'DS',text:'TikTok share 500 langsung masuk. Video saya jadi lebih rame.',date:'6 hari lalu'},
    {name:'Eka Gustiwana',initial:'EG',text:'Landing page untuk produk saya jadi lebih profesional. Conversion naik.',date:'2 minggu lalu'},
    {name:'Fani Andira',initial:'FA',text:'Prompt custom sesuai request saya. Hasilnya presisi banget.',date:'3 hari lalu'},
    {name:'Gilang Ramadhan',initial:'GR',text:'Paket starter TikTok cocok buat pemula. Harga murah hasil maksimal.',date:'1 minggu lalu'},
    {name:'Hana Saraswati',initial:'HS',text:'Copywriting caption nya catchy. Engagement Instagram saya naik 50%.',date:'5 hari lalu'},
    {name:'Irfan Hakim',initial:'IH',text:'Logo olshop saya jadi lebih branding. Customer lebih percaya.',date:'4 hari lalu'},
    {name:'Jessica Mila',initial:'JM',text:'Full edit wisuda HD worth it. Foto jadi kayak di studio profesional.',date:'2 minggu lalu'},
    {name:'Kevin Sanjaya',initial:'KS2',text:'TikTok views 10K masuk stabil. Video saya FYP 3 hari berturut-turut.',date:'3 hari lalu'},
    {name:'Luna Maya',initial:'LM',text:'Foto santai estetik jadi aesthetic banget. Cocok untuk feed Instagram.',date:'1 minggu lalu'},
    {name:'Mario Teguh',initial:'MT',text:'Script video affiliate yang dibuat persuasif. Banyak yang checkout.',date:'5 hari lalu'},
    {name:'Nia Ramadhani',initial:'NR',text:'Edit premium detail bener-bener detail. Nggak nyesel bayar lebih.',date:'4 hari lalu'},
    {name:'Oki Setiana',initial:'OS',text:'Paket AI Basic hemat dan berguna. Buat edit foto sehari-hari cukup.',date:'6 hari lalu'},
    {name:'Pevita Pearce',initial:'PP',text:'Ubah background foto produk jadi lebih clean. Jualan lebih laris.',date:'2 minggu lalu'},
    {name:'Raffi Ahmad',initial:'RA2',text:'YouTube Premium invite berhasil. Garansi aman sampai masa aktif habis.',date:'3 hari lalu'},
    {name:'Sandra Dewi',initial:'SD',text:'Couple wisuda edit nya sweet banget. Kami jadi punya kenangan indah.',date:'1 minggu lalu'},
    {name:'Tora Sudiro',initial:'TS',text:'Prompt landing page nya langsung bisa dipakai. Hemat waktu coding.',date:'5 hari lalu'},
    {name:'Ussy Sulistiawaty',initial:'US2',text:'TikTok likes 1000 real. Nggak bot sama sekali. Interaksi naik.',date:'4 hari lalu'},
    {name:'Vino Bastian',initial:'VB',text:'Logo gaming untuk channel saya keren. Subscriber naik berkat branding baru.',date:'2 minggu lalu'},
    {name:'Wulan Guritno',initial:'WG',text:'Face swap untuk video lucu. Hasilnya natural dan menghibur.',date:'3 hari lalu'},
    {name:'Yoshi Sudarso',initial:'YS2',text:'Paket creator TikTok lengkap. Views, likes, followers naik semua.',date:'1 minggu lalu'},
    {name:'Zaskia Sungkar',initial:'ZS',text:'Old photo restore nenek saya jadi berwarna. Keluarga pada terharu.',date:'5 hari lalu'},
    {name:'Ariel Tatum',initial:'AT',text:'Caption simple tapi powerful. Saya order berkali-kali untuk konten.',date:'4 hari lalu'},
    {name:'Baim Wong',initial:'BW',text:'TikTok followers 1000 stabil. Akun saya jadi lebih credible.',date:'6 hari lalu'},
    {name:'Chelsea Islan',initial:'CI',text:'Logo minimalist sesuai brand saya. Simple tapi elegan.',date:'2 minggu lalu'},
    {name:'Dion Wiyoko',initial:'DW',text:'Paket wisuda premium recommended. Edit lengkap plus HD.',date:'3 hari lalu'},
    {name:'Ersa Mayori',initial:'EM',text:'Perbaikan foto blur hasilnya tajam. Foto penting saya terselamatkan.',date:'1 minggu lalu'}
];

let currentSlide = 0;
const slidesPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

function renderTestimonials() {
    const track = document.getElementById('testimonialsTrack');
    if(!track) return;

    track.innerHTML = testimonialData.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-avatar">${t.initial}</div>
                <div class="testimonial-info">
                    <h4>${t.name}</h4>
                    <div class="stars">⭐⭐⭐⭐⭐</div>
                </div>
            </div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-date">${t.date}</div>
        </div>
    `).join('');

    updateSliderPosition();
}

function updateSliderPosition() {
    const track = document.getElementById('testimonialsTrack');
    if(!track) return;
    const cardWidth = track.children[0]?.offsetWidth + 24 || 324;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
}

function moveSlider(direction) {
    const maxSlide = testimonialData.length - slidesPerView;
    currentSlide += direction;
    if(currentSlide < 0) currentSlide = 0;
    if(currentSlide > maxSlide) currentSlide = maxSlide;
    updateSliderPosition();
}

// Auto slide
setInterval(() => {
    const maxSlide = testimonialData.length - slidesPerView;
    if(currentSlide < maxSlide) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    updateSliderPosition();
}, 5000);

// ===== FAQ =====
function toggleFaq(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    // Open clicked if wasn't active
    if(!isActive) {
        item.classList.add('active');
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    renderTestimonials();
});

// Handle resize for testimonials
window.addEventListener('resize', () => {
    currentSlide = 0;
    updateSliderPosition();
});