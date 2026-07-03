let array = [];
let selected = [];
let dailyCorrectMatches = [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];

function checkButtons(idx) {
    let counter = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[idx].isSelected == true) {
            counter++;
        }
    }
    if (counter == 4) {
        for (let j = 0; j < array.length; j++) {
            array[idx].disabled = true;
}
    }
} // this counts the number of selected buttons and disables all buttons if 4 buttons are selected, like in normal connections

function lowToHigh(arr) {
    return arr.sort((a, b) => a - b);
} // This is needed to order the selected buttons in ascending order so that they can be compared to the correct matches.

function appendAndRemove(idx) {
    if (array[idx].isSelected == true) {
            selected.push(idx);
        }
    if (array[idx].isSelected == false && selected.includes(idx)) {
            selected.splice(selected.indexOf(idx), 1);
        }
    }
// Appends choices to the selected array so that they can be compared to the correct matches.

for (let i = 0; i < 16; i++) {
    const button = document.getElementById(`${i + 1}`);
    button.isSelected = false;
    array.push(button);}

for (let i = 0; i < array.length; i++) {
    array[i].addEventListener("click", function() {
        array[i].isSelected = !array[i].isSelected;
        appendAndRemove(i);
        checkButtons(i);
        console.log('selected ts');
    });
} 
/* this creates an array of buttons and adds a click event listener to each button that toggles the isSelected property when clicked
and adds the button to the selected array if it is selected and removes it from the selected array if it is deselected. It also calls 
the checkButtons function to disable all buttons if 4 buttons are selected. */

const submitBtn = document.querySelector("button");
submitBtn.addEventListener("click", function() {
    if (selected.length == 4) {
        const sortedSelected = lowToHigh(selected);
        for (const match of dailyCorrectMatches) {
            if (JSON.stringify(sortedSelected) !== JSON.stringify(match)) {
                alert("Incorrect match. Try again.");
            }
            if (JSON.stringify(sortedSelected) === JSON.stringify(match)) {
                alert("Correct match!");
                for (const number of selected) {
                    array[number].classList.add("correct");
                    array[number].disabled = true;
                }
                console.log(selected.length)
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


/* Need to add a life system */