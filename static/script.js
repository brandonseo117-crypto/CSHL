array = [];

for (let i = 0; i < 16; i++) {
    const button = document.querySelector(`#${i + 1}`);
    button.isSelected = false;
    button.addEventListener("click", function() {
        button.isSelected = !button.isSelected;
    });
    array.push(button);
}


counter = 0
for (let i = 0; i < array.length; i++) {
    if (array[i].isSelected == true) {
        counter++;
    }
    if (counter == 4) {
        for (let j = 0; j < array.length; j++) {
            array[j].disabled = true;
}
    }
}

let correctMatches = [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]];

function lowToHigh(arr) {
    return arr.sort((a, b) => a - b);
}

selected = []

for (let i = 0; i < array.length; i++) {
    if (array[i].isSelected == true) {
        selected.push(i);
    }
}

const submitBtn = document.querySelector("button");
submitBtn.addEventListener("click", function() {
    if (selected.length == 4) {
        const sortedSelected = lowToHigh(selected);
        for (const match of correctMatches) {
            if (JSON.stringify(sortedSelected) === JSON.stringify(match)) {
                alert("Correct match!");
                break;
            }
        }
    }
});