import { cardDataBase } from "./localCards";
const allCardsArray = cardDataBase;

// this function fetchs single cards from the database accoroding to the card number
//
function fetchCard(cardId) {
  return allCardsArray.filter((card) => {
    if (card.id == cardId) {
      return card;
    }
  })[0];
}

export default fetchCard;
