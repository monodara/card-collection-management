import "../cssFiles/collection.css";
import { useState } from "react";
import React from "react";
import SingleCard from "../components/SingleCard";

const DeckCards = (props)=> {
  const [isInDeck, setIsInDeck] = useState(true);
  const cardInThisDeck = props.cardInThisDeck;
  // console.log(cardInThisDeck);
  useState(()=>{setIsInDeck(true)})
  
  return (
    <div className="collection">
    <div className="cardCollection">
      {cardInThisDeck.filter((c)=>{return c !== null}).map((c, i) => (
        
        <div className="cardCollection" key={i}>
          <SingleCard SingleCardData={c} isInDeck={isInDeck}
          removeFromDeck={props.removeFromDeck}
          addBackToDeckCollection={props.addBackToDeckCollection}/>
        </div>
      ))}
    </div>
    </div>
  );

}
export default DeckCards;