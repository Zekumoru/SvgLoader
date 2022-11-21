import 'normalize.css';
import './style.css';
import SvgLoader from '../scripts/SvgLoader';

(async () => {
  const svg = await SvgLoader.load('images/picture.svg', {
    colorable: true,
    style: 'color: red',
    wrap: true,
  });
  document.body.appendChild(svg);
})();
