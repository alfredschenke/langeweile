/**
 * Injects given style declarations globally
 */
export function injectGlobalStyles(id: string, styles: string): HTMLStyleElement {
  // already exists
  const existing = document.querySelector<HTMLStyleElement>(`style#${id}`);
  if (existing !== null) {
    return existing;
  }

  // create new style
  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = styles;
  document.head.appendChild(style);

  return style;
}
