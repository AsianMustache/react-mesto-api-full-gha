import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteCardPopup({ isDeletePopupOpen, closeAllPopups, onConfirmDelete, isDeleting }) {
    function handleConfirmClick() {
        onConfirmDelete();
        closeAllPopups();
    }

    return(
        <PopupWithForm name="delete" title="Удаление" isOpen={isDeletePopupOpen} onClose={closeAllPopups} showButton={false}>
                <button type="button" className="popup-container__close-button popup-close" onClick={closeAllPopups}></button>
                <h2 className="popup-container__title-delete">Вы уверены?</h2>
                <button type="button" className="popup-container__delete-button popup__button" onClick={handleConfirmClick} >Да</button>
        </PopupWithForm>
    )
}

export default DeleteCardPopup;