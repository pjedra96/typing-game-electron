//Random quotes api
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=120";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("user-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// JQuery on window load - starts when all resources all loaded
window.onload = () => {
    userInput.value = ""; // Empty the user input
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("new_quote_checkbox").style.display = "none";
    userInput.disabled = true;
    getNewQuote();

    // Add event listener for the colour mode switch
    document.getElementById("colour_mode").addEventListener("change", function(){
        switchColour(this);
    });
};

//Start test (on click)
const startTest = () => {
    // Check if user wants new quote or try the same one again
    if(document.getElementById("new_quote").checked) getNewQuote();

    userInput.value = ""; // Empty the user input
    mistakes = 0;
    timer = "";
    userInput.disabled = false;

    // Update HTML elements
    document.querySelector(".result").style.display = "none";
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    document.getElementById("new_quote_checkbox").style.display = "none";

    // Start the countdown
    timeReduce();

    // Remove the coloured highlight
    const characters = document.querySelectorAll('.quote-chars');
    characters.forEach((element) => {
        element.classList.remove("fail");
        element.classList.remove("success");
    });

    

    // Listen for input on the input box
    userInput.addEventListener("input", checkInput);
};


// Update the timer on the page
function updateTimer() {
    if (time == 0) {
        //End test if reaches 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Keep reducing the timer every second
const timeReduce = () => {
    time = 60;
    document.getElementById("timer").innerText = time + "s";
    timer = setInterval(updateTimer, 1000);
};

// Display random quotes from quotable.io
const getNewQuote = async () => {
    // Reset the quote section
    quoteSection.innerHTML = "";

    //Fetch content from quote api url
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    //Array of chars in quote
    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });
    quoteSection.innerHTML += arr.join("");
};

// Compare input words with quote
function checkInput(){
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    // Array of user input chars
    let userInputChars = userInput.value.split("");

    // Loop through each char in quote
    quoteChars.forEach((char, index) => {
        //Check chars with quote chars
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        //If user hasn't entered anything or backspaced
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        }
        // if user entered wrong character
        else {
            if (!char.classList.contains("fail")) {
                //increament and displaying mistakes
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        // Return true if all chars are correct
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });

        //End test if all chars are correct
        if (check) {
            displayResult();
        }

    });
}

// switches between light and dark colour scheme
function switchColour(element){
    if (element.checked) {
        // Dark mode
        // background colour
        document.body.style.backgroundColor = "black";
        document.getElementById('page_container').style.backgroundColor = "black";
        // text colour
        document.body.style.color = "white";
        document.getElementById('page_container').style.color = "white";
        document.getElementById('new_quote_label').style.color = "white";
        // Button background
        Array.from(document.getElementsByTagName("button"))
            .forEach(b => b.style.backgroundColor = "rgb(84, 84, 84)");
    }else{
        // Light mode
        // background colour
        document.body.style.backgroundColor = "white";
        document.getElementById('page_container').style.backgroundColor = "white";
        // text colour
        document.body.style.color = "black";
        document.getElementById('page_container').style.color = "black";
        document.getElementById('new_quote_label').style.color = "black";
        // Button background
        Array.from(document.getElementsByTagName("button"))
            .forEach(b => b.style.backgroundColor = "#1565c0");
    }
}

// Finish the test
const displayResult = () => {
    //Display result div
    document.querySelector(".result").style.display = "block";
    // Clear the timer
    clearInterval(timer);
    // Hide the stop test but display the start test button
    document.getElementById("start-test").style.display = "block";
    document.getElementById("new_quote").style.display = "inline";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("new_quote_checkbox").style.display = "inline-block";
    // Disable the input for the user once the game is over
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value ? (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm" : 0 + "wpm");
    document.getElementById("accuracy").innerText = (userInput.value ? Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%" : 0 + "%");

    // Remove the listener for user input
    userInput.removeEventListener("input", checkInput);
};
