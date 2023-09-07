# Book Club Rating 

## Overview
This Node.js application is designed to import CSV data containing book ratings, process the data, and create a Notion database with book ratings and user preferences. It utilizes the Notion API for database creation and record insertion.

## Demo 

https://github.com/kennethoo/notiontakehome/assets/48225800/aabfc7cb-85d1-4a18-90e6-0ef6592ecde7

## How It Works
First we Initilzed a class called BookClubRating and pass our notion page Id . We then calls a methods called importCSVDataAndBuildDatabase that call the followings methodes

- **processCSVAndCreateUniqueUserRatings**: reads data from a CSV file, processes each row, and organizes it into a data structure (this.uniquesUserRating) for further analysis.
   
- **updateBookRatings**: processes and aggregates ratings for books based on the data previously organized in the uniquesUserRating object
   
- **prepareDatabaseRecords**:  responsible for constructing and formatting data in preparation for input into a database.

- **createDataBase**: create a database in Notion.

- **insertDatabaseRecords**: responsible for rendering or creating entries (rows) in a Notion database based on the data provided. 

- **createRow**: responsible for creating a new row (entry) in a Notion database with the specified data.


## How to Run
1. **Prerequisites**:
   - install node.js
     
2. **Installation**:
   - cd into the root dirrectory
   - run node index.js

## Challenges and Problem Solving
- **Was there anything you got stuck on, and if so what did you do to resolve it?**:
  Something that I faced that was not a blocker but that was interesting was thinking about how I wanted to model this program, for example (function vs. class, error handling), and how deep and fancy I wanted to make this program. I then realized that it is important to focus on simplicity and correctness, and from there I designed it with those ideas in mind.
  
- **Do you have any suggestions for improving the API documentation to make it clearer or easier to use?** :
  The documentation is really good, one thing I can think of is that when looking into the notion SDK it was not clear where to find a list of all methods that can be called by the node.js SDK in the readme or the getting stated. However, overall the documentation is easy to understand. 

## Sources
- [Digitalocean]([https://example.com/notion-api](https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv)): Used to learn how to read cvs in node.js

## Dependencies
- [Notion API Library](https://github.com/makenotion/notion-sdk-js): Used to interact with the Notion API for database creation and data entry.
- [CSV Parser]([https://example.com/csv-parser](https://www.npmjs.com/package/csv-parser)): Used to parse CSV files and extract data.
"

