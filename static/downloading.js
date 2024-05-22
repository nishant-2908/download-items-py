// Get the elements
var progress = document.getElementById("progress");
var progressBar = document.getElementById("progress-bar");

// Defining a bool to check if completed
var completed = false;

// Defining a function to fetch the JSON data of the current downloading item
function getValues() {

    // Fetch over the particular URL
    fetch("/downloading_json").

        // Getting the response as text
        then(res => res.text())

        // Using the same again
        .then(data => {

            // Parsing the JSON data
            var value = JSON.parse(data);

            // Checking if the downloading is completed
            completed = value.current_index == value.total_index;

            // Changing the progress value
            progress.ariaValueNow = value.current;

            // Changing the progress bar width
            progressBar.style.width = (value.current / value.total * 100) + "%";

            // Changing the innerHTML to current bytes downloaded
            progressBar.innerHTML = value.current + "/" + value.total + " bytes";
        })
}

// Defining a function to run the above function with some integrity
function runFunction() {

    // If the completed bool turns to false
    if (!completed) {

        // Run the function
        getValues();

        // Run the function again after 0.5 seconds
        setTimeout(runFunction, 500);
    }

    // Else
    else {

        // After 2 seconds of delay, redirect the page to the success page
        setTimeout(function () {
            window.location.href = "/success";
        }, 2000)
    }
}

// Run the above function
runFunction();