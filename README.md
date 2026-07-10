Connect images rather than just words!

System architecture:

1. Grid is organized into 4x4 images
2. The buttons are initialized with getElementById with a for loop and pushed to an array titled "array"
3. Iterate through every object and add an event listener to make it so when clicked it will add a CSS.

Selecting images

1. When you click on an image, it adds a selected CSS class to it and pushes it to an array called selected
2. If you click it again, the image gets the class removed and taken out of the selected array

Submit button

1. When you click the submit button a function sorts your selected array (which are indexes of the initial image) from low to high
2. Stringifies the arrays and sees if they are equal

Shuffling

1. Fisher yates algorithm applied to return the images in shuffled order
2.
