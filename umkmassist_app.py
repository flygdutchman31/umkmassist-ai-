import streamlit as st
import json
from datetime import datetime
import random

st.set_page_config(page_title="UMKMAssist AI", page_icon="🤖", layout="wide")

# Inisialisasi session state
if "business" not in st.session_state:
    st.session_state.business = {
        "name": "Warung Contoh",
        "products": [
            {"name": "Nasi Goreng", "price": 15000},
            {"name": "Mie Goreng", "price": 12000},
            {"name": "Es Teh", "price": 5000}
        ],
        "faqs": [
            {"q": "jam buka", "a": "Kami buka setiap hari pukul 08.00 - 21.00"},
            {"q": "alamat", "a": "Jl. Contoh No. 123, Jakarta"},
            {"q": "ongkir", "a": "Ongkir gratis untuk area sekitar 3 km"}
        ],
        "leads": []
    }

if "messages" not in st.session_state:
    st.session_state.messages = []

def get_ai_response(user_msg):
    msg = user_msg.lower()
    biz = st.session_state.business
    
    # Cek FAQ
    for faq in biz["faqs"]:
        if any(word in msg for word in faq["q"].split()):
            return faq["a"]
    
    # Cek menu / produk
    if any(word in msg for word in ["menu", "makanan", "minuman", "harga", "produk"]):
        text = "Ini menu kami:\n"
        for p in biz["products"]:
            text += f"• {p['name']} - Rp {p['price']:,}\n"
        return text
    
    # Pesan / order
    if any(word in msg for word in ["pesan", "order", "booking", "beli"]):
        return "Silakan isi form booking di bawah untuk memesan. Tim kami akan segera menghubungi Anda."
    
    # Default
    responses = [
        "Baik, ada yang bisa saya bantu?",
        "Bisa dijelaskan lebih detail?",
        "Saya siap membantu pesanan atau pertanyaan Anda."
    ]
    return random.choice(responses)

# Sidebar - Pengaturan Bisnis
with st.sidebar:
    st.header("⚙️ Pengaturan Bisnis")
    biz = st.session_state.business
    biz["name"] = st.text_input("Nama Usaha", biz["name"])
    
    st.subheader("Produk")
    product_text = st.text_area(
        "Daftar Produk (format: Nama - Harga)",
        value="\n".join([f"{p['name']} - {p['price']}" for p in biz["products"]]),
        height=120
    )
    # Parse produk
    new_products = []
    for line in product_text.split("\n"):
        if " - " in line:
            name, price = line.split(" - ", 1)
            try:
                new_products.append({"name": name.strip(), "price": int(price.strip())})
            except:
                pass
    if new_products:
        biz["products"] = new_products
    
    st.subheader("FAQ")
    faq_text = st.text_area(
        "FAQ (format: pertanyaan | jawaban)",
        value="\n".join([f"{f['q']} | {f['a']}" for f in biz["faqs"]]),
        height=100
    )
    new_faqs = []
    for line in faq_text.split("\n"):
        if " | " in line:
            q, a = line.split(" | ", 1)
            new_faqs.append({"q": q.strip(), "a": a.strip()})
    if new_faqs:
        biz["faqs"] = new_faqs

# Main
st.title(f"🤖 {st.session_state.business['name']}")
st.caption("Asisten AI 24/7 untuk UMKM — Layani pelanggan, jawab FAQ, ambil pesanan otomatis.")

# Chat
st.subheader("💬 Chat Simulator")
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

if prompt := st.chat_input("Ketik pesan pelanggan..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    response = get_ai_response(prompt)
    st.session_state.messages.append({"role": "assistant", "content": response})
    st.rerun()

# Booking Form
st.subheader("📋 Booking / Lead Capture")
with st.form("booking_form"):
    col1, col2 = st.columns(2)
    with col1:
        nama = st.text_input("Nama Pelanggan")
        jumlah = st.number_input("Jumlah", min_value=1, value=1)
    with col2:
        pesanan = st.text_input("Pesanan / Keperluan")
        catatan = st.text_input("Catatan (opsional)")
    
    submitted = st.form_submit_button("Simpan Pesanan", use_container_width=True)
    if submitted and nama and pesanan:
        lead = {
            "waktu": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "nama": nama,
            "pesanan": pesanan,
            "jumlah": jumlah,
            "catatan": catatan
        }
        st.session_state.business["leads"].append(lead)
        st.success(f"Pesanan dari {nama} berhasil dicatat!")

# Tampilkan Leads
if st.session_state.business["leads"]:
    st.subheader("📊 Daftar Pesanan")
    for lead in reversed(st.session_state.business["leads"]):
        st.write(f"**{lead['waktu']}** — {lead['nama']} | {lead['pesanan']} (x{lead['jumlah']})")

st.divider()
st.caption("Versi Demo • Data tersimpan selama sesi browser")
    

            