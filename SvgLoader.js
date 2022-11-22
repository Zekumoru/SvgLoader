import axios from 'axios';

const SvgLoader = {
  async load(url, attrs = {}) {
    let svg = createSvg(await extractSvg(url));

    if (attrs.colorable) {
      makeColorable(svg);
      delete attrs.colorable;
    }

    if (Object.hasOwn(attrs, 'wrap')) {
      svg = wrap(svg, attrs.wrap);
      delete attrs.wrap;
    }

    Object.keys(attrs).forEach((key) => svg.setAttribute(key, attrs[key]));
    return svg;
  },
  async reload() {
    const imgs = document.querySelectorAll('img[data-svg-load]');
    const promises = [];

    for (const img of imgs) {
      promises.push((async () => {
        const url = simplifyPath(img.src);

        let svg = createSvg(await extractSvg(url));
        const options = extractOptions(img);

        const isColorable = img.dataset.svgColorable !== undefined || Object.hasOwn(options, 'colorable');
        if (isColorable) makeColorable(svg);

        if (Object.hasOwn(options, 'wrap')) svg = wrap(svg, options.wrap);

        passAttributes(img, svg);
        img.insertAdjacentElement('beforebegin', svg);
        img.remove();

        return svg;
      })());
    }

    return Promise.all(promises);
  },
};

export default SvgLoader;

SvgLoader.reload().then((svgs) => {
  document.body.dispatchEvent(new CustomEvent('DOMSvgLoaded', {
    bubbles: true,
    detail: svgs,
  }));
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

function extractOptions(img) {
  const raw = img.dataset.svgLoad;
  const options = {};

  raw.split(',').forEach((option) => {
    let value;
    [option, value] = option.split('=');

    options[option.trim()] = value?.trim();
  });

  return options;
}

function wrap(svg, tag) {
  if (typeof tag === 'boolean' && !tag) return svg;
  if (typeof tag === 'boolean' && tag) tag = '';
  const wrapper = document.createElement(tag || 'div');
  wrapper.appendChild(svg);
  return wrapper;
}

function passAttributes(from, to) {
  [...from.attributes].forEach((attr) => {
    attr = attr.name;
    if (attr === 'src') return;
    if (attr.startsWith('data-svg')) return;
    to.setAttribute(attr, from.getAttribute(attr));
  });
}

async function extractSvg(url) {
  if (!url.endsWith('.svg')) url += '.svg';

  try {
    const { data } = await axios.get(url);
    return /<svg(.|\s)*<\/svg>/.exec(data)[0];
  }
  catch (error) {
    throw new Error(`Could not fetch ${url}`);
  }
}
