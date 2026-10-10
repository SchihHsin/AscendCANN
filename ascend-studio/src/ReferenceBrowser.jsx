import { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconExternalLink,
  IconLock,
  IconReload,
  IconWorld,
} from "@tabler/icons-react";
import "./reference-browser.css";

// Existing research source: operator-ai-journey-research/run-log.md.
// The latest URL is an official reference entry, not a locked task environment.
export const ASCEND_C_REFERENCE = {
  title: "Ascend C 概览",
  url: "https://www.hiascend.com/document/detail/zh/canncommercial/latest/programug/Ascendcopdevg/atlas_ascendc_map_10_0002.html",
  publisher: "昇腾官方文档",
};

function webAddress(value) {
  try {
    const parsed = new URL(String(value).trim());
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch { return null; }
}

export function ReferenceBrowser({ reference = ASCEND_C_REFERENCE, resetVersion = 0 }) {
  const [history, setHistory] = useState([reference.url]);
  const [position, setPosition] = useState(0);
  const [address, setAddress] = useState(reference.url);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [error, setError] = useState("");
  const [embedError, setEmbedError] = useState(false);
  const currentUrl = history[position] || reference.url;
  const isOriginal = currentUrl === reference.url;
  const pageHost = new URL(currentUrl).hostname;

  useEffect(() => {
    setHistory([reference.url]);
    setPosition(0);
    setAddress(reference.url);
    setError("");
    setEmbedError(false);
    setReloadVersion((value) => value + 1);
  }, [reference.url, resetVersion]);

  const navigate = (url) => {
    const next = webAddress(url);
    if (!next) { setError("请输入完整的 http 或 https 网页地址。"); return; }
    if (next !== currentUrl) {
      setHistory((items) => [...items.slice(0, position + 1), next]);
      setPosition(position + 1);
    }
    setAddress(next);
    setError("");
    setEmbedError(false);
    setReloadVersion((value) => value + 1);
  };
  const move = (step) => {
    const next = position + step;
    if (next < 0 || next >= history.length) return;
    setPosition(next);
    setAddress(history[next]);
    setError("");
    setEmbedError(false);
  };
  const reload = () => {
    setEmbedError(false);
    setError("");
    setReloadVersion((value) => value + 1);
  };

  return <div className="rb-browser">
    <div className="rb-toolbar">
      <div className="rb-navigation">
        <button type="button" title="返回此前打开的地址" aria-label="返回此前打开的地址" disabled={position === 0} onClick={() => move(-1)}><IconArrowLeft size={15} /></button>
        <button type="button" title="前往下一个地址" aria-label="前往下一个地址" disabled={position === history.length - 1} onClick={() => move(1)}><IconArrowRight size={15} /></button>
        <button type="button" title="重新加载网页" aria-label="重新加载网页" onClick={reload}><IconReload size={15} /></button>
      </div>
      <form className="rb-address" onSubmit={(event) => { event.preventDefault(); navigate(address); }}>
        {currentUrl.startsWith("https:") ? <IconLock size={13} aria-hidden="true" /> : <IconWorld size={13} aria-hidden="true" />}
        <input type="url" aria-label="网页地址" value={address} onChange={(event) => setAddress(event.target.value)} spellCheck={false} />
        <button type="submit" title="打开此地址" aria-label="打开此地址"><IconArrowRight size={13} /></button>
      </form>
      <a className="rb-external" href={currentUrl} target="_blank" rel="noopener noreferrer" title="在外部浏览器打开" aria-label="在外部浏览器打开"><IconExternalLink size={15} /></a>
    </div>
    {error && <p className="rb-error" role="alert">{error}</p>}
    <div className="rb-reference-meta"><IconBook size={14} /><span><strong>{isOriginal ? reference.title : pageHost}</strong><small>{isOriginal ? `${reference.publisher} · 版本以原网页为准` : "当前打开的网页"}</small></span><a href={reference.url} target="_blank" rel="noopener noreferrer">原始参考<IconExternalLink size={12} /></a></div>
    <div className="rb-embed-notice"><span>{embedError ? "当前网页无法嵌入，请在外部浏览器中查看。" : "网页由原站提供；若显示空白或拒绝连接，可在外部浏览器中查看。"}</span><a href={currentUrl} target="_blank" rel="noopener noreferrer">外部打开<IconExternalLink size={12} /></a></div>
    <div className="rb-frame-wrap">
      <iframe key={`${currentUrl}:${reloadVersion}`} src={currentUrl} title={isOriginal ? "Ascend C 官方参考网页" : "参考网页查看器"} className="rb-frame" referrerPolicy="strict-origin-when-cross-origin" onError={() => setEmbedError(true)} />
    </div>
    <p className="rb-boundary">参考资料帮助理解概念，不代表已验证当前任务的版本、精度或根因。</p>
  </div>;
}

export default ReferenceBrowser;
