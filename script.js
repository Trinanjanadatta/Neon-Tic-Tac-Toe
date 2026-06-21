//Declare & inititalise the variables
let player1 = "",
    player2 = "",
    score1 = 0,
    score2 = 0,
    board = ["", "", "", "", "", "", "", "", ""],
    move,
    symbol,
    gameover,
    timer,
    timeleft;

const clicksound = new Audio("click.mp3");
const startsound =  new Audio("start.mp3");
const winsound = new Audio("win.mp3");

clicksound.load();
startsound.load();
winsound.load();

function getPlayerNames(){
    player1 = document.querySelector(".nameinput .player1 input").value.trim() || "Player 1";
    player2 = document.querySelector(".nameinput .player2 input").value.trim() || "Player 2";

    player1 = player1.slice(0, 10) + (player1.length > 10 ? "..." : "");
    player2 = player2.slice(0, 10) + (player2.length > 10 ? "..." : "");

    document.querySelector(".overlay").style.display = 'none';
    document.querySelector(".namePopup").style.display = 'none';
    
    startGame();
}

function skipNames(){
    player1 = "Player 1";
    player2 = "Player 2";

    document.querySelector(".overlay").style.display = 'none';
    document.querySelector(".namePopup").style.display = 'none';

    startGame();
}

function playaudio(scene){
    switch(scene){
        case "click":
            if (gameover) return;
            clicksound.currentTime = 0;
            clicksound.volume = 1;
            clicksound.play();
        break;
        case "start":
            startsound.currentTime = 0;
            startsound.volume = 1;
            startsound.playbackRate = 1.5;
            startsound.play();
        break;
        case "win":
            winsound.currentTime = 0;
            winsound.volume = 1;
            winsound.play();
        break;
        default:
            clicksound.currentTime = 0;
            clicksound.volume = 1;
            clicksound.play();
        break;
    }
}

function displayScore(){
    document.querySelector(".player1.score .playername").textContent = player1;
    document.querySelector(".player1.score .displayscore").textContent = score1;

    document.querySelector(".player2.score .playername").textContent = player2;
    document.querySelector(".player2.score .displayscore").textContent = score2;
}

function displayStatus(){
    if ( move == 0){
        move++;
        const status = document.querySelector(".statustext");
        status.textContent = "Good luck, CHAMPS!";
        status.classList.add("blink");
        setTimeout(() => {
            status.classList.remove("blink");
            displayStatus();
        }, 1000);
    }

    else if ( move % 2 == 0){
        document.querySelector(".statustext").textContent = player2 + "'s turn:";
        starttimer();
    }

    else{
        document.querySelector(".statustext").textContent = player1 + "'s turn:";
        starttimer();
    }
}

function starttimer(){
    const bar = document.querySelector(".status .timerbar");

    bar.classList.remove("wrap");

    void bar.offsetWidth;

    bar.classList.add("wrap");

    clearInterval(timer);
    
    timeleft = 20;

    timer = setInterval(() => {
        timeleft--;
        if(timeleft <= 0){
            clearInterval(timer);

            const status = document.querySelector(".statustext");
            status.textContent = "Time's up!";
            status.classList.add("blink");

            gameover = true;

            setTimeout(() => {
            status.classList.remove("blink");

                (move % 2 == 0) ? declareResult(1) : declareResult(2);

            }, 1000);

            return;
        }
    }, 1000)
}

function startGame(){
    playaudio("start");
    move = 0;
    gameover = false;
    document.querySelector(".winningline").style.display = "none";
    displayScore();
    displayStatus();
}

function drawWinningLine(cells){
    const line = document.querySelector(".winningline");
    line.style.display = "block";

    const key = cells.join(",");
    const board = document.querySelector(".board");
    const width = board.offsetWidth;
    const height = board.offsetHeight;

    const angle = Math.atan(height / width) * 180 / Math.PI;

    switch(key){

        // Rows
        case "0,1,2":
            Object.assign(line.style, {
                top: "16.67%",
                left: "5%",
                transform: "rotate(0deg)"
            });
            line.style.setProperty("--line-length", "90%");
            break;

        case "3,4,5":
            Object.assign(line.style, {
                top: "50%",
                left: "5%",
                transform: "rotate(0deg)"
            });
            line.style.setProperty("--line-length", "90%");
            break;

        case "6,7,8":
            Object.assign(line.style, {
                top: "83.33%",
                left: "5%",
                transform: "rotate(0deg)"
            });
            line.style.setProperty("--line-length", "90%");
            break;

        // Columns
        case "0,3,6":
            Object.assign(line.style, {
                top: "5%",
                left: "16.67%",
                transform: "rotate(90deg)"
            });
            line.style.setProperty("--line-length", "90%");
            break;

        case "1,4,7":
            Object.assign(line.style, {
                top: "5%",
                left: "50%",
                transform: "rotate(90deg)"
            });
            line.style.setProperty("--line-length", "90%");
            break;

        case "2,5,8":
            Object.assign(line.style, {
                top: "5%",
                left: "83.33%",
                transform: "rotate(90deg)"
            });
            line.style.setProperty("--line-length", "90%");
            break;

        // Diagonals
        case "0,4,8":
            Object.assign(line.style, {
                top: "5%",
                left: "5%",
                transform: `rotate(${angle}deg)`
            });
            line.style.setProperty("--line-length", "127%");
            break;

        case "2,4,6":
            Object.assign(line.style, {
                top: "95%",
                left: "5%",
                transform: `rotate(${-angle}deg)`
            });
            line.style.setProperty("--line-length", "127%");
            break;
    }

    line.classList.remove("draw");
    void line.offsetWidth;
    line.classList.add("draw");
}

function handleCellClick(cell, index){
    console.log()
    if(board[index] !== "" || gameover) return;
    symbol = (move % 2 === 0) ? "X" : "O";
    board[index] = symbol;
    cell.textContent = symbol;

    (move % 2 == 0)? cell.classList.add("player2sign") : cell.classList.add("player1sign");

    const winningcells = checkwinning(index);
    if (move > 4 && winningcells){
        drawWinningLine(winningcells);
        (move % 2) == 0 ? declareResult(2) : declareResult(1);
        return;
    }
    else if (move == 9){
        declareResult(0);
        return;
    }

    move++;

    displayStatus(move);
}

function checkwinning(index){
    function check(a, b, c){
        if ( board[a] != "" && board[a] == board[b] && board[a] == board[c]) return [a, b, c];
        return null;
    }

    switch(index){
        case 0:
            return (check(0, 1, 2) || check(0, 3, 6) || check(0, 4, 8));
        case 1:
            return (check(0, 1, 2) || check(1, 4, 7));
        case 2:
            return (check(0, 1, 2) || check(2, 5, 8) || check(2, 4, 6));
        case 3:
            return (check(3, 4, 5) || check(0, 3, 6));
        case 4:
            return (check(3, 4, 5) || check(1, 4, 7) || check(0, 4, 8) || check(2, 4, 6));
        case 5:
            return (check(3, 4, 5) || check(2, 5, 8));
        case 6:
            return (check(6, 7, 8) || check(0, 3, 6) || check(2, 4, 6));
        case 7:
            return (check(6, 7, 8) || check(1, 4, 7));
        case 8:
            return (check(6, 7, 8) || check(2, 5, 8) || check(0, 4, 8));
        break;
    }
    return 0;
}

function declareResult(id){
    playaudio("win");
    const status = document.querySelector(".statustext");
    switch (id){
        case 1:
            status.textContent = "WOHOO " + player1 + ", you're a CHAMP!";
            score1++;
        break;
        case 2:
            status.textContent = "WOHOO " + player2 + ", you're a CHAMP!";
            score2++;
        break;
        case 0:
            status.textContent = "You two are head on! IT'S A DRAW!";
            score1 += 0.5;
            score2 += 0.5;
        break;
        default:
            return;
        break;
    }
    clearInterval(timer);
    const bar = document.querySelector(".status .timerbar");
    bar.classList.remove("wrap");
    document.querySelector(".player1.score .displayscore").textContent = score1;
    document.querySelector(".player2.score .displayscore").textContent = score2;
    gameover = true;
    if (gameover) document.querySelectorAll(".option").forEach(option => {
    option.style.display = "flex";
    });
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".alertPopup").style.display = "none";
    // document.querySelector(".resignalertPopup").style.display = "none";

    document.querySelector(".rematch.option").addEventListener("click", rematch);
    document.querySelector(".newgame.option").addEventListener("click", newGame);

}

function handleDrawClick(){
    if (gameover) return;

    const popup = document.querySelector(".alertPopup");
    const otherplayer = (move % 2 == 0) ? player1 : player2;

    document.querySelector(".overlay").style.display = "block";
    popup.style.display = "block";
    
    popup.querySelector(".question").textContent = otherplayer + ", do you accept draw?";

    popup.querySelector(".yes").addEventListener("click", () => declareResult(0));
    popup.querySelector(".no").addEventListener("click", () => {
        document.querySelector(".overlay").style.display = "none";
        document.querySelector(".alertPopup").style.display = "none";
    });
    
}

function handleResignClick(){
    if (gameover) return;

    const popup = document.querySelector(".alertPopup");
    const currentplayer = (move % 2 == 0) ? player2 : player1;

    document.querySelector(".overlay").style.display = "block";
    popup.style.display = "block";
    
    popup.querySelector(".question").textContent = currentplayer + ", are you sure to resign?";

    popup.querySelector(".yes").addEventListener("click", () => {
        (move % 2 == 0) ? declareResult(1) : declareResult(2);
    });
        popup.querySelector(".no").addEventListener("click", () => {
        document.querySelector(".overlay").style.display = "none";
        document.querySelector(".alertPopup").style.display = "none";
    });

}

function rematch(){
    [player1, player2] = [player2, player1];
    [score1, score2] = [score2, score1];

    document.querySelectorAll(".grid").forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("player1sign", "player2sign");
    })

    document.querySelectorAll(".option").forEach(option => {
        option.style.display = "none";
    })

    board = ["", "", "", "", "", "", "", "", ""];

    startGame();
}

function newGame(){
    location.reload();
}




document.querySelector(".alertPopup").style.display = "none";
document.querySelectorAll(".option").forEach(option => {
    option.style.display = "none";
});

document.querySelector(".skip.buttons").addEventListener("click", skipNames);
document.querySelector(".continue.buttons").addEventListener("click", getPlayerNames);

const cells = document.querySelectorAll(".grid");

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
});

document.querySelector(".drawbutton.button").addEventListener("click", handleDrawClick);
document.querySelector(".resign.button").addEventListener("click", handleResignClick);

const buttons = document.querySelectorAll(".grid, .button, .buttons");

buttons.forEach(element => element.addEventListener("click", () => playaudio("click")));
