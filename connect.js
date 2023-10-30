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
    // TODO: Conexión a la Base de Datos
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
connect().catch(console.dir);

module.exports = { connect };
