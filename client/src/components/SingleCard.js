import React from "react";
import "../cssFiles/collection.css";
import CardBackground from "../images/background.png";
import Frame from "../images/frame.png";



const SingleCard = (props)=> {
  const { cardNum, name, image, description, points, cardType, usageTimes, rarity } = props.SingleCardData;
  const { isCreateDeck, isInDeck,addToDeck, removeFromCollection, removeFromDeck,addBackToDeckCollection} = props;

  
  return (
    <div className="cards">
      <img
        className="cardBackground"
        src={CardBackground}
        alt="card_background"
      />
      <img className="cardPicture" src={image} alt="card_picture" />
      <img className="frame" src={Frame} alt="frame" />
      <div className="cardTitle">{name}</div>
      <div className="cardDescription">{description}</div>
      <div className="rarity">
        {rarity === "ultra rare" && <p>★★★</p>}
        {rarity === "rare" && <p>★★✰</p>}
        {rarity === "common" && <p>★✰✰</p>}
      </div>
      <p className="points">{points}</p>
      {isCreateDeck && <button className="addDeckButton" onClick={()=>{addToDeck(cardNum);removeFromCollection(cardNum);}}>+</button>}
      {isInDeck && <button className="addDeckButton" onClick={()=>{removeFromDeck(cardNum);addBackToDeckCollection(cardNum);}}>-</button>}
    </div>
  );
}
export default SingleCard;