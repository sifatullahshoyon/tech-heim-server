const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");
const port = 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cn4db.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // Users
    const usersCollection = client.db("UsersDB").collection("Users");
    const productCollection = client.db("productDB").collection("Products");
    const blogsCollection = client.db("BlogsDB").collection("Blogs");

    ////////////////////// User Collection ////////////////////////
    // Users Post
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = {
        email: user?.email,
      };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({
          massage: "User Already Exists",
          insertedIn: null,
        });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // Users GET
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();

      res.send(result);
    });

    ////////////////////// Product Collection ////////////////////////

    // post all product
    app.post("/products/add", async (req, res) => {
      const products = req.body;
      const result = await productCollection.insertOne(products);
      res.send(result);
    });
    // get all products
    app.get("/products/all", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    // get single products
    app.get("/products/details/:id", async (req, res) => {
      const id = req?.params?.id;
      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // patch product
    app.patch("/products/edit/:id", async (req, res) => {
      const id = req?.params?.id;
      const editProduct = req.body;
      const result = await productCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: editProduct,
        }
      );
      res.send(result);
    });
    // delete product
    app.delete("/products/delete/:id", async (req, res) => {
      const id = req?.params?.id;
      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    ////////////////////// blog Collection ////////////////////////

    // Blogs add
    app.post("/blogs/add", async (req, res) => {
      const blogs = req.body;
      const result = await blogsCollection.insertOne(blogs);
      res.send(result);
    });
    // Blogs get
    app.get("/blogs/add", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });
    // Blogs Delete
    app.delete("/blogs/delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Route  is Working");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// userName= infotechheim
// pass = HDWydNQvMfOfQL2L
