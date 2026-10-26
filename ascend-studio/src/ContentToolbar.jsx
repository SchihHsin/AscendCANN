import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ContentSurfaceContext = createContext(null);

/** Each opened object owns its tools and scrolling body, including in a comparison. */
export function ContentSurface({ children, scrollerRef, onScroll }) {
  const [host, setHost] = useState(null);
  return <ContentSurfaceContext.Provider value={{ host }}>
    <div className="tw-toolbar-slot" ref={setHost} />
    <div className="tw-pane-content" ref={scrollerRef} onScroll={onScroll}>{children}</div>
  </ContentSurfaceContext.Provider>;
}

/** A material supplies its own tools; the shared shell supplies their position. */
export function ContentToolbar({ children, label = "当前内容工具" }) {
  const surface = useContext(ContentSurfaceContext);
  if (!surface) return <div className="tw-viewer-tools" role="group" aria-label={label}>{children}</div>;
  return surface.host ? createPortal(<div className="tw-viewer-tools" role="group" aria-label={label}>{children}</div>, surface.host) : null;
}
