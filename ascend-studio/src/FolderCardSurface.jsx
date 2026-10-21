import { useLayoutEffect, useRef, useState } from "react";

function folderFrontPath(width, height) {
  const shoulderStart = width * 0.76;
  const shoulderEnd = width * 0.86;
  return `M 0 20 C 0 12.3 6.3 6 14 6 H ${shoulderStart} C ${width * 0.81} 6 ${width * 0.81} 12 ${shoulderEnd} 12 H ${width - 8} Q ${width} 12 ${width} 20 V ${height - 14} Q ${width} ${height} ${width - 14} ${height} H 14 Q 0 ${height} 0 ${height - 14} Z`;
}

export function FolderCardSurface() {
  const cardRef = useRef(null);
  const [size, setSize] = useState({ width: 1, height: 1 });

  useLayoutEffect(() => {
    const surface = cardRef.current;
    if (!surface) return undefined;

    const updateSize = (width, height) => {
      if (!width || !height) return;
      setSize((current) => current.width === width && current.height === height ? current : { width, height });
    };
    updateSize(surface.clientWidth, surface.clientHeight);

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      updateSize(width, height);
    });
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={cardRef}
      className="new-task-home__card-surface"
      aria-hidden="true"
      viewBox={`0 0 ${size.width} ${size.height}`}
      preserveAspectRatio="none"
    >
      <rect className="new-task-home__card-back" x="0" y="0" width={size.width} height={size.height} rx="14" />
      <path className="new-task-home__card-front" d={folderFrontPath(size.width, size.height)} />
    </svg>
  );
}
