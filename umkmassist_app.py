import streamlit as st
import json
from datetime import datetime
import random

st.set_page_config(page_title="UMKMAssist AI", page_icon="🤖", layout="wide")

if "messages" not in st.session_state:
    st.session_state.messages = []
if "business" not in st.session_state:
    st.session_state.business = {
        "name": "Warung Makan Bu Sari",
        "type": "Warung Makan",
        "hours": "08:00 - 21:00",
        "phone": "0812-3456-7890",
        "address": "Jl. Merdeka No. 10, Jakarta",
        "products": [
            {"name": "Nasi Goreng Spesial", "price": "25.000", "desc": "Nasi goreng dengan telur, ayam, dan sayur"},
            {"name": "Mie Ayam Bakso", "price": "22.000", "desc": "Mie ayam dengan bakso dan pangsit"},
            {"name": "Es Teh Manis", "price": "8.000", "desc": "Es teh manis segar"}
        ],
        "faqs": [
            {"q": "buka jam berapa", "a": "Kami buka setiap hari pukul 08:00 sampai 21:00."},
            {"q": "ada delivery", "a": "Ya, kami melayani delivery via Gojek/Grab. Ongkir menyesuaikan jarak."},
            {"q": "metode pembayaran", "a": "Transfer BCA/Mandiri, QRIS, atau COD."}
        ]
    }
if "leads" not in st.session_state:
    st.session_state.leads = []

def get_ai_response(user_msg, business):
    msg = user_msg.lower()
    for faq in business["faqs"]:
        if any(word in msg for word in faq["q"].split()):
            return faq["a"]
    
    if any(k in msg for k in ["menu", "harga", "apa aja", "produk", "jual"]):
        reply = f"Halo! Berikut menu di {business['name']}:\n\n"
        for p in business["products"]:
            reply += f"• {p['name']} - Rp{p['price']}\n  {p['desc']}\n"
        reply += "\nMau pesan yang mana? Atau ada pertanyaan lain?"
        return reply
    
    if any(k in msg for k in ["pesan", "order", "booking", "reservasi", "ambil"]):
        return "Siap! Silakan isi form booking di sidebar atau ketik detail pesanan (nama, item, jumlah, alamat). Kami akan konfirmasi segera. 😊"
    
    if any(k in msg for k in ["alamat", "lokasi", "dimana"]):
        return f"Alamat kami: {business['address']}. Buka {business['hours']}."
    
    if any(k in msg for k in ["kontak", "nomor", "wa", "telepon"]):
        return f"Nomor WhatsApp kami: {business['phone']}. Bisa chat langsung atau lewat asisten AI ini 24 jam!"
    
    responses = [
        f"Terima kasih sudah menghubungi {business['name']}! Ada yang bisa saya bantu?",
        "Baik, saya catat. Bisa tolong detail lebih lanjut?",
        "Kami siap membantu 24/7. Mau tanya menu, pesan, atau info lainnya?"
    ]
    return random.choice(responses)

# Sidebar - Business Setup
with st.sidebar:
    st.title("⚙️ Setup Bisnis")
    st.session_state.business["name"] = st.text_input("Nama Bisnis", st.session_state.business["name"])
    st.session_state.business["type"] = st.text_input("Jenis Usaha", st.session_state.business["type"])
    st.session_state.business["hours"] = st.text_input("Jam Operasional", st.session_state.business["hours"])
    st.session_state.business["phone"] = st.text_input("No. WhatsApp", st.session_state.business["phone"])
    st.session_state.business["address"] = st.text_area("Alamat", st.session_state.business["address"])
    
    st.subheader("Tambah Produk")
    new_prod = st.text_input("Nama Produk")
    new_price = st.text_input("Harga")
    new_desc = st.text_input("Deskripsi")
    if st.button("Tambah Produk") and new_prod:
        st.session_state.business["products"].append({"name": new_prod, "price": new_price, "desc": new_desc})
        st.success("Produk ditambahkan!")
    
    st.subheader("Tambah FAQ")
    faq_q = st.text_input("Pertanyaan (keyword)")
    faq_a = st.text_area("Jawaban")
    if st.button("Tambah FAQ") and faq_q:
        st.session_state.business["faqs"].append({"q": faq_q, "a": faq_a})
        st.success("FAQ ditambahkan!")

# Main UI
st.title("🤖 UMKMAssist AI")
st.markdown("**Asisten AI 24/7 untuk UMKM** — Layani pelanggan, jawab FAQ, ambil pesanan & booking otomatis. Siap integrasi WhatsApp Business.")

col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("💬 Chat Simulator (seperti di WhatsApp)")
    for msg in st.session_state.messages:
        if msg["role"] == "user":
            st.chat_message("user").write(msg["content"])
        else:
            st.chat_message("assistant").write(msg["content"])
    
    if prompt := st.chat_input("Ketik pesan pelanggan..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        response = get_ai_response(prompt, st.session_state.business)
        st.session_state.messages.append({"role": "assistant", "content": response})
        st.rerun()

with col2:
    st.subheader("📋 Booking / Lead Capture")
    with st.form("booking"):
        nama = st.text_input("Nama Pelanggan")
        item = st.text_input("Pesanan / Keperluan")
        jumlah = st.number_input("Jumlah", 1, 100, 1)
        alamat = st.text_area("Alamat / Catatan")
        submitted = st.form_submit_button("Simpan Pesanan")
        if submitted and nama:
            lead = {
                "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "nama": nama,
                "item": item,
                "jumlah": jumlah,
                "alamat": alamat
            }
            st.session_state.leads.append(lead)
            st.success("Pesanan tersimpan! Siap di-follow up.")
    
    st.subheader("📊 Leads Hari Ini")
    if st.session_state.leads:
        for lead in reversed(st.session_state.leads[-5:]):
            st.info(f"{lead['time']} - {lead['nama']}: {lead['item']}")
    else:
        st.write("Belum ada pesanan.")

st.markdown("---")
st.markdown("""
### 🚀 Cara Release & Monetisasi
1. **Deploy gratis** di Streamlit Community Cloud (share.streamlit.io) dari GitHub.
2. Integrasikan dengan **WhatsApp Cloud API** atau Meta Business Agent untuk chat real.
3. Ganti fungsi `get_ai_response` dengan LLM (Grok / OpenAI / Gemini) untuk jawaban lebih pintar.
4. Pricing: Free (basic FAQ) → Rp149.000/bulan (full AI + booking + analytics).
5. Target: 65+ juta UMKM Indonesia. Bahkan 0,01% sudah market besar.

**Demo siap release besok pagi.** Terima beres!

""")

st.caption("UMKMAssist AI MVP v1.0 | Dibangun dalam 1 sesi | Analisis-Plan-Eksekusi-Test-Deploy")
