import React from "react";
import PopupWithForm from "./PopupWithForm";

function InfoTooltip({ isInfoTooltipOpen, closeAllPopups, type, notification }) {
    return(
        // <>
        //     {type === 'success' && (
        //         <PopupWithForm name="infotooltip-success" isOpen={isInfoTooltipOpen} onClose={closeAllPopups} showButton={false}>
        //         <button type="button" className="popup-container__close-button popup-close" onClick={closeAllPopups}></button>
        //         <h2 className="popup-container__title-delete">Success</h2>
        //         </PopupWithForm>
        //     )}
        //     {type === 'error' && (
        //         <PopupWithForm name="infotooltip-error" isOpen={isInfoTooltipOpen} onClose={closeAllPopups} showButton={false}>
        //         <button type="button" className="popup-container__close-button popup-close" onClick={closeAllPopups}></button>
        //         <h2 className="popup-container__title-delete">Error</h2>
        //         </PopupWithForm>
        //     )}
        // </>
        <PopupWithForm name="infotooltip-success" isOpen={isInfoTooltipOpen} onClose={closeAllPopups} showButton={false}>
        <button type="button" className="popup-container__close-button popup-close" onClick={closeAllPopups}></button>
        <div className={`popup__infotooltip_image-type_${notification.type}`} ></div>
        <h2 className="popup-container__title-infotooltip">{notification.text}</h2>
        </PopupWithForm>
   );
}

export default InfoTooltip;