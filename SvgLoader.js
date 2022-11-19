import axios from 'axios';

export default {
  async load(url, attrs = {}) {
    const svg = createSvg(await extractSvg(url));
    Object.keys(attrs).forEach((key) => {
      if (key === 'colorable' && attrs[key]) makeColorable(svg);
      svg.setAttribute(key, attrs[key]);
    });
    return svg;
  },
};

const imgs = document.querySelectorAll('img[data-svg-load]');
[...imgs].forEach(async (img) => {
  const url = simplifyPath(img.src);

  const svg = createSvg(await extractSvg(url));
  if (img.dataset.svgColorable === 'true') makeColorable(svg);

  [...img.attributes].forEach((attr) => {
    attr = attr.name;
    if (attr === 'src') return;
    if (attr.startsWith('data-svg')) return;
    svg.setAttribute(attr, img.getAttribute(attr));
  });

  img.insertAdjacentElement('beforebegin', svg);
  img.remove();
});

function createSvg(content) {
  const container = document.createElement('div');
  container.innerHTML = content;
  const svg = container.querySelector('svg');
  container.insertAdjacentElement('beforebegin', svg);
  container.remove();
  return svg;
}

function makeColorable(svg) {
  const toColorable = (node) => {
    ['fill', 'stroke'].forEach((attrName) => {
      const attr = node.getAttribute(attrName);
      if (attr && attr !== 'none') node.setAttribute(attrName, 'currentColor');
    });
  };

  if (svg.getAttribute('fill') !== 'none') svg.setAttribute('fill', 'currentColor');

  const paths = svg.querySelectorAll('path');
  const gs = svg.querySelectorAll('g');

  paths.forEach(toColorable);
  gs.forEach(toColorable);
}

function simplifyPath(path) {
  if (path.startsWith('./') || path.startsWith('/')) {
    const slash = path.indexOf('/');
    path = path.substring(slash + 1);
  }
  if (path.endsWith('.svg')) {
    const ext = path.lastIndexOf('.svg');
    path = path.substring(0, ext);
  }
  return path;
}

async function extractSvg(url) {
  if (!url.endsWith('.svg')) url += '.svg';

  try {
    const { data } = await axios.get(url);
    return /<svg(.|\s)*<\/svg>/.exec(data)[0];
  } catch (error) {
    throw new Error(`Could not fetch ${url}`);
  }
}
