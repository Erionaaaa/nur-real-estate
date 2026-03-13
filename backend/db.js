import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  port: 3309,
  user: "root",
  password: "Kosova.123",        // ose password yt
  database: "kimidb",
});
