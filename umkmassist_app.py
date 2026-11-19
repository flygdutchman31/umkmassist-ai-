import streamlit as st
from datetime import datetime
import random
import json

st.set_page_config(
    page_title="UMKMAssist AI",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Modern light theme
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .stApp { background: #f1f5f9; }
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; color: #0f172a; }
    h1, h2, h3 { color: #0f172a !important; font-weight: 700; }
    .stTextInput input, .stTextArea textarea, .stNumberInput input {
        background: white !important; color: #0f172a !important;
        border: 1px solid #cbd5e1 !important; border-radius: 10px !important;
    }
    .stButton button {
        background: #2563eb !important; color: white !important;
        border-radius: 10px !important; font-weight: 600 !important; border: none !important;
    }
    div[data-testid="stForm"] {
        background: white; padding: 1.5rem; border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

# Multi business via kode
if "kode" not in st.session_state:
    st.session_state.kode = "demo"

if "data" not in st.session_state:
    st.session_state.data = {}

def get_biz():
    kode = st.session_state.kode
    if kode not in st.session_state.data:
        st.session_state.data[kode] = {
            "name": "Usaha Saya",
            "products": [{"name": "Produk 1", "price": 10000}],
            "faqs": [{"q": "jam buka", "a": "08.00 - 21.00"}],
            "leads": [],
            "messages": []
        }
    return st.session_state.data[kode]

biz = get_biz()

def ai_reply(msg):
    m = msg.lower()
    for f in biz["faqs"]:
        if any(w in m for w in f["q"].split()):
            return f["a"]
    if any(w in m for w in ["menu", "harga", "produk", "makanan"]):
        txt = "**Menu:**\n\n"
        for p in biz["products"]:
            txt += f"• {p['name']} — Rp {p['price']:,}\n"
        return txt
    if any(w in m for w in ["pesan", "order", "beli", "booking"]):
        return "Silakan isi form booking di bawah untuk memesan."
    return random.choice(["Ada yang bisa dibantu?", "Bisa dijelaskan lebih detail?", "Siap membantu!"])

# Sidebar
with st.sidebar:
    st.markdown("### 🏪 UMKMAssist")
    new_kode = st.text_input("Kode Usaha", st.session_state.kode)
    if new_kode != st.session_state.kode:
        st.session_state.kode = new_kode
        st.rerun()
    
    st.divider()
    biz["name"] = st.text_input("Nama Usaha", biz["name"])
    
    st.markdown("**Produk**")
    prod_txt = st.text_area("Nama - Harga", 
        "\n".join(f"{p['name']} - {p['price']}" for p in biz["products"]), height=100)
    prods = []
    for line in prod_txt.splitlines():
        if " - " in line:
            try:
                n, p = line.split(" - ", 1)
                prods.append({"name": n.strip(), "price": int(p.strip())})
            except: pass
    if prods: biz["products"] = prods
    
    st.markdown("**FAQ**")
    faq_txt = st.text_area("tanya | jawab",
        "\n".join(f"{f['q']} | {f['a']}" for f in biz["faqs"]), height=80)
    faqs = []
    for line in faq_txt.splitlines():
        if " | " in line:
            q, a = line.split(" | ", 1)
            faqs.append({"q": q.strip(), "a": a.strip()})
    if faqs: biz["faqs"] = faqs

# Main
st.title(f"🤖 {biz['name']}")
st.caption("Asisten AI untuk UMKM • Siap dipakai pelanggan")

col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("💬 Chat Pelanggan")
    for m in biz["messages"]:
        with st.chat_message(m["role"]):
            st.markdown(m["content"])
    
    if prompt := st.chat_input("Tulis pesan..."):
        biz["messages"].append({"role": "user", "content": prompt})
        biz["messages"].append({"role": "assistant", "content": ai_reply(prompt)})
        st.rerun()

with col2:
    st.subheader("📋 Booking")
    with st.form("form", clear_on_submit=True):
        nama = st.text_input("Nama")
        pesanan = st.text_input("Pesanan")
        jumlah = st.number_input("Jumlah", 1, value=1)
        catatan = st.text_input("Catatan")
        if st.form_submit_button("Simpan", use_container_width=True) and nama and pesanan:
            biz["leads"].append({
                "waktu": datetime.now().strftime("%d/%m %H:%M"),
                "nama": nama, "pesanan": pesanan, "jumlah": jumlah, "catatan": catatan
            })
            st.success("Tercatat!")

if biz["leads"]:
    st.subheader("📊 Pesanan Masuk")
    for l in reversed(biz["leads"]):
        st.write(f"**{l['waktu']}** — {l['nama']} • {l['pesanan']} (x{l['jumlah']})")

st.divider()
st.caption("Bagikan link ini ke pelanggan • Ganti Kode Usaha di sidebar untuk usaha berbeda")
        
    
   
    
        