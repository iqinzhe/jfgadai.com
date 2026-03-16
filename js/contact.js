const adminPhone = "6289515692586";

function buildWA(message){
return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}


/* ================= KONSULTASI GADAI ================= */

document.getElementById("pawnForm").addEventListener("submit",function(e){

e.preventDefault();

const name = pawnName.value;
const phone = pawnPhone.value;
const item = pawnItem.value;
const desc = pawnDesc.value;
const msg = pawnMsg.value;

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

window.open(buildWA(message),"_blank");

});


/* ================= KEMITRAAN ================= */

document.getElementById("franchiseForm").addEventListener("submit",function(e){

e.preventDefault();

const name = franchiseName.value;
const phone = franchisePhone.value;
const city = franchiseCity.value;
const invest = franchiseInvest.value;
const msg = franchiseMsg.value;

const message =
`Halo JF Gadai, saya tertarik kemitraan bisnis.

Nama: ${name}
WA: ${phone}
Kota: ${city}

Rencana Investasi: ${invest}

Pesan:
${msg}`;

window.open(buildWA(message),"_blank");

});