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
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // patch data
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
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
      const cursor = productsCollection.find().sort({ price_min: -1 }).limit(2);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get one data by id
    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log("got error of", error);
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
