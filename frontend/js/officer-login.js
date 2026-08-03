const officerLoginForm = document.getElementById('officerLoginForm');
const workIdInput = document.getElementById('workId');
const phoneInput = document.getElementById('phoneNumber');
const passkeyInput = document.getElementById('passkey');
const formError = document.getElementById('formError');

const MASTER_PASSKEY = 'JKUAT2026#INTAKE';

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function clearError() {
  formError.textContent = '';
  formError.hidden = true;
}

if (officerLoginForm) {
  officerLoginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearError();

    const workId = workIdInput.value.trim();
    const phoneNumber = phoneInput.value.trim();
    const passkey = passkeyInput.value.trim();

    const validWorkId = /^JKUAT-OFF-\d{4}$/i.test(workId);
    const validPhone = /^(\+254|0)\d{9}$/.test(phoneNumber);
    const validPasskey = passkey === MASTER_PASSKEY;

    if (!validWorkId || !validPhone || !validPasskey) {
      showError('Please enter a valid work ID, a valid phone number, and the correct station passkey.');
      return;
    }

    localStorage.setItem('officerSession', 'active');
    localStorage.setItem('officerId', workId);
    window.location.href = 'officer.html';
  });
}
