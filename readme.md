# Program Name Book Rating Bot

## Overview
 This progran collect and process some book rating data that we have in a CVS file and populate our notion database with it.

## How It Works
First we create a class Initilzed a class called BookRating and pass our notion page Id . We then call a serrie of methods called processBookRating that calle muttiple otehr methode.
  - orderFile: The orderFile method reads data from a CSV file, processes each row, and organizes it into a data structure (this.uniquesUserRating) for further analysis. It does the following
    1 Retrieves CSV data using the getCVSData method.

    2 Iterates through each row of the CSV data.

    3 For each row, it extracts the book name, user, and rating.

    4 Normalizes and formats the book name and user by converting them to lowercase, trimming whitespace, and removing spaces between words.

    5 Generates a unique key for each combination of the formatted book name and user.

    6 Creates an entry in the uniquesUserRating object, storing the rating, original book name, and formatted book name under the generated unique key.

- processRating: The processRating function processes and aggregates ratings for books based on the data previously organized in the uniquesUserRating object. Here's what it does:
    1 It iterates through each book (represented by formatBookName) in the uniquesUserRating object.

    2 For each book, it retrieves the stored rating, original book name, and formatted book name.

    3 It checks if the formatBookName already exists in the bookRating object. If it does, it means there are previous ratings for this book.

    4 If it exists, it updates the following information for the book:
    - numberOfUser: Increments the count of users who have rated the book.
    - sumOfRating: Adds the new rating to the total sum of ratings for the book.
    - currentRating: Calculates the new average rating based on the updated sumOfRating and numberOfUser.

    - If it doesn't exist, it creates an entry for the book in the bookRating object with the initial values:
    - numberOfUser: Set to 1, indicating the first user to rate the book.
    - sumOfRating: Set to the initial rating, as there's only one rating so far.
    - currentRating: Set to the initial rating, which is also the first rating.

    Additionally, the function checks if the rating is equal to 5. If it is, it increments the count of users who have rated the book as a favorite in the favoritesBookRating object. If the book is not yet in the favoritesBookRating object, it initializes the count to 1.


- buildDatabaseData: The buildDatabaseData function is responsible for constructing and formatting data in preparation for input into a database. Here's a breakdown of what this function does:

    - It initializes an empty array called formatTedData, which will be used to store the formatted data for each book.

    - It iterates through the entries in the bookRating object, where each entry - represents a book and its associated rating information. The loop variable formatedBookName corresponds to the formatted book name used as a key in the bookRating object.

    - For each book, it extracts the bookName and currentRating from the bookRating object. These values represent the original book name and the current average rating for that book, respectively.

    - It checks the favoritesBookRating object to find the count of users who rated the book as a favorite. If the book is not found in the favoritesBookRating object (indicated by ?? 0), it defaults to a count of 0.

    - It constructs an object for each book, containing the following properties:

    bookName: The original book name, capitalized using the capitalizeWord function (which is assumed to be defined elsewhere in your code).
    currentRating: The current average rating for the book.
    favoriteBookCount: The count of users who rated the book as a favorite.
    The constructed object for each book is pushed into the formatTedData array.

    Finally, the function returns the formatTedData array, which now contains formatted data for each book, ready to be used for database entry or any other further processing.

    - createDataBase: The createDataBase function appears to create a database in Notion. Here's a breakdown of what this function does:

    It retrieves the Notion page ID from the environment variables using process.env.NOTION_PAGE_ID. This page ID likely represents the Notion page where you want to create the database.

    It sets a title variable with the value "Book ratings." This will be the title of the database.

    Inside a try-catch block, it attempts to create a new database in Notion using the notion.databases.create method. The database creation includes the following components:

    parent: Specifies that the new database will be created on a page with the given pageId.
    title: Sets the title of the database to "Book ratings."
    properties: Defines the properties or columns of the database, including "Book title," "Ratings," and "Favorites." These properties appear to be columns in the database, where "Book title" is of type "title," and "Ratings" and "Favorites" are of type "number."
    If the database creation is successful, it stores the ID of the newly created database in this.dataBaseId for future reference.

    If any errors occur during the database creation process, it catches the error and logs it to the console with a message indicating the error.

- renderDataInDatabase:The renderDataInDatabase function appears to be responsible for rendering or creating entries (rows) in a Notion database based on the data provided. Here's what this function does:


The renderDataInDatabase function appears to be responsible for rendering or creating entries (rows) in a Notion database based on the data provided. Here's what this function does:

It takes an array of data as its parameter. This array likely contains objects representing information about books, including properties like bookName, currentRating, and favoriteBookCount.

It iterates through each object in the data array using a for...of loop, where each info variable represents an object containing book-related data.

For each info object, it extracts the values of bookName, currentRating, and favoriteBookCount.

It then constructs a properties object, which appears to be in a format suitable for creating a new row (entry) in a Notion database. The properties object contains the following properties:

"Book title": This property represents the book's title and is set to an object with a title property, which contains an array with a single object. This single object further contains the book's title in a structured format.
"Ratings": This property represents the book's rating and is set to an object with a number property. The number property is populated with the parsed currentRating value, possibly rounded to two decimal places.
"Favorites": This property represents the count of users who rated the book as a favorite and is set to an object with a number property, populated with the favoriteBookCount value.
It calls the createRow method, passing the constructed properties object as an argument. This function likely creates a new row in the Notion database with the specified properties.


- createRow: The createRow function is responsible for creating a new row (entry) in a Notion database with the specified data. Here's how this function works:
t takes an object called newRowData as its parameter. This object represents the properties and values that will be used to populate the new row in the Notion database.

Inside a try-catch block, it attempts to create a new page (row) in the Notion database using the notion.pages.create method. This involves the following components:

parent: Specifies the database_id where the new row should be created. It uses the this.dataBaseId property, which likely holds the ID of the database where the row will be added.
properties: Contains the data to be added to the new row. This data is provided in the newRowData object.
If the creation of the new row is successful, it completes the operation.

If any errors occur during the row creation process, it catches the error and logs it to the console using console.error. The error message typically includes information about the error, such as the error.body property, which might contain details about the error response from the Notion API.


## How to Run
1. **Prerequisites**: List any prerequisites or dependencies that need to be installed or set up before running your program.

2. **Installation**: Explain how to install or set up your program, including any configuration steps if necessary.

3. **Running the Program**: Provide clear instructions on how to run your program. Include any command-line commands or specific steps users should follow.

4. **Usage**: If applicable, provide examples of how to use your program and the expected output.

## Challenges and Problem Solving
- **Was there anything you got stuck on, and if so what did you do to resolve it?**: something that I faced that was not a blocker but that was interesting was thinking about how I wanted to model this program, for example (function vs class, error handling), and how deep and fancy I wanted to make this program. I then realized that it is important to focus on simplicity and correctness, from there I then design it with those ideas in mind
- **Do you have any suggestions for improving the API documentation to make it clearer or easier to use?** : Honetly the documentating is really good. Something i can think of this that when looking into the notion sdk it was not clear where to find a list of all methodes that can me called by the node.js sdk in the readme or in the getting stated . However overall the documentation is easy to understand 

## Sources
List any major sources or references you relied on during the development of your program. This could include links to StackOverflow responses, documentation, or tutorials related to specific aspects of your code. 
- [Digitalocean]([https://example.com/notion-api](https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv)): Used to learn how to read cvs in node.js

## Dependencies
List major open-source libraries or packages you used in your program, along with their purpose. For example:
- [Notion API Library](https://github.com/makenotion/notion-sdk-js): Used to interact with the Notion API for database creation and data entry.
- [CSV Parser]([https://example.com/csv-parser](https://www.npmjs.com/package/csv-parser)): Used to parse CSV files and extract data.
"

