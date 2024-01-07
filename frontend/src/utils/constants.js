  const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    disabledButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__input-error_visible'
  };
  
  const optionsApi = { 
    url: 'https://mesto.nomoreparties.co/v1/cohort-76', 
    headers: {
      authorization: '83dc9433-9b9b-4fa6-92f5-5a62f5b1db23',
      'Content-Type': "application/json"
    }
  };


  export {
    validationConfig,
    editButtonElement,
    popupEditForm,
    editForm,
    addButtonElement,
    popupAddForm,
    addForm,
    cardsContainer,
    closeButtons,
    nameElement,
    urlElement,
    inputName,
    inputDescription,
    optionsApi
  };
