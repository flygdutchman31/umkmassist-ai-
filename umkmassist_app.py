import streamlit as st
from datetime import datetime
import random

st.set_page_config(page_title="UMKMAssist AI", page_icon="🤖", layout="wide")

# Custom CSS - Modern & Bright
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    .main {
        background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
    }
    
    h1 {
        color: #1e293b;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    
    .stChatMessage {
        background: white;
        border-radius: 16px;
        padding: 12px 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    
    .stButton>button {
        background: #4f46e5;
        color: white;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        padding: 0.6rem 1.2rem;
    }
    
    .stButton>button:hover {
        background: #4338ca;
    }
    
    .stTextInput>div>div>input, .stTextArea>div>div>textarea {
        border-radius: 12px;
        border: 1px solid #e2e8f0;
    }
    
    div[data-testid="stForm"] {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
</style>
""", unsafe_allow_html=True)

# Session state
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
    
    for faq in biz["faqs"]:
        if any(word in msg for word in faq["q"].split()):
            return faq["a"]
    
    if any(word in msg for word in ["menu", "makanan", "minuman", "harga", "produk"]):
        text = "**Menu kami:**\n\n"
        for p in biz["products"]:
            text += f"• **{p['name']}** — Rp {p['price']:,}\n"
        return text
    
    if any(word in msg for word in ["pesan", "order", "booking", "beli"]):
        return "Silakan isi form di bawah untuk memesan. Kami akan segera menghubungi Anda."
    
    responses = [
        "Baik, ada yang bisa saya bantu?",
        "Bisa dijelaskan lebih detail?",
        "Saya siap membantu pesanan atau pertanyaan Anda."
    ]
    return random.choice(responses)

# Sidebar
with st.sidebar:
    st.markdown("### ⚙️ Pengaturan Bisnis")
    biz = st.session_state.business
    biz["name"] = st.text_input("Nama Usaha", biz["name"])
    
    st.markdown("**Produk**")
    product_text = st.text_area(
        "Nama - Harga",
        value="\n".join([f"{p['name']} - {p['price']}" for p in biz["products"]]),
        height=110,
        label_visibility="collapsed"
    )
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
    
    st.markdown("**FAQ**")
    faq_text = st.text_area(
        "pertanyaan | jawaban",
        value="\n".join([f"{f['q']} | {f['a']}" for f in biz["faqs"]]),
        height=90,
        label_visibility="collapsed"
    )
    new_faqs = []
    for line in faq_text.split("\n"):
        if " | " in line:
            q, a = line.split(" | ", 1)
            new_faqs.append({"q": q.strip(), "a": a.strip()})
    if new_faqs:
        biz["faqs"] = new_faqs

# Header
st.markdown(f"# 🤖 {st.session_state.business['name']}")
st.markdown("Asisten AI untuk UMKM — jawab pertanyaan & catat pesanan otomatis.")

# Chat
st.markdown("### 💬 Chat Simulator")
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Ketik pesan pelanggan..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    response = get_ai_response(prompt)
    st.session_state.messages.append({"role": "assistant", "content": response})
    st.rerun()

# Booking
st.markdown("### 📋 Booking / Lead Capture")
with st.form("booking_form", clear_on_submit=True):
    c1, c2 = st.columns(2)
    with c1:
        nama = st.text_input("Nama Pelanggan")
        jumlah = st.number_input("Jumlah", min_value=1, value=1)
    with c2:
        pesanan = st.text_input("Pesanan / Keperluan")
        catatan = st.text_input("Catatan (opsional)")
    
    if st.form_submit_button("Simpan Pesanan", use_container_width=True) and nama and pesanan:
        lead = {
            "waktu": datetime.now().strftime("%d %b %Y, %H:%M"),
            "nama": nama,
            "pesanan": pesanan,
            "jumlah": jumlah,
            "catatan": catatan
        }
        st.session_state.business["leads"].append(lead)
        st.success(f"Pesanan dari **{nama}** berhasil dicatat!")

# Leads
if st.session_state.business["leads"]:
    st.markdown("### 📊 Daftar Pesanan")
    for lead in reversed(st.session_state.business["leads"]):
        st.markdown(f"**{lead['waktu']}** — {lead['nama']} • {lead['pesanan']} (x{lead['jumlah']})")

st.caption("UMKMAssist AI • Versi Demo")