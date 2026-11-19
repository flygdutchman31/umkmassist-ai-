import streamlit as st
from datetime import datetime
import random

st.set_page_config(
    page_title="UMKMAssist AI", 
    page_icon="🤖", 
    layout="wide",
    initial_sidebar_state="expanded"
)

# Force light theme + modern style
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    .stApp {
        background: #f8fafc;
        color: #1e293b;
    }
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        color: #1e293b;
    }
    
    h1, h2, h3 {
        color: #0f172a !important;
        font-weight: 700;
    }
    
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea,
    .stNumberInput > div > div > input {
        background-color: white !important;
        color: #1e293b !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 12px !important;
    }
    
    .stButton > button {
        background-color: #4f46e5 !important;
        color: white !important;
        border-radius: 12px !important;
        font-weight: 600 !important;
        border: none !important;
    }
    
    .stButton > button:hover {
        background-color: #4338ca !important;
    }
    
    div[data-testid="stForm"] {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    
    .stChatMessage {
        background: white !important;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

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
    
    if any(word in msg for word in ["menu", "makanan", "harga", "produk"]):
        text = "**Menu kami:**\n\n"
        for p in biz["products"]:
            text += f"• **{p['name']}** — Rp {p['price']:,}\n"
        return text
    
    if any(word in msg for word in ["pesan", "order", "booking"]):
        return "Silakan isi form booking di bawah ya."
    
    return random.choice([
        "Baik, ada yang bisa saya bantu?",
        "Bisa dijelaskan lebih detail?",
        "Saya siap membantu."
    ])

with st.sidebar:
    st.markdown("### ⚙️ Pengaturan")
    biz = st.session_state.business
    biz["name"] = st.text_input("Nama Usaha", biz["name"])
    
    product_text = st.text_area("Produk (Nama - Harga)", 
        value="\n".join([f"{p['name']} - {p['price']}" for p in biz["products"]]), height=100)
    new_products = []
    for line in product_text.split("\n"):
        if " - " in line:
            try:
                name, price = line.split(" - ", 1)
                new_products.append({"name": name.strip(), "price": int(price.strip())})
            except: pass
    if new_products: biz["products"] = new_products

    faq_text = st.text_area("FAQ (tanya | jawab)", 
        value="\n".join([f"{f['q']} | {f['a']}" for f in biz["faqs"]]), height=90)
    new_faqs = []
    for line in faq_text.split("\n"):
        if " | " in line:
            q, a = line.split(" | ", 1)
            new_faqs.append({"q": q.strip(), "a": a.strip()})
    if new_faqs: biz["faqs"] = new_faqs

st.markdown(f"# 🤖 {st.session_state.business['name']}")
st.markdown("Asisten AI untuk UMKM")

st.markdown("### 💬 Chat")
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if prompt := st.chat_input("Ketik pesan..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.session_state.messages.append({"role": "assistant", "content": get_ai_response(prompt)})
    st.rerun()

st.markdown("### 📋 Booking")
with st.form("booking", clear_on_submit=True):
    c1, c2 = st.columns(2)
    with c1:
        nama = st.text_input("Nama Pelanggan")
        jumlah = st.number_input("Jumlah", 1, value=1)
    with c2:
        pesanan = st.text_input("Pesanan")
        catatan = st.text_input("Catatan")
    
    if st.form_submit_button("Simpan Pesanan", use_container_width=True) and nama and pesanan:
        st.session_state.business["leads"].append({
            "waktu": datetime.now().strftime("%d %b %H:%M"),
            "nama": nama, "pesanan": pesanan, "jumlah": jumlah, "catatan": catatan
        })
        st.success("Pesanan tercatat!")

if st.session_state.business["leads"]:
    st.markdown("### 📊 Pesanan Masuk")
    for lead in reversed(st.session_state.business["leads"]):
        st.write(f"**{lead['waktu']}** — {lead['nama']} • {lead['pesanan']} (x{lead['jumlah']})")



    