# Importing the required libraries and objects
from flask import Flask, render_template, request, jsonify, redirect
from flask_session import Session
from wget import download
from threading import Thread
from helpers import apology

# Setting up the flask application
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Defining a class to store the item details
class item_details:
    def __init__(self, url, output_name, current=0, total=0):
        self.url = url
        self.output_name = output_name
        self.current = current
        self.total = total

    def __str__(self):
        return f"{self.url} {self.output_name} {self.current} {self.total}"

    def __repr__(self):
        return f"{self.url} {self.output_name} {self.current} {self.total}"


# Defining a list to store the item objects
items = []


# Ensures that the cache is removeed
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Supporting both POST and GET methods
@app.route("/", methods=["GET", "POST"])
def download_items():

    # If the request method is GET
    if request.method == "GET":

        # Render the required template
        return render_template("index.html")

    # Otherwise
    else:

        # Get the number of items
        number_of_items = int(request.form.get("number_of_items"))

        # Get the item URL
        items_url = [
            request.form.get("item_url" + str(i)) for i in range(number_of_items)
        ]

        # Get the output file name
        output_files = [
            request.form.get("output_file" + str(i)) for i in range(number_of_items)
        ]

        # If the total elements in each list is not same
        if len(items_url) != len(output_files):

            # Render an apology message
            return apology("Please enter the same number of URLs and output files")

        # Clearing all the previous contents in the list containing all the items
        items.clear()

        # For each item in any of the lists
        for i, j in enumerate(items_url):

            # State the item details to the list's particular index
            items.append(item_details(j, output_files[i], 0, 0))

        # Defining a thread to download the items
        download_thread = Thread(target=download_items_process)

        # Starting the thread
        download_thread.start()

        # Return redirect to the progress bar page
        return redirect("/downloading")


# Defining a function to update the progress bar and do the updates in the item's object
def download_items_bar(current, total, width):

    # Get the item from the global variables
    item = globals()["item"]

    # Set the current and total parameters of the object to the passed parameters
    item.current = current
    item.total = total


# Defining a function to download the items
def download_items_process():

    # For each item in list of items
    for i, k in enumerate(items):

        # Setting the global variable
        global item
        item = items[i]

        # Setting the variables to the URL and output name of the particular item
        url = items[i].url
        output_name = items[i].output_name

        # Downloading the item using wget module's download function
        download(url, out=output_name, bar=download_items_bar)


# Supporting only GET method
@app.route("/downloading_json")
def json_download_process():

    # Return a JSON object containing all the item details for the item currently downloading
    return jsonify(
        item=globals()["item"].url,
        output_name=globals()["item"].output_name,
        current=globals()["item"].current,
        total=globals()["item"].total,
        current_index=items.index(globals()["item"]),
        total_index=len(items),
    )


# Supporting only GET method for the progress bar
@app.route("/downloading")
def downloading_items_process():

    # Rendering the template with the required counts
    return render_template(
        "downloading.html",
        total_count=len(items),
        current_count=items.index(globals()["item"]),
    )


# Supporting only GET method for the success route
@app.route("/success")
def download_items_success():

    # Rendering the required template with the total count
    return render_template("success.html", total_count=len(items))


# Running the app in debug mode
if __name__ == "__main__":
    app.run(debug=True)
