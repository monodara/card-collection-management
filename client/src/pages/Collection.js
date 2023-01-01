import "../cssFiles/collection.css";
// import CardCollection from "../components/CardCollection";
import React from "react";
import axios from "axios";
import { useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import SingleCard from "../components/SingleCard";
import { useState, useForceUpdate, useCallback } from "react";

const Collection = (props)=> {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [cardData, setCardDate] = useState([]);
  const [collectionCards, setCollectionCards] = useState([]);
  const {isCreateDeck, removeFromCollection,changedCol} = props;
  //load all cards in the collection
  const cookies = useCookies("user");
  const userID = cookies[0].UserId;
  useState(async()=>{
    console.log(cookies)
    try{
      const response = await axios.post(
        `http://localhost:8000/loadCollection`,
        {userID,changedCol}
        );
        const carddata = response.data;

          // setCollectionCards(carddata)
          update(carddata)
          setCardDate(carddata);

        // forceUpdate();
      }catch(error){console.log(error)};
    },[cardData,collectionCards]);

  const update=(carddata)=>{setCollectionCards(carddata)}  
  // this function fetchs cards based on a RNG
  // that uses a gauge to pick the card.
  const fetchCard = async () => {
      const numOfEachRarity = 40;
      var cardNum;
      //if the random number is 1~10, the create an "ultra rare" card
      //if the random number is 11~30, the create an "rare" card
      //if the random number is 31~60, the create an "common" card
      //using the random number to control the ratio in card collection
      //ultra-rare cards to rare cards to common cards is controlled as 1:2:3. 
      var cardRarity = Math.floor(Math.random() * 60) + 1;
      /*
      The team should have created 120 cards 
      (40 ultra-rare cards, 40 rare cards and 40 common cards; 60 for attack, 60 for defence) 
      and each member took the responsibility of devising 24 cards. 
      However, some members did not finish this task such that we only have 80 cards. 
      And the card numbers are discontiguous.
      So, the code below is for generating cards using 8 ultra-rare, 8 rare and 8 common cards.
      */
      if (cardRarity <= 10) {
        // cardNum = Math.floor(Math.random() * numOfEachRarity) + 1;
        cardNum = Math.floor(Math.random() *8) + 33;
      } else if (cardRarity <= 30) {
        cardNum = Math.floor(Math.random() *8) + 73;
        // cardNum = Math.floor(Math.random() * numOfEachRarity) + 1 + numOfEachRarity;
      } else {
        cardNum = Math.floor(Math.random() *8) + 113;
        // cardNum = Math.floor(Math.random() * numOfEachRarity) + 1 + numOfEachRarity * 2;
      } 
      try{

        const response = await axios.post(
          `http://localhost:8000/fetchcard`,
          {userID, cardNum}
          );
          const oneCard = response.data;
          // setCollectionCards(oneCard);
          update(oneCard)
          setCardDate(oneCard);
      }catch(error){
        console.log(error)
      }    
  };
  ///////Filter function that filters by rarity.
  const filterByRarity = (rarityString) => {
    if (rarityString === "all") {
      setCardDate(collectionCards);

      return;
    }
    var cardsAfterFilter = collectionCards.filter((card) => {return card.rarity === rarityString});
    setCardDate(cardsAfterFilter);

  };

  ///////Filter function that filters by attack or defence.
  const filterByType = (cardType) => {
    if (cardType === "all") {
      setCardDate(collectionCards);

      return;
    }
    var cardsAfterFilter = collectionCards.filter((card) => {
      if (card.cardType === cardType) {
        return card;
      }
    });
    setCardDate(cardsAfterFilter);

  };

  const navigate = useNavigate();
  const goToDashboard = ()=>{
    navigate("/dashboard");
  }
  
    return (
      <div className="collection">
        <button onClick={goToDashboard}>Go back to Dashboard</button>
        <button className="buttons" onClick={fetchCard}>add ONE card</button>
        {/* <button className="buttons" onClick={() => {fetchCard(5);}}>add FIVE card</button> */}
        <br />
        <form className="filters" style={{ fontSize: "1.2rem" }}>
          <label style={{ color: "lightblue", marginLeft: "10px" }} htmlFor="rarity">
            Choose a card rarity
          </label>
          <select
            style={{ marginLeft: "10px" }}
            name="rarity"
            id="cardRarity"
            onChange={(e) => {
              filterByRarity(e.target.value);
            }}
          >
            <option defaultValue="---">---</option>
            <option value="all">all</option>
            <option value="ultra rare">ultra rare</option>
            <option value="rare">rare</option>
            {/* <option value="uncommon">uncommon</option> */}
            <option value="common">common</option>
          </select>
          <label
            style={{ color: "lightblue", marginLeft: "10px" }}
            htmlFor="cardType"
          >
            Choose a card type
          </label>
          <select
            style={{ marginLeft: "10px" }}
            name="cardType"
            id="cardType"
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option defaultValue="---">---</option>
            <option value="all">all</option>
            <option value="attack">attack</option>
            <option value="defence">defence</option>
          </select>
        </form>

        <div className="cardCollection">
          
          {cardData.filter((c)=>{return c !== null && c.cardNum !== props.removedCardNum}).map((card, i) => (
            <div key={i}>
              {/* {console.log(c)} */}
              <SingleCard 
              SingleCardData={card} 
              isCreateDeck={isCreateDeck} 
              addToDeck={props.addToDeck}
              removeFromCollection={removeFromCollection}/>
            </div>
          ))}
        </div>
      </div>
    );
  
}

export default Collection;
