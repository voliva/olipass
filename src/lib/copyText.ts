export function copyText(text?: string) {
  if (!text) return;

  function selectElementText(element: HTMLElement) {
    if ((document as any).selection) {
      let range = (document.body as any).createTextRange();
      range.moveToElementText(element);
      range.select();
    } else if (window.getSelection) {
      let range = document.createRange();
      range.selectNode(element);
      const selection = window.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  var element = document.createElement("DIV");
  element.textContent = text;
  document.body.appendChild(element);
  selectElementText(element);
  document.execCommand("copy");
  element.remove();
}
