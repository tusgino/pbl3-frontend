export const setTextContent = (parent, selector, text) => {
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export const setSrcContent = (parent, selector, src) => {
  const element = parent.querySelector(selector);
  if (element) element.src = src;
}