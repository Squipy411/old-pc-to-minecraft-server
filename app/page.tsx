"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { chapters, groups, type Chapter } from "./guide-content";
import { Markdown, getHeadings } from "./markdown";

const STORAGE_KEY = "old-pc-mc-progress-v1";
type Theme = "light" | "dark";

function Icon({ name }: { name: "menu" | "search" | "sun" | "moon" | "check" | "print" | "reset" }) {
  const glyphs = { menu: "☰", search: "⌕", sun: "☀", moon: "◐", check: "✓", print: "▣", reset: "↺" };
  return <span aria-hidden="true">{glyphs[name]}</span>;
}

function PcCheck() {
  const [ram, setRam] = useState("8");
  const [drive, setDrive] = useState("ssd");
  const [players, setPlayers] = useState("5");
  const [style, setStyle] = useState("fabric");
  const nRam = Number(ram);
  const nPlayers = Number(players);
  let verdict = "A reasonable starting point";
  let detail = "Try 3–4 GB for Minecraft, keep view distance at 8, and add optimization mods carefully.";
  if (nRam < 6 || drive === "hdd" || nPlayers > 10) {
    verdict = "Possible, but expect limits";
    detail = "Use an SSD if you can, keep the group small, pregenerate a modest world, and avoid large modpacks.";
  }
  if (nRam >= 16 && drive === "ssd" && nPlayers <= 10) {
    verdict = "A good fit for a friend-group server";
    detail = style === "modpack" ? "Start with 6–8 GB for Minecraft and leave at least 4 GB for ZimaOS and Crafty." : "Start with 5–6 GB for Minecraft; more RAM is not automatically faster.";
  }
  return (
    <section className="tool-card" aria-labelledby="pc-check-title">
      <div className="eyebrow">Private, in-browser estimate</div>
      <h2 id="pc-check-title">Can my PC run it?</h2>
      <div className="form-grid">
        <label>System RAM<select value={ram} onChange={(e) => setRam(e.target.value)}><option value="4">4 GB</option><option value="8">8 GB</option><option value="16">16 GB</option><option value="32">32 GB+</option></select></label>
        <label>Main drive<select value={drive} onChange={(e) => setDrive(e.target.value)}><option value="ssd">SSD</option><option value="hdd">HDD</option></select></label>
        <label>Players<select value={players} onChange={(e) => setPlayers(e.target.value)}><option value="3">1–3</option><option value="5">4–6</option><option value="10">7–10</option><option value="15">11+</option></select></label>
        <label>Server style<select value={style} onChange={(e) => setStyle(e.target.value)}><option value="fabric">Fabric + optimization</option><option value="vanilla">Mostly vanilla</option><option value="modpack">Large modpack</option></select></label>
      </div>
      <div className="verdict"><strong>{verdict}</strong><span>{detail}</span></div>
      <p className="fine-print">This is a starting estimate, not a guarantee. CPU single-core speed, Minecraft version, mods, farms, world generation, upload speed, and electricity use all matter.</p>
    </section>
  );
}

function Home({ onStart, onCheck }: { onStart: () => void; onCheck: () => void }) {
  const path = ["Old PC", "ZimaOS", "Crafty", "Fabric server", "Playit or router", "Friends join"];
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> Beginner field guide · reviewed July 29, 2026</div>
          <h1>Turn an old PC into a real Minecraft server</h1>
          <p className="hero-lead">A complete, plain-language guide to installing ZimaOS, setting up Crafty Controller, creating a Fabric server, and helping your friends join.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={onStart}>Start the guide <span aria-hidden="true">→</span></button>
            <button className="button secondary" onClick={onCheck}>Check if my PC is good enough</button>
          </div>
          <p className="reassurance">No Linux experience required. No account on this site. Your progress stays in this browser.</p>
        </div>
        <div className="server-visual" aria-label="An old computer becoming a Minecraft server">
          <div className="monitor"><div className="monitor-screen"><span>SERVER</span><b>ONLINE</b><i /></div><div className="monitor-stand" /></div>
          <div className="status-stack"><span><i className="green" /> Fabric 1.21.x</span><span><i className="green" /> 5 friends online</span><span><i className="amber" /> Backup in 2h</span></div>
        </div>
      </section>

      <section className="path-card" aria-labelledby="path-heading">
        <div><span className="section-number">THE PATH</span><h2 id="path-heading">One computer. Six understandable steps.</h2></div>
        <div className="path-flow">{path.map((item, i) => <div className="path-item" key={item}><span>{String(i + 1).padStart(2, "0")}</span><b>{item}</b>{i < path.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div>
      </section>

      <section className="honest-grid">
        <article><div className="eyebrow">Self-hosting</div><h2>More control, more responsibility</h2><ul><li>Full world and mod access</li><li>Your own RAM and storage</li><li>No queue or forced sleep timer</li><li>Backups on your schedule</li><li>No recurring host fee</li></ul></article>
        <article><div className="eyebrow muted">Free hosts</div><h2>Easier first setup, firmer limits</h2><ul><li>Little hardware setup</li><li>Resource limits and queues may apply</li><li>Less file and mod control</li><li>Service availability sets the schedule</li><li>A sensible option for some groups</li></ul></article>
        <aside><strong>The honest version</strong><p>Not every old PC is a win. Slow CPUs, hard drives, power costs, or weak home internet can make a hosted service the better choice. This guide helps you check first.</p></aside>
      </section>

      <section className="chapter-preview"><div><span className="section-number">29 CHAPTERS</span><h2>From “what is a server?” to “friends can join.”</h2><p>Follow the chapters in order the first time. Each one includes a time estimate, plain-language explanations, and a troubleshooting exit ramp.</p></div><div className="preview-list">{chapters.slice(0, 5).map((c, i) => <button key={c.slug} onClick={() => onStart()}><span>{String(i + 1).padStart(2, "0")}</span><b>{c.title}</b><small>{c.time}</small></button>)}</div></section>
      <PcCheck />
    </div>
  );
}

function SearchPanel({ query, setQuery, onSelect }: { query: string; setQuery: (v: string) => void; onSelect: (c: Chapter) => void }) {
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return chapters.slice(0, 7);
    return chapters.filter((c) => `${c.title} ${c.summary} ${c.source}`.toLowerCase().includes(q)).slice(0, 10);
  }, [query]);
  return <div className="search-panel"><label><span className="sr-only">Search every guide chapter</span><Icon name="search" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search errors, mods, backups…" /></label><div className="search-results">{results.map(c => <button key={c.slug} onClick={() => onSelect(c)}><span>{c.group}</span><b>{c.title}</b><small>{c.summary}</small></button>)}{results.length === 0 && <p>No matching chapter. Try a shorter phrase.</p>}</div></div>;
}

export default function HomePage() {
  const [active, setActive] = useState<string>("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const chapter = chapters.find((c) => c.slug === active);
  const chapterIndex = chapter ? chapters.indexOf(chapter) : -1;

  const navigate = useCallback((slug: string) => {
    setActive(slug); setMobileOpen(false); setSearchOpen(false); setQuery("");
    window.history.replaceState(null, "", slug ? `#${slug}` : window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) { try { setCompleted(JSON.parse(stored)); } catch { /* ignore old data */ } }
      const savedTheme = localStorage.getItem("old-pc-mc-theme") as Theme | null;
      const initialTheme = savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(initialTheme); document.documentElement.dataset.theme = initialTheme;
      const hash = location.hash.slice(1); if (chapters.some(c => c.slug === hash)) setActive(hash);
    });
    const keys = (e: KeyboardEvent) => { if (e.key === "/" && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); setSearchOpen(true); } if (e.key === "Escape") { setSearchOpen(false); setMobileOpen(false); } };
    addEventListener("keydown", keys); return () => { cancelled = true; removeEventListener("keydown", keys); };
  }, []);

  const toggleTheme = () => { const next = theme === "light" ? "dark" : "light"; setTheme(next); document.documentElement.dataset.theme = next; localStorage.setItem("old-pc-mc-theme", next); };
  const toggleComplete = () => { if (!chapter) return; const next = completed.includes(chapter.slug) ? completed.filter(x => x !== chapter.slug) : [...completed, chapter.slug]; setCompleted(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const resetProgress = () => { setCompleted([]); localStorage.removeItem(STORAGE_KEY); };
  const pct = Math.round((completed.length / chapters.length) * 100);
  const headings = chapter ? getHeadings(chapter.source) : [];

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="mobile-menu" aria-label="Open guide navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}><Icon name="menu" /></button>
        <button className="brand" onClick={() => navigate("")} aria-label="Old PC to Minecraft Server home"><span className="brand-mark">OP</span><span>Old PC <i>→</i> Minecraft Server</span></button>
        <button className="search-trigger" onClick={() => setSearchOpen(v => !v)}><Icon name="search" /><span>Search the guide</span><kbd>/</kbd></button>
        <div className="header-actions"><button onClick={() => window.print()} aria-label="Print this page"><Icon name="print" /></button><button onClick={toggleTheme} aria-label={`Use ${theme === "light" ? "dark" : "light"} mode`}><Icon name={theme === "light" ? "moon" : "sun"} /></button></div>
      </header>
      {searchOpen && <SearchPanel query={query} setQuery={setQuery} onSelect={(c) => navigate(c.slug)} />}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="progress-card"><div><span>Your progress</span><strong>{completed.length} of {chapters.length}</strong></div><div className="progress-track"><i style={{ width: `${pct}%` }} /></div><button onClick={resetProgress}><Icon name="reset" /> Reset</button></div>
        <nav aria-label="Guide chapters"><button className={!active ? "active home-link" : "home-link"} onClick={() => navigate("")}><span>⌂</span>Overview</button>{groups.map(group => <div className="nav-group" key={group}><h2>{group}</h2>{chapters.filter(c => c.group === group).map((c) => <button key={c.slug} className={active === c.slug ? "active" : ""} onClick={() => navigate(c.slug)}><span className={completed.includes(c.slug) ? "done" : "chapter-dot"}>{completed.includes(c.slug) ? "✓" : chapters.indexOf(c) + 1}</span>{c.title}</button>)}</div>)}</nav>
        <div className="sidebar-foot"><span className="live-dot" /> Reviewed July 29, 2026</div>
      </aside>
      {mobileOpen && <button className="scrim" aria-label="Close guide navigation" onClick={() => setMobileOpen(false)} />}

      <main className={active ? "guide-main" : "home-main"}>
        {!chapter ? <Home onStart={() => navigate(chapters[0].slug)} onCheck={() => { navigate("hardware-check"); setTimeout(() => document.getElementById("pc-check-title")?.scrollIntoView(), 80); }} /> : (
          <>
            <div className="breadcrumbs"><button onClick={() => navigate("")}>Home</button><span>/</span><span>{chapter.group}</span><span>/</span><strong>{chapter.title}</strong></div>
            <article className="guide-article">
              <header className="chapter-header"><div className="chapter-kicker"><span>Chapter {chapterIndex + 1} of {chapters.length}</span><span>{chapter.time}</span></div><h1>{chapter.title}</h1><p>{chapter.summary}</p><div className="reviewed"><span className="live-dot" /> Last reviewed July 29, 2026 <i>•</i> Interfaces and version requirements can change</div></header>
              {chapter.slug === "hardware-check" && <PcCheck />}
              <Markdown source={chapter.source} />
              <section className="helpful"><div><b>Was this chapter helpful?</b><span>Feedback stays on this device.</span></div><div><button onClick={() => localStorage.setItem(`helpful-${chapter.slug}`, "yes")}>Yes</button><button onClick={() => localStorage.setItem(`helpful-${chapter.slug}`, "no")}>Not yet</button></div></section>
              <button className={`complete-button ${completed.includes(chapter.slug) ? "is-complete" : ""}`} onClick={toggleComplete}><Icon name="check" />{completed.includes(chapter.slug) ? "Chapter complete" : "Mark chapter complete"}</button>
              <nav className="prev-next" aria-label="Previous and next chapters">{chapterIndex > 0 ? <button onClick={() => navigate(chapters[chapterIndex - 1].slug)}><span>Previous</span><b>← {chapters[chapterIndex - 1].title}</b></button> : <span />}{chapterIndex < chapters.length - 1 ? <button className="next" onClick={() => navigate(chapters[chapterIndex + 1].slug)}><span>Next</span><b>{chapters[chapterIndex + 1].title} →</b></button> : <button className="next" onClick={() => navigate("")}><span>Finished</span><b>Back to overview →</b></button>}</nav>
            </article>
            <aside className="toc"><span>ON THIS PAGE</span>{headings.map(h => <a key={h.id} href={`#${h.id}`}>{h.text}</a>)}<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑ Back to top</button></aside>
          </>
        )}
      </main>
      <footer><span>Independent community guide. Not affiliated with Mojang, Microsoft, ZimaSpace, Crafty, Fabric, or Playit.</span><a href="https://github.com/Squipy411/old-pc-to-minecraft-server/issues" target="_blank" rel="noreferrer">Suggest a correction ↗</a></footer>
    </div>
  );
}
