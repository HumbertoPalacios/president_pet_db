// Create global variables that are accessible everywhere on app.js
const searchButton = $("#searchButton");
const clearButton = $("#clearButton");
const presidentResults = $("#presidentResults")

// Search Button Event Listener 
searchButton.on('click', function(){ 
    presidentResults.empty(); // Clear the results

    const presidentNumber = $("#presidentNumber").val(); // Attain the value of the input and store it in the const presidentNumber

    fetch(`http://localhost:3000/api/presidents/${presidentNumber}/pets`) // Fecth this URL 
    .then((res) => res.json()) // If successful, respond with JSON formatted data
    .then((data) => { // And execute the following code

      if (!data || data.length === 0) { // Verify if data exists
        presidentResults.append(`<h3>No Data Found for President Number ${presidentNumber}</h3>`); // If it does not, send a message
      } else { // If it does exists
        // Format the president data in a user friedly way and store it in a const
        const presidentInfo = ` 
          <div class="president-info">
            <h2>${data[0].presidentname}</h2>
            <p>Chronological Number: ${data[0].chronologicalnumber}</p>
            <p>Term: ${data[0].startyear} - ${data[0].endyear}</p>
            <p>Had Pets: ${data[0].hadpets}</p>
          </div>`;
  
        let petsList = '<ul class="pets-list">'; // Create a ul and store it in variable
        data.forEach((item) => { // For each loop that iterates through the array of objects
          if (item.petname) { // If the president does have a pet
            petsList += `<li><strong>${item.petname}</strong> - ${item.species}</li>`; // Concatenate the name and species to the existing ul
          }
        });
        petsList += '</ul>'; // Finish the concatenation of the ul
  
        presidentResults.append(presidentInfo); // Append the president information 
        if (data[0].hadpets) { // Verify if the president did have a pet or pets and if so
          presidentResults.append(`<h3>Pets:</h3>`); // Create a h3 tag with text
          presidentResults.append(petsList); // And append the pet list
        }
      }
    });
})

// Clear Button Event Listener 
clearButton.on("click", function(){
    presidentResults.empty();  // Clear the previous results
    $("#presidentNumber").val(""); // Clear the value of the input

    // Append an H2 tag with this text and as well as a picture of bo the dog
    presidentResults.append(`<h2>Hail to the Pet Chief</h2><br>`); 
    presidentResults.append(`<img src="https://i.natgeofe.com/k/ef90348b-94f1-450e-9bab-5006a387395b/bo-white-house_square.jpg" width="500" height="500">`);

})

  

