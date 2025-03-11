const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); 


const connectDB = async () => {
  try {
    await mongoose.connect("link of your database");
    console.log("MongoDB connected");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};
connectDB();


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, 
  email: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);


const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
});
const Post = mongoose.model("Post", postSchema);



app.get("/users", async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from MongoDB
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ error: "All fields are required" });

    const user = new User({ username, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});


app.post("/posts", async (req, res) => {
  try {
    const { title, content, user } = req.body;
    if (!title || !content || !user) return res.status(400).json({ error: "All fields are required" });

    const post = new Post({ title, content, user });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username email"); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


app.put("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


app.delete("/posts/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found" });

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

