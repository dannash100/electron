const { clipboard } = require('electron');

const request = require('request').defaults({
  url: 'https://cliphub.glitch.me/clippings',
  headers: { 'User-Agent': 'Clipmaster 9000' },
  json: true,
});

const clippingsList = document.getElementById('clippings-list');
const copyFromClipboardButton = document.getElementById(
  'copy-from-clipboard',
);

const createClippingElement = (clippingText) => {
  const clippingElement = document.createElement('article');

  clippingElement.classList.add('clippings-list-item');

  clippingElement.innerHTML = `
  <div class="clipping-text" disabled="true"></div>
  <div class="clipping-controls">
  <button class="copy-clipping">&rarr; Clipboard</button>
  <button class="publish-clipping">Publish</button>
  <button class="remove-clipping">Remove</button>
  </div>  
  `;

  clippingElement.querySelector('.clipping-text').innerText = clippingText;

  return clippingElement;
};

const addClippingToList = () => {
  const clippingText = clipboard.readText();
  const clippingElement = createClippingElement(clippingText);
  clippingsList.prepend(clippingElement);
};

const publishClipping = (clipping) => {
  request.post({ json: { clipping } }, (error, response, body) => {
    if (error) return alert(JSON.parse(error).message);
    const { url } = body;
    alert(url);
    clipboard.writeText(url);
  });
};

const getButtonParent = ({ target }) => target.parentNode.parentNode;

const getClippingText = clippingListItem => clippingListItem.querySelector('.clipping-text').innerText;

const removeClipping = target => target.remove();

const writeToClipboard = clippingText => clipboard.writeText(clippingText);

copyFromClipboardButton.addEventListener('click', addClippingToList);

clippingsList.addEventListener('click', (event) => {
  const hasClass = className => event.target.classList.contains(className);

  const clippingListItem = getButtonParent(event);

  if (hasClass('remove-clipping')) removeClipping(clippingListItem);
  if (hasClass('copy-clipping')) writeToClipboard(getClippingText(clippingListItem));
  if (hasClass('publish-clipping')) publishClipping(getClippingText(clippingListItem)); // not finished
});
