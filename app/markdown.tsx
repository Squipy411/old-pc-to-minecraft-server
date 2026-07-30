"use client";
import { Fragment, useState, type ReactNode } from "react";

const slugify = (text: string) => text.toLowerCase().replace(/[`*_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export function getHeadings(source: string) { return source.split("\n").filter(l => /^## /.test(l)).map(l => ({ text: l.slice(3).trim(), id: slugify(l.slice(3).trim()) })); }

function inline(text: string): ReactNode[] {
  const bits = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return bits.filter(Boolean).map((bit, i) => {
    if (bit.startsWith("`") && bit.endsWith("`")) return <code key={i}>{bit.slice(1, -1)}</code>;
    if (bit.startsWith("**") && bit.endsWith("**")) return <strong key={i}>{bit.slice(2, -2)}</strong>;
    const link = bit.match(/^\[([^\]]+)\]\(([^)]+)\)$/); if (link) return <a key={i} href={link[2]} target={link[2].startsWith("http") ? "_blank" : undefined} rel="noreferrer">{link[1]}{link[2].startsWith("http") && " ↗"}</a>;
    return <Fragment key={i}>{bit}</Fragment>;
  });
}

function CodeBlock({ children }: { children: string }) { const [copied, setCopied] = useState(false); return <div className="code-block"><button onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied" : "Copy"}</button><pre><code>{children}</code></pre></div>; }

export function Video({ id, title, summary }: { id: string; title: string; summary: string }) { const [consent, setConsent] = useState(false); return <figure className="video"><div className="video-frame">{consent ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen /> : <button onClick={() => setConsent(true)}><span>▶</span><b>Load video from YouTube</b><small>YouTube may set cookies after you choose to load it.</small></button>}</div><figcaption><b>{title}</b><span>{summary} The written steps above are the main source; videos may show an older interface.</span></figcaption></figure>; }

export function Markdown({ source }: { source: string }) {
  const lines = source.trim().split("\n"); const out: ReactNode[] = []; let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (line.startsWith("```")) { const code: string[] = []; i++; while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]); i++; out.push(<CodeBlock key={out.length}>{code.join("\n")}</CodeBlock>); continue; }
    const callout = line.match(/^> \[!(NOTE|TIP|WARNING|DANGER)\] ?(.*)$/); if (callout) { const body: string[] = []; i++; while (i < lines.length && lines[i].trim().startsWith(">")) body.push(lines[i++].trim().replace(/^> ?/, "")); out.push(<aside key={out.length} className={`callout ${callout[1].toLowerCase()}`}><span>{callout[1]}</span>{callout[2] && <strong>{callout[2]}</strong>}<p>{inline(body.join(" "))}</p></aside>); continue; }
    if (line === "<VideoPlayit />") { out.push(<Video key={out.length} id="_4WgER3o8mg" title="Public Minecraft server setup from Playit" summary="Official Playit video; use it only as a visual companion." />); i++; continue; }
    if (/^## /.test(line)) { const t = line.slice(3); out.push(<h2 id={slugify(t)} key={out.length}><a href={`#${slugify(t)}`}>{inline(t)}<span>#</span></a></h2>); i++; continue; }
    if (/^### /.test(line)) { const t = line.slice(4); out.push(<h3 id={slugify(t)} key={out.length}>{inline(t)}</h3>); i++; continue; }
    if (/^- \[[ x]\] /.test(line)) { const items: { checked: boolean; text: string }[] = []; while (i < lines.length && /^- \[[ x]\] /.test(lines[i].trim())) { const v = lines[i].trim(); items.push({ checked: v[3] === "x", text: v.slice(6) }); i++; } out.push(<ul className="checklist" key={out.length}>{items.map((x, j) => <li key={j}><span>{x.checked ? "✓" : "□"}</span>{inline(x.text)}</li>)}</ul>); continue; }
    if (/^- /.test(line)) { const items: string[] = []; while (i < lines.length && /^- /.test(lines[i].trim())) items.push(lines[i++].trim().slice(2)); out.push(<ul key={out.length}>{items.map((x, j) => <li key={j}>{inline(x)}</li>)}</ul>); continue; }
    if (/^\d+\. /.test(line)) { const items: string[] = []; while (i < lines.length && /^\d+\. /.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^\d+\. /, "")); out.push(<ol className="steps" key={out.length}>{items.map((x, j) => <li key={j}><span>{j + 1}</span><div>{inline(x)}</div></li>)}</ol>); continue; }
    if (/^\|/.test(line)) { const rows: string[][] = []; while (i < lines.length && /^\|/.test(lines[i].trim())) { const cells = lines[i++].trim().slice(1, -1).split("|").map(x => x.trim()); if (!cells.every(x => /^-+$/.test(x))) rows.push(cells); } const [head, ...body] = rows; out.push(<div className="table-wrap" key={out.length}><table><thead><tr>{head.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr></thead><tbody>{body.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{inline(c)}</td>)}</tr>)}</tbody></table></div>); continue; }
    const para: string[] = [line]; i++; while (i < lines.length && lines[i].trim() && !/^(#{2,3} |```|> \[!|[-] |\d+\. |\||<Video)/.test(lines[i].trim())) para.push(lines[i++].trim()); out.push(<p key={out.length}>{inline(para.join(" "))}</p>);
  }
  return <div className="markdown-body">{out}</div>;
}
