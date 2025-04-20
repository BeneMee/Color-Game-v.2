//globale Variabeln
let baseColor;
let AllItems;
let correct_item_ID;
let feedbackEl = document.getElementById("feedback");
let scoreEl = document.getElementById("score");
let highscoreEl = document.getElementById("highscore");
let currentScore = 0;
let highScore = 0;


//check if highscore in local storage
if (localStorage.getItem("highscore") === null) {
    // True if no such key in local storage so just move on
} else {
    highScore = parseInt(localStorage.getItem("highscore"));
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

//Game Logik color tiles 
function addEventListenerToTiles () {
    AllItems.forEach(function(item) {
        item.addEventListener("click", function() {
            if (item.id === correct_item_ID) {
                //feedbackEl.innerText = "Richtig!✅";
                currentScore = currentScore + 1;
                if (highScore < currentScore) {
                    highScore = currentScore;
                    //speichern highscore in local storage (string)
                    localStorage.setItem("highscore", highScore);
                };
                scoreEl.innerText = `Score: ${currentScore}`;
                highscoreEl.innerText = `Highscore: ${highScore}`;
                applyColorToTiles();
                applySimilarColor();
            } else {
                //feedbackEl.innerText = "Falsch!❌";
                //wackeln des divs bei klick
                wrongClickedTile = document.getElementById(item.id);
                addShakeCSS(wrongClickedTile);
                currentScore = 0;
                scoreEl.innerText = `Score: ${currentScore}`;
            }
        });
    });
}

//function feedbackWiederAusblenden() {
    setTimeout(() => {
        feedbackEl.innerText = "";
    }, 1000);
//}

function addShakeCSS (elementToAddShake) {
    elementToAddShake.classList.add("shake");
    setTimeout(() => {
        elementToAddShake.classList.remove("shake");
    }, 300);
}








applyColorToTiles()
applySimilarColor()
addEventListenerToTiles()
















