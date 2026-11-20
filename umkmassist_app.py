import streamlit as st
from datetime import datetime
import random
from supabase import create_client

SUPABASE_URL = "https://xzuypgesmwomkjxbllaa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dXlwZ2VzbXdvbWtqeGJsbGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwNzAxMzcsImV4cCI6MjExMDY0NjEzN30.XlkkmvXFzN4uXn0-CNn7aCgxoHiO4LU_nkco4LAMxpQ"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

st.set_page_config(page_title="UMKMAssist AI", page_icon="✨", layout="wide")

# Modern Colorful Theme
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.stApp {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-attachment: fixed;
}

html, body, [class*="css"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.main .block-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 2rem;
    margin-top: 1rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    backdrop-filter: blur(10px);
}

h1 {
    background: linear-gradient(90deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800 !important;
    font-size: 2.5rem !important;
}

h2, h3 {
    color: #1e1b4b !important;
    font-weight: 700 !important;
}

.stButton > button {
    background: linear-gradient(90deg, #667eea, #764ba2) !important;
    color: white !important;
    border: none !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    padding: 0.6rem 1.5rem !important;
    transition: all 0.3s ease !important;
}

.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4) !important;
}

.stTextInput > div > div > input,
.stTextArea > div > div > textarea,
.stNumberInput > div > div > input {
    border-radius: 12px !important;
    border: 2px solid #e0e7ff !important;
    background: white !important;
}

.stTextInput > div > div > input:focus,
.stTextArea > div > div > textarea:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
}

div[data-testid="stForm"] {
    background: linear-gradient(135deg, #faf5ff, #f0f9ff);
    padding: 1.5rem;
    border-radius: 20px;
    border: 2px solid #e0e7ff;
}

.stTabs [data-baseweb="tab-list"] {
    gap: 8px;
    background: transparent;
}

.stTabs [data-baseweb="tab"] {
    background: white;
    border-radius: 12px;
    padding: 10px 20px;
    font-weight: 600;
    border: 2px solid #e0e7ff;
}

.stTabs [aria-selected="true"] {
    background: linear-gradient(90deg, #667eea, #764ba2) !important;
    color: white !important;
    border: none !important;
}

.stChatMessage {
    background: white !important;
    border-radius: 16px !important;
    border: 1px solid #e0e7ff !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
}

[data-testid="stMetric"] {
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 1rem;
    border-radius: 16px;
    color: white !important;
}

[data-testid="stMetric"] label {
    color: rgba(255,255,255,0.9) !important;
}

[data-testid="stMetric"] [data-testid="stMetricValue"] {
    color: white !important;
    font-weight: 700 !important;
}

.stSuccess {
    background: linear-gradient(90deg, #10b981, #34d399) !important;
    color: white !important;
    border-radius: 12px !important;
}
</style>
""", unsafe_allow_html=True)

if "kode" not in st.session_state:
    st.session_state.kode = "demo"

def load_biz(kode):
    try:
        res = supabase.table("businesses").select("*").eq("kode", kode).execute()
        if res.data:
            return res.data[0]
        new = {
            "kode": kode,
            "name": "Usaha Baru",
            "products": [{"name": "Produk Contoh", "price": 15000}],
            "faqs": [
                {"q": "jam buka", "a": "Kami buka setiap hari pukul 08.00 - 21.00"},
                {"q": "alamat", "a": "Hubungi kami untuk info lokasi"}
            ],
            "leads": []
        }
        supabase.table("businesses").insert(new).execute()
        return new
    except:
        return {"kode": kode, "name": "Usaha Baru", "products": [], "faqs": [], "leads": []}

def save_biz(biz):
    try:
        supabase.table("businesses").update({
            "name": biz["name"],
            "products": biz["products"],
            "faqs": biz["faqs"],
            "leads": biz["leads"]
        }).eq("kode", biz["kode"]).execute()
        return True
    except:
        return False

biz = load_biz(st.session_state.kode)

def smart_reply(msg):
    m = msg.lower().strip()
    products = biz.get("products", [])
    faqs = biz.get("faqs", [])
    
    for f in faqs:
        if any(w in m for w in f["q"].lower().split()):
            return f["a"]
    
    if any(w in m for w in ["menu", "harga", "produk", "daftar", "list"]):
        if not products:
            return "Belum ada produk nih 😊"
        text = "✨ **Menu Spesial Kami:**\n\n"
        for p in products:
            text += f"🍽️ **{p['name']}** — Rp {p['price']:,}\n"
        return text + "\nMau pesan yang mana? 😋"
    
    if any(w in m for w in ["pesan", "order", "beli", "booking"]):
        return "Oke! Silakan isi form di tab **Pesanan** ya. Kami siap proses! 🚀"
    
    if any(w in m for w in ["halo", "hai", "hi", "pagi", "siang"]):
        return f"Halo! 👋 Selamat datang di **{biz.get('name')}**. Ada yang bisa dibantu hari ini?"
    
    return random.choice([
        "Bisa dijelaskan lebih detail? 😊",
        "Saya siap bantu! Mau lihat menu atau langsung pesan?",
        "Ada pertanyaan lain? Ketik saja!"
    ])

# Sidebar
with st.sidebar:
    st.markdown("## ✨ UMKMAssist")
    st.caption("Asisten AI Modern")
    
    new_kode = st.text_input("🔑 Kode Usaha", st.session_state.kode)
    if st.button("🔄 Muat", use_container_width=True):
        st.session_state.kode = new_kode.strip() or "demo"
        st.rerun()
    
    st.divider()
    biz["name"] = st.text_input("🏪 Nama Usaha", biz.get("name", ""))
    
    st.markdown("#### 📦 Produk")
    prod_input = st.text_area("Nama - Harga", 
        "\n".join(f"{p['name']} - {p['price']}" for p in biz.get("products", [])),
        height=100, label_visibility="collapsed")
    
    st.markdown("#### ❓ FAQ")
    faq_input = st.text_area("tanya | jawab",
        "\n".join(f"{f['q']} | {f['a']}" for f in biz.get("faqs", [])),
        height=80, label_visibility="collapsed")
    
    if st.button("💾 Simpan Semua", use_container_width=True, type="primary"):
        new_prods = []
        for line in prod_input.splitlines():
            if " - " in line:
                try:
                    n, p = line.split(" - ", 1)
                    new_prods.append({"name": n.strip(), "price": int(p.strip().replace(".","").replace(",",""))})
                except: pass
        if new_prods: biz["products"] = new_prods
        
        new_faqs = []
        for line in faq_input.splitlines():
            if " | " in line:
                q, a = line.split(" | ", 1)
                new_faqs.append({"q": q.strip(), "a": a.strip()})
        if new_faqs: biz["faqs"] = new_faqs
        
        if save_biz(biz):
            st.success("✅ Tersimpan!")
        else:
            st.error("Gagal menyimpan")

# Header
st.markdown(f"# ✨ {biz.get('name', 'UMKMAssist')}")
st.markdown(f"<p style='color: #64748b; margin-top: -10px;'>Kode: <code>{biz.get('kode')}</code> • Siap melayani pelanggan 24/7</p>", unsafe_allow_html=True)

tab1, tab2, tab3 = st.tabs(["💬 Chat AI", "📋 Pesanan", "📊 Dashboard"])

with tab1:
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
    
    if prompt := st.chat_input("💬 Ketik pesan..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        reply = smart_reply(prompt)
        st.session_state.messages.append({"role": "assistant", "content": reply})
        st.rerun()

with tab2:
    st.markdown("### 📝 Catat Pesanan Baru")
    with st.form("order", clear_on_submit=True):
        c1, c2 = st.columns(2)
        with c1:
            nama = st.text_input("👤 Nama Pelanggan")
            jumlah = st.number_input("🔢 Jumlah", 1, value=1)
        with c2:
            pesanan = st.text_input("🛒 Pesanan")
            catatan = st.text_input("📝 Catatan")
        
        if st.form_submit_button("✨ Simpan Pesanan", use_container_width=True) and nama and pesanan:
            lead = {
                "waktu": datetime.now().strftime("%d/%m %H:%M"),
                "nama": nama,
                "pesanan": pesanan,
                "jumlah": int(jumlah),
                "catatan": catatan
            }
            biz.setdefault("leads", []).append(lead)
            save_biz(biz)
            st.success(f"🎉 Pesanan {nama} berhasil dicatat!")
    
    st.markdown("### 📦 Daftar Pesanan")
    leads = biz.get("leads", [])
    if leads:
        for lead in reversed(leads):
            st.markdown(f"""
            <div style="background: white; padding: 1rem; border-radius: 12px; margin-bottom: 0.5rem; border-left: 4px solid #667eea;">
                <strong>{lead.get('waktu', '')}</strong> — {lead.get('nama', '')}<br>
                {lead.get('pesanan', '')} × {lead.get('jumlah', 1)}
                {'<br><small>' + lead.get('catatan', '') + '</small>' if lead.get('catatan') else ''}
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("Belum ada pesanan masuk")

with tab3:
    leads = biz.get("leads", [])
    c1, c2, c3 = st.columns(3)
    c1.metric("📦 Total Pesanan", len(leads))
    c2.metric("🍽️ Produk", len(biz.get("products", [])))
    c3.metric("❓ FAQ", len(biz.get("faqs", [])))
    
    if leads:
        st.markdown("#### 🔥 Pesanan Terbaru")
        for lead in list(reversed(leads))[:5]:
            st.write(f"• **{lead.get('nama')}** — {lead.get('pesanan')}")

st.markdown("---")
st.markdown("<center style='color: #94a3b8;'>✨ UMKMAssist AI • Powered by Modern Tech</center>", unsafe_allow_html=True)

    

                    
