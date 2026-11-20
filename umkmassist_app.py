import streamlit as st
from datetime import datetime
import random
from supabase import create_client

SUPABASE_URL = "https://xzuypgesmwomkjxbllaa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dXlwZ2VzbXdvbWtqeGJsbGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwNzAxMzcsImV4cCI6MjExMDY0NjEzN30.XlkkmvXFzN4uXn0-CNn7aCgxoHiO4LU_nkco4LAMxpQ"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

st.set_page_config(page_title="UMKMAssist AI", page_icon="🤖", layout="wide")

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.stApp { background: #f8fafc; }
html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
.stButton>button { border-radius: 8px; font-weight: 600; }
div[data-testid="stForm"] { background: white; padding: 1.2rem; border-radius: 12px; border: 1px solid #e2e8f0; }
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
                {"q": "alamat", "a": "Silakan hubungi kami untuk alamat lengkap"}
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
    
    if any(w in m for w in ["menu", "harga", "produk", "daftar", "list", "makanan", "minuman"]):
        if not products:
            return "Belum ada produk yang terdaftar."
        text = "**Berikut menu kami:**\n\n"
        for p in products:
            text += f"• **{p['name']}** — Rp {p['price']:,}\n"
        text += "\nMau pesan yang mana?"
        return text
    
    if any(w in m for w in ["pesan", "order", "beli", "booking", "ambil"]):
        return "Silakan isi form **Booking** di bawah untuk memesan. Kami akan segera proses."
    
    if any(w in m for w in ["halo", "hai", "hi", "pagi", "siang", "sore", "malam"]):
        return f"Halo! Selamat datang di **{biz.get('name', 'toko kami')}**. Ada yang bisa saya bantu?"
    
    return random.choice([
        "Baik, bisa dijelaskan lebih detail?",
        "Saya siap membantu. Mau tanya menu atau langsung pesan?",
        "Ada yang ingin ditanyakan seputar produk kami?"
    ])

# Sidebar
with st.sidebar:
    st.title("⚙️ Pengaturan")
    new_kode = st.text_input("Kode Usaha", st.session_state.kode)
    if st.button("Muat Kode Ini", use_container_width=True):
        st.session_state.kode = new_kode.strip() or "demo"
        st.rerun()
    
    st.divider()
    biz["name"] = st.text_input("Nama Usaha", biz.get("name", ""))
    
    st.subheader("Produk")
    prod_input = st.text_area(
        "Satu baris satu produk\nFormat: Nama - Harga",
        value="\n".join(f"{p['name']} - {p['price']}" for p in biz.get("products", [])),
        height=120
    )
    
    st.subheader("FAQ")
    faq_input = st.text_area(
        "Format: pertanyaan | jawaban",
        value="\n".join(f"{f['q']} | {f['a']}" for f in biz.get("faqs", [])),
        height=100
    )
    
    if st.button("💾 Simpan Semua", use_container_width=True, type="primary"):
        # Parse products
        new_prods = []
        for line in prod_input.splitlines():
            if " - " in line:
                try:
                    n, p = line.split(" - ", 1)
                    new_prods.append({"name": n.strip(), "price": int(p.strip().replace(".", "").replace(",", ""))})
                except:
                    pass
        if new_prods:
            biz["products"] = new_prods
        
        # Parse FAQs
        new_faqs = []
        for line in faq_input.splitlines():
            if " | " in line:
                q, a = line.split(" | ", 1)
                new_faqs.append({"q": q.strip(), "a": a.strip()})
        if new_faqs:
            biz["faqs"] = new_faqs
        
        if save_biz(biz):
            st.success("Berhasil disimpan!")
        else:
            st.error("Gagal menyimpan")

# Main
st.title(f"🤖 {biz.get('name', 'UMKMAssist')}")
st.caption(f"Kode usaha: `{biz.get('kode')}` • Bagikan link ini ke pelanggan")

tab1, tab2, tab3 = st.tabs(["💬 Chat", "📋 Pesanan", "📊 Statistik"])

with tab1:
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
    
    if prompt := st.chat_input("Ketik pesan pelanggan..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        reply = smart_reply(prompt)
        st.session_state.messages.append({"role": "assistant", "content": reply})
        st.rerun()

with tab2:
    st.subheader("Catat Pesanan Baru")
    with st.form("order_form", clear_on_submit=True):
        c1, c2 = st.columns(2)
        with c1:
            nama = st.text_input("Nama Pelanggan")
            jumlah = st.number_input("Jumlah", min_value=1, value=1)
        with c2:
            pesanan = st.text_input("Pesanan")
            catatan = st.text_input("Catatan")
        
        if st.form_submit_button("Simpan Pesanan", use_container_width=True) and nama and pesanan:
            lead = {
                "waktu": datetime.now().strftime("%d/%m/%Y %H:%M"),
                "nama": nama,
                "pesanan": pesanan,
                "jumlah": int(jumlah),
                "catatan": catatan,
                "status": "Baru"
            }
            biz.setdefault("leads", []).append(lead)
            save_biz(biz)
            st.success(f"Pesanan {nama} berhasil dicatat!")
    
    st.subheader("Daftar Pesanan")
    leads = biz.get("leads", [])
    if leads:
        for i, lead in enumerate(reversed(leads)):
            with st.container(border=True):
                st.write(f"**{lead.get('waktu', '')}** — {lead.get('nama', '')}")
                st.write(f"{lead.get('pesanan', '')} (x{lead.get('jumlah', 1)})")
                if lead.get("catatan"):
                    st.caption(f"Catatan: {lead['catatan']}")
    else:
        st.info("Belum ada pesanan.")

with tab3:
    leads = biz.get("leads", [])
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Pesanan", len(leads))
    col2.metric("Produk", len(biz.get("products", [])))
    col3.metric("FAQ", len(biz.get("faqs", [])))
    
    if leads:
        st.write("**Pesanan Terbaru**")
        for lead in list(reversed(leads))[:5]:
            st.write(f"• {lead.get('nama')} — {lead.get('pesanan')}")

st.divider()
st.caption("UMKMAssist AI • Data tersimpan permanen")


