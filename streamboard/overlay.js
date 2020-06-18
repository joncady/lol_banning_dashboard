"use strict";

const squaresPath = "./squares/";
const loadingPath = "./loading/";
const playerPath = "./players/player";
const totalChamps = 10;
const totalPlayers = 10;
const numBans = 5;
let socket;
let phaseNum = 1;
const SECOND = 1000;
let currentInterval;
let countdownTime;
let totalCountdown;
let oldData = {
    playerData: [],
    banData: [],
    champData: []
};

const states = {
    phase1: {
        name: 'Banning Phase 1',
        type: 'ban',
        perTeam: 3,
        cycles: 3 * 2,
        time: 28,
        totalTime: 6 * 27
    },
    phase2: {
        name: 'Champion Selection 1',
        type: 'champ',
        perTeam: 3,
        cycles: 3 * 2,
        time: 28,
        totalTime: 6 * 27
    },
    phase3: {
        name: 'Banning Phase 2',
        type: 'ban',
        perTeam: 2,
        cycles: 2 * 2,
        time: 28,
        totalTime: 6 * 27
    },
    phase4: {
        name: 'Champion Selection 2',
        type: 'champ',
        perTeam: 2,
        cycles: 2 * 2,
        time: 28,
        totalTime: 6 * 27
    },
    phase5: {
        name: 'Finalization',
        type: 'finish',
        perTeam: 1,
        cycles: 1,
        time: 61,
        totalTime: 1 * 60
    }
}

$(function () {
    fillPlayers();
    socket = io.connect('http://localhost:8080', { reconnection: true, reconnectionDelay: 1000 });
    socket.on('update', function (data) {
        updateInfo(data);
    });
    socket.on('start', function () {
        initializeStates();
    });
    socket.on('increase', (data) => {
        shiftState(data);
    });
    socket.on('next', () => {
        shiftCycle();
    });
});

function fillPlayers() {
    for (let i = 0; i < 10; i++) {
        $("#champ" + (i + 1)).css("background-image", "url(" + playerPath + i + ".jpg");
    }
}

function updateInfo(data) {
    let playerData = data.playerData;
    let champData = data.champData;
    let banData = data.banData;
    for (let i = 0; i < totalChamps; i++) {
        if (champData[i] !== "" && oldData.champData[i] != champData[i]) {
            oldData.champData[i] = champData[i];
            $("#champ" + (i + 1)).fadeOut(400, () => {
                $("#champ" + (i + 1)).css("background-image", "url(" + loadingPath + champData[i] + ".jpg");
            });
            setTimeout(() => {
                $("#champ" + (i + 1)).fadeIn();
            }, 500);
        }
        if (playerData[i] !== "" && playerData[i] != oldData.playerData[i]) {
            oldData.playerData[i] = playerData[i];
            $("#player" + (i + 1)).fadeOut(400, () => {
                $("#player" + (i + 1)).text(playerData[i]);
            });
            setTimeout(() => {
                $("#player" + (i + 1)).fadeIn();
            }, 500);
        }
    }
    for (let i = 0; i < numBans; i++) {
        let url = "url(" + squaresPath + banData[i] + ".jpg)";
        if (banData[i] !== "" && oldData.banData[i] != banData[i]) {
            oldData.banData[i] = banData[i];
            // $("#ban" + (i + 1) + "a").fadeOut(400, () => {
                $("#ban" + (i + 1) + "a").css("background-image", "url(" + squaresPath + banData[i] + ".jpg)");
            // });
            // setTimeout(() => {
            //     $("#ban" + (i + 1) + "a").fadeIn();
            // }, 500);
        }
        if (banData[i + 5] !== "" && oldData.banData[i + 5] != banData[i + 5]) {
            oldData.banData[i + 5] = banData[i + 5];
            // $("#ban" + (i + 1) + "b").fadeOut(400, () => {
                $("#ban" + (i + 1) + "b").css("background-image", "url(" + squaresPath + banData[i + 5] + ".jpg");
            // });
            // setTimeout(() => {
            //     $("#ban" + (i + 1) + "b").fadeIn();
            // }, 500);
        }
    }
}

function shiftState(state) {
    clearInterval(currentInterval);
    phaseNum = state;
    startInterval(states["phase" + phaseNum]);
}

function shiftCycle() {
    clearInterval(currentInterval);
    startInterval(states["phase" + phaseNum]);
}

function initializeStates() {
    startInterval(states.phase1);
}

function startInterval(phase) {
    let { name, time, cycles } = phase;
    $("#state").text(name);
    countdownTime = time;
    currentInterval = setInterval(() => oneSecond(), SECOND);
}

function oneSecond() {
    countdownTime -= 1;
    if (countdownTime <= 0) {
        clearInterval(currentInterval);
        phaseNum += 1;
    }
    $('#countdown').text(countdownTime);
}