var apiURL = new FetchApi('https://games-app-siit.herokuapp.com');

async function showGames(){
    const arrayOfGames = await apiURL.getGamesList();
    const gameContainer = document.querySelector('.container')
    for(var i = 0; i < arrayOfGames.length; i++) {
        const game = new Game(arrayOfGames[i]._id, arrayOfGames[i].title, arrayOfGames[i].description, arrayOfGames[i].imageUrl);
        const gameDiv = game.show();
        gameContainer.appendChild(gameDiv);

        document.getElementById(`${game._id}`).addEventListener("click", async function(){
            if(event.target.classList.contains('delete-btn')){
                const gameDiv = event.target.parentElement;
                //const delGame = await apiUrl.deleteGame(gameDiv.getAttribute('id'));
                console.log(apiURL);
                removeDeletedElementFromDOM(document.querySelector('.game-box'));
            } else if(event.target.classList.contains('update-btn')){
                createDomElement((event.target.parentElement));
            }
        })
    }
}

function createDomElement(gameContainer){
    const gameTitle = gameContainer.querySelector('h1');
    const gameDescription = gameContainer.querySelector('p');
    const gameImageURL = gameContainer.querySelector('img');
    const updatedGameElement = document.createElement('form');
    updatedGameElement.id = "updateForm";
    updatedGameElement.innerHTML = `
                                    <label for="newGameTitle">Title *</label>
                                    <input type="text" value="${gameTitle.textContent}" name="newGameTitle" id="newGameTitle" />

                                    <label for="newGameDescription">Description</label>
                                    <textarea name="newGameDescription" id="newGameDescription">${gameDescription.textContent}</textarea>
                                    
                                    <label for="newGameImageUrl">Image URL *</label>
                                    <input type="text" name="newGameImageUrl" id="newGameImageUrl" value="${gameImageURL.src}"/>
                                    
                                    <button class="save-btn">Save Changes</button>
                                    <button class="cancel-btn">Cancel</button>`;
    gameContainer.appendChild(updatedGameElement);
    gameContainer.querySelector('.cancel-btn').addEventListener('click', function(event){
        event.preventDefault();
        removeDeletedElementFromDOM(updatedGameElement);
    });

    gameContainer.querySelector('.save-btn').addEventListener('click', function(event){
        event.preventDefault();

        const updatedGameTitle = document.querySelector('#newGameTitle');
        const updatedGameDescription = document.querySelector('#newGameDescription');
        const updatedGameImageUrl = document.querySelector('#newGameImageUrl');

        const urlencoded = new URLSearchParams();
        urlencoded.append("title", updatedGameTitle.value);
        urlencoded.append("description", updatedGameDescription.value);
        urlencoded.append("imageUrl", updatedGameImageUrl.value);
        
        removeDeletedElementFromDOM(updatedGameElement);
        (async function(){
            const editForm = await apiURL.updateGameRequest(gameContainer.id, urlencoded);
            return editForm;
        })();
    });
        
};

showGames();

function removeDeletedElementFromDOM(domElement){
    domElement.remove();
};

document.querySelector(".submitBtn").addEventListener("click", function(event){
    event.preventDefault();
    const newGame = new createGameForm(document.getElementById("gameTitle"),
                                        document.getElementById("gameDescription"),
                                        document.getElementById("gameGenre"),
                                        document.getElementById("gamePublisher"),
                                        document.getElementById("gameImageUrl"),
                                        document.getElementById("gameRelease"));


    newGame.validateFormElement(newGame.gameTitle, "The title is required!");
    newGame.validateFormElement(newGame.gameGenre, "The genre is required!");
    newGame.validateFormElement(newGame.gameImageUrl, "The image URL is required!");
    newGame.validateFormElement(newGame.gameRelease, "The release date is required!");

    newGame.validateReleaseTimestampElement(newGame.gameRelease, "The release date you provided is not a valid timestamp!");

    if(newGame.gameTitle.value !== "" && newGame.gameGenre.value !== "" && newGame.gameImageUrl.value !== "" && newGame.gameRelease.value !== "") {
        var urlencoded = new URLSearchParams();
        urlencoded.append("title", newGame.gameTitle.value);
        urlencoded.append("releaseDate", newGame.gameRelease.value);
        urlencoded.append("genre", newGame.gameGenre.value);
        urlencoded.append("publisher", newGame.gamePublisher.value);
        urlencoded.append("imageUrl", newGame.gameImageUrl.value);
        urlencoded.append("description", newGame.gameDescription.value);

       (async function gameCreate(){
           const request = await apiURL.createGameRequest(urlencoded)
           console.log(request);
           const newGameDom = newGame.displayCreatedGame(request);
           document.querySelector('.container').appendChild(newGameDom);
       })
    }
})

function createGameForm(title, releaseDate, genre, publisher, imageUrl, description) {
    this.title = title;
    this.releaseDate = releaseDate;
    this.genre = genre;
    this.publisher = publisher;
    this.imageUrl = imageUrl;
    this.description = description;
}

createGameForm.prototype.validateFormElement = function(inputElement, errorMessage) {
    if(inputElement.value === "") {
        if(!document.querySelector('[rel="' + inputElement.id + '"]')){
            buildErrorMessage(inputElement, errorMessage);
        }
    } else {
        if(document.querySelector('[rel="' + inputElement.id + '"]')){
            console.log("the error is erased!");
            document.querySelector('[rel="' + inputElement.id + '"]').remove();
            inputElement.classList.remove("inputError");
        }
    } 
}

createGameForm.prototype.validateReleaseTimestampElement = function (inputElement, errorMessage){
    if(isNaN(inputElement.value) && inputElement.value !== "") {
        buildErrorMessage(inputElement, errorMessage);
    }
}

createGameForm.prototype.buildErrorMessage = function (inputEl, errosMsg){
    inputEl.classList.add("inputError");
    const errorMsgElement = document.createElement("span");
    errorMsgElement.setAttribute("rel", inputEl.id);
    errorMsgElement.classList.add("errorMsg");
    errorMsgElement.innerHTML = errosMsg;
    inputEl.after(errorMsgElement);
}

createGameForm.prototype.displayCreatedGame = function(request) {
    const gameELement = document.createElement("div");
    gameELement.className = "game-box";
    gameELement.setAttribute("id", `${request._id}`)
    gameELement.innerHTML = `<h1>${request.title}</h1> 
                            <img src="${request.imageUrl}" />
                            <p>${request.description}</p> 
                            <button class="delete-btn">Delete Game</button>
                            <button class="edit-btn">Edit Game</button>`;

    return gameELement;
}
