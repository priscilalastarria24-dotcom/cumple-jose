// ============================
// CONFIG (tu llave secreta 😌)
// ============================
const LOGIN_CODE = "OGITORD";
const LOGIN_LASTNAME = "TOLENTINO";
const VALID_UNTIL_TEXT = "03 de marzo";

// Cupones (10) — incluye tus ideas + 1 extra útil
const COUPONS = [
  {
    title: "Te perdono una tontería",
    desc: "No aplica a cosas serias 😤",
    extra: "Válido 1 vez. Si se intenta usar para algo serio, se activa modo: NO 😌."
  },
  {
    title: "“Sí mi amor” x3",
    desc: "Usos limitados por salud mental.",
    extra: "Máximo 3 usos. No acumulable con 'pero' ni con 'ya veremos'."
  },
  {
    title: "Oral VIP",
    desc: "Edición premium 😌",
    extra: "Solo con consentimiento, buen mood y cero presión. Servicio sujeto a disponibilidad del proveedor (yo) 😂."
  },
  {
    title: "Te preparo tu comida favorita",
    desc: "Desayuno / almuerzo / cena (tú eliges).",
    extra: "No incluye lavar platos… a menos que el cupón venga con mirada de perrito."
  },
  {
    title: "Masaje Deluxe — 20 min",
    desc: "Modo relax activado.",
    extra: "Incluye: 'no me muevo' mode. Si te duermes, se cobra con besitos."
  },
  {
    title: "Salida a un cafecito o una cita",
    desc: "Plan simple, vibes bonitas.",
    extra: "Se coordina fecha y hora. Dress code: tu sonrisa."
  },
  {
    title: "Peli/serie que tú escojas",
    desc: "Se mira sin debate.",
    extra: "Regla: no se aceptan críticas durante la peli. Solo abrazos."
  },
  {
    title: "Hoy tú descansas",
    desc: "Yo cubro una tarea concreta.",
    extra: "Tarea a elección del cumpleañero (siempre que no sea 'todo' 😤)."
  },
  {
    title: "Mirador / atardecer en Cusco",
    desc: "Con fotos obligatorias.",
    extra: "Incluye: caminata + fotos + comentario obligatorio: 'qué guapa mi novia'."
  },
  {
    title: "Abrazo de 20 segundos",
    desc: "Canje inmediato. Sin excusas.",
    extra: "Si no se canjea, se aplica automáticamente (sí, esto es amenaza)."
  },
];

// Términos y condiciones
const TERMS = [
  `Válido hasta el ${VALID_UNTIL_TEXT} (o hasta que muera el hosting jajaja).`,
  "Cupones no transferibles. No se aceptan reventas ni trueques raros.",
  "Para redimir: presentar cupón impreso o mostrar en pantalla + cara de cumpleañero.",
  "Cupón “Sí mi amor” x3: si se usa todo en 1 día, se activa modo “no hay más stock”.",
  "Cupón “Te perdono una tontería”: no aplica a cosas serias ni a faltas de respeto.",
  "La administración se reserva el derecho de dar besitos extra sin previo aviso.",
  "Si se pierde un cupón: se reemplaza por 1 abrazo (sin reclamos).",
];

// Fotos (15) — renómbralas 01.jpg ... 15.jpg
const PHOTOS = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `assets/photos/${n}.jpg`, caption: "" };
});

// Mensaje final (con OGITORD plot twist)
const FINAL_HTML = `
  <p>
    Feliz cumple, mi amorrr. Gracias por aguantarme, quererme y ser mi lugar seguro (aunque a veces yo sea un mini caos con pestañas). Te amo por cómo me cuidas, por cómo me haces reír y por cómo estás conmigo en las buenas y en las “ya pues, ya”. Hoy no te celebro con cosas, te celebro con mi tiempo, mi amor y mis ganas de seguir construyendo contigo. 🫶🥰
  </p>
  <p>
    <b>PD:</b> ¿Viste el código? <b>OGITORD</b>… sí pues… <b>GORDITO</b> pero ordenado 😂
  </p>
  <p class="muted">
    (Y sí, esto está impreso, firmado, y con cuponera. Así que ajá.)
  </p>
`;

// ============================
// Helpers
// ============================
const el = (id) => document.getElementById(id);

function normalizeUpper(s){
  return (s || "").trim().toUpperCase();
}

// ============================
// Views
// ============================
const loginView = el("loginView");
const appView = el("appView");

const codeInput = el("codeInput");
const lastNameInput = el("lastNameInput");
const loginBtn = el("loginBtn");
const loginError = el("loginError");

const expiryText = el("expiryText");
const couponGrid = el("couponGrid");
const termsList = el("termsList");
const finalText = el("finalText");

const playAudioBtn = el("playAudioBtn");
const printBtn = el("printBtn");
const logoutBtn = el("logoutBtn");
const audio = el("audio");

const finalConfettiBtn = el("finalConfettiBtn");
const goCouponsBtn = el("goCouponsBtn");

// menu navigation
document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-go");
    const section = document.getElementById(id);
    if(section) section.scrollIntoView({ behavior:"smooth", block:"start" });
  });
});

// ============================
// Render content
// ============================
function printOneCoupon(couponEl){
  // Marca SOLO este cupón como objetivo
  document.querySelectorAll(".coupon").forEach(c => c.classList.remove("print-target"));
  couponEl.classList.add("print-target");

  // Activa modo imprimir uno
  document.body.classList.add("print-one");

  // Abre detalles para que salgan en impresión
  const extra = couponEl.querySelector(".couponExtra");
  if(extra) extra.style.display = "block";

  window.print();
}

// Limpieza post impresión (para volver normal)
window.addEventListener("afterprint", () => {
  document.body.classList.remove("print-one");
  document.querySelectorAll(".coupon").forEach(c => c.classList.remove("print-target"));
});

function renderCoupons(){
  couponGrid.innerHTML = "";

  COUPONS.forEach((c, idx) => {
    const code = `CUP-${String(idx+1).padStart(2,"0")}`;

    const card = document.createElement("div");
    card.className = "coupon";
    card.innerHTML = `
  <div class="couponTicket">
    <div class="couponMain">
      <div class="couponHeader">
        <div class="couponTitle">${c.title}</div>
        <div class="couponValid">Válido hasta: <b>${VALID_UNTIL_TEXT}</b></div>
      </div>

      <div class="couponDesc">${c.desc}</div>

      <div class="couponExtra">
        ${c.extra}
      </div>

      <div class="couponActions">
        <button class="couponPrintBtn" type="button">🖨️ Imprimir</button>
      </div>
    </div>

    <div class="couponStub">
      <div class="stubLabel">CUPÓN</div>
      <div class="stubCode">${code}</div>
      <div class="stubSmall">Vigencia</div>
      <div class="stubSmall"><b>${VALID_UNTIL_TEXT}</b></div>
      <div class="stubTiny">Firmado: Pri 😌</div>
    </div>
  </div>
`;


    // Click en el cupón = mostrar/ocultar detalles (excepto si fue el botón)
    card.addEventListener("click", (e) => {
      if(e.target.closest(".couponPrintBtn")) return;

      const extra = card.querySelector(".couponExtra");
      const open = extra.style.display === "block";
      extra.style.display = open ? "none" : "block";
      if(!open) confettiBurst(0.25);
    });

    // Botón imprimir = imprimir SOLO este cupón
    card.querySelector(".couponPrintBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      confettiBurst(0.12);
      printOneCoupon(card);
    });

    couponGrid.appendChild(card);
  });
}

function renderTerms(){
  termsList.innerHTML = "";
  TERMS.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    termsList.appendChild(li);
  });
}

function renderFinal(){
  finalText.innerHTML = FINAL_HTML;
}

function renderPhotos(){
  const photoGrid = el("photoGrid");
  photoGrid.innerHTML = "";

  PHOTOS.forEach((p, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "photo";
    wrap.innerHTML = `<img src="${p.src}" alt="Foto ${idx+1}" loading="lazy" />`;
    wrap.addEventListener("click", () => openModal(p.src, p.caption || `Foto ${idx+1}`));
    photoGrid.appendChild(wrap);
  });
}

// ============================
// Login logic
// ============================
function doLogin(){
  loginError.textContent = "";

  const code = normalizeUpper(codeInput.value);
  const last = normalizeUpper(lastNameInput.value);

  const ok = (code === LOGIN_CODE) && (last === LOGIN_LASTNAME);

  if(!ok){
    loginError.textContent = "Datos incorrectos 😤 Revisa tu boarding pass.";
    confettiBurst(0.08);
    return;
  }

  // success
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");

  confettiBurst(0.95);

  // focus coupons first
  setTimeout(() => {
    document.getElementById("coupons").scrollIntoView({ behavior:"smooth", block:"start" });
  }, 250);
}

loginBtn.addEventListener("click", doLogin);
codeInput.addEventListener("keydown", (e)=>{ if(e.key==="Enter") doLogin(); });
lastNameInput.addEventListener("keydown", (e)=>{ if(e.key==="Enter") doLogin(); });

// Logout (por si quieres volver a probar)
logoutBtn?.addEventListener("click", () => {
  appView.classList.add("hidden");
  loginView.classList.remove("hidden");
  codeInput.value = "";
  lastNameInput.value = "";
  loginError.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================
// Buttons: audio + print
// ============================
let audioIsPlaying = false;

playAudioBtn?.addEventListener("click", async () => {
  try{
    const src = audio?.querySelector("source")?.getAttribute("src");
    if(!src){
      alert("Sube tu audio como assets/audio.mp3 y listo 😌");
      return;
    }

    if(!audioIsPlaying){
      await audio.play();
      audioIsPlaying = true;
      playAudioBtn.textContent = "⏸️ Pausar audio";
      confettiBurst(0.18);
    } else {
      audio.pause();
      audioIsPlaying = false;
      playAudioBtn.textContent = "🔊 Audio";
    }
  }catch(err){
    alert("Tu navegador bloqueó el audio. Dale clic otra vez y sube el volumen 😭");
  }
});

// Cuando termina el audio, resetea el botón
audio?.addEventListener("ended", () => {
  audioIsPlaying = false;
  if(playAudioBtn) playAudioBtn.textContent = "🔊 Audio";
});


printBtn?.addEventListener("click", () => {
  confettiBurst(0.18);
  window.print();
});

finalConfettiBtn?.addEventListener("click", () => confettiBurst(0.85));
goCouponsBtn?.addEventListener("click", () => document.getElementById("coupons").scrollIntoView({behavior:"smooth"}));

// ============================
// Init render
// ============================
expiryText.textContent = VALID_UNTIL_TEXT;
renderCoupons();
renderTerms();
renderFinal();
renderPhotos();

// ============================
// Photo modal
// ============================
const modal = el("photoModal");
const modalImg = el("modalImg");
const modalCaption = el("modalCaption");
const modalCloseBtn = el("modalCloseBtn");
const modalBackdrop = el("modalBackdrop");

function openModal(src, caption){
  modalImg.src = src;
  modalCaption.textContent = caption || "";
  modal.classList.remove("hidden");
}
function closeModal(){
  modal.classList.add("hidden");
  modalImg.src = "";
  modalCaption.textContent = "";
}
modalCloseBtn?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", closeModal);
document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModal(); });

// ============================
// Confetti (más rápido + dt para fluidez)
// ============================
const canvas = el("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let raf = null;
let lastT = 0;

function resize(){
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener("resize", resize);
resize();

function confettiBurst(intensity=0.8){
  // Menos piezas pero MÁS velocidad (se ve más “fiesta” y menos pesado)
  const count = Math.floor(75 * intensity);
  const emojis = ["🎉","✨","💛","🥳","🌟","🧡"];

  for(let i=0;i<count;i++){
    pieces.push({
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * 180,
      vx: (Math.random() - 0.5) * 8,         // más lateral
      vy: 7 + Math.random() * 7,             // MÁS rápido hacia abajo
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.28,
      emoji: emojis[(Math.random() * emojis.length) | 0],
      size: 14 + Math.random() * 12,
      life: 120 + Math.random() * 70
    });
  }

  if(!raf){
    lastT = 0;
    raf = requestAnimationFrame(animate);
  }
}

function animate(t){
  // dt = 1 cuando va normal, >1 cuando baja FPS, para que no se “ralentice”
  const dt = lastT ? Math.min(2.2, (t - lastT) / 16.67) : 1;
  lastT = t;

  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

  for(const p of pieces){
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;

    // gravedad fuerte para que caiga con energía
    p.vy += 0.28 * dt;

    p.life -= 1.2 * dt;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = `${p.size}px system-ui, Apple Color Emoji, Segoe UI Emoji`;
    ctx.fillText(p.emoji, 0, 0);
    ctx.restore();
  }

  pieces = pieces.filter(p => p.life > 0 && p.y < window.innerHeight + 80);

  if(pieces.length){
    raf = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(raf);
    raf = null;
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  }
}
