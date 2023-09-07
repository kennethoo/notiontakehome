// Load environment variables from a .env file
require("dotenv").config();

// Import required packages
const { Client } = require("@notionhq/client");
const fs = require("fs");
const capitalizeWord = require("./utills/capitalize");
const { parse } = require("csv-parse");

// Initialize Notion client with authentication token
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Define a class for managing the Book Club Ratings
class BookClubRating {
  constructor(pageId) {
    if (!pageId) throw new Error("missing page id");
    this.pageId = pageId;
    this.favoritesBookRating = {};
    this.uniquesUserRating = {};
    this.bookRating = {};
    this.dataBaseId = null;
  }

  createDataBase = async () => {
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
          Ratings: {
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
    const bookRatingData = [];
    for (const formatedBookName in this.bookRating) {
      const { formattedBookName, averageRating } =
        this.bookRating[formatedBookName];
      const favoritedCount = this.favoritesBookRating[formatedBookName] ?? 0;
      bookRatingData.push({
        bookName: capitalizeWord(formattedBookName),
        averageRating,
        favoritedCount,
      });
    }
    return bookRatingData;
  };
  insertDatabaseRecords = async (databaseRecords) => {
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
        Ratings: {
          number: parseInt(averageRating.toFixed(2)),
        },
        Favorites: {
          number: favoritedCount,
        },
      };
      this.createRow(properties);
    }
  };
  createRow = async (properties) => {
    try {
      await notion.pages.create({
        parent: {
          database_id: this.dataBaseId,
        },
        properties: properties,
      });
    } catch (error) {
      console.error("Error creating row:", error.body);
    }
  };

  importCSVDataAndBuildDatabase = async () => {
    await this.processCSVAndCreateUniqueUserRatings();
    await this.updateBookRatings();
    const databaseRecords = await this.prepareDatabaseRecords();
    await this.createDataBase();
    await this.insertDatabaseRecords(databaseRecords);
  };
}
const bookClubRating = new BookClubRating(process.env.NOTION_PAGE_ID);
bookClubRating.importCSVDataAndBuildDatabase();
