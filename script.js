var timeouts = [];

var game = function() {
  this.power = false; // whether or not the game is "on"
  this.inProgress = false; // whether the player is in the middle of a game
  this.pattern = []; // the game's pattern
  this.playerPattern = []; // keeps track of current pattern entered by player
  this.strict = false; // whether or not the player has enabled strict mode
  this.awaitingPlayerInput = false; // is the game waiting for the player to input a pattern
  this.currentRound = 0; // current round, aka number of beeps currently in the pattern
  this.interval = 1250; // how quickly the pattern is displayed to the player

  function displayPattern(patternIndex, pattern) { // recursive function that will keep calling itself as long as the index passed is less than the length of the current pattern

    if (patternIndex < pattern.length) {
      if (pattern[patternIndex] === 1) {
        $("#green").css("background-color", "#25E722");
        document.getElementById("greensound").play();
        window.timeouts.push(setTimeout(function() {
          $("#green").css("background-color", "#266627");
        }, 400));
        window.timeouts.push(setTimeout(function() {
          displayPattern(++patternIndex, pattern);
        }, Simon.interval));

      } else if (pattern[patternIndex] === 2) {
        $("#red").css("background-color", "#F74343");
        document.getElementById("redsound").play();
        window.timeouts.push(setTimeout(function() {
          $("#red").css("background-color", "#924040");
        }, 400));
        window.timeouts.push(setTimeout(function() {
          displayPattern(++patternIndex, pattern);
        }, Simon.interval));

      } else if (pattern[patternIndex] === 3) {
        $("#yellow").css("background-color", "#F5FA44");
        document.getElementById("yellowsound").play();
        window.timeouts.push(setTimeout(function() {
          $("#yellow").css("background-color", "#92922E");
        }, 400));
        window.timeouts.push(setTimeout(function() {
          displayPattern(++patternIndex, pattern);
        }, Simon.interval));

      } else if (pattern[patternIndex] === 4) {
        $("#blue").css("background-color", "#6275EE");
        document.getElementById("bluesound").play();
        window.timeouts.push(setTimeout(function() {
          $("#blue").css("background-color", "#425189");
        }, 400));
        window.timeouts.push(setTimeout(function() {
          displayPattern(++patternIndex, pattern);
        }, Simon.interval));

      }
    } else {
      Simon.awaitingPlayerInput = true;
    }
  };

  this.checkSpeed = function() {
    if (this.currentRound > 12) {
      this.interval = 650;
    } else if (this.currentRound > 8) {
      this.interval = 850;
    } else if (this.currentRound > 4) {
      this.interval = 1050;
    }
  }

  this.nextRound = function() {
    this.awaitingPlayerInput = false;
    this.pattern.push(Math.round(Math.random() * 3 + 1)); // 1234, green, red, yellow, blue
    this.currentRound++;
    this.checkSpeed();
    var display = this.currentRound < 10 ? "0" + this.currentRound : this.currentRound;
    $("#count").html(display);
    displayPattern(0, this.pattern);
  }

  this.flashExclamation = function() {
    var display = Simon.currentRound < 10 ? "0" + Simon.currentRound : Simon.currentRound;
    $("#count").html("!!");
    window.timeouts.push(setTimeout(function() {
      $("#count").html("")
    }, 300));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("!!")
    }, 400));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("")
    }, 700));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("!!")
    }, 800));
    window.timeouts.push(setTimeout(function() {
      $("#count").html(display)
    }, 1100));
  };

  this.flashVictory = function() {
    $("#count").html("WIN");
    window.timeouts.push(setTimeout(function() {
      $("#count").html("")
    }, 300));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("WIN")
    }, 400));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("")
    }, 700));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("WIN")
    }, 800));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("")
    }, 1100));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("WIN")
    }, 1200));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("")
    }, 1500));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("WIN")
    }, 1600));
    window.timeouts.push(setTimeout(function() {
      $("#count").html("")
    }, 1900));
    window.timeouts.push(setTimeout(function() {
      startButton();
    }, 2400));
  }

  this.comparePatterns = function() {
    if (this.pattern.toString() == this.playerPattern.toString()) {
      this.playerPattern = [];
      if (this.currentRound > 19) {
        this.flashVictory();
      } else window.timeouts.push(setTimeout(function() {
        Simon.nextRound();
      }, 1500));
    }

    for (var i = 0; i < this.playerPattern.length; i++) {
      if (this.playerPattern[i] != this.pattern[i]) {
        this.flashExclamation();
        this.playerPattern = [];
        if (this.strict === true) {
          this.pattern = [];
          this.currentRound = 0;
          window.timeouts.push(setTimeout(function() {
            Simon.nextRound();
          }, 1500));
        } else {
          window.timeouts.push(setTimeout(function() {
            displayPattern(0, Simon.pattern);
          }, 1500));
          this.awaitingPlayerInput = false;
        }
      }
    }

  };

}

var Simon = new game(); // create a name "game" object named Simon at the beginning. whenever all of the game states need to be reset (ie. when the game's power is turned off) simply a fresh Simon is made, so "Simon" is the only game object that will ever be referred to throughout the code, therefore it will always relate to the current game state. 

function onoffswitch() {
  if (Simon.power === false) {
    $("#onoffswitch").css("float", "right");
    $("#count").css("color", "#B23C3C");
    Simon.power = true;
  } else {
    clearTimers();
    $("#onoffswitch").css("float", "left");
    $("#count").css("color", "#5E1D1D");
    $("#count").html("--");
    $("#strictlight").css("background-color", "#420909");
    window.Simon = new game();
  }
}

function playerInput(color) {

  if (Simon.awaitingPlayerInput === true) {
    Simon.playerPattern.push(color);
    switch (color) {

      case 1:
        $("#green").css("background-color", "#25E722");
        document.getElementById("greensound").play();
        window.timeouts.push(setTimeout(function() {
          $("#green").css("background-color", "#266627");
        }, 400));
        break;
      case 2:
        $("#red").css("background-color", "#F74343");
        document.getElementById("redsound").play();
        window.timeouts.push(setTimeout(function() {
          $("#red").css("background-color", "#924040");
        }, 400));
        break;
      case 3:
        $("#yellow").css("background-color", "#F5FA44");
        document.getElementById("yellowsound").play();
        window.timeouts.push(setTimeout(function() {
          $("#yellow").css("background-color", "#92922E");
        }, 400));
        break;
      case 4:
        $("#blue").css("background-color", "#6275EE");
        document.getElementById("bluesound").play();
        window.timeouts.push(setTimeout(function() {
          $("#blue").css("background-color", "#425189");
        }, 400));
        break;
    }

    Simon.comparePatterns();
  }

};

function startButton() {
  if (Simon.power === false) {
    return;
  } else if (Simon.inProgress === true) {
    Simon.playerPattern = [];
    Simon.pattern = [];
    Simon.currentRound = 0;
    clearTimers();
  }
  $("#count").html("RDY");
  window.timeouts.push(setTimeout(function() {
    $("#count").html("")
  }, 300));
  window.timeouts.push(setTimeout(function() {
    $("#count").html("RDY")
  }, 400));
  window.timeouts.push(setTimeout(function() {
    $("#count").html("")
  }, 700));
  window.timeouts.push(setTimeout(function() {
    $("#count").html("RDY")
  }, 800));
  Simon.inProgress = true;
  window.timeouts.push(setTimeout(function() {
    Simon.nextRound();
  }, 1200));
}

function strictMode() {
  if (Simon.power === false) {
    return;
  }
  if (Simon.strict === false) {
    $("#strictlight").css("background-color", "red");
    Simon.strict = true;
  } else {
    Simon.strict = false;
    $("#strictlight").css("background-color", "#420909");
  }
}

function clearTimers() {
  for (var i = 0; i < window.timeouts.length; i++) {
    clearTimeout(window.timeouts[i]);
  }
  window.timeouts = [];
  $("#green").css("background-color", "#266627");
  $("#red").css("background-color", "#924040");
  $("#yellow").css("background-color", "#92922E");
  $("#blue").css("background-color", "#425189");
}