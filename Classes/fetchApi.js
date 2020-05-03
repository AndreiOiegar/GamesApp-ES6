function FetchApi(apiURL){
    this.apiURL = apiURL;
}

FetchApi.prototype.getGamesList = function(){
    return fetch(`${this.apiURL}` + "/games", {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        } 
    })
    .then(response => response.json());
}

FetchApi.prototype.deleteGame = function(gameID){
    return fetch(`${this.apiURL}` + "/games/" + gameID, {
        method: "DELETE",
    }).then(r => r.text());
}

FetchApi.prototype.createGameRequest = function(){
    return fetch(`${this.apiURL}` + "/games/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: gameObject
    }).then(response => response.json());
}

FetchApi.prototype.updateGameRequest = function(gameId, updatedGameObj){
    return fetch(`${this.apiURL}` + "/games/" + gameId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: updatedGameObj
    }).then(response => response.json())
}