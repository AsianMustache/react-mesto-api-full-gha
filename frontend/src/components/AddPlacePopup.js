import React, {useRef, useEffect} from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({isAddPlacePopupOpen, closeAllPopups, onAddPlace}) {
    const nameRef = useRef();
    const linkRef = useRef();

    useEffect(() => {
        if (!isAddPlacePopupOpen) {
            nameRef.current.value = '';
            linkRef.current.value = '';
        }
    }, [isAddPlacePopupOpen]);
    
    function handleSubmit(e) {
        e.preventDefault();

        onAddPlace({
            name: nameRef.current.value,
            link: linkRef.current.value
        })
    }

    return(
        <PopupWithForm name="add" title="Новое место" isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onSubmit={handleSubmit} buttonText="Добавить">
                <label className="popup__label">
                    <input ref={nameRef} type="text" id="name-place" name="name-place"  placeholder="Название" className="add-form__text add-form__text_input_title popup__input" minLength="2" maxLength="40" required />
                    <span className="name-place-error popup__input-error"></span>
                </label>
                <label className="popup__label">
                    <input ref={linkRef} type="url" name="url" id="url" placeholder="Ссылка на картинку" className="add-form__text add-form__text_input_url popup__input" required />
                    <span className="url-error popup__input-error"></span>
                </label>
        </PopupWithForm>
    )
}

export default AddPlacePopup;