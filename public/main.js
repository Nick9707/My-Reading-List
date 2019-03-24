import "materialize-css";
import config from "./firebase.js";
import firebase from 'firebase/app';
import 'firebase/database';
firebase.initializeApp(config);

document.addEventListener('DOMContentLoaded', () => {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    document.getElementById("add_list").addEventListener("click", fINeedThis);
});

function fINeedThis(evt){
    let sTitle = document.getElementById("Title").value;
    document.getElementById("Title").value = "";
    let sAuthor = document.getElementById("Author").value;
    document.getElementById("Author").value = "";
    let sGenre = document.getElementById("Genre").value;
    document.getElementById("Genre").value = "";
    let sPublished = document.getElementById("Published").value;
    document.getElementById("Published").value = "";

    let sItemID = new Date().toISOString().replace(".", "_");
    firebase.database().ref('books/' + sItemID).set({
        Author: sAuthor,
        Genre: sGenre,
        published: sPublished,
        title: sTitle
    }).then(() => {
        console.log("inserted");
    });

}

function fIboughtThis(evt){
    evt.preventDefault();
    let sId = evt.target.parentNode.id;
    firebase.database().ref('books/' + sId + "/datePurchased").set(new Date().toISOString(), ()=>{
        console.log("completed " + sId);
    });
}

function fIDontNeedThis(evt){
    evt.preventDefault();
   let sId = evt.target.parentNode.id;
    firebase.database().ref('books/' + sId).remove(()=>{
        console.log("removed " + sId);
    });
}


firebase.database().ref('books').on("value", snapshot => {
    // the database has changed
    let oBooksItems = snapshot.val();
    let oBookList = document.getElementById("booklist");
    console.log(oBooksItems);
    oBookList.innerHTML = "";

    Object.keys(oBooksItems).map((key) => {
        //we have an item here let's make a card for it
        let oBooksItem = oBooksItems[key];
        let oCard = document.createElement("div");
        oCard.className ="card blue-grey darken-1";

        //card content
        let oCardContent = document.createElement("div");
        oCardContent.className = "card-content white-text";
        if(oBooksItem.datePurchased){
            oCardContent.innerHTML = "<span class=\"card-title purchased\">" + oBooksItem.title + "</span>";

        }else{
            oCardContent.innerHTML = "<span class=\"card-title\">" + oBooksItem.title + "</span>";

        }
        oCardContent.innerHTML += "<p>" + oBooksItem.Author + "</p>";
        oCardContent.innerHTML += "<p>" + oBooksItem.Genre + "</p>";
        oCardContent.innerHTML += "<p>" + oBooksItem.published + "</p>";

        oCard.append(oCardContent);

        //card action
        let oCardAction = document.createElement("div");
        oCardAction.className = "card-action";
        oCardAction.id = key;

        //I Read This
        let oIboughtThis = document.createElement("a");
        oIboughtThis.href = "#";
        oIboughtThis.innerHTML = "I Read This";
        oIboughtThis.addEventListener("click", fIboughtThis);
        oCardAction.append(oIboughtThis);

        //Not Interested Anymore
        let oIDontNeedThis = document.createElement("a");
        oIDontNeedThis.href = "#";
        oIDontNeedThis.innerHTML = "Not Interested Anymore";
        oIDontNeedThis.addEventListener("click", fIDontNeedThis);
        oCardAction.append(oIDontNeedThis);

        oCard.append(oCardAction);


        oBookList.prepend(oCard);
    });
});