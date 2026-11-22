"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

type Task = { id: string; title: string; done: boolean };
type Action = "summarize" | "plan" | "rewrite";
const actions: { id: Action; number: string; title: string; description: string; icon: string }[] = [
  { id: "summarize", number: "01", title: "Ringkas teks", description: "Temukan inti dari catatan panjang.", icon: "≡" },
  { id: "plan", number: "02", title: "Susun rencana", description: "Ubah ide menjadi langkah nyata.", icon: "↗" },
  { id: "rewrite", number: "03", title: "Rapikan tulisan", description: "Buat pesan lebih jelas dan rapi.", icon: "✳" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    spark: <><path d="M12 3 13.8 9.2 20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
    check: <><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
    copy: <><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [action, setAction] = useState<Action>("summarize");
  const [text, setText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [date, setDate] = useState("");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ruang-tasks-v1");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setTasks(parsed.filter((task): task is Task => typeof task?.id === "string" && typeof task?.title === "string" && typeof task?.done === "boolean"));
      }
    } catch { setStorageError(true); }
    setDate(new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("ruang-tasks-v1", JSON.stringify(tasks)); } catch { setStorageError(true); }
  }, [ready, tasks]);

  const done = tasks.filter(task => task.done).length;
  const selected = actions.find(item => item.id === action)!;
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskInput.trim();
    if (!title) return;
    setTasks(current => [...current, { id: crypto.randomUUID(), title, done: false }]);
    setTaskInput("");
  }
  async function runAI(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setResult(""); setCopied(false);
    if (!apiKey.trim()) { setError("Masukkan kunci API OpenAI di pengaturan terlebih dahulu."); return; }
    if (!text.trim()) { setError("Tulis atau tempel teks terlebih dahulu."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/assist", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` }, body: JSON.stringify({ action, text: text.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Permintaan belum berhasil. Coba lagi.");
      setResult(data.result);
    } catch (err) { setError(err instanceof Error ? err.message : "Tidak dapat terhubung. Coba lagi."); }
    finally { setLoading(false); }
  }
  async function copyResult() {
    try { await navigator.clipboard.writeText(result); setCopied(true); }
    catch { setError("Tidak bisa menyalin otomatis. Silakan pilih dan salin hasilnya."); }
  }

  return <div className="app-shell" id="beranda">
    <aside className="sidebar">
      <a className="brand" href="#beranda" aria-label="Ruang, beranda"><span className="brand-mark">✳</span><span>ruang<span className="brand-dot">.</span><small>WORKSPACE / AI</small></span></a>
      <div className="side-label">WORKSPACE <span>01</span></div>
      <nav className="side-nav" aria-label="Navigasi utama">
        <a className="active" href="#beranda"><Icon name="grid"/> Beranda <span>↗</span></a>
        <a href="#asisten"><Icon name="spark"/> Asisten AI <span>↗</span></a>
        <a href="#tugas"><Icon name="check"/> Tugas saya <span>↗</span></a>
      </nav>
      <div className="sidebar-bottom"><div className="orbit-mark">✳</div><strong>Lebih sedikit sibuk.<br/>Lebih banyak berkarya.</strong><p>Ruang kecil untuk hal-hal besar.</p><span>VERSI 01 / 2026</span></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="crumb"><span>WORKSPACE</span><span>/</span><strong>BERANDA</strong></div><div className="top-right"><span className="online-dot"/> RUANG UNTUK FOKUS <span className="top-index">✳</span></div></header>
      <div className="content">
        <div className="welcome-row"><span className="micro"><span className="online-dot"/> RUANG KERJA PRIBADIMU</span><span className="date">{date || "HARI INI"}</span></div>
        <section className="hero-panel" aria-labelledby="hero-title">
          <div className="hero-content"><span className="hero-tag">✳ &nbsp; KERJA LEBIH JERNIH</span><h1 id="hero-title">Ide besar,<br/><span>langkah kecil.</span></h1><p>Semua yang kamu butuhkan untuk merapikan pikiran dan mulai bergerak.</p><a className="hero-link" href="#asisten">MULAI DENGAN AI <Icon name="arrow" size={17}/></a></div>
          <div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-disc"><span>✳</span></div><div className="art-label art-label-top">PUNYA IDE? <span>↗</span></div><div className="art-label art-label-bottom"><span>✦</span> JADIKAN NYATA</div><span className="art-coordinate">R / 01 — 26</span></div>
        </section>
        <div className="section-title" id="asisten"><div><span className="micro">01 / ASISTEN PRIBADI</span><h2>Mulai dari sini<span>.</span></h2><p>Pilih alat yang paling kamu butuhkan sekarang.</p></div><span className="section-aside">BUAT RUANG UNTUK IDE &nbsp; ↗</span></div>
        <div className="tool-grid" role="group" aria-label="Pilih alat AI">{actions.map(item => <button key={item.id} type="button" className={`tool-card ${action === item.id ? "selected" : ""}`} aria-pressed={action === item.id} onClick={() => { setAction(item.id); setResult(""); setError(""); }}><span className="tool-top"><span className="tool-icon">{item.icon}</span><span className="tool-number">{item.number} / 03</span></span><span className="tool-title">{item.title}<span>↗</span></span><span className="tool-desc">{item.description}</span></button>)}</div>
        <div className="workspace-grid">
          <section className="editor-card" aria-labelledby="editor-title"><div className="card-heading"><div><span className="micro">✳ &nbsp; AI WORKSPACE</span><h2 id="editor-title">{selected.title}</h2></div><span className="card-index">01 — 03</span></div><p className="card-description">{selected.description} Tulis atau tempel teks di bawah ini.</p><form onSubmit={runAI}><label className="field-label" htmlFor="ai-text">TEKSMU <span>{text.length} / 12.000</span></label><textarea id="ai-text" maxLength={12000} value={text} onChange={e => setText(e.target.value)} placeholder={action === "plan" ? "Contoh: Saya ingin memulai usaha kecil dalam tiga bulan..." : "Tulis sesuatu di sini, atau tempel catatanmu..."}/><div className="editor-bottom"><span>✦ &nbsp; DIOLAH DENGAN AI</span><button className="primary-button" disabled={loading} type="submit">{loading ? "SEDANG DIPROSES..." : "PROSES SEKARANG"} <Icon name="arrow" size={16}/></button></div></form><details className="key-settings"><summary><Icon name="lock" size={15}/> Pengaturan kunci API <span>＋</span></summary><label htmlFor="api-key">KUNCI API OPENAI</label><input id="api-key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Masukkan kunci API" autoComplete="off"/><p>Kunci hanya tersimpan selama halaman ini terbuka dan dikirim untuk memproses permintaan. Penggunaan API dapat dikenai biaya.</p></details>{error && <p className="error-message" role="alert">{error}</p>}{result && <div className="result" aria-live="polite"><div className="result-head"><span className="micro">HASIL AI</span><button type="button" onClick={copyResult}><Icon name="copy" size={16}/>{copied ? "Tersalin" : "Salin"}</button></div><p>{result}</p></div>}</section>
          <section className="tasks-card" id="tugas" aria-labelledby="tasks-title"><div className="card-heading"><div><span className="micro">02 / FOKUS HARI INI</span><h2 id="tasks-title">Selangkah<br/>lebih dekat<span>.</span></h2></div><span className="task-flower">✳</span></div><p className="card-description">Hal kecil juga layak dirayakan.</p><div className="progress-block"><div><span>PROGRES TUGAS</span><strong>{done}<small> / {tasks.length}</small></strong></div><div className="progress-track"><span style={{ width: `${tasks.length ? done / tasks.length * 100 : 0}%` }}/></div><p>{tasks.length ? `${done} dari ${tasks.length} tugas selesai` : "Mulai dengan menambahkan tugas pertamamu."}</p></div><form className="task-form" onSubmit={addTask}><label className="sr-only" htmlFor="task-input">Tugas baru</label><input id="task-input" maxLength={120} value={taskInput} onChange={e => setTaskInput(e.target.value)} placeholder="Tambah tugas baru..."/><button type="submit" aria-label="Tambah tugas"><Icon name="plus"/></button></form><div className="task-list">{tasks.length === 0 ? <div className="empty-task"><span>◌</span> Belum ada tugas. Mulai dari satu hal kecil.</div> : tasks.map(task => <div className="task-row" key={task.id}><label><input type="checkbox" checked={task.done} onChange={() => setTasks(current => current.map(item => item.id === task.id ? { ...item, done: !item.done } : item))}/><span className={task.done ? "completed" : ""}>{task.title}</span></label><button type="button" aria-label={`Hapus ${task.title}`} onClick={() => setTasks(current => current.filter(item => item.id !== task.id))}><Icon name="trash" size={17}/></button></div>)}</div>{storageError && <p className="error-message" role="status">Penyimpanan browser tidak tersedia; tugas mungkin tidak tersimpan setelah halaman ditutup.</p>}<div className="task-foot"><span>✳</span> SATU LANGKAH PADA SATU WAKTU.</div></section>
        </div>
        <footer><span>RUANG. / RUANG UNTUK BERTUMBUH</span><span>DIBUAT UNTUK IDE-IDE BESARMU &nbsp; ✳</span></footer>
      </div>
    </main>
  </div>;
}
