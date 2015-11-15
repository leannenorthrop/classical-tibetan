console.log("Initialising variables.");
var isDebug = true;
var numberOfGuesses = 0;
var targetColour = getARandomColour();

/*
 * Colour guessing game.
 * Randomly selects a colour from array of colours and repeatedly
 * prompts user to guess a colour until the colour guess is the same
 * as the target colour.
 */
function play() {
  // Reset page and global variabless for start of game 
  // (in case doGame() called from somewhere else)
  var isCorrectGuess = false;
  setBackgroundColour("transparent");
  numberOfGuesses = 0;
  $("#color-game .alert").hide();

  // Lets play!

  // Select a colour at random
  targetColour = getARandomColour();

  // Display selected colour if in debug mode
  console.log("Target colour is " + targetColour + ".");    
}

/*
 * Select and returns a colour chosen randomly from the array of colours.
 */
function getARandomColour() {
  var numberOfColours = window.colours.length;
  var randomColourIndex = Math.floor(Math.random() * numberOfColours);
  var randomColour = window.colours[randomColourIndex];
  return randomColour;
}

/*
 * Compare guessedColour to targetColour showing appropriate alert to user.
 */
function checkGuess(guessedColour, targetColour) {
  

  if (window.colours.indexOf(guessedColour) < 0) {
    $("#color-game div.alert-danger").html("<strong>Sorry, I don't recognise your colour!</strong><br>Please try again.").show();
  } else {
    if (guessedColour != targetColour) {
      $("#color-game div.alert-danger").html("<strong>Sorry, your guess is not correct!</strong><br>" +
            "Hint: Your colour is not the same as mine.<br>" +
            "Please try again.").show();
    } else {
      $("#color-game div.alert-danger").hide();  

      setBackgroundColour(targetColour);
      var guessText = numberOfGuesses == 1 ? "1 guess" : numberOfGuesses + " guesses";
      $("#color-game div.alert-success").html("<strong>Congratulations!</strong><br>You have guessed the colour!<br>" +
            "It took you " + guessText + " to finish the game!<br>"+
            "You can see the colour in the background.").show();
    }
  }
}

/*
 * Set Body background colour to supplied colour.
 */
function setBackgroundColour(colour) {
  $("#color-game div.alert.alert-success").css("background-color", colour);
}

/*!
 * Start here when page loads.
 */
(function () {
  var lang = "uchen";
  play();
  $("#color-game .input-group-btn ul.dropdown-menu li a").click(function() {
    var v = $(this).html();
    lang = v.toLowerCase();
    console.log("Lang is now " + lang);
    $("#color-game .input-group-btn button").html(v+' <span class="caret"></span>');
  });

  $("#color-game .btn-primary").click(function() {
    var g = $("#colourguess").val();
    var guessedColour = "";
    if (lang == "wylie") {
      if (answersInWylie[g] != undefined) {
        guessedColour = answersInWylie[g];
      }
    } else if (lang == "uchen") {
      if (answersInUchen[g] != undefined) {
        guessedColour = answersInUchen[g];
      }
    }
    console.log(guessedColour);

    numberOfGuesses++;
    checkGuess(guessedColour, targetColour);
    isCorrectGuess = guessedColour == targetColour;
  });
})();