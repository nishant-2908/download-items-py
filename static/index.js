// Getting the required elements
var no_of_items = document.getElementById("number_of_items");
var generated_fields = document.getElementById("generated_field");
var warning = document.getElementById("warning");
var submit_button = document.getElementById("button");
var form = document.getElementById("form");


// Defining a function to generate the fields
function generate_field() {

    // Getting the values of the input field for number of items
    var items = parseInt(no_of_items.value);

    // Clear previous content
    generated_fields.innerHTML = '';

    // For loop iterated over items
    for (var i = 0; i < items; i++) {

        // Adding to the innerHTML for the generated_fields div element
        generated_fields.innerHTML += `
                <div class="mb-3 row">
                    <div class="col">
                        <label for="item_url_label">
                            <h3 class="choose-title">
                                Item ${i + 1} URL
                            </h3>
                        </label>
                        <textarea name="item_url${i}" class="url form-control" placeholder="Enter the item url" required
                        autocapitalize="off" autocomplete="off" minlength="10" inputmode="url"></textarea>
                    </div>
                    <div class="col">
                        <label for="output_name_label">
                            <h3 class="choose-title">
                                Item ${i + 1} Output Name
                            </h3>
                        </label>
                        <input type="text" class="output form-control" placeholder="Enter the output file name" name="output_file${i}"
                        required autocapitalize="off" autocomplete="off" minlength="3">
                    </div>
                </div>
            `;
    }
}


// Defining a function to check the validity of the fields
function checkValidity() {

    // Getting all the urls from the form
    var urls = document.getElementsByClassName("url");

    // If the submit button is for Check
    if (submit_button.innerText == "Check") {

        // Run the function to check for duplicates
        var duplicates = checkDuplicate();

        // If the function returns true
        if (duplicates == true) {

            // Return the function
            return
        }

        // For each item in the urls' list
        for (var i = 0; i < urls.length; i++) {

            // If the item is empty
            if (urls[i].value == "") {

                // Change the innerText for the warning
                warning.innerText = "Item " + (i + 1) + " URL empty";

                // Return the function
                return
            }

            // If the url turns to be an invalid url, checked using the function isValidURL
            else if (isValidURL(urls[i].value) == false) {

                // Change the innerText for the warning
                warning.innerText = "Item " + (i + 1) + " URL not valid";

                // Return the function
                return
            }

            // If the item is valid, change the innerText for the warning
            else {

                // Clear all the content
                warning.innerText = "";

                // Change the color to green
                warning.style.color = "green";

                // Change the innerText for the submit button
                warning.innerText = "All valid URL's found";

                // Change the innerText for the submit button
                submit_button.innerText = "Submit";
            }

        }
    } else {

        // Submit the form if the submit button is for Submit
        form.submit();
    }
}

// Defining a function to check for duplicates
function checkDuplicate() {

    // Get the urls' list
    var urls = document.getElementsByClassName("url");

    // For each item in the urls' list
    for (var i = 0; i < urls.length; i++) {

        // For each item in the list starting from the next element of the parent iterator variable
        for (var j = i + 1; j < urls.length; j++) {

            // If the values are equal
            if (urls[i].value == urls[j].value) {

                // Change the color to red
                warning.style.color = "red";

                // Change the innerText for the warning
                warning.innerText = "Item " + (i + 1) + "'s URL found matching with Item " + (j + 1)

                // Disable the submit button
                submit_button.disabled = true;

                // Return true (duplicates detected)
                return true
            }
        }

    }

    // Get all the output names
    var output_names = document.getElementsByClassName("output");

    // For each item in the list of output names
    for (var i = 0; i < output_names.length; i++) {

        // For each item in the list starting from the next element of the parent iterator variable
        for (var j = i + 1; j < output_names.length; j++) {

            // If the values are equal
            if (output_names[i].value == output_names[j].value) {

                // Change the warning color to red
                warning.style.color = "red";

                // Update the innerText for warning
                warning.innerText = "Item " + (i + 1) + "'s output name found matching with Item " + (j + 1)

                // Change the submit button's disabled to true
                submit_button.disabled = true;

                // Return true (duplicates detected)
                return true
            }
        }
    }

    // If the function does not return true, return false
    return false
}

// Defining a function to check for valid URL
function isValidURL(url) {

    // Check if the url is a valid URL (running a try-catch block)
    try {

        // Initiate the URL object with the url
        new URL(url);

        // Return true if object initiated true
        return true;
    }
    catch (error) {

        // If caught error, return false
        return false;
    }
}

// Run the function for generating fields for the default value in the input
generate_field();

// Adding event listeners to the input field of number of items
no_of_items.addEventListener("input", generate_field);

// Adding event listener to the submit button to check the form
submit_button.addEventListener("click", checkValidity);