import React, { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Sailaja-Katragadda/CS353Project/main/userData.json"
    )
      .then((results) => results.json())
      .then((data) => {
        setUsers(data.userData);
      });
  }, []);

  function login() {
      console.log(users);
      var uname=document.getElementById("uname").value;
      var pwd=document.getElementById("psw").value;
      console.log(uname);
      console.log(pwd);
      if (uname==="" || pwd==="") 
          alert("Please Enter User name and Password");
      else {
        let foundUser = users.filter(
          searchForPasswordByUsername(uname)
        );
        console.log(foundUser[0]);
        if (foundUser[0].password===pwd)
          alert("Login successful");
        else {
          alert("Invalid username or password, Please try again");
          window.location.reload(false);
        }
      } 
  }

  function searchForPasswordByUsername(u) {
    return function (Obj) {
      return Obj.username === u;
    };
  }
 
  return (
    <div className="App">
     
     <div className="container">
        <label for="uname"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" id="uname" required></input>

        <label for="psw"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" id="psw" required></input>
        <button onClick={() =>login()}>LOGIN</button>
    </div>
    </div>
 
  );
}
export default App;