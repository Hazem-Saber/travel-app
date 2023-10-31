import { submitForm } from './js/app'
import { clearForm } from './js/app'
import { checkLocation } from './js/checkLocation'
import { checkDate } from './js/checkDate'

document.querySelector('#form-submit').addEventListener('click', (e) => submitForm(e));

document.querySelector('#form-clear').addEventListener('click', (e) => clearForm(e));

import './styles/layout.scss';
import './styles/header.scss';
import './styles/main.scss';
import './styles/footer.scss';

export {
  submitForm,
  clearForm,
  checkLocation,
  checkDate
}