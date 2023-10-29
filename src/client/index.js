import { submitForm } from './js/app'
import { checkLocation } from './js/checkLocation'
import { checkDate } from './js/checkDate'

document.querySelector('#form-submit').addEventListener('click', (e) => submitForm(e));

import './styles/layout.scss';
import './styles/header.scss';
import './styles/main.scss';
import './styles/footer.scss';

export {
  submitForm,
  checkLocation,
  checkDate
}