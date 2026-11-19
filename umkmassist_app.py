import streamlit as st
from datetime import datetime
import random
from supabase import create_client

# Supabase
SUPABASE_URL = "https://xzuypgesmwomkjxbllaa.supabase.co"
SUPABASE_KEY = "sb_publishable_RXOD1-hh6QH-m-9-MltkKA_XcBMJ2nl"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

st.set_page_config(page_title="UMKMAssist AI", page_icon="🤖", layout="wide")

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .stApp { background: #f8fafc; }
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; color: #0f172a; }
    .stButton button { background: #2563eb !important; color: white !important; border-radius: 10px !important; }
    div[data-testid="stForm"] { background: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
</style>
""", unsafe_allow_html=True)

if "kode" not in st.session_state:
    st.session_state.kode = "demo"

def load_biz(kode):
    res = supabase.table("businesses").select("*").eq("kode", kode).execute()
    if res.data:
        return res.data[0]
    else:
        new = {
            "kode": kode,
            "name": "Usaha Baru",
            "products": [{"name": "Produk 1", "price": 10000}],
            "faqs": [{"q": "jam buka", "a": "08.00 - 21.00"}],
            "leads": []
        }
        supabase.table("businesses").insert(new).execute()
        return new

def save_biz(biz):
    supabase.table("businesses").update({
        "name": biz["name"],
        "products": biz["products"],
        "faqs": biz["faqs"],
        "leads": biz["leads"]
    }).eq("kode", biz["kode"]).execute()

biz = load_biz(st.session_state.kode)

def ai_reply(msg):
    m = msg.lower()
    for f in biz.get("faqs", []):
        if any(w in m for w in f["q"].split()):
            return f["a"]
    if any(w in m for w in ["menu", "harga", "produk"]):
        txt = "**Menu:**\n\n"
        for p in biz.get("products", []):
            txt += f"• {p['name']} — Rp {p['price']:,}\n"
        return txt
    if any(w in m for w in ["pesan", "order", "beli"]):
        return "Silakan isi form booking di bawah."
    return random.choice(["Ada yang bisa dibantu?", "Bisa dijelaskan lebih detail?"])

with st.sidebar:
    st.header("UMKMAssist")
    new_kode = st.text_input("Kode Usaha", st.session_state.kode)
    if new_kode != st.session_state.kode:
        st.session_state.kode = new_kode
        st.rerun()
    
    biz["name"] = st.text_input("Nama Usaha", biz["name"])
    
    prod_txt = st.text_area("Produk (Nama - Harga)", 
        "\n".join(f"{p['name']} - {p['price']}" for p in biz.get("products", [])), height=100)
    prods = []
    for line in prod_txt.splitlines():
        if " - " in line:
            try:
                n, pr = line.split(" - ", 1)
                prods.append({"name": n.strip(), "price": int(pr.strip())})
            except: pass
    if prods: biz["products"] = prods
    
    if st.button("Simpan Pengaturan"):
        save_biz(biz)
        st.success("Tersimpan!")

st.title(f"🤖 {biz['name']}")
st.caption(f"Kode: {biz['kode']}")

if "messages" not in st.session_state:
    st.session_state.messages = []

st.subheader("💬 Chat")
for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.markdown(m["content"])

if prompt := st.chat_input("Pesan..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    reply = ai_reply(prompt)
    st.session_state.messages.append({"role": "assistant", "content": reply})
    st.rerun()

st.subheader("📋 Booking")
with st.form("book", clear_on_submit=True):
    nama = st.text_input("Nama")
    pesanan = st.text_input("Pesanan")
    jumlah = st.number_input("Jumlah", 1, value=1)
    if st.form_submit_button("Simpan Pesanan") and nama and pesanan:
        lead = {"waktu": datetime.now().strftime("%d/%m %H:%M"), "nama": nama, "pesanan": pesanan, "jumlah": jumlah}
        biz.setdefault("leads", []).append(lead)
        save_biz(biz)
        st.success("Pesanan tersimpan!")

if biz.get("leads"):
    st.subheader("📊 Pesanan")
    for l in reversed(biz["leads"]):
        st.write(f"**{l['waktu']}** — {l['nama']} • {l['pesanan']} (x{l['jumlah']})")


