# Book Club Rating 

## Overview
This Node.js application is designed to import CSV data containing book ratings, process the data, and create a Notion database with book ratings and user preferences. It utilizes the Notion API for database creation and record insertion.

## Demo 

https://github.com/kennethoo/notiontakehome/assets/48225800/9441e2e9-c83c-4f1c-9433-ca258cab683e

## How It Works
First we Initilzed a class called BookClubRating and pass our notion page Id . We then calls a methods called importCSVDataAndBuildDatabase that call the followings methodes

- **processCSVAndCreateUniqueUserRatings**: reads data from a CSV file, processes each row, and organizes it into a data structure (this.uniquesUserRating) for further analysis.
   
- **updateBookRatings**: processes and aggregates ratings for books based on the data previously organized in the uniquesUserRating object
   
- **prepareDatabaseRecords**:  responsible for constructing and formatting data in preparation for input into a database.

- **createDataBase**: create a database in Notion (If we don't have one yet)

- **insertDatabaseRecords**: responsible for rendering or creating entries (rows) in a Notion database based on the data provided. 

- **createUniqueRow**: responsible for creating unique a new row (entry) in a Notion database with the specified data.


## How to Run
   - install node.js
   - cd into the root directory
   - run node index.js

## Challenges and Problem Solving
- **Was there anything you got stuck on, and if so what did you do to resolve it?**:
  Something that I faced that was not a blocker but that was interesting was thinking about how I wanted to model this program, for example (function vs class, error handling etc), and how deep and fancy I wanted to make this program. I then realized that it is important to focus on simplicity and correctness, and from there I designed the program with those ideas in mind.
  
- **Do you have any suggestions for improving the API documentation to make it clearer or easier to use?** :
  The documentation is really good, one thing I can think of is that when looking into the notion SDK it was not clear where to find a list of all methods that can be called by the node.js SDK in the readme or the getting stated. However, overall the documentation is easy to understand. 

## Sources
- [Digitalocean](https://www.digitalocean.com/community/tutorials/how-to-read-and-write-csv-files-in-node-js-using-node-csv): Used to learn how to read CSV in node.js.

- [Stackoverflow](https://stackoverflow.com/questions/68911829/getting-the-page-title-from-a-database-query-in-notion-api): Used to learn how to query the a notion dataBase.

- [Notion Doc](https://www.notion.so/help/intro-to-databases): Used to learn about notion dataBase.

## Dependencies
- [Notion API Library](https://github.com/makenotion/notion-sdk-js): Used to interact with the Notion API for database creation and data entry.
- [CSV Parser](https://www.npmjs.com/package/csv-parser): Used to parse CSV files and extract data.
- [Prettier](https://www.npmjs.com/package/prettier): Used to format my code.
