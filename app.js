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
let startSecond = 30;
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
        clearInterval(countdownID);
        countdownID = null;
        countdown = startSecond;
        timerEl.innerText = ``;
    } else {
        checkLocalStorageZeitModus();
        stoppuhr();
    }
}

function stoppuhr() {
    if (!countdownID) {
        countdown = startSecond;
        timerEl.innerText = `Zeit: ${countdown}`
        countdownID = setInterval(timerAblauf, 1000)
    }
}

function timerAblauf() {
    countdown--; // erst runterzählen

    if (countdown <= 0) {
        timerEl.innerText = `Zeit: 0`;
        clearInterval(countdownID);
        countdownID = null;
        countdown = startSecond;
        AllItems.forEach(function(item) {
            item.removeEventListener("click", handleTileClick);
        });
        listenerHinzugefuegt = false;
        zeitAbgelaufenText.innerText = "Zeit abgelaufen .____. "; // ✅ korrekt gesetzt
        return; // damit unten nichts mehr passiert
    }
    timerEl.innerText = `Zeit: ${countdown}`;
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
// function getSlightlySimilarColor() {
//     let veränderungswert = 30; // schwierigkeitsgrad
//     let untereGrenze = 10;  // schwierigkeitsgrad
//     let rgb_digits = baseColor.match(/\d+/g).map(Number);
//     let index = Math.floor(Math.random() * 3);
//     let veränderung = Math.random() < 0.5 ? -veränderungswert : veränderungswert;
//     let neuerWert = Math.min(255, Math.max(0, rgb_digits[index] + veränderung));
//     let differenz = Math.abs(rgb_digits[index] - neuerWert);
    



//     if (differenz < untereGrenze) {
//         if (neuerWert + untereGrenze <= 255) {
//             neuerWert += untereGrenze;
//         } else {
//             neuerWert -= untereGrenze;
//         }
//     };
    
//     rgb_digits[index] = neuerWert;
    

//     console.warn(differenz)
//     console.warn(neuerWert)



//     let r = rgb_digits[0];
//     let g = rgb_digits[1];
//     let b = rgb_digits[2];
//     let slightlySimilarColor = `rgb(${r}, ${g}, ${b})`

//     return slightlySimilarColor
// }


// CODE NOCHMAL PRÜFEN UND NACHVOLLZIEHEN / Schwierigkeitsgrad --
function getSlightlySimilarColor() {
    const untereGrenze = 20;
    const veränderungswert = 30;
    const rgb_digits = baseColor.match(/\d+/g).map(Number);
    const index = Math.floor(Math.random() * 3);
    const originalWert = rgb_digits[index];

    let neuerWert;
    let maxPositive = Math.min(255 - originalWert, veränderungswert);
    let maxNegative = Math.min(originalWert, veränderungswert);

    let gültigeRichtungen = [];

    if (maxPositive >= untereGrenze) gültigeRichtungen.push("hoch");
    if (maxNegative >= untereGrenze) gültigeRichtungen.push("runter");

    if (gültigeRichtungen.length === 0) {
        neuerWert = originalWert; // Sonderfall: keine gültige Richtung (z. B. bei 0 oder 255)
    } else {
        let richtung = gültigeRichtungen[Math.floor(Math.random() * gültigeRichtungen.length)];
        let abstand = Math.floor(Math.random() * (veränderungswert - untereGrenze + 1)) + untereGrenze;

        if (richtung === "hoch") {
            neuerWert = originalWert + abstand;
        } else {
            neuerWert = originalWert - abstand;
        }
    }

    rgb_digits[index] = neuerWert;

    const abstandFinal = Math.abs(neuerWert - originalWert);
    console.warn(`Δ = ${abstandFinal} (von ${originalWert} → ${neuerWert})`);

    const [r, g, b] = rgb_digits;
    return `rgb(${r}, ${g}, ${b})`;
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
















