import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kosova.123",        // ose password yt
  database: "kimidb",
});
