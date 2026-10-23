import './style.css';

const status = document.querySelector<HTMLParagraphElement>('#app-status');

if (status) {
  status.textContent = 'Wegweiser ist bereit für die nächsten Ausbauschritte.';
}
