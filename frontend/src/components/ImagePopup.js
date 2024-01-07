import React, {useEffect} from "react";

function ImagePopup({ card, onClose }) {
  useEffect(() => {
    function handleEscClose(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    function handleOverlayClose(event) {
      if (event.target.classList.contains('popup')) {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscClose);
    window.addEventListener('mousedown', handleOverlayClose);

    return () => {
      window.removeEventListener('keydown', handleEscClose);
      window.removeEventListener('mousedown', handleOverlayClose);
    };
  }, [onClose]);

    return (
      <div className={`popup popup_form_image ${card ? 'popup_opened' : ''}`}>
        <div className="popup-image-container">
          <img src={card?.link} alt={card?.name} className="popup-image-container__image-fullscreen" />
          <h2 className="popup-image-container__title-fullscreen">{card?.name}</h2>
          <button type="button" className="popup-image-container__close-button popup-close" onClick={onClose}></button>
        </div>
      </div>
    );
  }

export default ImagePopup;