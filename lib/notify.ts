import Swal from 'sweetalert2';

const BRAND_BLUE = '#359aff';
const BRAND_TEXT = '#0b2f66';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: '#ffffff',
  customClass: {
    popup: 'swal2-toast-custom',
  },
  didOpen: (toast) => {
    // pause timer on hover
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

function buildHtml(iconSvg: string, title: string, sub?: string) {
  return `
    <div class="toast-inner">
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${sub ? `<div class="toast-sub">${sub}</div>` : ''}
      </div>
    </div>
  `;
}

export function successToast(title: string, sub?: string) {
  const checkSvg = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#5cc1ff" />
          <stop offset="100%" stop-color="#1590ff" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" stroke="url(#g1)" stroke-width="1.5" fill="url(#g1)" fill-opacity="0.12"/>
      <path d="M7.5 12.5l2.5 2.5L16.5 9" stroke="${BRAND_BLUE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return Toast.fire({
    icon: undefined,
    html: buildHtml(checkSvg, title, sub),
    color: BRAND_TEXT,
    // keep timer as configured in mixin
  });
}

export function errorToast(title: string, sub?: string) {
  const errSvg = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#ffecec" />
      <path d="M15 9L9 15M9 9l6 6" stroke="#d33" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return Toast.fire({
    icon: undefined,
    html: buildHtml(errSvg, title, sub),
    color: '#6e1212',
    timer: 6000,
  });
}

export default Toast;
