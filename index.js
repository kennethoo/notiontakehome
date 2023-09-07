require("dotenv").config();
const { Client } = require("@notionhq/client");
const fs = require("fs");
const capitalizeWord = require("./utills/capitalize");
const { parse } = require("csv-parse");
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

class BookRating {
  constructor(NOTION_PAGE_ID) {
    if (!NOTION_PAGE_ID) throw new Error("missing page id");
    this.NOTION_PAGE_ID = NOTION_PAGE_ID;
    this.favoritesBookRating = {};
    this.uniquesUserRating = {};
    this.bookRating = {};
    this.dataBaseId = null;
  }
  createDataBase = async () => {
    const pageId = process.env.NOTION_PAGE_ID;
    const title = "Book ratings";
    try {
      const newDb = await notion.databases.create({
        parent: {
          type: "page_id",
          page_id: pageId,
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

  orderFile = async () => {
    const cvsData = await this.getCVSData();
    for (let i = 0; i < cvsData.length; i++) {
      const [bookName, user, rating] = cvsData[i];
      const formatBookName = bookName.toLowerCase().trim().split(" ").join("");
      const formatUserName = user.toLowerCase().trim().split(" ").join("");
      const uniqueKey = formatBookName + "#" + formatUserName;
      this.uniquesUserRating[uniqueKey] = {
        rating: parseInt(rating),
        bookName: bookName.trim(),
        formatBookName,
      };
    }
  };
  processRating = async () => {
    for (const formatedBookName in this.uniquesUserRating) {
      const { rating, bookName, formatBookName } =
        this.uniquesUserRating[formatedBookName];
      this.bookRating[formatBookName];
      if (this.bookRating[formatBookName] !== undefined) {
        const { numberOfUser, sumOfRating } = this.bookRating[formatBookName];
        const newNumberOfRatingUser = numberOfUser + 1;
        const newSumOfRating = sumOfRating + rating;
        const newRating = newSumOfRating / newNumberOfRatingUser;

        this.bookRating[formatBookName] = {
          numberOfUser: newNumberOfRatingUser,
          currentRating: newRating,
          sumOfRating: newSumOfRating,
          bookName,
        };
      } else {
        this.bookRating[formatBookName] = {
          numberOfUser: 1,
          currentRating: rating,
          sumOfRating: rating,
          bookName,
        };
      }
      if (rating == 5) {
        this.favoritesBookRating[formatBookName] =
          this.favoritesBookRating[formatBookName] + 1 || 1;
      }
    }
  };

  buildDatabaseData = () => {
    const formatTedData = [];
    for (const formatedBookName in this.bookRating) {
      const { bookName, currentRating } = this.bookRating[formatedBookName];
      const favoriteBookCount = this.favoritesBookRating[formatedBookName] ?? 0;
      formatTedData.push({
        bookName: capitalizeWord(bookName),
        currentRating,
        favoriteBookCount,
      });
    }
    return formatTedData;
  };
  renderDataInDatabase = async (data) => {
    for (let info of data) {
      const { bookName, currentRating, favoriteBookCount } = info;
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
          number: parseInt(currentRating.toFixed(2)),
        },
        Favorites: {
          number: favoriteBookCount,
        },
      };
      this.createRow(properties);
    }
  };
  createRow = async (newRowData) => {
    try {
      await notion.pages.create({
        parent: {
          database_id: this.dataBaseId,
        },
        properties: newRowData,
      });
    } catch (error) {
      console.error("Error creating row:", error.body);
    }
  };
  proccesCSV = async () => {
    await this.orderFile();
    await this.processRating();
    const data = await this.buildDatabaseData();
    await this.createDataBase();
    await this.renderDataInDatabase(data);
  };
}
const bookRating = new BookRating(process.env.NOTION_PAGE_ID);
bookRating.proccesCSV();
