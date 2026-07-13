let array = [];
let selected = [];
let dailyCorrectMatches = [[5,2,3,4], [1,6,7,8], [9,10,11,12], [13,14,15,16]];
let lives = 0;
const matchedGroups = {
    0: 'group1',
    1: 'group2',
    2: 'group3',
    3: 'group4'
};
let attempts = 0;
let correctAttempts = 0;

const arrayOfTimes = [];
const order = [];

function getAvgTimes(array) {
    const timePerQueries = [];
    for (let i=0; i < array.length; i+=2) {
        if (array[i+1]) timePerQueries.push(array[i+1]-array[i])
    };
    const sum = timePerQueries.reduce((total, num) => total + num, 0);
    const averageTime = sum / timePerQueries.length;

    return averageTime
}

async function sendData(url, payload) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
        const data = await response.json();
        return data;

        } catch (error) {
        console.error('Fetch failed:', error.message);
        throw error;
    }
};

function formatIntoData(accuracy, timePerQuery, orderOfCorrectGuesses) {
    const data = {
        'Accuracy': accuracy,
        'Average time per selection': timePerQuery,
        'Order of correct guesses': orderOfCorrectGuesses
    }

    return data
};

function lowToHigh(arr) {
    return arr.sort((a, b) => a - b);
}; // This is needed to order the selected buttons in ascending order so that they can be compared to the correct matches.

function appendAndRemove(idx) {
    if (selected.length < 4 && array[idx].classList.contains("correct") == false) {
        for (let i = 0; i < array.length; i++) {
            if (array[i]) array[i].disabled = false;
        };
        const el = array[idx];
        const idNum = Number(el.id);
        if (el.isSelected == true) {
            if (!selected.includes(idNum)) selected.push(idNum);
        }
        if (el.isSelected == false && selected.includes(idNum)) {
            selected.splice(selected.indexOf(idNum), 1);
        }
        el.classList.toggle("selected");
    }
    else {
        const el = array[idx];
        const idNum = el ? Number(el.id) : null;
        if (el && el.isSelected == false && idNum !== null && selected.includes(idNum)) {
            selected.splice(selected.indexOf(idNum), 1);
            el.classList.toggle("selected");
        }
        for (let i = 0; i < array.length; i++) {
            if (array[i]) array[i].disabled = true;
        }
    }
};
// Appends choices to the selected array so that they can be compared to the correct matches.

for (let i = 0; i < 16; i++) {
    const button = document.getElementById(`${i + 1}`);
    button.isSelected = false;
    array.push(button)};

for (let j = 0; j < array.length; j++) {
    const el = array[j];
    if (!el) continue;
    el.addEventListener("click", function(event) {
        const clicked = event.currentTarget;
        clicked.isSelected = !clicked.isSelected;
        const idx = array.indexOf(clicked);
        if (idx === -1) return;
        appendAndRemove(idx);
        const time = performance.now();
        arrayOfTimes.push(time);
        console.log('selected ts');
        console.log(getAvgTimes(arrayOfTimes)) //Maybe change?
    });
};

const submitBtn = document.getElementById("submitbtn");
submitBtn.addEventListener("click", function() {
        if (selected.length == 4) {
            const sortedSelected = lowToHigh([...selected]);
            let counter = 4;
            for (const match of dailyCorrectMatches) {
                const sortedSelectedMatch = lowToHigh(match);
                if (JSON.stringify(sortedSelected) !== JSON.stringify(sortedSelectedMatch)) {
                    counter--;
                    if (counter == 0) {
                        alert("Incorrect match. Please try again.");
                        attempts++;
                        const accuracy = correctAttempts / attempts;
                        console.log(accuracy);
                        lives++;
                        for (let i=0; i < lives; i++) {
                            const lifeEl = document.getElementById(`life${4-i}`);
                            if (lifeEl) lifeEl.style.opacity = '0'
                        }
                    }
                }
                if (JSON.stringify(sortedSelected) === JSON.stringify(sortedSelectedMatch)) {
                    const correctChoice = matchedGroups[dailyCorrectMatches.indexOf(match)]
                    alert(`${correctChoice}`);
                    order.push(correctChoice);
                    for (const idNum of selected) {
                        const el = document.getElementById(String(idNum));
                        if (!el) continue;
                        el.classList.remove("selected");
                        el.classList.add("correct");
                        el.disabled = true;
                    };
                    attempts++;
                    correctAttempts++;
                    const accuracy = correctAttempts/attempts;
                    console.log(accuracy);
                    selected.splice(0, 4);
                    console.log(selected.length);
                    break;
                    }
                }
            }
        else {
            alert("Please select 4 buttons before submitting.");
            console.log(selected.length);
        }
    }
); /* Creates a submit button that checks if the selected length is 4, sort from low to high, checks if any of the corrected matches match, 
and alerts if the match is correct or incorrect. If correct, it adds a CSS class to the selected button and disables them from being clicked again. */

function reroll() {
    let newIdx = randint(0,15)
    return newIdx
};

function shuffle(array) {
    for (let i = array.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
} // Fisher-Yates Algorithm

// Shuffle the backing array and also reorder the DOM children inside the .images container
function shuffleInDOM() {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    const container = document.querySelector('.images');
    if (!container) return;

    // Re-append elements in shuffled order (skips falsy entries)
    for (const el of array) {
        if (el) container.appendChild(el);
    }
};

const shuffleBtn = document.getElementById('shufflebtn');
if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
        shuffleInDOM();
    });
}