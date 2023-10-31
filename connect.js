const dbUrl = require('./config');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = dbUrl.dbUrl;
console.log('dburl', uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}
);

async function connect() {
  try {
    // Conectar a la base de datos
    await client.connect();
    console.log('Pinged your deployment. You successfully connected to MongoDB!');

    // Obtener la base de datos
    const db = client.db('bqapi-database');

    return { client, db };
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
}

module.exports = { connect };
