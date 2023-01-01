import * as React from "react";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import Collection from "../pages/Collection";
import DeckCards from "../pages/DeckCards";
import { useState, useForceUpdate, useCallback } from "react";
import "../cssFiles/collection.css";
import { useCookies} from "react-cookie";
import axios from "axios";


const NewDeck = ()=> {

  const [deckName, setDeckName] = useState(""); //set the deck name;
  const [previouName, setPreviouName] = useState(""); //set the deck name;
  const [isNewDeck, setIsNew] = useState(true); //set the deck name;
  const [isCreateDeck, setIsCreateDect] = useState(true); //when creating a deck, render the add button on every card
  const [cardInThisDeck, setCardInThisDeck] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userID = cookies.UserId;//use this userID to add the newDeck to database
  const deckNameInCookies = cookies.deckName;
  const [changedCol, setChanedCol] = useState([]);//the card add to deck and remove from the collection
  
  useState(async()=>{
    console.log(cookies)
    if(deckNameInCookies !== ""){setIsNew(false)}
    setDeckName(deckNameInCookies);
    setPreviouName(deckNameInCookies);
    console.log(deckName)
    try{
      const response = await axios.post(
        `http://localhost:8000/loadSingleDeck`,
        {userID ,deckName}
        );
        const deckCards = response.data;
         update(deckCards);
        console.log(cardInThisDeck)
      }catch(error){console.log(error)};
  },[cardInThisDeck,changedCol]);
  const update =  (deck)=>{setCardInThisDeck(deck)}
  const addToDeck = async (cardNum) => {//when the button clicked, add card to deck
    console.log(deckName)
    if (deckName === "") {
      alert("Deck name is required.")
    } else {
      try {
        const response = await axios.put(
          `http://localhost:8000/addCardToDeck`,
          { cardNum, userID, deckName }
        );
        const cardsInDeck = response.data.deck_cards;
         update(cardsInDeck);
        // setCardInThisDeck(cardsInDeck);
        console.log(cardInThisDeck)
        
      } catch (error) {
        const errMess = await error.message;
        if(errMess.includes("400")) alert("Each deck allows a maximum of 15 cards.");
        if(errMess.includes("401")) alert("Each deck allows a maximum of 3 ultra-rare cards.");
        if(errMess.includes("402")) alert("Each deck allows a maximum of 5 rare cards.");
      }
    }
  }
  const removeFromCollection = async (cardNum)=>{
    if (deckName === "") {
      alert("Deck name is required.")
    } else {
      try {
        const response = await axios.put(
          `http://localhost:8000/removeFromCollection`,
          { cardNum, userID}
          );
          setChanedCol(response.data);
          // window.location.reload();
      } catch (error) {
        console.log(error)
      }
    }
  }
  const removeFromDeck = async (cardNum)=>{
      try {
        const response = await axios.put(
          `http://localhost:8000/removeFromDeck`,
          { cardNum, userID, deckName}
        );
        setCardInThisDeck(response.data)

      } catch (error) {
        console.log(error)
      }
  }
  const addBackToDeckCollection = async (cardNum)=>{
      try {
        const response = await axios.put(
          `http://localhost:8000/addBackToDeckCollection`,
          { cardNum, userID, deckName}
        );
        setChanedCol(response.data)
        // window.location.reload()

      } catch (error) {
        console.log(error)
      }
  }

   
    return (
      <SplitterLayout >
        <div className="collection">
        <Collection 
        isCreateDeck={isCreateDeck}
        addToDeck={addToDeck}
        removeFromCollection={removeFromCollection}
        changedCol={changedCol}
        />
        </div>
     
        <div className="collection">
          <div className="deckName">The Deck Name: <span id={"deck_name"}>{deckName}</span></div>
          {<span>{isNewDeck? "Please give a name to your deck." : "You can change the deck name." }      </span>}
          <input className="DeckNameInput" onChange={(e)=>{
            setDeckName(e.target.parentNode.children[2].value);           
          }}></input>
          {isNewDeck && <button onClick={async (e)=>{//if the deck is new, get the new name 
            if(deckName === ""){
              alert("Deck name cannot be empty.")
            }else{
              const name = document.getElementById("deck_name").innerHTML;
              setCookie("deckName",name, {path: "/"});//store the deck name;
              console.log(deckName)
              try{
                const response = await axios.put(
                  `http://localhost:8000/newDeckName`,
                  {userID, deckName}
                  );
                if(typeof response.data === "string"){
                  alert(response.data)
                }else{
                  setCardInThisDeck(response.data.deck_cards);
                  setIsNew(false);
                  alert("Now you have a new deck - " + response.data.deck_name);
                  setPreviouName(deckName);

                }
                }catch(error){console.log(error)};
            }}}>Confirm the name</button>}
          {!isNewDeck && <button onClick={async (e)=>{//if user is changing the name, get the changed name 
              try{
                const response = await axios.put(
                  `http://localhost:8000/changeDeckName`,
                  {userID, deckName, previouName}
                  );
                  if(typeof response.data === "string"){
                    alert(response.data)
                  }else{
                    console.log(response.data)
                    alert(JSON.stringify(response.data.message))
                    setCardInThisDeck(response.data.updatedDeck.deck_cards);
                    setPreviouName(deckName);
                    console.log(deckName)
              setCookie("deckName",deckName, {path: "/"});//store the deck name;
              console.log(cookies)
                  }
                }catch(error){console.log(error)};  
            }}>Confirm the name</button>}
            <br/>
            <button onClick={()=>{
              alert("Enjoy your game!!")
            }}>Go to play</button>
        <DeckCards 
        deckName={deckName} 
        cardInThisDeck={cardInThisDeck}
        removeFromDeck={removeFromDeck}
        addBackToDeckCollection={addBackToDeckCollection}
        />
        </div>
     
      </SplitterLayout>
    );
  
}
export default NewDeck;
