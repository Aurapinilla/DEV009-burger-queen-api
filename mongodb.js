const { MongoClient } = require('mongodb');
const config = require("./config");

const client = new MongoClient(config.dbUrl);

async function connect() {
  try {
    await client.connect();
    const db = client.db(bq);
    return db;
  } catch (error) {
    //
  }
}