import streamlit as st
from datetime import datetime
import random
from supabase import create_client

SUPABASE_URL = "https://xzuypgesmwomkjxbllaa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dXlwZ2VzbXdvbWtqeGJsbGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwNzAxMzcsImV4cCI6MjExMDY0NjEzN30.XlkkmvXFzN4uXn0-CNn7aCgxoHiO4LU_nkco4LAMxpQ"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

st.set_page_config(page_title="UMKMAssist", page_icon="💬", layout="wide")

# Clean Modern Theme + Click Sound
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.stApp {
    background: #fafafa;
}

html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #171717;
}

.main .block-container {
    max-width: 900px;
    padding-top: 2rem;
}

h1 {
    font-weight: 700 !important;
    font-size: 1.75rem !important;
    color: #171717 !important;
    letter-spacing: -0.02em;
}

h2, h3 {
    font-weight: 600 !important;
    color: #171717 !important;
    font-size: 1.1rem !important;
}

.stButton > button {
    background: #171717 !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    font-weight: 500 !important;
    font-size: 0.875rem !important;
    padding: 0.5rem 1rem !important;
    transition: all 0.15s ease !important;
}

.stButton > button:hover {
    background: #404040 !important;
}

.stButton > button:active {
    transform: scale(0.98);
}

.stTextInput > div > div > input,
.stTextArea > div > div > textarea,
.stNumberInput input {
    border-radius: 8px !important;
    border: 1px solid #e5e5e5 !important;
    background: white !important;
    font-size: 0.875rem !important;
}

.stTextInput > div > div > input:focus,
.stTextArea > div > div > textarea:focus {
    border-color: #171717 !important;
    box-shadow: none !important;
}

div[data-testid="stForm"] {
    background: white;
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid #e5e5e5;
}

.stTabs [data-baseweb="tab-list"] {
    gap: 0;
    border-bottom: 1px solid #e5e5e5;
}

.stTabs [data-baseweb="tab"] {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    padding: 0.75rem 1rem;
    font-weight: 500;
    color: #737373;
}

.stTabs [aria-selected="true"] {
    background: transparent !important;
    color: #171717 !important;
    border-bottom: 2px solid #171717 !important;
}

.stChatMessage {
    background: #f5f5f5 !important;
    border-radius: 12px !important;
    border: none !important;
}

[data-testid="stSidebar"] {
    background: white;
    border-right: 1px solid #e5e5e5;
}

.stSuccess {
    background: #f0fdf4 !important;
    color: #166534 !important;
    border: 1px solid #bbf7d0 !important;
    border-radius: 8px !important;
}

hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 1.5rem 0;
}
</style>

<script>
document.addEventListener('click', function(e) {
    if (e.target.closest('button')) {
        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+btoa(String.fromCharCode(...new Array(100).fill(128))));
        audio.volume = 0.1;
        audio.play().catch(()=>{});
    }
});
</script>
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
            "products": [{"name": "Produk 1", "price": 15000}],
            "faqs": [{"q": "jam buka", "a": "08.00 - 21.00"}],
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
    
    if any(w in m for w in ["menu", "harga", "produk", "daftar"]):
        if not products:
            return "Belum ada produk."
        text = "Menu:\n\n"
        for p in products:
            text += f"• {p['name']} — Rp {p['price']:,}\n"
        return text
    
    if any(w in m for w in ["pesan", "order", "beli"]):
        return "Silakan isi form di tab Pesanan."
    
    if any(w in m for w in ["halo", "hai", "hi"]):
        return f"Halo, selamat datang di {biz.get('name')}. Ada yang bisa dibantu?"
    
    return "Ada yang bisa dibantu?"

# Sidebar
with st.sidebar:
    st.markdown("**UMKMAssist**")
    st.caption("Pengaturan")
    
    new_kode = st.text_input("Kode Usaha", st.session_state.kode)
    if st.button("Muat", use_container_width=True):
        st.session_state.kode = new_kode.strip() or "demo"
        st.rerun()
    
    st.divider()
    biz["name"] = st.text_input("Nama Usaha", biz.get("name", ""))
    
    st.caption("Produk")
    prod_input = st.text_area("produk", 
        "\n".join(f"{p['name']} - {p['price']}" for p in biz.get("products", [])),
        height=100, label_visibility="collapsed")
    
    st.caption("FAQ")
    faq_input = st.text_area("faq",
        "\n".join(f"{f['q']} | {f['a']}" for f in biz.get("faqs", [])),
        height=80, label_visibility="collapsed")
    
    if st.button("Simpan", use_container_width=True, type="primary"):
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
            st.success("Tersimpan")

# Main
st.markdown(f"# {biz.get('name', 'UMKMAssist')}")
st.caption(f"Kode: {biz.get('kode')}")

tab1, tab2, tab3 = st.tabs(["Chat", "Pesanan", "Ringkasan"])

with tab1:
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.write(msg["content"])
    
    if prompt := st.chat_input("Ketik pesan..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        reply = smart_reply(prompt)
        st.session_state.messages.append({"role": "assistant", "content": reply})
        st.rerun()

with tab2:
    with st.form("order", clear_on_submit=True):
        c1, c2 = st.columns(2)
        with c1:
            nama = st.text_input("Nama")
            jumlah = st.number_input("Jumlah", 1, value=1)
        with c2:
            pesanan = st.text_input("Pesanan")
            catatan = st.text_input("Catatan")
        
        if st.form_submit_button("Simpan Pesanan", use_container_width=True) and nama and pesanan:
            lead = {
                "waktu": datetime.now().strftime("%d/%m %H:%M"),
                "nama": nama,
                "pesanan": pesanan,
                "jumlah": int(jumlah),
                "catatan": catatan
            }
            biz.setdefault("leads", []).append(lead)
            save_biz(biz)
            st.success("Pesanan tercatat")
    
    st.markdown("**Daftar Pesanan**")
    leads = biz.get("leads", [])
    if leads:
        for lead in reversed(leads):
            st.write(f"{lead.get('waktu', '')} — {lead.get('nama', '')} • {lead.get('pesanan', '')} ×{lead.get('jumlah', 1)}")
    else:
        st.caption("Belum ada pesanan")

with tab3:
    leads = biz.get("leads", [])
    c1, c2, c3 = st.columns(3)
    c1.metric("Pesanan", len(leads))
    c2.metric("Produk", len(biz.get("products", [])))
    c3.metric("FAQ", len(biz.get("faqs", [])))

st.divider()
st.caption("UMKMAssist")