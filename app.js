//globale Variabeln
let feedbackEl = document.getElementById("feedback");
let scoreEl = document.getElementById("score");
let highscoreEl = document.getElementById("highscore");
let endlosButtonEl = document.getElementById("endlos_button");
let zeitButtonEl = document.getElementById("zeit_button");
let timerEl = document.getElementById("timer")
let zeitAbgelaufenText = document.getElementById("zeit_vorbei_text")
let baseColor;
let AllItems;
let correct_item_ID;
let currentScore = 0;
let highScore = 0;
let startSecond = 5;
let countdown = startSecond; 
let countdownID;
let gameModus = null;
let listenerHinzugefuegt = false;


endlosButtonEl.addEventListener("click", function () {
    gameModus = "endlos";
    document.getElementById("modus_anzeige_wrapper").innerText = "Endlos Modus!";
    startGame();
});

zeitButtonEl.addEventListener("click", function () {
    gameModus = "zeitmodus";
    document.getElementById("modus_anzeige_wrapper").innerText = "Zeit Modus!";
    startGame();
});


function startGame() {
    currentScore = 0;
    scoreEl.innerText = `Score: ${currentScore}`;

    applyColorToTiles();
    applySimilarColor();
    if (!listenerHinzugefuegt) {
        addEventListenersToTiles();
        listenerHinzugefuegt = true;
    }

    if (gameModus === "endlos") {
        checkLocalStorageEndlosModus();
    } else {
        checkLocalStorageZeitModus();
        stoppuhr();
    }
}

function stoppuhr() {
    console.log("stoppuhr wurde aufgerufen");
    console.log(`das ist die ${countdownID}`)
    if (!countdownID) {
        countdownID = setInterval(timerAblauf, 1000)
    }
}

function timerAblauf() {
    console.log(countdown)
    timerEl.innerText = `Zeit: ${countdown}`
    countdown = countdown - 1
    if (countdown === 0 ) {
        console.log(countdown)
        timerEl.innerText = `Zeit: ${countdown}`
        countdown = startSecond;
        clearInterval(countdownID);
        countdownID = null;
        AllItems.forEach(function(item) {
            item.removeEventListener("click", handleTileClick);
        });
        listenerHinzugefuegt = false;
        zeitAbgelaufenText.style.innerText = "ZEIT VORBEI!";
        ///// funktioniert nicht zeit abgelaufen text
    }
}

//check if highscore in local storage
function checkLocalStorageEndlosModus() {
    if (localStorage.getItem("highscoreEndlos") === null) {
        highScore = 0;
    } else {
        highScore = parseInt(localStorage.getItem("highscoreEndlos"));
        highscoreEl.innerText = `Highscore: ${highScore}`;
    }
    highscoreEl.innerText = `Highscore: ${highScore}`;
}
function checkLocalStorageZeitModus() {
    if (localStorage.getItem("highscoreZeit") === null) {
        highScore = 0;
        // True if no such key in local storage so just move on
    } else {
        highScore = parseInt(localStorage.getItem("highscoreZeit"));
        highscoreEl.innerText = `Highscore: ${highScore}`;
    }
    highscoreEl.innerText = `Highscore: ${highScore}`;
}
// basisfarbe erzeugen random
function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    baseColor = `rgb(${r}, ${g}, ${b})`; //backticks `` für template literal syntax
    return baseColor;
}
//Farbe auf alle 6 Kacheln anwenden 
function applyColorToTiles() {
    /** @type {NodeListOf<HTMLElement>} */  
    AllItems = document.querySelectorAll(".item")
    baseColor = getRandomColor()

    AllItems.forEach(function(item) {
        item.style.backgroundColor = baseColor;
    });
}
//slightly andere Farbe erzeugen 
function getSlightlySimilarColor() {
    let rgb_digits = baseColor.match(/\d+/g).map(Number);
    let index = Math.floor(Math.random() * 3)
    let veränderung = Math.random() < 0.5 ? -30 : 30;
    rgb_digits[index] = Math.min(255, Math.max(0, rgb_digits[index] + veränderung))
    // keine werte > 0 > 255 möglich!
    let r = rgb_digits[0];
    let g = rgb_digits[1];
    let b = rgb_digits[2];
    let slightlySimilarColor = `rgb(${r}, ${g}, ${b})`
    return slightlySimilarColor
}
//slightly andere farbe auf eine random tile stylen
function applySimilarColor() {
    let randomNumber = Math.floor(Math.random() * 6) + 1;
    let item_id = `item_${randomNumber}`
    correct_item_ID = item_id
    let chosen_item = document.getElementById(item_id)
    chosen_item.style.backgroundColor = getSlightlySimilarColor()
}

function addShakeCSS (elementToAddShake) {
    elementToAddShake.classList.add("shake");
    setTimeout(() => {
        elementToAddShake.classList.remove("shake");
    }, 300);
}

function handleTileClick(event) {
    let clickedItem = event.target;

    if (clickedItem.id !== correct_item_ID) {
        // Falsch geklickt
        addShakeCSS(clickedItem);
        currentScore = 0;
        scoreEl.innerText = `Score: ${currentScore}`;
        return;
    }

    // Richtig geklickt
    currentScore++;
    scoreEl.innerText = `Score: ${currentScore}`;

    if (currentScore > highScore) {
        highScore = currentScore;
        if (gameModus === "endlos") {
            localStorage.setItem("highscoreEndlos", highScore);
        } else if (gameModus === "zeitmodus") {
            localStorage.setItem("highscoreZeit", highScore);
        }
    }

    highscoreEl.innerText = `Highscore: ${highScore}`;

    // Neue Runde starten
    applyColorToTiles();
    applySimilarColor();
}

function addEventListenersToTiles() {
    AllItems.forEach(function(item) {
        item.addEventListener("click", handleTileClick);
    });
}















// //Game Logik color tiles und speichern highscore ENDLOS MODUS
// function addEventListenerToTilesEndlosModus () {
//     AllItems.forEach(function(item) {
//         item.addEventListener("click", function() {
//             if (item.id === correct_item_ID) {
//                 //feedbackEl.innerText = "Richtig!✅";
//                 currentScore = currentScore + 1;
//                 if (highScore < currentScore) {
//                     highScore = currentScore;
//                     //speichern highscore in local storage (string)
//                     localStorage.setItem("highscoreEndlos", highScore);
//                 };
//                 scoreEl.innerText = `Score: ${currentScore}`;
//                 highscoreEl.innerText = `Highscore: ${highScore}`;
//                 applyColorToTiles();
//                 applySimilarColor();
//             } else {
//                 //feedbackEl.innerText = "Falsch!❌";
//                 //wackeln des divs bei klick
//                 wrongClickedTile = document.getElementById(item.id);
//                 addShakeCSS(wrongClickedTile);
//                 currentScore = 0;
//                 scoreEl.innerText = `Score: ${currentScore}`;
//             }
//         });
//     });
// }

// //Game Logik color tiles und speichern highscore ZEIT MODUS
// function addEventListenerToTilesZeitModus () {
//     AllItems.forEach(function(item) {
//         item.addEventListener("click", function() {
//             if (item.id === correct_item_ID) {
//                 //feedbackEl.innerText = "Richtig!✅";
//                 currentScore = currentScore + 1;
//                 if (highScore < currentScore) {
//                     highScore = currentScore;
//                     //speichern highscore in local storage (string)
//                     localStorage.setItem("highscoreZeit", highScore);
//                 };
//                 scoreEl.innerText = `Score: ${currentScore}`;
//                 highscoreEl.innerText = `Highscore: ${highScore}`;
//                 applyColorToTiles();
//                 applySimilarColor();
//             } else {
//                 //feedbackEl.innerText = "Falsch!❌";
//                 //wackeln des divs bei klick
//                 wrongClickedTile = document.getElementById(item.id);
//                 addShakeCSS(wrongClickedTile);
//                 currentScore = 0;
//                 scoreEl.innerText = `Score: ${currentScore}`;
//             }
//         });
//     });
// }
















