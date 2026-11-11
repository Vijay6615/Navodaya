import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout instead of blocking for 30s
};

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, handle hot-reload and automatically reset rejected connections
  const getClientPromise = () => {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        // If connection fails, clear the cached rejected promise so the next request auto-retries!
        delete global._mongoClientPromise;
        throw err;
      });
    }
    return global._mongoClientPromise;
  };

  clientPromise = {
    then: (onfulfilled, onrejected) =>
      getClientPromise().then(onfulfilled, onrejected),
    catch: (onrejected) => getClientPromise().catch(onrejected),
    finally: (onfinally) => getClientPromise().finally(onfinally),
  };
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
