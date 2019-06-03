(function($) {
    $.fn.grid = function(option) {

    let defaultoptions = {
        'col': 6,
        'row': 5,
        'name1': 'I am Red',
        'name2': 'I am Yellow',
        'color1':'#d63031',
        'color2': '#fdcb6e',
        'backgroundColor': '#ADD8E6'
    };

    let parameters = $.extend(defaultoptions, option);
    let lastMove = 0;
    let lastMoveMapRow = 0;
        let lastMoveMapCol = 0;
        let player1Points = 0;
    let player2Points = 0;
    let player = 2;
    let turns = 0;
    let maxTurns = parameters.col * parameters.row;

    //create buttons start/restart

        $("#optionGame").append("<br><input id='play' type='submit' value='Play' />");
        $("#optionGame").append("<input id='replay' type='submit' value='Replay' />");
        $("<input id='undo' type='submit' value='undo' />").insertAfter("#replay");
        $(`#undo`).css('visibility','hidden');



        $("#optionGame").append(`<div id='Score'><div class="player1"></div><div class="player2"></div></div>`);
        $("#optionGame").append("<div id='currentPlayer'></div>");



    //Board and map creation
        function createGameBoard()
        {
            $("div.player1").html(parameters.name1 + ": " + player1Points);
            $("div.player2").html(parameters.name2 + ": " + player1Points);


            $("<table id='grid' cellspacing='6'>").insertAfter("#optionGame");
            $('#grid').css('background-color',parameters.backgroundColor);
            $('#grid').wrap("<div class='style_grid'></div>");


            for (let i = 0; i < parameters.row; i++)
            {
                 $("#grid").append(`<tr class='row-${i}'>`);
                for(let j = 0; j < parameters.col; j++) {
                    $(`.row-${i}`).append(`<td id='${i}-${j}' class='col-${j}'>`);
                }
            }
            $("td").css("position", "relative");
        }

        function map() {
            let mapping = [];
            for (let k = 0; k < parameters.row; k++)
            {
                let row = [];
                for( let l = 1; l <= parameters.col; l++) {
                    row.push('0');
                }
                mapping.push(row);
            }
            parameters.map = mapping ;

        }

        let position = null;


    // Putting Token
        function addToken(event) {
            let info = event.target.id;
            let info2 =  info.split('-');
            let height = $("#grid").height();

            for ( let a = parameters.row - 1; a >= 0 ; a-- )
            {
                if (parameters.map[a][Number(info2[1])] == 0) {
                        turns++;
                        if(player == 2)
                        {
                            //if player 2, set map/animation/background
                            $("div#currentPlayer").html('');
                            $("div#currentPlayer").html(parameters.name1 + "'s turn");

                            parameters.map[a][Number(info2[1])] = 2;

                            $(`#${a}-${[Number(info2[1])]}`).css(
                                "top", `-${height}px`
                            ).animate({
                                top: 0,
                            }, 200);
                            $(`#${a}-${[Number(info2[1])]}`).css('background-color',parameters.color2);


                        }
                         if(player == 1)
                         {
                             //if player 1, set map/animation/background

                             $("div#currentPlayer").html('');
                             $("div#currentPlayer").html(parameters.name2 + "'s turn");

                             parameters.map[a][Number(info2[1])] = 1;
                             $(`#${a}-${[Number(info2[1])]}`).css(
                                 "top", `-${height}px`
                             ).animate({
                                 top: 0,
                             }, 200);
                             $(`#${a}-${[Number(info2[1])]}`).css('background-color',parameters.color1)

                         }
                         //getting position for undo button

                         position = `${a}-${[Number(info2[1])]}`;
                         lastMove = position;
                         lastMoveMapRow = a;
                         lastMoveMapCol = Number(info2[1]);
                        break;

                }
            }

        }

    //Checking victory
        function checkwinRow()
        {
            //console.log("it's fucking borkmass");
            let positionRow = parseInt(position.split('-')[0]);
            let positionCol = position.split('-')[1];
            let win = 0;
            let startPlace = parseInt(positionCol) - 3;
            let finishPlace = parseInt(positionCol) + 3;

            while (startPlace < finishPlace + 1 && win < 4)
            {
                if (startPlace >= 0 && startPlace <= (parameters.row))
                {
                    if (player === parameters.map[positionRow][Number(startPlace)])
                    {
                        win++;
                    }
                    else if (win === 4){
                        return true;

                    }
                    else
                        {
                            win = 0;
                        }
                }
                if(win >= 4){
                    return true;
                }
                console.log(win);
                startPlace++;

            }

        }

        function checkwinCol()
        {
           // console.log("Sword doogo online");
            let positionRow = parseInt(position.split('-')[0]);
            let positionCol = position.split('-')[1];
            let win = 0;

            for (let i = 0 ; i < parameters.row ; i++){
                if (player === parameters.map[i][positionCol]){
                    win ++;
                }
                else{
                    win = 0;
                }
                if (win ===4){
                    return true;
                }

            }
        }


        function checkwinDiag()
        {
           // console.log("Henlo my Shobe");
            let positionRow = position.split('-')[0];
            let positionCol = position.split('-')[1];
            let win = 0;
            let startDiag1 = parseInt(positionRow) - 3;
            let finishDiag1 = parseInt(positionRow) + 3;
            let colDiag1 = parseInt(positionCol) + 3;


            while (startDiag1 <= finishDiag1 && win < 4)
            {
                if (startDiag1 >= 0 && startDiag1 <= (parameters.row)) {

                    if (startDiag1 in parameters.map) {
                        if (player === parameters.map[startDiag1][Number(colDiag1)]) {
                            win++;
                        } else {
                            win = 0;
                        }
                    }
                }
                 colDiag1--;
                startDiag1++;

                if (win === 4) {
                    return true;
                }
            }
             win = 0;
                let startDiag2 = parseInt(positionRow) - 3;
                let finishDiag2 = parseInt(positionRow) + 3;
                let colDiag2 = parseInt(positionCol) - 3;

                while (startDiag2 <= finishDiag2 && win < 4)
                {

                    if (startDiag2 >= 0 && startDiag2 <= (parameters.row)) {
                        if (startDiag2 in parameters.map) {
                            if (player === parameters.map[startDiag2][Number(colDiag2)]) {
                                win++;
                            } else {
                                win = 0;
                            }
                        }
                    }
                    colDiag2++;
                    startDiag2++;

                    if (win === 4) {
                        return true;
                    }
                }
             return false;
        }

        function draw() {
            if (turns === maxTurns)
            {
                return true;
            }
        }


     // function for buttons
        function reset()
        {
            map();
            $('td').css('background-color',"white")
        }

        function undo() {
            if (parameters.map[lastMoveMapRow][lastMoveMapCol] > 0) {
                $(`#${lastMove}`).css('background-color', "white");
                parameters.map[lastMoveMapRow][lastMoveMapCol] = 0;
                if (player == 2) {
                    player = 1;
                    $("div#currentPlayer").html('');
                    $("div#currentPlayer").html(parameters.name1 + "'s turn");
                } else {
                    player = 2;
                    $("div#currentPlayer").html('');
                    $("div#currentPlayer").html(parameters.name2 + "'s turn");
                }
            }
        }


        function music()
        {
            let src = new Audio("./fatality.mp3");
            src.play();
        }

        // calling all function

        $('#play').click(function(){

            $(`#undo`).css('visibility','visible');
            $('#play').attr("disabled", true);


            createGameBoard();

            map();

            $("td").click(function(event)
            {
                addToken(event);

                if (checkwinDiag() || checkwinRow() || checkwinCol()){
                        music();
                    if (confirm(`You won! \nDo you want to retry ?`) === true){
                        reset();
                    }
                    else {
                        location.reload();
                    }

                    if (player == 2)
                    {
                        player2Points++;
                        $("div.player2").html("");
                        $("div.player2").html(parameters.name2 + ": " + player2Points);

                    }
                else {
                    player1Points++;
                        $("div.player1").html("");
                        $("div.player1").html(parameters.name1 + ": " + player1Points);
                    }
                }
                if(draw())
                {
                    console.log("coucou");
                    if (confirm(`It's a draw! \nDo you want to retry ?`) === true){
                        reset();
                    }
                    else {
                        location.reload();
                    }
                }


                if(parseInt(player) === 2 )
                {
                  player = 1;
                } else{
                    player = 2;
                }


            });

        });
        $("#replay").click(function()
        {
            location.reload();
        });

        $("#undo").click(function()
        {
            console.log("you fucking retard");
            undo();
        });

    };
})(jQuery);

//pluging Call

$("#grid").grid(
    {
        // row: 10,
        // col: 10,
        color1: 'blue',
        color2: 'green'
        // backgroundColor: 'black'
    }
);