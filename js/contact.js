// contact.js - Gabungan dari kode lama dan baru

const adminPhone = "6289515692586";

function buildWA(message) {
  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}

// Fungsi untuk memastikan semua elemen form sudah tersedia
function getElementSafe(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Element with id "${id}" not found`);
  return el;
}

// Inisialisasi setelah DOM siap
document.addEventListener("DOMContentLoaded", function() {
  
  /* ================= KONSULTASI GADAI ================= */
  const pawnForm = getElementSafe("pawnForm");
  if (pawnForm) {
    pawnForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const pawnName = getElementSafe("pawnName");
      const pawnPhone = getElementSafe("pawnPhone");
      const pawnItem = getElementSafe("pawnItem");
      const pawnDesc = getElementSafe("pawnDesc");
      const pawnMsg = getElementSafe("pawnMsg");

      // Validasi elemen penting
      if (!pawnName || !pawnPhone || !pawnItem || !pawnDesc) {
        alert("Terjadi kesalahan pada form. Silakan muat ulang halaman.");
        return;
      }

      const name = pawnName.value.trim();
      const phone = pawnPhone.value.trim();
      const item = pawnItem.value;
      const desc = pawnDesc.value.trim();
      const msg = pawnMsg ? pawnMsg.value.trim() : "";

      if (!name || !phone || !desc) {
        alert("Harap isi nama, nomor WhatsApp, dan deskripsi barang.");
        return;
      }

      const message = 
`Halo JF Gadai, saya ingin konsultasi gadai.

Nama: ${name}
WA: ${phone}

Barang: ${item}

Deskripsi:
${desc}

Pesan Tambahan:
${msg}

Mohon info taksiran pinjaman.`;

      window.open(buildWA(message), "_blank");
    });
  }

  /* ================= KEMITRAAN ================= */
  const franchiseForm = getElementSafe("franchiseForm");
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const franchiseName = getElementSafe("franchiseName");
      const franchisePhone = getElementSafe("franchisePhone");
      const franchiseCity = getElementSafe("franchiseCity");
      const franchiseInvest = getElementSafe("franchiseInvest");
      const franchiseMsg = getElementSafe("franchiseMsg");

      if (!franchiseName || !franchisePhone || !franchiseInvest) {
        alert("Terjadi kesalahan pada form. Silakan muat ulang halaman.");
        return;
      }

      const name = franchiseName.value.trim();
      const phone = franchisePhone.value.trim();
      const city = franchiseCity ? franchiseCity.value.trim() : "";
      const invest = franchiseInvest.value;
      const msg = franchiseMsg ? franchiseMsg.value.trim() : "";

      if (!name || !phone) {
        alert("Harap isi nama dan nomor WhatsApp.");
        return;
      }

      const message = 
`Halo JF Gadai, saya tertarik kemitraan bisnis.

Nama: ${name}
WA: ${phone}
Kota: ${city}

Rencana Investasi: ${invest}

Pesan:
${msg}`;

      window.open(buildWA(message), "_blank");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      item.classList.toggle("active");
    });

  });

});
