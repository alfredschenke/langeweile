import './components';
import styles from './index.scss';

// inject global style
const GLOBAL_STYLE_ID = 'asm.globals';
if (document.getElementById(GLOBAL_STYLE_ID) === null) {
  const style = document.createElement('style');
  style.id = GLOBAL_STYLE_ID;
  style.innerHTML = styles as string;
  document.head.appendChild(style);
}

// add app component
document.body.innerHTML = '<asm-app></asm-app>';
