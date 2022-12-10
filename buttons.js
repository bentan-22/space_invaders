const easyMode = () => {
    easyModeSettings();
    return game.init();
};
const mediumMode = () => {
    mediumModeSettings();
    return game.init();
};
const hardMode = () => {
    hardModeSettings();
    return game.init();
};

const allModeButtons = document.getElementById('mode-buttons-div');
const instructionsDiv = document.getElementById('instructions-div');
const h1SpaceInvaders = document.getElementById('spaceinvaders-h1');

const mainMenu = document.getElementById('main-menu');
mainMenu.onclick = (event) => {
    location.reload();
}

const easyModeButton = document.getElementById('easy-mode-button');
easyModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return easyMode();
}

const mediumModeButton = document.getElementById('medium-mode-button');
mediumModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return mediumMode();
}

const hardModeButton = document.getElementById('hard-mode-button');
hardModeButton.onclick = (event) => {
    allModeButtons.style.display = 'none';
    instructionsDiv.style.display = 'none';
    h1SpaceInvaders.style.display = 'none';
    return hardMode();
}