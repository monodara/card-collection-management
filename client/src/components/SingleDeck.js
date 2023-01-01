import React from "react";
import BacksideImage from "../images/backside_purple.png";
import { useNavigate } from "react-router-dom";
import { useCookies} from "react-cookie";
import "../cssFiles/decks.css";

const SingleDeck = (props)=> {
  const navigate = useNavigate();
  
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  
  const { deck_name } = props.SingleDeck;
  
  
  return (
    <div className="cards" onClick={()=>{
      navigate("/new-deck");
      setCookie("deckName",deck_name, {path: "/"});//store the deck name;
    }}>
      <div className="decksName">{deck_name}</div>
      <img
        className="BacksideImage"
        src={BacksideImage}
        alt="BacksideImage"
      />
    </div>
  );
}
export default SingleDeck;