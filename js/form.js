import {imgPreview, resetEffectData, replaceClass, changeSlider} from './image_effect.js';
import {isEnterKey, isEscapeKey, showAlert} from './util.js';
import {sendData} from './server_data.js';

const uploadFile = document.querySelector('#upload-file');
const showForm = document.querySelector('.img-upload__overlay');
const canselButton = document.querySelector('#upload-cancel');
const uploadForm = document.querySelector('.img-upload__form');
const publicButton = document.querySelector('#upload-submit');
const textDescription = document.querySelector('.text__description');
const scaleControlValue = document.querySelector('.scale__control--value');
const successMessage = document.querySelector('#success').content.querySelector('.success');
const errorMessage = document.querySelector('#error').content.querySelector('.error');
const successButton = document.querySelector('#success').content.querySelector('.success__button');
const errorButton = document.querySelector('#error').content.querySelector('.error__button');
let templateMessage = undefined;
let sizeWindow = 1;

const resetForm = () => {
  scaleControlValue.value = '100%';
  imgPreview.style.transform = 'scale(1)';
  sizeWindow = 1;
  replaceClass('effects__preview--none');
};

const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closingFormAfterChange();
  }
};

const showFormAfterChange = () => {
  textDescription.textContent = '';
  showForm.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscKeydown);
  resetForm();
  resetEffectData();
  changeSlider();
};

const closingFormAfterChange = () => {
  showForm.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscKeydown);
  uploadForm.reset();
  resetForm();
};

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__text',
  errorTextParent: 'img-upload__text',
  errorTextClass: 'img-upload__text__error-text',
});

const blockSubmitButton = () => {
  publicButton.disabled = true;
  publicButton.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  publicButton.disabled = false;
  publicButton.textContent = 'Отправить';
};

const changeOfSize = (scaleButton) => {
  if(scaleButton && sizeWindow > 0.25 ){
    sizeWindow = sizeWindow - 0.25;
    scaleControlValue.value = `${sizeWindow * 100}%`;
    imgPreview.style.transform = `scale(${sizeWindow})`;
  }
  if (!scaleButton && sizeWindow < 1){
    sizeWindow = sizeWindow + 0.25;
    scaleControlValue.value = `${sizeWindow * 100}%`;
    imgPreview.style.transform = `scale(${sizeWindow})`;
  }
};

const hideWindowMessage = (event) => {
  templateMessage.remove();
  document.removeEventListener('keydown', onMessageEsc);
  document.removeEventListener('click', onMessageClick);
  const button = event.className === 'success__button' ? successButton : errorButton;
  button.removeEventListener('click', clickButtonOnMessage);
};

const onMessageEsc = (evt) => {
  if (isEscapeKey(evt)) {
    hideWindowMessage(evt.target.className);
  }
};
const onMessageClick = (evt) => {
  if (evt.target.className !== 'success__inner' && evt.target.className !== 'success__title' &&
    evt.target.className !== 'error__inner' && evt.target.className !== 'error__title') {
    hideWindowMessage(evt.target.className);
  }
};

const onMessageButton = (evt) => {
  if (evt.target.className === 'success__button' ) {
    hideWindowMessage(evt.target.className);
  }
};

const showAlertMessage = (message, viewMessage) => {
  templateMessage = message.cloneNode(true);
  document.querySelector('body').append(templateMessage);
  document.addEventListener('keydown', onMessageEsc);
  document.addEventListener('click', onMessageClick);
  if (viewMessage === 'success__button') {
    successButton.addEventListener('click', onMessageButton);
  } else {
    errorButton.addEventListener('click', onMessageButton);
  }
};

const setFormSubmit = (onSuccess) => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(
        () => {
          onSuccess();
          unblockSubmitButton();
          showAlertMessage(successMessage, 'success__button');
        },
        () => showAlert('Не удалось отправить форму. Попробуйте еще раз.'),
        new FormData(evt.target),
      );
    } else {
      showAlertMessage(errorMessage, 'error__button');
      unblockSubmitButton();
      showAlert('Не удалось отправить форму. Попробуйте еще раз.');
    }

  });
};

export {pristine, uploadForm, scaleControlValue, publicButton, uploadFile, canselButton, setFormSubmit, blockSubmitButton, unblockSubmitButton, isEnterKey, isEscapeKey,
  onPopupEscKeydown, showFormAfterChange, closingFormAfterChange, changeOfSize };

