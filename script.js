/* ========================================
   FassaStore — script.js (Vanilla JS only)
   ======================================== */

/* ---------- Initial Product Data ---------- */
const DEFAULT_PRODUCTS = [
  { id:1, name:"Facebook Fresh Cookies", price:2000, stock:120, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Akun Facebook fresh cookies siap login.", best:true },
  { id:2, name:"Facebook Fresh A2F ON", price:3000, stock:90, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Facebook fresh dengan 2FA aktif & aman.", best:true },
  { id:3, name:"Facebook Tua 2010", price:15000, stock:25, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Akun Facebook lawas tahun 2010.", limited:true },
  { id:4, name:"Facebook Tua 2011", price:15000, stock:30, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Akun Facebook lawas tahun 2011." },
  { id:5, name:"Facebook Tua 2012", price:15000, stock:28, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Akun Facebook lawas tahun 2012." },
  { id:6, name:"Facebook Tua 2013", price:15000, stock:40, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Akun Facebook lawas tahun 2013." },
  { id:7, name:"Facebook Tua 2014", price:15000, stock:35, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Akun Facebook lawas tahun 2014." },
  { id:8, name:"Facebook Tua 2015", price:15000, stock:42, cat:"facebook", icon:"fa-brands fa-facebook", iconClass:"fb", desc:"Akun Facebook lawas tahun 2015." },
  { id:9, name:"Gmail Fresh", price:5000, stock:200, cat:"gmail", icon:"fa-solid fa-envelope", iconClass:"gmail", desc:"Akun Gmail baru fresh, full akses.", best:true },
  { id:10, name:"Gmail Bekas", price:5000, stock:150, cat:"gmail", icon:"fa-solid fa-envelope", iconClass:"gmail", desc:"Akun Gmail bekas siap pakai." },
  { id:11, name:"YouTube Premium 1 Bulan", price:7000, stock:80, cat:"youtube", icon:"fa-brands fa-youtube", iconClass:"yt", desc:"Akses YouTube Premium 1 bulan penuh.", best:true },
  { id:12, name:"Bot Auto Create FB — 1 Bulan", price:35000, stock:18, cat:"bot", icon:"fa-solid fa-robot", iconClass:"bot", desc:"Bot mentah auto create akun FB, durasi 1 bulan.", limited:true },
  { id:13, name:"Bot Auto Create FB — 3 Bulan", price:55000, stock:15, cat:"bot", icon:"fa-solid fa-robot", iconClass:"bot", desc:"Bot mentah auto create akun FB, durasi 3 bulan." },
  { id:14, name:"Bot Auto Create FB — Permanen", price:115000, stock:8, cat:"bot", icon:"fa-solid fa-robot", iconClass:"bot", desc:"Bot mentah auto create akun FB, lisensi permanen.", best:true, limited:true },
];

/* ---------- LocalStorage helpers ---------- */
const LS_KEY = "fassastore_products_v1";
function loadProducts(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return [...DEFAULT_PRODUCTS];
}
function saveProducts(){ localStorage.setItem(LS_KEY, JSON.stringify(PRODUCTS)); }
let PRODUCTS = loadProducts();

/* ---------- Format ---------- */
const rupiah = n => "Rp"+Number(n).toLocaleString("id-ID");

/* ---------- Loader ---------- */
window.addEventListener("load",()=>{
  setTimeout(()=>document.getElementById("loader").classList.add("hide"),600);
});

/* ---------- Year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Cursor glow ---------- */
const cg = document.getElementById("cursorGlow");
document.addEventListener("mousemove",e=>{
  cg.style.left = e.clientX+"px";
  cg.style.top  = e.clientY+"px";
});

/* ---------- Hamburger ---------- */
const ham = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
ham.addEventListener("click",()=>{ham.classList.toggle("open");navMenu.classList.toggle("open")});
navMenu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{ham.classList.remove("open");navMenu.classList.remove("open")}));

/* ---------- Counter ---------- */
const counters = document.querySelectorAll(".counter");
function animateCounter(el){
  const target = +el.dataset.target;
  let cur=0;const step=Math.max(1,Math.floor(target/80));
  const t=setInterval(()=>{
    cur+=step;
    if(cur>=target){cur=target;clearInterval(t)}
    el.textContent = cur.toLocaleString("id-ID");
  },20);
}
const io = new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){animateCounter(e.target);io.unobserve(e.target)}});
});
counters.forEach(c=>io.observe(c));

/* ---------- Back to top ---------- */
const backTop = document.getElementById("backTop");
window.addEventListener("scroll",()=>{
  backTop.classList.toggle("show", window.scrollY>500);
});
backTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

/* ---------- Render Products ---------- */
let currentFilter="all", currentSearch="";
function renderProducts(){
  const grid = document.getElementById("productGrid");
  const list = PRODUCTS.filter(p=>{
    const okCat = currentFilter==="all" || p.cat===currentFilter;
    const okSearch = !currentSearch || p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return okCat && okSearch;
  });
  if(!list.length){grid.innerHTML='<p class="muted" style="text-align:center;grid-column:1/-1;padding:40px">Tidak ada produk ditemukan.</p>';return}
  grid.innerHTML = list.map(p=>`
    <div class="product-card">
      ${p.best?'<span class="p-badge">Best Seller</span>':p.limited?'<span class="p-badge limited">Limited</span>':''}
      <div class="p-icon ${p.iconClass||''}"><i class="${p.icon||'fa-solid fa-box'}"></i></div>
      <div class="p-name">${p.name}</div>
      <div class="p-desc">${p.desc||''}</div>
      <div class="p-meta">
        <div class="p-price">${rupiah(p.price)}</div>
        <div class="p-stock ${p.stock<20?'low':''}">${p.stock<20?'Stok '+p.stock:'Ready'}</div>
      </div>
      <button class="p-buy" onclick='openPay(${p.id})'><i class="fa-solid fa-bolt"></i> Beli Sekarang</button>
    </div>
  `).join("");
}
renderProducts();

/* ---------- Filter & Search ---------- */
document.getElementById("filterChips").addEventListener("click",e=>{
  const b = e.target.closest(".chip"); if(!b) return;
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
  b.classList.add("active");
  currentFilter = b.dataset.cat;
  renderProducts();
});
document.getElementById("searchInput").addEventListener("input",e=>{
  currentSearch = e.target.value;
  renderProducts();
});

/* ---------- Testimoni ---------- */
const TESTIS = [
  {n:"Rizky Pratama",r:5,t:"Fast respon dan akun aman. Recommended seller!"},
  {n:"Dimas Wijaya",r:5,t:"Trusted banget dan cepat. Akan order lagi."},
  {n:"Kevin Alexander",r:4,t:"UI website keren dan premium, transaksi mudah."},
  {n:"Andi Saputra",r:5,t:"Akun FB nyala semua, mantap admin!"},
  {n:"Bayu Pratama",r:5,t:"Bot FB jalan lancar, support oke."},
  {n:"Reza Mahendra",r:4,t:"Harga termurah dibanding tempat lain."},
  {n:"Fauzan Yusuf",r:5,t:"Gmail-nya fresh, full akses, work."},
  {n:"Hendra Wijaya",r:5,t:"YouTube Premium aktif tanpa kendala."},
  {n:"Galang Ramadhan",r:4,t:"Pelayanan ramah, pengiriman cepat."},
  {n:"Iqbal Maulana",r:5,t:"Order kedua kali, tetap memuaskan!"},
];
document.getElementById("testiTrack").innerHTML = TESTIS.map(t=>`
  <div class="testi-card">
    <div class="testi-head">
      <div class="testi-ava">${t.n[0]}</div>
      <div>
        <div class="testi-name">${t.n} <span class="testi-verify"><i class="fa-solid fa-circle-check"></i></span></div>
        <div class="testi-stars">${"★".repeat(t.r)}${"☆".repeat(5-t.r)}</div>
      </div>
    </div>
    <div class="testi-text">"${t.t}"</div>
  </div>
`).join("");

/* ---------- Toast ---------- */
function toast(msg, type="success"){
  const w = document.getElementById("toastWrap");
  const ic = type==="success"?"fa-circle-check":type==="error"?"fa-circle-xmark":"fa-circle-info";
  const el = document.createElement("div");
  el.className = "toast "+type;
  el.innerHTML = `<i class="fa-solid ${ic}"></i> <span>${msg}</span>`;
  w.appendChild(el);
  setTimeout(()=>{el.style.opacity="0";el.style.transform="translateX(20px)";el.style.transition=".3s";setTimeout(()=>el.remove(),300)},2800);
}

/* ---------- Online counter ---------- */
const onlineEl = document.getElementById("onlineCount");
let onlineCount = 120 + Math.floor(Math.random()*80);
onlineEl.textContent = onlineCount;
setInterval(()=>{
  onlineCount += Math.floor(Math.random()*7)-3;
  if(onlineCount<80)onlineCount=80;if(onlineCount>260)onlineCount=260;
  onlineEl.textContent = onlineCount;
},4000);

/* ---------- Live checkout popup ---------- */
const NAMES = ["Rizky","Dimas","Andi","Bayu","Reza","Fauzan","Hendra","Galang","Iqbal","Kevin","Aldi","Putra","Rafi","Yoga","Bagas","Wahyu","Dwi","Eko","Fajar","Gilang","Hafizh","Ilham","Joko","Krisna","Lukman","Maulana","Nanda","Oka","Pandu","Qadri","Rian","Satrio","Taufik","Umar","Vino","Wisnu","Yusuf","Zaki","Surya","Arya","Bima","Citra","Dewi","Eka","Fitri","Gita","Hana","Indah","Jihan","Kirana","Lina","Mega","Nisa","Olivia","Putri","Rina","Sari","Tania","Uli","Vania","Winda","Yuni","Zahra"];
const CITIES = ["Jakarta","Bandung","Surabaya","Medan","Semarang","Yogyakarta","Bali","Makassar","Palembang","Bekasi","Tangerang","Depok","Bogor","Malang","Solo","Padang","Pekanbaru","Manado","Banjarmasin","Pontianak","Samarinda","Jambi","Lampung","Cirebon","Kediri"];
function showLive(){
  const wrap = document.getElementById("livePop");
  const name = NAMES[Math.floor(Math.random()*NAMES.length)];
  const city = CITIES[Math.floor(Math.random()*CITIES.length)];
  const prod = PRODUCTS[Math.floor(Math.random()*PRODUCTS.length)];
  const mins = Math.floor(Math.random()*30)+1;
  const el = document.createElement("div");
  el.className="live-card";
  el.innerHTML = `
    <div class="live-ava">${name[0]}</div>
    <div class="live-text">
      <strong>${name}</strong> dari <strong>${city}</strong> baru membeli <strong>${prod.name}</strong>
      <small>${mins} menit lalu</small>
    </div>`;
  wrap.appendChild(el);
  setTimeout(()=>{el.style.opacity="0";el.style.transform="translateY(20px)";el.style.transition=".4s";setTimeout(()=>el.remove(),400)},5000);
}
setTimeout(showLive,2500);
setInterval(showLive, 8000);

/* ============================================
   PAYMENT MODAL
   ============================================ */
let activeProduct = null, qty = 1, cdTimer=null;

function openPay(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  activeProduct = p; qty = 1;
  document.getElementById("ppName").textContent = p.name;
  document.getElementById("ppPrice").textContent = rupiah(p.price);
  document.getElementById("ppIcon").innerHTML = `<i class="${p.icon}"></i>`;
  document.getElementById("ppIcon").className = "pp-icon "+(p.iconClass||"");
  document.getElementById("invNo").textContent = "#INV-"+Date.now().toString().slice(-7);
  document.getElementById("qty").value = 1;
  document.getElementById("buyerName").value = "";
  document.getElementById("proofPreview").src = "";
  document.getElementById("proofFile").value = "";
  updateTotal();
  startCountdown();
  document.getElementById("payModal").classList.add("open");
}
function closePay(){
  document.getElementById("payModal").classList.remove("open");
  if(cdTimer) clearInterval(cdTimer);
}
function changeQty(n){
  qty = Math.max(1, qty + n);
  document.getElementById("qty").value = qty;
  updateTotal();
}
function updateTotal(){
  if(!activeProduct) return;
  document.getElementById("totalPrice").textContent = rupiah(activeProduct.price*qty);
}
function copyRek(num, name){
  navigator.clipboard.writeText(num).then(()=>toast(`Nomor ${name} disalin: ${num}`,"success"));
}
function previewProof(e){
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = ev=>document.getElementById("proofPreview").src = ev.target.result;
  r.readAsDataURL(f);
}
function startCountdown(){
  let s = 15*60;
  const el = document.getElementById("countdown");
  if(cdTimer) clearInterval(cdTimer);
  cdTimer = setInterval(()=>{
    s--;
    const m = String(Math.floor(s/60)).padStart(2,"0");
    const ss = String(s%60).padStart(2,"0");
    el.textContent = `${m}:${ss}`;
    if(s<=0){clearInterval(cdTimer);toast("Waktu pembayaran habis","error");closePay();}
  },1000);
}
function confirmPay(){
  const name = document.getElementById("buyerName").value.trim();
  if(!name){ toast("Mohon isi nama pembeli","error"); return; }
  closePay();
  setTimeout(()=>{
    document.getElementById("successModal").classList.add("open");
    toast("Pembayaran berhasil dikonfirmasi!","success");
  },200);
}
function closeSuccess(){document.getElementById("successModal").classList.remove("open")}

/* ---------- QR Zoom ---------- */
function zoomQR(){
  const src = document.getElementById("qrisImg").src;
  document.getElementById("qrZoom").src = src;
  document.getElementById("qrModal").classList.add("open");
}
function closeQR(){document.getElementById("qrModal").classList.remove("open")}

/* ============================================
   ADMIN PANEL
   ============================================ */
function openAdmin(e){ e&&e.preventDefault(); document.getElementById("adminLogin").classList.add("open"); }
function closeAdminLogin(){document.getElementById("adminLogin").classList.remove("open")}
function adminLogin(){
  const u = document.getElementById("admUser").value;
  const p = document.getElementById("admPass").value;
  if(u==="admin" && p==="admin"){
    closeAdminLogin();
    document.getElementById("adminPanel").classList.add("open");
    renderAdmin();
    toast("Login admin berhasil","success");
  }else{
    toast("Username/password salah","error");
  }
}
function closeAdmin(){document.getElementById("adminPanel").classList.remove("open")}

function renderAdmin(){
  // bars
  const bars = document.getElementById("bars");
  const days = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
  bars.innerHTML = days.map(d=>{
    const h = 30 + Math.floor(Math.random()*70);
    return `<div style="height:${h}%"><span>${d}</span></div>`;
  }).join("");
  // activity
  const acts = ["Order baru #INV-12932 - Facebook Fresh","Pembayaran terverifikasi #INV-12931","Customer baru terdaftar","Produk Gmail Fresh restocked","Order #INV-12930 dikirim","Bot Auto Create FB terjual","Review baru bintang 5","Order #INV-12928 - YouTube Premium"];
  document.getElementById("actList").innerHTML = acts.map(a=>`<li><span>${a}</span><small>${Math.floor(Math.random()*60)}m</small></li>`).join("");
  // table
  renderAdminTable();
}
function renderAdminTable(){
  const tb = document.querySelector("#admTable tbody");
  tb.innerHTML = PRODUCTS.map(p=>`
    <tr>
      <td>${p.name}</td>
      <td>${rupiah(p.price)}</td>
      <td>${p.stock}</td>
      <td>${p.cat}</td>
      <td>
        <button onclick="openProductEdit(${p.id})"><i class="fa-solid fa-pen"></i></button>
        <button class="del" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`).join("");
}
function openProductEdit(id){
  const isNew = !id;
  const p = isNew ? {id:Date.now(),name:"",price:0,stock:0,cat:"facebook",desc:""} : PRODUCTS.find(x=>x.id===id);
  document.getElementById("prodModalTitle").textContent = isNew?"Tambah Produk":"Edit Produk";
  document.getElementById("pId").value = p.id;
  document.getElementById("pName").value = p.name;
  document.getElementById("pPrice").value = p.price;
  document.getElementById("pStock").value = p.stock;
  document.getElementById("pCat").value = p.cat;
  document.getElementById("pDesc").value = p.desc||"";
  document.getElementById("prodModal").classList.add("open");
}
function closeProductEdit(){document.getElementById("prodModal").classList.remove("open")}
function saveProduct(){
  const id = +document.getElementById("pId").value;
  const data = {
    id, name:document.getElementById("pName").value.trim(),
    price:+document.getElementById("pPrice").value,
    stock:+document.getElementById("pStock").value,
    cat:document.getElementById("pCat").value,
    desc:document.getElementById("pDesc").value.trim()
  };
  if(!data.name){toast("Nama produk wajib diisi","error");return}
  const iconMap = {facebook:{icon:"fa-brands fa-facebook",iconClass:"fb"},gmail:{icon:"fa-solid fa-envelope",iconClass:"gmail"},youtube:{icon:"fa-brands fa-youtube",iconClass:"yt"},bot:{icon:"fa-solid fa-robot",iconClass:"bot"},other:{icon:"fa-solid fa-box",iconClass:""}};
  Object.assign(data, iconMap[data.cat]||iconMap.other);
  const idx = PRODUCTS.findIndex(x=>x.id===id);
  if(idx>=0) PRODUCTS[idx] = {...PRODUCTS[idx], ...data};
  else PRODUCTS.push(data);
  saveProducts();
  renderAdminTable();
  renderProducts();
  closeProductEdit();
  toast("Produk tersimpan","success");
}
function deleteProduct(id){
  if(!confirm("Hapus produk ini?")) return;
  PRODUCTS = PRODUCTS.filter(x=>x.id!==id);
  saveProducts();
  renderAdminTable();
  renderProducts();
  toast("Produk dihapus","success");
}

/* Close modals when clicking outside card */
document.querySelectorAll(".modal").forEach(m=>{
  m.addEventListener("click",e=>{
    if(e.target===m && m.id!=="qrModal") m.classList.remove("open");
  });
});

/* Expose to window (inline handlers) */
Object.assign(window,{openPay,closePay,changeQty,copyRek,previewProof,confirmPay,closeSuccess,zoomQR,closeQR,openAdmin,closeAdminLogin,adminLogin,closeAdmin,openProductEdit,closeProductEdit,saveProduct,deleteProduct,toast});