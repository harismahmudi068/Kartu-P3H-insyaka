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

  } else if (whatsappRaw.length > 8) {

    whatsappDisplay =
      whatsappRaw.slice(0, 4) +
      "-" +
      whatsappRaw.slice(4, 8) +
      "-" +
      whatsappRaw.slice(8);

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
// UPLOAD FOTO
// =========================================

const photoInput = $("photo");

if (photoInput) {

  photoInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

      const photoPreview = $("photoPreview");

      if (photoPreview) {

        photoPreview.src = reader.result;
        photoPreview.style.display = "block";

      }

    };

    reader.readAsDataURL(file);

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