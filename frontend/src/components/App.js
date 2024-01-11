import React, { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as apiAuthorize from "../utils/apiAuthorize";
import { setToken } from "../utils/token";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const openInfotooltip = ({ type, text }) => {
    setNotification({ type, text });
    setIsInfoTooltipOpen(true);
    setTimeout(() => {
      setIsInfoTooltipOpen(false);
    }, 1500);
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await apiAuthorize.authorize(email, password);
      if (data.token) {
        setToken(data.token);
        setLoggedIn(true);
        setUserEmail(email);
        localStorage.setItem("loggedIn", true);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      openInfotooltip({
        type: "error",
        text: "Что-то пошло не так! Попробуйте ещё раз.",
      });
    }
  };

  const handleRegister = (email, password) => {
    return apiAuthorize
      .register(email, password)
      .then((data) => {
        if (data) {
          openInfotooltip({
            type: "success",
            text: "Вы успешно зарегистрировались!",
          });
          navigate("/sign-in", { replace: true });
        }
      })
      .catch((err) => {
        openInfotooltip({
          type: "error",
          text: "Что-то пошло не так! Попробуйте ещё раз.",
        });
        console.log(err);
      });
  };

  const onSignOut = () => {
    localStorage.clear();
    setLoggedIn(false);
    navigate("/sign-in");
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleDeletePopupClick(card) {
    setIsDeletePopupOpen(true);
    setCardToDelete(card);
  }

  function handleConfirmDelete() {
    if (cardToDelete) {
      handleCardDelete(cardToDelete);
    }
    setIsDeletePopupOpen(false);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c === card._id ? newCard : c)));
      })
      .catch((err) => {
        console.log("Ошибка: ", err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCardApi(card._id)
      .then(() => {
        setCards((prevState) => prevState.filter((c) => c !== card._id));
        setIsDeleting(false);
      })
      .catch((err) => {
        console.log("Ошибка: ", err);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(null);
  }

  function handleUpdateUser({ name, about }) {
    api
      .editApiProfile(name, about)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Ошибка:", err);
      });
  }

  function handleUpdateAvatar(newAvatar) {
    api
      .editAvatar(newAvatar.avatar)
      .then((res) => {
        setCurrentUser({ ...currentUser, avatar: res.avatar });
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Ошибка:", err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewCardApi(name, link)
      .then((newPlace) => {
        setCards([newPlace, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log("Ошибка:", err);
      });
  }

  useEffect(() => {
    function handleEscClose(event) {
      if (event.key === "Escape") {
        closeAllPopups();
      }
    }

    function handleOverlayClose(event) {
      if (event.target.classList.contains("popup")) {
        closeAllPopups();
      }
    }
    if (
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isEditAvatarPopupOpen ||
      isDeletePopupOpen ||
      isInfoTooltipOpen
    ) {
      window.addEventListener("keydown", handleEscClose);
      window.addEventListener("mousedown", handleOverlayClose);
    }

    return () => {
      window.removeEventListener("keydown", handleEscClose);
      window.removeEventListener("mousedown", handleOverlayClose);
      document.body.classList.add("body");
    };
  }, [
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isDeletePopupOpen,
    isInfoTooltipOpen,
  ]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getApiUserInfo()
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getAllCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => {
          console.log("Ошибка:", err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiAuthorize
        .checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserEmail(res.email);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (loggedIn) navigate("/");
  }, [loggedIn, navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          onSignOut={onSignOut}
          loggedIn={loggedIn}
          userEmail={userEmail}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                loggedIn={loggedIn}
                component={Main}
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                setCards={setCards}
                onCardDelete={handleCardDelete}
                onDeletePopupClick={handleDeletePopupClick}
                onSignOut={onSignOut}
              />
            }
          />
          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="*" element={<Navigate replace to="/sign-in" />} />
        </Routes>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <Footer />

        <EditProfilePopup
          isEditProfilePopupOpen={isEditProfilePopupOpen}
          closeAllPopups={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isAddPlacePopupOpen={isAddPlacePopupOpen}
          closeAllPopups={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isEditAvatarPopupOpen={isEditAvatarPopupOpen}
          closeAllPopups={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <DeleteCardPopup
          isDeletePopupOpen={isDeletePopupOpen}
          closeAllPopups={closeAllPopups}
          onConfirmDelete={handleConfirmDelete}
          card={cardToDelete}
          isDeleting={isDeleting}
        />

        <InfoTooltip
          isInfoTooltipOpen={isInfoTooltipOpen}
          closeAllPopups={closeAllPopups}
          notification={notification}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
