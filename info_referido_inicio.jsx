//Codigo jsx
import "./Modal_mkt_recr.css";
import equix from "../../assets/images/icons8-x-48.png";
import lupa from "../../assets/images/icons8-búsqueda-50.png";
import { getInitials } from "../CostantsComponent/getInitials";
import { formatTimeElapsed } from "../CostantsComponent/timeElapsed";
import { COLORS_ARRAY } from "../CostantsComponent/costants";
import coment from "../../assets/images/comentario.png";
import { useState } from "react";
import { useAuth } from "../AuthContextComponent/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { TaAssignePeople } from "../CostantsComponent/TaAssignePeople";
import { lastUpdate } from "../CostantsComponent/TaAssignePeople";

const getUserColor = (user, usersArray, colorArray) => {
  if (!user || !usersArray || !colorArray || usersArray.length === 0) {
    return "#ccc";
  }
  const userIndex = usersArray.findIndex((u) => u.id === user.id);
  const colorIndex = userIndex !== -1 ? userIndex % colorArray.length : 0;
  return colorArray[colorIndex];
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

function Modal_MKT_RECR({
  card,
  onClose,
  mktUsers = [],
  recruiterUsers = [],
  view,
}) {
  const [opcionSelecionada, setOpcionSelecionada] = useState("");

  const handleCambio = (event) => {
    // Corrección: event.target.value en lugar de event.target.vaue
    setOpcionSelecionada(event.target.value);
  };

  const { userData } = useAuth();
  const [commentText, setCommentext] = useState("");
  const [comments, setComments] = useState([]);

  const handleAddComment = () => {
    if (commentText.trim() === "" || !userData) {
      return;
    }
    const usersToSearch = view === "recr" ? recruiterUsers : mktUsers;
    const userColor = getUserColor(userData, usersToSearch, COLORS_ARRAY);
    const newComment = {
      id: Date.now(),
      text: commentText,
      userInitials: getInitials(userData.name),
      userName: userData.name,
      userColor: userColor,
      timestamp: new Date(),
    };
    setComments((prevComments) => [
      newComment,
      ...(Array.isArray(prevComments) ? prevComments : []),
    ]);
    setCommentext("");
  };

  if (!card) {
    return null;
  }

  const mktAssigneeUser = mktUsers.find(
    (user) =>
      user.id === card.selectedMktUser?.id || user.id === card.assignedMktUserId
  );
  const taAssigneeUser = recruiterUsers.find(
    (user) => user.id === card.assignedRecruiterId
  );

  const renderUserBadge = (user) => {
    if (!user) return "No Asignado";
    const usersToSearch = view === "recr" ? recruiterUsers : mktUsers;
    const userIndex = usersToSearch.findIndex((u) => u.id === user.id);
    const userColor = COLORS_ARRAY[userIndex % COLORS_ARRAY.length];

    return (
      <>
        <span
          className="initial-user"
          style={{
            backgroundColor: userColor,
            marginRight: "4px",
          }}
        >
          {getInitials(user.name)}
        </span>
        {user.name}
      </>
    );
  };

  return (
    <>
      <div className="modal-overlay-mkt-recr" onClick={onClose}>
        <div
          className="modal-content-mkt-recr"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="header-title-btn">
            <div className="title-mkt-recr">
              <h2 className="modal-title-mkt-recr">Referral info</h2>
            </div>
            <div className="close-btn-detail-referral">
              <button className="modal-close-button-mkt-recr" onClick={onClose}>
                <img alt="" src={equix} className="equix"></img>
              </button>
            </div>
          </div>
          <div className="paneles">
            <div className="panel-izquierdo">
              <div className="modal-body-mkt-recr">
                <span className="modal-label">Name</span>
                <span className="modal-value">{card.name}</span>
                <span className="modal-label">Email</span>
                <span className="modal-value">{card.email}</span>
                <span className="modal-label">Phone</span>
                <span className="modal-value">{card.phoneNumber}</span>
                {card.referredBy && (
                  <>
                    <span className="modal-label">Referral ID</span>
                    <span className="modal-value">{card.referralID}</span>
                  </>
                )}
                <span className="modal-label">Area</span>
                <span className="modal-value">{card.area}</span>
                <span className="modal-label">Country</span>
                <span className="modal-value">{card.country}</span>
                <span className="modal-label">City</span>
                <span className="modal-value">{card.city}</span>
                <span className="modal-label">Referred by</span>
                <span className="modal-value">{card.referredBy}</span>
              </div>
            </div>
            <div className="panel-derecho">
              <div className="titulo-panel-derecho">
                <img className="lupa2" src={lupa} alt=""></img>
                <h2 className="titulo">Details</h2>
              </div>
              <div className="aligh-derecho">
                <div className="modal-body-mkt-recr">
                  {view === "mkt" && (
                    <>
                      <span className="modal-label">Assignee</span>
                      <span className="modal-value">
                        {renderUserBadge(mktAssigneeUser)}
                      </span>
                    </>
                  )}
                  {view === "recr" && (
                    <>
                      <span className="modal-label">Assignee</span>
                      <span className="modal-value">
                        {renderUserBadge(taAssigneeUser)}
                      </span>
                    </>
                  )}
                  <span className="modal-label">Status</span>
                  <span className="modal-value">{card.status}</span>
                  <span className="modal-label">Creation date</span>
                  <span className="modal-value">{card.date}</span>
                  <span className="modal-label">Vigency</span>
                  <span className="modal-value">
                    {formatTimeElapsed(card.creationDate)} days
                  </span>

                  {/* CLAVE: CORRECCIÓN DE LA LÓGICA CONDICIONAL */}
                  {view === "recr" && card.status === "In Progress" && (
                    <>
                      <span className="modal-label">TA Assigne</span>
                      <div>
                        <select
                          id="selector"
                          value={opcionSelecionada}
                          onChange={handleCambio}
                          className="selector-taassigne"
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {TaAssignePeople.map((user) => (
                            <option key={user.id} value={user.name}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="modal-label">Last Update</span>
                      <div>
                        <select
                          id="selector"
                          value={opcionSelecionada}
                          onChange={handleCambio}
                          className="selector-taassigne"
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {lastUpdate.map((options, index) => (
                            <option key={index} value={options.option}>
                              {options.option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

  {/* Codigo css*/}
 @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap");

/* --- Modal Contenedor General --- */
.modal-overlay-mkt-recr {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
}
select {
  font-size: 13px;
}

.modal-content-mkt-recr {
  background: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 60%;
  height: 95vh;
  position: relative;
  animation: modalFadeIn 0.3s forwards;
  display: flex;
  flex-direction: column;
}

.modal-title-mkt-recr {
  color: rgb(220, 112, 56);
}
.header-title-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.lupa2 {
  width: 1.8rem;
  height: 1.8rem;
}
.modal-close-button-mkt-recr {
  background: none;
  border: none;
  cursor: pointer;
}
.equix {
  width: 35px;
}
.modal-close-button-mkt-recr:hover {
  color: #333;
}
.img-coment {
  width: 2rem;
}
.title-coments {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.titulo-panel-derecho {
  display: flex;
  gap: 12px;
  justify-content: start;
  margin-left: 5px;
  padding-top: 2px;
}
.titulo {
  font-size: 25px;
  font-family: "Poppins", sans-serif;
}
.selector-taassigne {
  border: none;
}
.paneles {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex: 1;
}
.modal-body-mkt-recr {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
}
.panel-derecho {
  width: 22.5rem;
  height: fit-content;
  background-color: #fff;
  border: solid 2px #9999;
  border-radius: 5px;
}
.aligh-derecho {
  margin-left: 8px;
  margin-top: 1px;
}

.modal-label {
  color: #6c757d;
}
.modal-value {
  color: #000;
  font-family: "Poppins", sans-serif;
}
.comment-text {
  margin: 0 0 5px 0;
  white-space: pre-wrap;
}
.no-comments-message {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}
.initial-user {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 50%;
  color: #fff;
}

      
