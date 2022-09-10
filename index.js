const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./main.db");
const cors = require('cors')

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json({limit: '50mb'}));

app.use(cors())

app.get("/create_db", (req, res) => {
  try {
    db.serialize(() => {
      try {
        db.run(
          "CREATE TABLE prosthetic (id TEXT, subject TEXT, details TEXT, date TEXT, features TEXT, data_set TEXT)"
        );
      } catch (err) {}
    });
  } catch (error) {
    console.error(error);
  }

  res.send("add database");
});

app.post("/add_subject", (req, res) => {
  try {
    console.log(req.body);
    db.serialize(() => {
      // add subject
      const stmt = db.prepare(
        "INSERT INTO prosthetic VALUES (?, ?, ?, ?, ?, ?)"
      );
      stmt.run(
        `${uuidv4()}`,
        req.body?.subject,
        req.body?.details,
        Date.now(),
        req.body?.features,
        req.body?.data_set
      );
      stmt.finalize();
    });
  } catch (error) {
    console.error(error);
  }

  res.send("add subject");
});

app.post("/read_subject", (req, res) => {
  try {
    db.serialize(() => {
      // read all subject
      db.all("SELECT * FROM prosthetic", (err, rows) => {
        res.send(rows);
      });
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/read_subject_features", (req, res) => {
  try {
    db.serialize(() => {
      // read subject by id
      db.get(
        `SELECT * FROM prosthetic WHERE id = '${req.query?.id}'`,
        (err, row) => {
          console.log(row);
          const data = row?.features;
          res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Length': data.length
          });
          res.end(data); 
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/read_subject_data_set", (req, res) => {
  try {
    db.serialize(() => {
      // read subject by id
      db.get(
        `SELECT * FROM prosthetic WHERE id = '${req.query?.id}'`,
        (err, row) => {
          console.log(row);
          const data = row?.data_set;
          res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Length': data.length
          });
          res.end(data); 
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
});


app.post("/delete_subject", (req, res) => {
  try {
    db.serialize(() => {
      // delete subject by id
      db.run(`DELETE FROM prosthetic WHERE id = '${req.body?.id}'`);
    });

    res.send("delete subject");
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
