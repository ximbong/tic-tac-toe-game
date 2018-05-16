$(document).ready(function() {
  var huPlayer;
  var aiPlayer;
  var userDidChoose = false;
  var humanTurn = true;
  var compTurn = false;
  var board = [];
  for (var i = 0; i < 9; i++) {
    board[i] = i;
  }

  $("#X, #O").click(function() {
    $(this).css("transform", "translate(0, 3px)");
    setTimeout(function() {
      $(".first").addClass("animated fadeOut");
    }, 500);
    setTimeout(function() {
      $(".first").css("display", "none");
    }, 1200);

    setTimeout(function() {
      $(".game").css("display", "block");
      $(".game").addClass("animated fadeIn");
      if (humanTurn) {
        $("#player").css("background", "#a883a8");
      } else {
        $("#computer").css("background", "#a883a8");
      }
    }, 1400);
    if (userDidChoose === false) {
      huPlayer = $(this).text();
      userDidChoose = true;
      huPlayer === "X" ? (aiPlayer = "O") : (aiPlayer = "X");
    }
    if (compTurn) {
      var bestSpot = minimax(board, aiPlayer);
      board[bestSpot.index] = aiPlayer;

      $("#" + bestSpot.index).text(aiPlayer);
      compTurn = false;
      humanTurn = true;
    }
  });

  $(".square").click(function() {
    var val = $(this)
      .find("span")
      .text();

    if (humanTurn && val.length < 1) {
      val += huPlayer;

      $(this)
        .find("span")
        .text(val);

      var id = parseInt(
        $(this)
        .find("span")
        .attr("id")
      );
      board[id] = huPlayer;
      console.log(board);

      humanTurn = false;
      compTurn = true;
    }

    if (compTurn) {
      $(".square").css("pointer-events", "none");
      $("#computer").css("background", "#a883a8");
      $("#player").css("background", "#ffd24d");
      setTimeout(function() {
        var bestSpot = minimax(board, aiPlayer);
        board[bestSpot.index] = aiPlayer;

        $("#" + bestSpot.index).text(aiPlayer);

        var availSpots = emptyIndexies(board);

        $("#player").css("background", "#a883a8");
        $("#computer").css("background", "#ffd24d");

        if (winning(board, aiPlayer) === true) {

          $(".square").css("pointer-events", "none");
          $(".result").text("you lost");
          setTimeout(function() {
            $(".game").addClass("animated fadeOut");
            $("#player, #computer").css("background", "#ffd24d");
            var compScore = parseInt($("#score").text());
            compScore += 1;
            $("#score").text(compScore);
            compTurn = false;
            humanTurn = true;
          }, 500);

          setTimeout(function() {
            $(".game").css("display", "none");
            $(".result").css("display", "block");
            $(".result").addClass("animated fadeIn");
          }, 1200);
        } else if (availSpots.length === 0) {
          $(".result").text("draw");
          setTimeout(function() {
            $(".game").addClass("animated fadeOut");
            $("#player, #computer").css("background", "#ffd24d");
          }, 500);

          setTimeout(function() {
            $(".game").css("display", "none");
            $(".result").css("display", "block");
            $(".result").addClass("animated fadeIn");
          }, 1200);
        } else {
          $(".square").css("pointer-events", "auto");
          compTurn = false;
          humanTurn = true;
        }
      }, 500);
    }
  });

  function emptyIndexies(board) {
    return board.filter(s => s != "O" && s != "X");
  }

  // winning combinations using the board indexies for instace the first win could be 3 xes in a row
  function winning(board, player) {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function minimax(newBoard, player) {
    //available spots
    var availSpots = emptyIndexies(newBoard);

    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(newBoard, huPlayer)) {
      return {
        score: -10
      };
    } else if (winning(newBoard, aiPlayer)) {
      return {
        score: 10
      };
    } else if (availSpots.length === 0) {
      return {
        score: 0
      };
    }

    // an array to collect all the objects
    var moves = [];

    // loop through available spots
    for (var i = 0; i < availSpots.length; i++) {
      //create an object for each and store the index of that spot that was stored as a number in the object's index key
      var move = {};
      move.index = newBoard[availSpots[i]];

      // set the empty spot to the current player
      newBoard[availSpots[i]] = player;

      //if collect the score resulted from calling minimax on the opponent of the current player
      if (player == aiPlayer) {
        var result = minimax(newBoard, huPlayer);
        move.score = result.score;
      } else {
        var result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }

      //reset the spot to empty
      newBoard[availSpots[i]] = move.index;

      // push the object to the array
      moves.push(move);
    }

    // if it is the computer's turn loop over the moves and choose the move with the highest score
    var bestMove;
    if (player === aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      // else loop over the moves and choose the move with the lowest score
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    // return the chosen move (object) from the array to the higher depth
    return moves[bestMove];
  }

  $(".reset").click(function() {
    for (var i = 0; i < 9; i++) {
      board[i] = i;
    }
    $(".result").css("display", "none");
    $(".game").css("display", "none");
    $(".square")
      .find("span")
      .empty();
    $(".square").css("pointer-events", "auto");
    $("#player, #computer").css("background", "#ffd24d");
    userDidChoose = false;

    setTimeout(function() {
      $(".first").css("display", "block");
      $(".first, .game").removeClass("animated fadeOut");
      $(".first").addClass("animated fadeIn");
    }, 500);

  });
});
