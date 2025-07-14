// Objeto para armazenar atalhos:
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons"; // Maneira dinamica para o caminho de alguma imagem dentro de icons.

// Pequeno banco de dados com as cartas do jogo:
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}/dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}/magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}/exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    // Impede ver a carta do oponente:
    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });

        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}

async function setCardField(cardId) {
    await removeAllCardsImages(); // Reset de cartas durante duelo.

    let computerCardId = await getRandomCardId();
    
    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
    if (value == true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block"; 
    }

    if (value == false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none"; 
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";    
    state.cardSprites.type.innerText = "";   
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "It's Draw";
    let playerCard = cardData[playerCardId];

    // o metodo includes() pesquisa um valor especifico em uma string:
    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "You Win!";
        await playAudio("win");
        state.score.playerScore++;
    }
    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "You lose";
        await playAudio("lose")
        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages() {
    // Desestruturação de Objetos:
    let { computerBOX, player1BOX } = state.playerSides;

    let imageElements = computerBOX.querySelectorAll("img");
    imageElements.forEach((img) => {
        img.remove();
    });

    imageElements = player1BOX.querySelectorAll("img");
    imageElements.forEach((img) => {
        img.remove();
    });
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init(); // Reinicia o duelo.
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    
    try {
        audio.play();
    } catch {}
}

function init() {
    showHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    // Toca a musica de fundo:
    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();