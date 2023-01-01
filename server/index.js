const PORT = 8000;
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ReturnDocument } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

const uri =
  "mongodb+srv://ashAdmin:ashpassword@teamash.xlkj4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("hello yes");
});
app.post("/signup", async (req, res) => {//create a new account;
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  //hashs password
  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await client.connect();
    const database = client.db("ash-db");//use the database "ash-db"
    const users = database.collection("users"); //use the collection users
    
    //
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      return res.status(409).send("user already exist");
    }
    
    const sanitisedEmail = email.toLowerCase();
    const data = {
      user_id: generatedUserId,
      email: sanitisedEmail,
      hashed_password: hashedPassword,
      user_card_collection:[],//store all the cards in the user's collection
    };
    const insertedUser = await users.insertOne(data);
    // res.send(data);//load user information using email information
    const token = jwt.sign(insertedUser, sanitisedEmail, {
      expiresIn: 60 * 24,
    });
    res.status(201).json({ token, userId: generatedUserId });
  } catch (error) {
    console.log("error");
  }
});
//// For logging in
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("ash-db");
    const users = database.collection("users");

    const user = await users.findOne({ email });

    const correctPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).json({ token, userId: user.user_id });
    }
    res.status(400).send("Invalid credentials");
  } catch (err) {
    res.status(401).send()
    // console.log(err + "login");
  }
});

// app.get("/decks", async (req, res) => {
//   const client = new MongoClient(uri);
//   //const userId = req.query.userId;

//   try {
//     await client.connect();
//     const database = client.db("ash-db");
//     const decks = database.collection("decks");

//     const returnedUsers = await decks.find().toArray();

//     res.send(returnedUsers);

//     //  console.log(user);
//   } finally {
//     await client.close();
//   }
// });
app.post("/fetchcard", async (req, res)=>{
  const {userID, cardNum} = req.body;
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const cards = database.collection("card-data");
    //find a card according to cardNum, then add it to the user's collection
    const card = await cards.findOne({cardNum});
    //find the user according to the userID
    var usersCollection = database.collection("users");
    const user = await usersCollection.findOne({user_id:userID});
    const currentCollection = user.user_card_collection;//the card array in the user's collection
    if(card !== null){
      const newValue = {$set: {user_card_collection : currentCollection.concat(card)}};
      await usersCollection.updateOne({user_id:userID}, newValue);

    }
    const cardCollection = await user.user_card_collection;
    res.send(cardCollection);//send all the cards in the user's collection
  }catch(error){
    console.log(error);
  }finally{
    // await client.close();
  }
})
app.put("/addCardToDeck", async (req, res)=>{
  const {cardNum, userID, deckName} = req.body;
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const usersCollection = database.collection("users");
    //find the user according to the userID
    const user = await usersCollection.findOne({user_id:userID});
    //find the card in the collection according to cardNum, then add it to the deck;
    const cardCollection = user.user_card_collection;//an array - all cards of the user
    var card;
    for(var i = 0; i < cardCollection.length; i++){
      if(cardCollection[i] !== null && cardCollection[i].cardNum === cardNum){
        card = cardCollection[i];//find the card matching the card number
        break;
      }
    }
    //add the card to the existed deck
    const deckCollection = database.collection("decks");
    const deck = await deckCollection.findOne({user_id: userID,deck_name: deckName});
    const currentCardsInDeck = deck.deck_cards;//the existing cards array
    var ultra_rare_cards = 0;
    var rare_cards = 0;
    for(var i=0; i<currentCardsInDeck.length; i++){
      console.log(currentCardsInDeck[i].rarity)     
      if(currentCardsInDeck[i].rarity === 'ultra rare'){
        ultra_rare_cards++;
      }
      if(currentCardsInDeck[i].rarity === 'rare'){
        rare_cards++;
      }
    }
    if(currentCardsInDeck.length < 15){//check the total number of cards in the deck
      if(card !== null){
        if(card.rarity === 'ultra rare' && ultra_rare_cards >= 3){
          return res.status(401).send({mes:"Each deck allows a maximum of 3 ultra-rare cards."})
        }
        if(card.rarity === 'rare' && rare_cards >= 5){
          return res.status(402).send("Each deck allows a maximum of 5 rare cards.")
        }
      }
      // if(ultra_rare_cards >= 3){//check the  number of ultra-rare cards in the deck
      //   return res.status(401).send({mes:"Each deck allows a maximum of 3 ultra-rare cards."})
      // }
      // if(rare_cards >= 5){//check the number of rare cards in the deck
      //   return res.status(402).send("Each deck allows a maximum of 5 rare cards.")
      // }

      if(card !== null) {
        const addedCards = currentCardsInDeck.concat(card);
        await deckCollection.updateOne({user_id: userID,deck_name: deckName},{$set:{deck_cards:addedCards}});
      }
      const deckCards = await deckCollection.findOne({user_id: userID,deck_name: deckName});
      res.send(deckCards);
    }else{
      return res.status(400).send({mes:"Each deck allows a maximum of 15 cards."})
    }
    
    
  }catch(error){
    console.log(error);
  }finally{
    await client.close();
  }
})
app.put("/removeFromDeck", async (req, res)=>{
  const {cardNum, userID, deckName} = req.body;
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const decksCollection = database.collection("decks");
    //find the user's deck according to the userID and deck name
    const deck = await decksCollection.findOne({user_id:userID, deck_name:deckName});
    //find the card in the deck;
    const deckCards = deck.deck_cards;//an array - all cards of the user
    var card;
    var removeIndex;
    for(var i = 0; i <deckCards.length; i++){
      if(deckCards[i].cardNum === cardNum){
        card = deckCards[i];//find the card matching the card number
        removeIndex = i;
        break;
      }
    }
    const removedCard = deckCards.splice(removeIndex,1);
    const afterRemove = deckCards.filter((c)=>{return c !== null})
    // console.log(afterRemove)

    //update the new deck after removal
    await decksCollection.updateOne({user_id: userID,deck_name: deckName},{$set:{deck_cards:afterRemove}});
    res.send(afterRemove);
  }catch(error){
    console.log(error);
  }finally{
    await client.close();
  }
})
//at the same time of adding a card to deck, it should be removed from the collection.
app.put("/addBackToDeckCollection", async (req, res)=>{
  const {cardNum, userID, deckName} = req.body;
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const decksCollection = database.collection("decks");
    //find the user's deck according to the userID and deck name
    const deck = await decksCollection.findOne({user_id:userID, deck_name:deckName});
    //find the card in the deck;
    const deckCards = deck.deck_cards;//an array - all cards of in the specific deck
    var card;
    var removeIndex;
    for(var i = 0; i <deckCards.length; i++){
      if(deckCards[i].cardNum === cardNum){
        card = deckCards[i];//find the card matching the card number
        removeIndex = i;
        break;
      }
    }
    const removedCard = deckCards.splice(removeIndex,1);
    //fine the card collection
    const userCollection = database.collection("users");
    const user = await userCollection.findOne({user_id:userID})
    const cardCollection = user.user_card_collection;
    const newValue = {$set: {user_card_collection: cardCollection.concat(card)}}
    await userCollection.updateOne({user_id:userID}, newValue);
    const newCollection = user.user_card_collection;
    res.send(newCollection);
  }catch(error){
    console.log(error);
  }finally{
    await client.close();
  }
})
//at the same time of adding a card to deck, it should be removed from the collection.
app.put("/removeFromCollection", async (req, res)=>{
  const {cardNum, userID, deckName} = req.body;
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const usersCollection = database.collection("users");
    //find the user according to the userID
    const user = await usersCollection.findOne({user_id:userID});
    //find the card in the collection according to cardNum, then add it to the deck;
    const cardCollection = user.user_card_collection;//an array - all cards of the user
    var card;
    var removeIndex;
    for(var i = 0; i <cardCollection.length; i++){
      if(cardCollection[i] !== null && cardCollection[i].cardNum === cardNum){
        card = cardCollection[i];//find the card matching the card number
        removeIndex = i
        break;
      }
    }
    //remove this card from the user's cards collection
    const removed = cardCollection.splice(removeIndex, 1);
    
    await usersCollection.updateOne({user_id:userID},{$set:{user_card_collection: cardCollection}})
    const removedCollection = user.user_card_collection;
    res.send(removedCollection);
  }catch(error){
    console.log(error);
  }finally{
    await client.close();
  }
})
//create a new deck;
app.put("/newDeckName", async (req, res)=>{
  const {userID, deckName} = req.body;
  const client = new MongoClient(uri);

  try{
    await client.connect();
    const database = client.db("ash-db");
    //create/insert a new record to "decks" collection
    const deckCollection = database.collection("decks");
    const isNameExist = await deckCollection.findOne({user_id: userID,deck_name: deckName});
    if(isNameExist){
      res.send("Deck of this name has existed.")
    }else{
      await deckCollection.insertOne({user_id: userID, deck_name: deckName,deck_cards: []});
  
      const deck = await deckCollection.findOne({user_id: userID,deck_name: deckName});
      res.send(deck);

    }
    
  }catch(error){
    console.log(error);
  }finally{
    // await client.close();
  }
})
//when the user change the deck name
app.put("/changeDeckName", async (req, res)=>{
  const {userID, deckName, previouName} = req.body;
  console.log(previouName)
  console.log(deckName)
  const client = new MongoClient(uri);

  try{
    await client.connect();
    const database = client.db("ash-db");
    //update the deck name
    const deckCollection = database.collection("decks");
    const deck = await deckCollection.findOne({user_id: userID,deck_name: deckName});//check if the deck name has existed
    if(deck){
      res.status(200).send("Deck of this name has existed.")
    }else{
      await deckCollection.updateOne({user_id: userID,deck_name: previouName}, {$set:{deck_name:deckName}});
      
      const updatedDeck = await deckCollection.findOne({user_id: userID,deck_name: deckName});//check if the deck name has existed
      res.send({message: "Deck's name has been changed as " + deckName, updatedDeck});
    }
  }catch(error){
    console.log(error);
  }finally{
    // await client.close();
  }
})
//load all cards in the user's collection
app.post("/loadCollection", async(req, res)=>{
  const {userID, changedCol} = req.body;
  console.log(userID)
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const userCollection = database.collection("users");
    //find a user according to userID
    if(changedCol !== undefined && changedCol.length > 0){
      await userCollection.updateOne({user_id:userID},{$set: {user_card_collection : changedCol}})
    }
    const user = await userCollection.findOne({user_id:userID});
    res.send(user.user_card_collection);
  }catch(error){
    console.log(error);
  }finally{
    // await client.close();
  }
})
app.get("/ShowAllDecks", async(req, res)=>{
  const userID = req.query.userID
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const deckCollection = database.collection("decks");
    //find a user according to userID
    const decks = await deckCollection.find({user_id:userID}).toArray();
    res.send(decks);
  }catch(error){
    console.log(error);
  }
})
app.post("/loadSingleDeck", async(req, res)=>{
  const {userID,deckName} = req.body;

  const client = new MongoClient(uri);
  try{
    await client.connect();
    const database = client.db("ash-db");
    const userCollection = database.collection("decks");

    //find the user's deck cards according to the deckName
    const deck = await userCollection.findOne({user_id:userID, deck_name:deckName});
    if(deck !== null){
      const deckCollection = deck.deck_cards;
      res.send(deckCollection);
      console.log(deckCollection)
    }else{res.send([])}
  }catch(error){
    console.log(error);
  }
})

app.listen(PORT, () => console.log("server running on PORT " + PORT));
