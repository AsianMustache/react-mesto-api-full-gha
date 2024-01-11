import React from "react";
import trash from "../images/Trash.svg";
import like from "../images/favorite.svg";
import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onDeletePopupClick }) {
  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onDeletePopupClick(card);
  }

  const currentUser = useContext(CurrentUserContext);

  return (
    <article className="element">
      {card.owner === currentUser._id && (
        <button
          type="button"
          className="element__delete-button"
          onClick={handleDeleteClick}
        >
          <img
            className="element__image-delete"
            src={trash}
            alt="Кнопка удаления"
          />
        </button>
      )}
      <img
        className="element__image"
        style={{ backgroundImage: `url(${card.link})` }}
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <div className="element__group">
        <h2 className="element__group-title">{card.name}</h2>
        <button
          type="button"
          className="element__group-button"
          onClick={handleLikeClick}
        >
          <img
            className={`element__group-favorite ${
              card.likes.some((i) => i === currentUser._id)
                ? "element__group-favorite_active"
                : ""
            }`}
            alt="Избранное"
            src={like}
          />
        </button>
      </div>
      <span id="element__likes" className="element__likes">
        {card.likes.length}
      </span>
    </article>
  );
}

export default Card;
