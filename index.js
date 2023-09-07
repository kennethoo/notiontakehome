// Load environment variables from a .env file
require("dotenv").config();

// Import required packages
const { Client } = require("@notionhq/client");
const fs = require("fs");
const capitalizeWords = require("./utills/capitalizeWords");
const { parse } = require("csv-parse");

// Initialize Notion client with authentication token
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Define a class for managing the Book Club Ratings
class BookClubRating {
  constructor({ notionPageID }) {
    if (!notionPageID) throw new Error("missing page Id");
    this.pageId = notionPageID;
    this.favoritesBookRating = {};
    this.uniquesUserRating = {};
    this.bookRating = {};
    this.dataBaseId = process.env.NOTION_DATABASE_ID;
  }

  createDataBase = async () => {
    console.log("Creating Notion DataBase...");
    const title = "Book Ratings";
    try {
      const newDb = await notion.databases.create({
        parent: {
          type: "page_id",
          page_id: this.pageId,
        },
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
        properties: {
          "Book title": { id: "fy:{", type: "title", title: {} },
          Rating: {
            type: "number",
            number: {},
          },
          Favorites: {
            type: "number",
            number: {},
          },
        },
      });
      this.dataBaseId = newDb.id;
    } catch (error) {
      console.log({ message: "error", error });
    }
  };

  getCVSData = async () => {
    return new Promise((resolve, reject) => {
      const data = [];
      const csvFilePath = "./static/ratings.csv";
      try {
        fs.createReadStream(csvFilePath)
          .pipe(parse({ delimiter: "," }))
          .on("data", function (row) {
            data.push(row);
          })
          .on("end", () => resolve(data));
      } catch (error) {
        reject(error);
      }
    });
  };

  processCSVAndCreateUniqueUserRatings = async () => {
    console.log("Processing CSV...");
    const cvsData = await this.getCVSData();
    for (let i = 0; i < cvsData.length; i++) {
      const [bookName, user, rating] = cvsData[i];
      const formattedBookName = bookName.toLowerCase().trim();
      const userNameFormatted = user.toLowerCase().trim();
      const uniqueRecordKey = formattedBookName + "#" + userNameFormatted;
      this.uniquesUserRating[uniqueRecordKey] = {
        rating: parseInt(rating),
        formattedBookName,
      };
    }
  };
  updateBookRatings = async () => {
    console.log("Updating Book Ratings...");
    for (const recordKey in this.uniquesUserRating) {
      const { rating, formattedBookName } = this.uniquesUserRating[recordKey];
      this.bookRating[formattedBookName];
      if (this.bookRating[formattedBookName] !== undefined) {
        const { userCount, totalRating } = this.bookRating[formattedBookName];

        const newUserCount = userCount + 1;
        const newTotalRating = totalRating + rating;
        const newRating = newTotalRating / newUserCount;

        this.bookRating[formattedBookName] = {
          userCount: newUserCount,
          averageRating: newRating,
          totalRating: newTotalRating,
          formattedBookName,
        };
      } else {
        this.bookRating[formattedBookName] = {
          userCount: 1,
          averageRating: rating,
          totalRating: rating,
          formattedBookName,
        };
      }
      if (rating == 5) {
        this.favoritesBookRating[formattedBookName] =
          this.favoritesBookRating[formattedBookName] + 1 || 1;
      }
    }
  };

  prepareDatabaseRecords = () => {
    console.log("Preparing Database Record...");
    const bookRatingData = [];
    for (const formatedBookName in this.bookRating) {
      const { formattedBookName, averageRating } =
        this.bookRating[formatedBookName];
      const favoritedCount = this.favoritesBookRating[formatedBookName] ?? 0;
      bookRatingData.push({
        bookName: capitalizeWords(formattedBookName),
        averageRating,
        favoritedCount,
      });
    }
    return bookRatingData;
  };
  // Get previous book from the database
  getBookTitles = async () => {
    try {
      const { results } = await notion.databases.query({
        database_id: this.dataBaseId,
      });
      return results.map((post) =>
        post.properties["Book title"].title[0].plain_text.toLowerCase()
      );
    } catch (error) {
      console.error("Error querying the database:", error.body);
    }
  };

  //Insert book data into the database
  insertDatabaseRecords = async (databaseRecords) => {
    console.log("Inserting Database Record...");
    const bookTitles = new Set(await this.getBookTitles());

    for (const databaseRecord of databaseRecords) {
      const { bookName, averageRating, favoritedCount } = databaseRecord;
      const properties = {
        "Book title": {
          title: [
            {
              text: {
                content: bookName,
              },
            },
          ],
        },
        Rating: {
          number: parseInt(averageRating.toFixed(2)),
        },
        Favorites: {
          number: favoritedCount,
        },
      };
      await this.createUniqueRow(properties, bookTitles, bookName);
    }
  };

  //Create unique record for book rating
  createUniqueRow = async (properties, bookTitles, bookName) => {
    if (bookTitles.has(bookName.toLowerCase())) return;
    try {
      await notion.pages.create({
        parent: {
          database_id: this.dataBaseId,
        },
        properties,
      });
    } catch (error) {
      console.error("Error creating row:", error.body);
    }
  };

  importCSVDataAndBuildDatabase = async () => {
    await this.processCSVAndCreateUniqueUserRatings();
    await this.updateBookRatings();
    const databaseRecords = await this.prepareDatabaseRecords();
    //create a new database if we don't have a default one
    if (!this.dataBaseId) await this.createDataBase();
    await this.insertDatabaseRecords(databaseRecords);
    console.log("CVS successfully uploaded to notion 🎉🎉.");
  };
}
const bookClubRating = new BookClubRating({
  notionPageID: process.env.NOTION_PAGE_ID,
});
bookClubRating.importCSVDataAndBuildDatabase();
