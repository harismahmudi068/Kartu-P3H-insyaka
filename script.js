const $ = (id) => document.getElementById(id);


// =========================================
// NORMALIZE WHATSAPP
// =========================================

function normalizeWhatsApp(value) {
  let n = (value || "").replace(/\D/g, "");

  if (n.startsWith("0")) {
    n = "62" + n.slice(1);
  } else if (n.startsWith("8")) {
    n = "62" + n;
  }

  return n;
}


// =========================================
// FORMAT TANGGAL
// =========================================

function formatDate(value) {
  if (!value) return "";

  return new Date(value + "T00:00:00").toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}


// =========================================
// UPDATE KARTU
// =========================================

function updateCard() {

  // NAMA
  const name = $("name");
  const outName = $("outName");

  if (name && outName) {
    outName.textContent = name.value;
  }


  // NOMOR REGISTRASI
  const registration = $("registration");
  const outRegistration = $("outRegistration");

  if (registration && outRegistration) {
    outRegistration.textContent = registration.value;
  }
  // =======================================
// ID P3H OTOMATIS
// =======================================

const idP3H = $("outIdP3H");
const registrationValue = $("registration");

if (idP3H && registrationValue) {

  let reg = registrationValue.value.trim();

  if (reg) {
    idP3H.textContent = "ID-P3H-" + reg;
  } else {
    idP3H.textContent = "ID-P3H-";
  }

}


  // =======================================
  // NOMOR WHATSAPP
  // =======================================

  const whatsappInput = $("whatsapp");
  const outWhatsapp = $("outWhatsapp");

  let whatsappRaw = "";

  if (whatsappInput) {
    whatsappRaw = whatsappInput.value.replace(/\D/g, "");
  }

  // Ubah 62xxxxxxxx menjadi 0xxxxxxxx
  if (whatsappRaw.startsWith("62")) {
    whatsappRaw = "0" + whatsappRaw.slice(2);
  } else if (whatsappRaw.startsWith("8")) {
    whatsappRaw = "0" + whatsappRaw;
  }

  let whatsappDisplay = whatsappRaw;

  // Format 0857-6794-9767
  if (whatsappRaw.length > 4 && whatsappRaw.length <= 8) {

    whatsappDisplay =
      whatsappRaw.slice(0, 4) +
      "-" +
      whatsappRaw.slice(4);

} else if (whatsappRaw.length > 12) {

  whatsappDisplay =
    whatsappRaw.slice(0, 4) +
    "-" +
    whatsappRaw.slice(4, 8) +
    "-" +
    whatsappRaw.slice(8, 12) +
    "-" +
    whatsappRaw.slice(12, 16);

} else if (whatsappRaw.length > 8) {

  whatsappDisplay =
    whatsappRaw.slice(0, 4) +
    "-" +
    whatsappRaw.slice(4, 8) +
    "-" +
    whatsappRaw.slice(8, 12);

}

  if (outWhatsapp) {
    outWhatsapp.textContent = whatsappDisplay;
  }


  // =======================================
  // WILAYAH
  // =======================================

  const area = $("area");
  const outArea = $("outArea");

  if (area && outArea) {
    outArea.textContent = area.value;
  }


  // =======================================
  // TANGGAL
  // =======================================

  const validFrom = $("validFrom");
  const outDate = $("outDate");

  if (validFrom && outDate) {
    outDate.textContent = formatDate(validFrom.value);
  }


  // =======================================
  // QR WHATSAPP
  // =======================================

  const qrBox = $("qrCode");

  if (!qrBox) return;

  qrBox.innerHTML = "";

  const wa = normalizeWhatsApp(whatsappRaw);

  if (wa && typeof QRCode !== "undefined") {

    let url = "https://wa.me/" + wa;

    const messageInput = $("waMessage");

    if (messageInput) {

      const message = messageInput.value.trim();

      if (message) {
        url += "?text=" + encodeURIComponent(message);
      }

    }

    new QRCode(qrBox, {
      text: url,
      width: 160,
      height: 160,
      colorDark: "#0b4a36",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

  }

}


// =========================================
// FOTO - UPLOAD / CROP / ZOOM / GESER
// =========================================

const photoInput = $("photo");
const photoPreview = $("photoPreview");
const photoZoom = $("photoZoom");
const resetPhoto = $("resetPhoto");

let photoScale = 1;
let photoX = 0;
let photoY = 0;

let pointers = new Map();
let lastPinchDistance = null;
let lastPanX = 0;
let lastPanY = 0;


// =========================================
// BATAS PERGESERAN FOTO
// =========================================

function limitPhotoPosition() {

  const frame = document.querySelector(".photo-frame");

  if (!frame) return;

  const frameWidth = frame.clientWidth;
  const frameHeight = frame.clientHeight;

  const maxX = (frameWidth * photoScale - frameWidth) / 2;
  const maxY = (frameHeight * photoScale - frameHeight) / 2;

  photoX = Math.max(-maxX, Math.min(maxX, photoX));
  photoY = Math.max(-maxY, Math.min(maxY, photoY));
}


// =========================================
// TERAPKAN POSISI FOTO
// =========================================

function applyPhotoTransform() {

  if (!photoPreview) return;

  limitPhotoPosition();

  photoPreview.style.transform =
    `translate(${photoX}px, ${photoY}px) scale(${photoScale})`;

}


// =========================================
// HITUNG JARAK DUA JARI
// =========================================

function getPointerDistance() {

  const values = Array.from(pointers.values());

  if (values.length < 2) return 0;

  const p1 = values[0];
  const p2 = values[1];

  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  return Math.sqrt(dx * dx + dy * dy);
}


// =========================================
// UPLOAD FOTO
// =========================================

if (photoInput) {

  photoInput.addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function() {

      if (!photoPreview) return;

      photoPreview.src = reader.result;
      photoPreview.style.display = "block";

      // Reset posisi
      photoScale = 1;
      photoX = 0;
      photoY = 0;

      if (photoZoom) {
        photoZoom.value = 1;
      }

      applyPhotoTransform();

    };

    reader.readAsDataURL(file);

  });

}


// =========================================
// ZOOM DENGAN SLIDER
// =========================================

if (photoZoom) {

  photoZoom.addEventListener("input", function() {

    photoScale = parseFloat(this.value) || 1;

    limitPhotoPosition();
    applyPhotoTransform();

  });

}


// =========================================
// RESET FOTO
// =========================================

if (resetPhoto) {

  resetPhoto.addEventListener("click", function() {

    photoScale = 1;
    photoX = 0;
    photoY = 0;

    if (photoZoom) {
      photoZoom.value = 1;
    }

    applyPhotoTransform();

  });

}


// =========================================
// GESER + PINCH ZOOM DENGAN JARI
// =========================================

if (photoPreview) {

  photoPreview.addEventListener("pointerdown", function(event) {

    event.preventDefault();

    this.setPointerCapture(event.pointerId);

    pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });

    if (pointers.size === 1) {

      lastPanX = event.clientX;
      lastPanY = event.clientY;

    }

    if (pointers.size === 2) {

      lastPinchDistance = getPointerDistance();

    }

  });


  photoPreview.addEventListener("pointermove", function(event) {

    if (!pointers.has(event.pointerId)) return;

    event.preventDefault();

    pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });


    // =====================================
    // DUA JARI = ZOOM
    // =====================================

    if (pointers.size === 2) {

      const currentDistance = getPointerDistance();

      if (lastPinchDistance) {

        const difference =
          currentDistance - lastPinchDistance;

        photoScale += difference * 0.005;

        photoScale =
          Math.max(1, Math.min(3, photoScale));

        if (photoZoom) {
          photoZoom.value = photoScale;
        }

        applyPhotoTransform();

      }

      lastPinchDistance = currentDistance;

      return;

    }


    // =====================================
    // SATU JARI = GESER
    // =====================================

    if (pointers.size === 1) {

      const dx = event.clientX - lastPanX;
      const dy = event.clientY - lastPanY;

      photoX += dx;
      photoY += dy;

      lastPanX = event.clientX;
      lastPanY = event.clientY;

      applyPhotoTransform();

    }

  });


  photoPreview.addEventListener("pointerup", function(event) {

    pointers.delete(event.pointerId);

    if (pointers.size < 2) {
      lastPinchDistance = null;
    }

  });


  photoPreview.addEventListener("pointercancel", function(event) {

    pointers.delete(event.pointerId);

    if (pointers.size < 2) {
      lastPinchDistance = null;
    }

  });

}

// =========================================
// TOMBOL PERBARUI KARTU
// =========================================

const updateBtn = $("updateBtn");

if (updateBtn) {
  updateBtn.addEventListener("click", updateCard);
}


// =========================================
// FORMAT NOMOR WHATSAPP SAAT DIKETIK
// =========================================

const whatsappField = $("whatsapp");

if (whatsappField) {

  whatsappField.addEventListener("input", function () {

    let value = this.value.replace(/\D/g, "");

    if (value.length > 4 && value.length <= 8) {

      value =
        value.slice(0, 4) +
        "-" +
        value.slice(4);

} else if (value.length > 12) {

  value =
    value.slice(0, 4) +
    "-" +
    value.slice(4, 8) +
    "-" +
    value.slice(8, 12) +
    "-" +
    value.slice(12, 16);

} else if (value.length > 8) {

  value =
    value.slice(0, 4) +
    "-" +
    value.slice(4, 8) +
    "-" +
    value.slice(8, 12);

    }

    this.value = value;

  });

}


// =========================================
// DOWNLOAD PNG DEPAN + BELAKANG
// =========================================

const pngBtn = $("pngBtn");

if (pngBtn) {

  pngBtn.addEventListener("click", async function () {

    const btn = this;

    btn.classList.add("download-active");

    btn.dataset.originalText = btn.textContent;

    btn.textContent = "Menyiapkan PNG...";

    updateCard();


    // CEK HTML2CANVAS
    if (typeof html2canvas === "undefined") {

      alert("Fitur PNG belum siap. Refresh halaman.");

      btn.classList.remove("download-active");

      btn.textContent = btn.dataset.originalText;

      return;

    }


    // CARI KARTU
    const front = document.querySelector(".front-card");
    const back = document.querySelector(".back-card");


    if (!front || !back) {

      alert("Kartu depan atau belakang tidak ditemukan.");

      btn.classList.remove("download-active");

      btn.textContent = btn.dataset.originalText;

      return;

    }


    try {

      // =====================================
      // PNG DEPAN
      // =====================================

      const canvasFront = await html2canvas(front, {

        scale: 8,

        useCORS: true,

        backgroundColor: "#ffffff",

        imageTimeout: 0,

        logging: false

      });


      const linkFront = document.createElement("a");

      linkFront.download = "Kartu-P3H-Depan.png";

      linkFront.href =
        canvasFront.toDataURL("image/png");

      document.body.appendChild(linkFront);

      linkFront.click();

      linkFront.remove();


      // Tunggu sebentar
      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );


      // =====================================
      // PNG BELAKANG
      // =====================================

      const canvasBack = await html2canvas(back, {

        scale: 8,

        useCORS: true,

        backgroundColor: "#ffffff",

        imageTimeout: 0,

        logging: false

      });


      const linkBack = document.createElement("a");

      linkBack.download =
        "Kartu-P3H-Belakang.png";

      linkBack.href =
        canvasBack.toDataURL("image/png");

      document.body.appendChild(linkBack);

      linkBack.click();

      linkBack.remove();


      // =====================================
      // BERHASIL
      // =====================================

      btn.textContent = "✓ PNG Berhasil";


    } catch (error) {

      console.error(error);

      alert("Gagal membuat PNG.");

      btn.textContent = "Download Gagal";

    }


    // KEMBALIKAN TOMBOL
    setTimeout(() => {

      btn.classList.remove("download-active");

      btn.textContent =
        btn.dataset.originalText;

    }, 2000);

  });

}


// =========================================
// JALANKAN KARTU SAAT HALAMAN DIBUKA
// =========================================

updateCard();