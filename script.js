// =========================================================
// GENERATOR KARTU P3H
// SCRIPT.JS - VERSI KONSISTEN & PRESISI KTP
// =========================================================


// =========================================================
// HELPER
// =========================================================

const $ = (id) => document.getElementById(id);


// =========================================================
// SKALA OTOMATIS PREVIEW (SUPAYA SAMA DI HP & DESKTOP)
// =========================================================

function adjustCardScale() {

  document.querySelectorAll('.card-wrapper').forEach(wrapper => {

    const scale = wrapper.clientWidth / 856;

    const card = wrapper.querySelector('.id-card');

    if (card) {

      card.style.transform = `scale(${scale})`;

    }

  });

}

window.addEventListener('resize', adjustCardScale);


// =========================================================
// NORMALIZE WHATSAPP
// =========================================================

function normalizeWhatsApp(value) {

  let n =
    (value || "")
      .replace(/\D/g, "");


  if (
    n.startsWith("0")
  ) {

    n =
      "62" +
      n.slice(1);

  }

  else if (
    n.startsWith("8")
  ) {

    n =
      "62" +
      n;

  }


  return n;

}


// =========================================================
// FORMAT TANGGAL
// =========================================================

function formatDate(value) {

  if (!value) return "";


  try {

    return new Date(
      value + "T00:00:00"
    )
      .toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }
      );

  }

  catch (error) {

    return "";

  }

}


// =========================================================
// UPDATE KARTU
// =========================================================

function updateCard() {


  // =======================================================
  // NAMA
  // =======================================================

  const name =
    $("name");

  const outName =
    $("outName");


  if (
    name &&
    outName
  ) {

    outName.textContent =
      name.value.trim();

  }


  // =======================================================
  // NOMOR REGISTRASI
  // =======================================================

  const registration =
    $("registration");

  const outRegistration =
    $("outRegistration");


  if (
    registration &&
    outRegistration
  ) {

    outRegistration.textContent =
      registration.value.trim();

  }


  // =======================================================
  // ID P3H OTOMATIS
  // =======================================================

  const idP3H =
    $("outIdP3H");

  const registrationValue =
    $("registration");


  if (
    idP3H &&
    registrationValue
  ) {

    const reg =
      registrationValue.value.trim();


    if (reg) {

      idP3H.textContent =
        "ID-P3H-" +
        reg;

    }

    else {

      idP3H.textContent =
        "ID-P3H-";

    }

  }


  // =======================================================
  // NOMOR WHATSAPP
  // =======================================================

  const whatsappInput =
    $("whatsapp");

  const outWhatsapp =
    $("outWhatsapp");


  let whatsappRaw =
    "";


  if (whatsappInput) {

    whatsappRaw =
      whatsappInput.value
        .replace(
          /\D/g,
          ""
        );

  }


  // =======================================================
  // NORMALISASI TAMPILAN NOMOR
  // =======================================================

  if (
    whatsappRaw.startsWith("62")
  ) {

    whatsappRaw =
      "0" +
      whatsappRaw.slice(2);

  }

  else if (
    whatsappRaw.startsWith("8")
  ) {

    whatsappRaw =
      "0" +
      whatsappRaw;

  }


  let whatsappDisplay =
    whatsappRaw;


  // =======================================================
  // FORMAT NOMOR
  // =======================================================

  if (
    whatsappRaw.length > 4 &&
    whatsappRaw.length <= 8
  ) {

    whatsappDisplay =
      whatsappRaw.slice(0, 4) +
      "-" +
      whatsappRaw.slice(4);

  }

  else if (
    whatsappRaw.length > 12
  ) {

    whatsappDisplay =
      whatsappRaw.slice(0, 4) +
      "-" +
      whatsappRaw.slice(4, 8) +
      "-" +
      whatsappRaw.slice(8, 12) +
      "-" +
      whatsappRaw.slice(12, 16);

  }

  else if (
    whatsappRaw.length > 8
  ) {

    whatsappDisplay =
      whatsappRaw.slice(0, 4) +
      "-" +
      whatsappRaw.slice(4, 8) +
      "-" +
      whatsappRaw.slice(8, 12);

  }


  if (outWhatsapp) {

    outWhatsapp.textContent =
      whatsappDisplay;

  }


  // =======================================================
  // WILAYAH
  // =======================================================

  const area =
    $("area");

  const outArea =
    $("outArea");


  if (
    area &&
    outArea
  ) {

    outArea.textContent =
      area.value.trim();

  }


  // =======================================================
  // TANGGAL
  // =======================================================

  const validFrom =
    $("validFrom");

  const outDate =
    $("outDate");


  if (
    validFrom &&
    outDate
  ) {

    outDate.textContent =
      formatDate(
        validFrom.value
      );

  }


  // =======================================================
  // QR CODE
  // =======================================================

  generateQRCode(
    whatsappRaw
  );


  // =======================================================
  // SESUAIKAN SKALA
  // =======================================================

  adjustCardScale();

}


// =========================================================
// GENERATE QR CODE
// =========================================================

function generateQRCode(
  whatsappRaw
) {

  const qrBox =
    $("qrCode");


  if (!qrBox) return;


  // Bersihkan QR lama

  qrBox.innerHTML =
    "";


  const wa =
    normalizeWhatsApp(
      whatsappRaw
    );


  if (
    !wa ||
    typeof QRCode ===
    "undefined"
  ) {

    return;

  }


  let url =
    "https://wa.me/" +
    wa;


  // =======================================================
  // PESAN WHATSAPP
  // =======================================================

  const messageInput =
    $("waMessage");


  if (messageInput) {

    const message =
      messageInput.value.trim();


    if (message) {

      url +=
        "?text=" +
        encodeURIComponent(
          message
        );

    }

  }


  // =======================================================
  // BUAT QR
  // =======================================================

  try {

    new QRCode(
      qrBox,
      {

        text:
          url,

        width:
          160,

        height:
          160,

        colorDark:
          "#0b4a36",

        colorLight:
          "#ffffff",

        correctLevel:
          QRCode.CorrectLevel.H

      }
    );


    // =====================================================
    // PAKSA QR HANYA SATU ELEMEN
    // =====================================================

    const qrImg =
      qrBox.querySelector(
        "img"
      );

    const qrCanvas =
      qrBox.querySelector(
        "canvas"
      );


    if (qrCanvas) {

      qrCanvas.style.display =
        "block";

      qrCanvas.style.width =
        "100%";

      qrCanvas.style.height =
        "100%";


      if (qrImg) {

        qrImg.style.display =
          "none";

      }

    }

    else if (qrImg) {

      qrImg.style.display =
        "block";

      qrImg.style.width =
        "100%";

      qrImg.style.height =
        "100%";

    }

  }

  catch (error) {

    console.error(
      "QR Code gagal dibuat:",
      error
    );

  }

}


// =========================================================
// FOTO
// =========================================================

const photoInput =
  $("photo");

const photoPreview =
  $("photoPreview");

const photoZoom =
  $("photoZoom");

const resetPhoto =
  $("resetPhoto");


let photoScale =
  1;

let photoX =
  0;

let photoY =
  0;


let pointers =
  new Map();

let lastPinchDistance =
  null;

let lastPanX =
  0;

let lastPanY =
  0;


// =========================================================
// BATAS FOTO
// =========================================================

function limitPhotoPosition() {

  const frame =
    document.querySelector(
      ".photo-frame"
    );


  if (!frame) return;


  const frameWidth =
    frame.clientWidth;

  const frameHeight =
    frame.clientHeight;


  const maxX =
    Math.max(
      0,
      (
        frameWidth *
        photoScale -
        frameWidth
      ) / 2
    );


  const maxY =
    Math.max(
      0,
      (
        frameHeight *
        photoScale -
        frameHeight
      ) / 2
    );


  photoX =
    Math.max(
      -maxX,
      Math.min(
        maxX,
        photoX
      )
    );


  photoY =
    Math.max(
      -maxY,
      Math.min(
        maxY,
        photoY
      )
    );

}


// =========================================================
// TERAPKAN TRANSFORMASI FOTO
// =========================================================

function applyPhotoTransform() {

  if (!photoPreview) return;


  limitPhotoPosition();


  photoPreview.style.transform =
    `translate(${photoX}px, ${photoY}px) scale(${photoScale})`;

}


// =========================================================
// JARAK PINCH
// =========================================================

function getPointerDistance() {

  const values =
    Array.from(
      pointers.values()
    );


  if (
    values.length < 2
  ) {

    return 0;

  }


  const p1 =
    values[0];

  const p2 =
    values[1];


  const dx =
    p1.x -
    p2.x;

  const dy =
    p1.y -
    p2.y;


  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}


// =========================================================
// UPLOAD FOTO
// =========================================================

if (photoInput) {

  photoInput.addEventListener(
    "change",
    function(event) {

      const file =
        event.target.files[0];


      if (!file) return;


      const reader =
        new FileReader();


      reader.onload =
        function() {

          if (!photoPreview) {
            return;
          }


          photoPreview.src =
            reader.result;


          photoPreview.style.display =
            "block";


          photoScale =
            1;

          photoX =
            0;

          photoY =
            0;


          if (photoZoom) {

            photoZoom.value =
              1;

          }


          applyPhotoTransform();

        };


      reader.readAsDataURL(
        file
      );

    }
  );

}


// =========================================================
// ZOOM SLIDER
// =========================================================

if (photoZoom) {

  photoZoom.addEventListener(
    "input",
    function() {

      photoScale =
        parseFloat(
          this.value
        ) || 1;


      limitPhotoPosition();


      applyPhotoTransform();

    }
  );

}


// =========================================================
// RESET FOTO
// =========================================================

if (resetPhoto) {

  resetPhoto.addEventListener(
    "click",
    function() {

      photoScale =
        1;

      photoX =
        0;

      photoY =
        0;


      if (photoZoom) {

        photoZoom.value =
          1;

      }


      applyPhotoTransform();

    }
  );

}


// =========================================================
// GESER + PINCH FOTO
// =========================================================

if (photoPreview) {


  photoPreview.addEventListener(
    "pointerdown",
    function(event) {

      event.preventDefault();


      this.setPointerCapture(
        event.pointerId
      );


      pointers.set(
        event.pointerId,
        {
          x:
            event.clientX,

          y:
            event.clientY
        }
      );


      if (
        pointers.size === 1
      ) {

        lastPanX =
          event.clientX;

        lastPanY =
          event.clientY;

      }


      if (
        pointers.size === 2
      ) {

        lastPinchDistance =
          getPointerDistance();

      }

    }
  );


  photoPreview.addEventListener(
    "pointermove",
    function(event) {

      if (
        !pointers.has(
          event.pointerId
        )
      ) {

        return;

      }


      event.preventDefault();


      pointers.set(
        event.pointerId,
        {
          x:
            event.clientX,

          y:
            event.clientY
        }
      );


      if (
        pointers.size === 2
      ) {

        const currentDistance =
          getPointerDistance();


        if (
          lastPinchDistance
        ) {

          const difference =
            currentDistance -
            lastPinchDistance;


          photoScale +=
            difference *
            0.005;


          photoScale =
            Math.max(
              1,
              Math.min(
                3,
                photoScale
              )
            );


          if (photoZoom) {

            photoZoom.value =
              photoScale;

          }


          applyPhotoTransform();

        }


        lastPinchDistance =
          currentDistance;


        return;

      }


      if (
        pointers.size === 1
      ) {

        const dx =
          event.clientX -
          lastPanX;


        const dy =
          event.clientY -
          lastPanY;


        photoX +=
          dx;

        photoY +=
          dy;


        lastPanX =
          event.clientX;

        lastPanY =
          event.clientY;


        applyPhotoTransform();

      }

    }
  );


  photoPreview.addEventListener(
    "pointerup",
    function(event) {

      pointers.delete(
        event.pointerId
      );


      if (
        pointers.size < 2
      ) {

        lastPinchDistance =
          null;

      }

    }
  );


  photoPreview.addEventListener(
    "pointercancel",
    function(event) {

      pointers.delete(
        event.pointerId
      );


      if (
        pointers.size < 2
      ) {

        lastPinchDistance =
          null;

      }

    }
  );

}


// =========================================================
// TOMBOL UPDATE
// =========================================================

const updateBtn =
  $("updateBtn");


if (updateBtn) {

  updateBtn.addEventListener(
    "click",
    function() {

      updateCard();

    }
  );

}


// =========================================================
// FORMAT NOMOR SAAT DIKETIK
// =========================================================

const whatsappField =
  $("whatsapp");


if (whatsappField) {

  whatsappField.addEventListener(
    "input",
    function() {

      let value =
        this.value.replace(
          /\D/g,
          ""
        );


      if (
        value.length > 4 &&
        value.length <= 8
      ) {

        value =
          value.slice(0, 4) +
          "-" +
          value.slice(4);

      }

      else if (
        value.length > 12
      ) {

        value =
          value.slice(0, 4) +
          "-" +
          value.slice(4, 8) +
          "-" +
          value.slice(8, 12) +
          "-" +
          value.slice(12, 16);

      }

      else if (
        value.length > 8
      ) {

        value =
          value.slice(0, 4) +
          "-" +
          value.slice(4, 8) +
          "-" +
          value.slice(8, 12);

      }


      this.value =
        value;

    }
  );

}


// =========================================================
// TUNGGU
// =========================================================

function wait(ms) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}


// =========================================================
// TUNGGU QR SIAP
// =========================================================

async function waitForQRCode() {

  const qrBox =
    $("qrCode");


  if (!qrBox) {

    return;

  }


  for (
    let i = 0;
    i < 30;
    i++
  ) {

    const canvas =
      qrBox.querySelector(
        "canvas"
      );

    const img =
      qrBox.querySelector(
        "img"
      );


    if (
      canvas ||
      img
    ) {

      await wait(250);

      return;

    }


    await wait(100);

  }

}


// =========================================================
// PERSIAPAN KARTU SEBELUM RENDER
// =========================================================

async function prepareCardForRender() {

  updateCard();

  await waitForQRCode();

  await wait(300);

  applyPhotoTransform();

  await new Promise(
    resolve =>
      requestAnimationFrame(
        () => resolve()
      )
  );

}


// =========================================================
// KONFIGURASI HTML2CANVAS
// =========================================================

function getCanvasOptions() {

  return {

    scale:
      6,

    useCORS:
      true,

    allowTaint:
      false,

    backgroundColor:
      "#ffffff",

    imageTimeout:
      0,

    logging:
      false,

    removeContainer:
      true,

    scrollX:
      0,

    scrollY:
      0

  };

}


// =========================================================
// RENDER KARTU (DENGAN RESET SKALA SEMENTARA)
// =========================================================

async function renderCard(
  element
) {

  if (!element) {

    throw new Error(
      "Elemen kartu tidak ditemukan."
    );

  }


  await prepareCardForRender();


  const originalTransform =
    element.style.transform;

  element.style.transform =
    "scale(1)";


  try {

    await wait(100);


    const canvas =
      await html2canvas(
        element,
        getCanvasOptions()
      );


    return canvas;

  }

  finally {

    element.style.transform =
      originalTransform;

  }

}


// =========================================================
// DOWNLOAD FILE PNG
// =========================================================

function downloadCanvasPNG(
  canvas,
  filename
) {

  return new Promise(
    function(resolve, reject) {

      if (!canvas) {

        reject(
          new Error(
            "Canvas tidak tersedia."
          )
        );

        return;

      }


      canvas.toBlob(
        function(blob) {

          if (!blob) {

            reject(
              new Error(
                "Gagal membuat file PNG."
              )
            );

            return;

          }


          try {

            const url =
              URL.createObjectURL(
                blob
              );


            const link =
              document.createElement(
                "a"
              );


            link.href =
              url;

            link.download =
              filename;


            document.body.appendChild(
              link
            );


            link.click();


            link.remove();


            setTimeout(
              function() {

                URL.revokeObjectURL(
                  url
                );

              },
              1500
            );


            resolve();

          }

          catch (error) {

            reject(
              error
            );

          }

        },
        "image/png"
      );

    }
  );

}


// =========================================================
// DOWNLOAD PNG
// =========================================================

const pngBtn =
  $("pngBtn");


if (pngBtn) {

  pngBtn.addEventListener(
    "click",
    async function() {

      const btn =
        this;


      const originalText =
        btn.textContent;


      try {

        btn.disabled =
          true;


        btn.classList.add(
          "download-active"
        );


        btn.textContent =
          "Menyiapkan PNG...";


        if (
          typeof html2canvas ===
          "undefined"
        ) {

          throw new Error(
            "html2canvas belum siap."
          );

        }


        const front =
          document.querySelector(
            ".front-card"
          );

        const back =
          document.querySelector(
            ".back-card"
          );


        if (
          !front ||
          !back
        ) {

          throw new Error(
            "Kartu depan atau belakang tidak ditemukan."
          );

        }


        btn.textContent =
          "Membuat PNG depan...";


        const canvasFront =
          await renderCard(
            front
          );


        await downloadCanvasPNG(
          canvasFront,
          "Kartu-P3H-Depan.png"
        );


        await wait(800);


        btn.textContent =
          "Membuat PNG belakang...";


        const canvasBack =
          await renderCard(
            back
          );


        await downloadCanvasPNG(
          canvasBack,
          "Kartu-P3H-Belakang.png"
        );


        btn.textContent =
          "✓ PNG Berhasil";

      }

      catch (error) {

        console.error(
          "PNG ERROR:",
          error
        );


        alert(
          "Gagal membuat PNG.\n\n" +
          error.message
        );


        btn.textContent =
          "Download Gagal";

      }

      finally {

        setTimeout(
          function() {

            btn.classList.remove(
              "download-active"
            );


            btn.disabled =
              false;


            btn.textContent =
              originalText;

          },
          2000
        );

      }

    }
  );

}


// =========================================================
// DOWNLOAD PDF
// =========================================================

const pdfBtn =
  $("pdfBtn");


if (pdfBtn) {

  pdfBtn.addEventListener(
    "click",
    async function() {

      const btn =
        this;


      const originalText =
        btn.textContent;


      try {

        btn.disabled =
          true;


        btn.classList.add(
          "download-active"
        );


        btn.textContent =
          "Menyiapkan PDF...";


        if (
          typeof html2canvas ===
          "undefined"
        ) {

          throw new Error(
            "html2canvas belum siap."
          );

        }


        if (
          typeof window.jspdf ===
          "undefined"
        ) {

          throw new Error(
            "jsPDF belum siap."
          );

        }


        const front =
          document.querySelector(
            ".front-card"
          );

        const back =
          document.querySelector(
            ".back-card"
          );


        if (
          !front ||
          !back
        ) {

          throw new Error(
            "Kartu depan atau belakang tidak ditemukan."
          );

        }


        const CARD_WIDTH =
          85.60;

        const CARD_HEIGHT =
          53.98;


        const {
          jsPDF
        } =
          window.jspdf;


        const pdf =
          new jsPDF({

            orientation:
              "landscape",

            unit:
              "mm",

            format: [
              CARD_WIDTH,
              CARD_HEIGHT
            ],

            compress:
              true

          });


        btn.textContent =
          "Membuat PDF depan...";


        const canvasFront =
          await renderCard(
            front
          );


        const imageFront =
          canvasFront.toDataURL(
            "image/png"
          );


        pdf.addImage(

          imageFront,

          "PNG",

          0,

          0,

          CARD_WIDTH,

          CARD_HEIGHT,

          undefined,

          "FAST"

        );


        btn.textContent =
          "Membuat PDF belakang...";


        const canvasBack =
          await renderCard(
            back
          );


        const imageBack =
          canvasBack.toDataURL(
            "image/png"
          );


        pdf.addPage(

          [
            CARD_WIDTH,
            CARD_HEIGHT
          ],

          "landscape"

        );


        pdf.addImage(

          imageBack,

          "PNG",

          0,

          0,

          CARD_WIDTH,

          CARD_HEIGHT,

          undefined,

          "FAST"

        );


        btn.textContent =
          "Menyimpan PDF...";


        pdf.save(
          "Kartu-P3H-Depan-Belakang.pdf"
        );


        btn.textContent =
          "✓ PDF Berhasil";

      }

      catch (error) {

        console.error(
          "PDF ERROR:",
          error
        );


        alert(
          "Gagal membuat PDF.\n\n" +
          error.message
        );


        btn.textContent =
          "Download Gagal";

      }

      finally {

        setTimeout(
          function() {

            btn.classList.remove(
              "download-active"
            );


            btn.disabled =
              false;


            btn.textContent =
              originalText;

          },
          2000
        );

      }

    }
  );

}


// =========================================================
// EVENT LISTENER FORM INPUT
// =========================================================

const waMessage =
  $("waMessage");

if (waMessage) {
  waMessage.addEventListener("input", updateCard);
}

const nameInput =
  $("name");

if (nameInput) {
  nameInput.addEventListener("input", updateCard);
}

const registrationInput =
  $("registration");

if (registrationInput) {
  registrationInput.addEventListener("input", updateCard);
}

const areaInput =
  $("area");

if (areaInput) {
  areaInput.addEventListener("input", updateCard);
}

const validFromInput =
  $("validFrom");

if (validFromInput) {
  validFromInput.addEventListener("change", updateCard);
}


// =========================================================
// INISIALISASI AWAL
// =========================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCard();

  }
);

updateCard();