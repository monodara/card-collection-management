// import "../cssFiles/collection.css";
// import axios from "axios";
// import { useCookies} from "react-cookie";
// import {useEffect} from "react";
// import SingleCard from "./SingleCard.js";
// import { useState } from "react";
// import React from "react";

// const CardCollection =  ()=> {
//   const [cardData, setCardDate] = useState([]);
//   const [collectionCards, setCollectionCards] = useState([]);
//   //load all cards in the collection
//   const cookies = useCookies("user");
//   const userID = cookies[0].UserId;
//   useState(async()=>{
//     try{
//       const response = await axios.post(
//         `http://localhost:8000/loadCollection`,
//         {userID}
//         );
//         setCardDate(response.data);
//       }catch(error){console.log(error)};
//     });
    
//     // this function fetchs cards based on a RNG
//     // that uses a gauge to pick the card.
//   const fetchCard = async () => {
      
//       const numOfEachRarity = 40;
//       var cardNum;
//       //the the random number is 1~10, the create an "ultra rare" card
//       //the the random number is 11~30, the create an "rare" card
//       //the the random number is 31~60, the create an "common" card
//       var cardRarity = Math.floor(Math.random() * 60) + 1;
      
//       if (cardRarity <= 10) {
//         // cardNum = Math.floor(Math.random() * numOfEachRarity) + 1;
//         cardNum = Math.floor(Math.random() *8) + 33;
//       } else if (cardRarity <= 30) {
//         cardNum = Math.floor(Math.random() *8) + 73;
//         // cardNum = Math.floor(Math.random() * numOfEachRarity) + 1 + numOfEachRarity;
//       } else {
//         cardNum = Math.floor(Math.random() *8) + 113;
//         // cardNum = Math.floor(Math.random() * numOfEachRarity) + 1 + numOfEachRarity * 2;
//       } 
//       try{
//         const response = await axios.post(
//           `http://localhost:8000/fetchcard`,
//           {userID, cardNum}
//           );
//           const oneCard = response.data;
//           setCollectionCards([oneCard, ...collectionCards]);
//           setCardDate(collectionCards);

//       }catch(error){
//         console.log(error)
//       }    
//   };
//   ///////Filter function that filters by rarity.
//   const filterByRarity = (rarityString) => {
//     if (rarityString === "all") {
//       setCardDate(collectionCards);

//       return;
//     }
//     var cardsAfterFilter = collectionCards.filter((card) => {
//       if (card.rarity === rarityString) {
//         return card;
//       }
//     });
//     setCardDate(cardsAfterFilter);

//   };

//   ///////Filter function that filters by attack or defence.
//   const filterByType = (cardType) => {
//     if (cardType === "all") {
//       setCardDate(collectionCards);

//       return;
//     }
//     var cardsAfterFilter = collectionCards.filter((card) => {
//       if (card.cardType === cardType) {
//         return card;
//       }
//     });
//     setCardDate(cardsAfterFilter);

//   };

//     return (
//       <div className="colPage">
        
//         <button className="buttons" onClick={fetchCard}>add ONE card</button>
//         <button className="buttons" onClick={() => {fetchCard(5);}}>add FIVE card</button>
//         <br />
//         <form className="filters" style={{ fontSize: "1.2rem" }}>
//           <label style={{ color: "lightblue", marginLeft: "10px" }} htmlFor="rarity">
//             Choose a card rarity
//           </label>
//           <select
//             style={{ marginLeft: "10px" }}
//             name="rarity"
//             id="cardRarity"
//             onChange={(e) => {
//               filterByRarity(e.target.value);
//             }}
//           >
//             <option value="all">all</option>
//             <option value="ultra rare">ultra rare</option>
//             <option value="rare">rare</option>
//             {/* <option value="uncommon">uncommon</option> */}
//             <option value="common">common</option>
//           </select>
//           <label
//             style={{ color: "lightblue", marginLeft: "10px" }}
//             htmlFor="cardType"
//           >
//             Choose a card type
//           </label>
//           <select
//             style={{ marginLeft: "10px" }}
//             name="cardType"
//             id="cardType"
//             onChange={(e) => {
//               filterByType(e.target.value);
//             }}
//           >
//             <option value="all">all</option>
//             <option value="attack">attack</option>
//             <option value="defence">defence</option>
//           </select>
//         </form>

//         <div className="cardCollection">
//           {cardData.map((c, i) => (
//             <div key={i}>
//               <SingleCard SingleCardData={c} />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
  
// }
// export default CardCollection;