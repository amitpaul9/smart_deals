const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middlewear
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("smart server is running");
});

// mongoDB start
const uri =
  "mongodb+srv://smartDBUser:yiC8eF2lAGQyvRwE@cluster0.rbs3vpy.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// try function

async function run() {
  try {
    await client.connect();

    const myDb = client.db("smart_db");
    const productsCollection = myDb.collection("products");
    const bidCollection = myDb.collection("bids");
    // -----------------
    // APIs

    // post data
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // delete data
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // patch data
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: id };
      const updated = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
        },
      };
      const options = {};
      const result = await productsCollection.updateOne(
        query,
        updated,
        options
      );
      res.send(result);
    });

    // get data
    app.get("/products", async (req, res) => {
      const projectFields = { price_min: 1, price_max: 1 };

      // sort, skip, limit and project ⬇️⬇️

      // const cursor = productsCollection
      //   .find()
      //   .sort({ price_min: -1 })
      //   .skip(2)
      //   .limit(6)
      //   .project(projectFields);

      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }

      const cursor = productsCollection.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    // get one data by id
    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: id };
        const result = await productsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log("got error of", error);
      }
    });

    //bids related api
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }

      const cursor = bidCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/bids", async (req, res) => {
      const newBids = req.body;
      const result = await bidCollection.insertOne(newBids);
      res.send(result);
    });

    app.delete("/bids/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: id };
        const result = await bidCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log("got error of", error);
      }
    });

    app.get("/bids/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: id };
        const result = await bidCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log("caght error", error);
      }
    });

    // ----------------
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);

// mongoDB endsss

app.listen(port, () => {
  console.log(`listening to the port, ${port}`);
});

// shortest way to connect to mongoDB ⬇️⬇️

// client
//   .connect()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`smart server is running on port ${port}`);
//     });
//   })
//   .catch(console.dir);
