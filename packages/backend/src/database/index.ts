import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { DB_NAME } from "../config/db_config";

let _db: Db | null = null;

const DbConfig = (function () {

    const connectToDb = async (uri: string) => {
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            },
        });

        try {
            // Connect the client to the server (optional starting in v4.7)
            await client.connect();
            console.log(
                "Connected to MongoDB! Trying to ping it...."
              );
        
            
            // assing db instance
            _db = client.db(DB_NAME);

            // Send a ping to confirm a successful connection
            // await client.db("admin").command({ ping: 1 });
            await _db.command({ ping: 1});

            console.log(
              "Pinged your deployment. You successfully connected to MongoDB!"
            );
            return client;
          } finally {
            // Ensures that the client will close when you finish/error
            // await client.close();
          }
    }
  const getDb = (uri: string) => {
    return _db;
  };

  return {getDb, connectToDb};
})();

export default DbConfig;
