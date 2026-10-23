const activeTimers = new WeakMap();

function isScrollable(element) {
  if (!(element instanceof HTMLElement)) return false;
  if (!element.matches(".project-scroll, .conversation-scroll")) return false;
  const style = getComputedStyle(element);
  const canScrollY = /(auto|scroll|overlay)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
  const canScrollX = /(auto|scroll|overlay)/.test(style.overflowX) && element.scrollWidth > element.clientWidth + 1;
  return canScrollY || canScrollX;
}

function reveal(element) {
  if (!isScrollable(element)) return;
  element.classList.add("is-scrollbar-visible");
  clearTimeout(activeTimers.get(element));
  activeTimers.set(element, setTimeout(() => {
    element.classList.remove("is-scrollbar-visible");
    activeTimers.delete(element);
  }, 900));
}

document.addEventListener("scroll", event => reveal(event.target), true);
