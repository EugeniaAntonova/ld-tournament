"use strict";
const currentPlayerContainer = document.querySelector('#current-player-wrapper');
const currentPlayerAction = document.querySelector('.current-player-action');
const currentPlayerScore = document.querySelector('.current-player-score');
const currentPlayerPlace = document.querySelector('.current-player-place');
const playersList = document.querySelector('.rating-list');
const playerTemplate = document.querySelector('#player-template').content;
const winnerTemplate = document.querySelector('#winner-template').content;
const winnersList = document.querySelector('.winners-list');

const animateValue = (field, max, time) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / time, 1);
        field.textContent = `${Math.floor(progress * max).toLocaleString().replaceAll(',', ' ')}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const scoreOperations = (allScore) => {
    const starter = 1950000;
    const finalValue = starter + allScore * 0.05;

    const animatedValue = document.querySelector('.js-prize-value');
    animateValue(animatedValue, finalValue, 1000);

    const prizes = [...document.querySelectorAll('.js-prizes-prize')];
    for (let i = 0; i < prizes.length; i++) {
        switch (i) {
            case 0:
                prizes[i].textContent = (500000 + allScore * 0.05 * 0.15).toLocaleString().replaceAll(',', ' ');
                break;
            case 1:
                prizes[i].textContent = (500000 + allScore * 0.05 * 0.10).toLocaleString().replaceAll(',', ' ');
                break;
            case 2:
                prizes[i].textContent = (300000 + allScore * 0.05 * 0.05).toLocaleString().replaceAll(',', ' ');
                break;
            case 3:
                prizes[i].textContent = (250000 + allScore * 0.05 * 0.05).toLocaleString().replaceAll(',', ' ');
                break;
            case 4:
                prizes[i].textContent = (100000 + allScore * 0.05 * 0.05).toLocaleString().replaceAll(',', ' ');
                break;
            case 5:
                prizes[i].textContent = (12000).toLocaleString().replaceAll(',', ' ');
                break;
            case 6:
                prizes[i].textContent = (10000).toLocaleString().replaceAll(',', ' ');
                break;
            case 7:
                prizes[i].textContent = (1000).toLocaleString().replaceAll(',', ' ');
                break;

        }
    }
}

const createPlayer = (data) => {
    const { nick, place, score, bgUserToken } = data;
    const player = playerTemplate.cloneNode(true);
    player.querySelector('.nick').textContent = nick;
    player.querySelector('.place').textContent = place;
    player.querySelector('.score').textContent = score / 100;
    // if (parseInt(place) <= 5) {
    //     player.querySelector('.avatar-img').src = `https://sz.kz/picture?bgAvatar=${bgUserToken}`
    // }

    return player;
}
// const createWinner = (data) => {
//     const { nick, place } = data;
//     const winner = winnerTemplate.cloneNode(true);
//     winner.querySelector('.nick').textContent = nick;
//     winner.querySelector('.place').textContent = place;

//     return winner;
// }

const createAnchor = (current) => {
    if (current) {
        let players = playersList.children;
        players[current.place - 1].id = 'current-in-the-list';
        players[current.place - 1].classList.add('current-player')

        const target = document.querySelector('#current-in-the-list');


        if (current.place <= 100 && current.place > 5) {
            currentPlayerAction.classList.add('ready');
            currentPlayerAction.addEventListener('click', () => {
                target.scrollIntoView({ block: 'center', });
            })
        }
    } else {
        currentPlayerContainer.style.display = 'none';
    }
}

const onSuccessPlayers = (data, current, cb) => {
    data.forEach(element => {
        const player = cb(element);
        playersList.appendChild(player);
    });

    currentPlayerPlace.textContent = current.place;
    currentPlayerScore.textContent = current.score / 100;
    createAnchor(current);
}

// const onSuccessWinners = (data, cb) => {
//     const winners = data.slice(0, 5);
//     winners.forEach(element => {
//         const winner = cb(element);
//         winnersList.appendChild(winner);
//     });
// }

const onFail = (err) => {
    console.log(err);
}
const getData = async (onSuccess, onFail, playersOperator, scoreOperator) => {
    try {
        const response = await fetch(
            './data.json'
        );

        if (!response.ok) {
            throw new Error('Не удалось получить данные');
        }

        const resp = await response.json();
        const data = resp.data;
        const current = resp.currentUser ? resp.currentUser : false;
        const allScore = resp.allScore;
        scoreOperator(allScore);
        onSuccess(data, current, playersOperator);
    } catch (error) {
        onFail(error.message);
    }
};

// const getPrevWinners = async (onSuccess, onFail, cb) => {
//     try {
//         const response = await fetch(
//             './data.json'
//         );

//         if (!response.ok) {
//             throw new Error('Не удалось получить данные');
//         }

//         const resp = await response.json();
//         const data = resp.data;
//         onSuccess(data, cb);
//     } catch (error) {
//         onFail(error.message);
//     }
// };


document.addEventListener('DOMContentLoaded', () => {
    getData(onSuccessPlayers, onFail, createPlayer, scoreOperations);
    // getPrevWinners(onSuccessWinners, onFail, createWinner);
})

