/**
 * Reveals the index of the given element within its siblings
 * @param element
 * @returns index or -1
 */
export function getElementIndex(element: HTMLElement): number {
  if (element.parentElement === null) {
    return -1;
  }
  return Array.from(element.parentElement.children).indexOf(element);
}
