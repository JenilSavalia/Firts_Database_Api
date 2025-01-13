import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const app = express();
const PORT = process.env.Express_PORT;

app.use(express.json())

const uri = process.env.Mongo_URI;
const client = new MongoClient(uri)


const connectToDatabase = async () => {

    try {
        await client.connect()
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }

}

connectToDatabase();

const db = client.db("codinggita");
const collection = db.collection("students")


app.get("/coginggita/students", async (req, res) => {

    try {
        const items = await collection.find().toArray();
        res.status(200).json(items)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }

})

app.post("/coginggita/students", async (req, res) => {
    try {
        const item = req.body
        const result = await collection.insertOne(item);
        // await collection.insertOne(item);
        console.log(result)
        res.status(200).json({ message: "Item added successfully", id: result.insertedId })
    } catch (err) {
        console.log("Cannot Add User", err)
    }
})

app.put("/coginggita/students", async (req, res) => {
    try {
        // Destructure _id from the request body
        const { _id, ...updatedData } = req.body;

        if (!_id) {
            return res.status(400).json({ error: "Missing _id in the request body" });
        }

        // Update the document using _id
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) }, // Convert _id to ObjectId
            { $set: updatedData } // Update only the provided fields
        );

        // Check if the document was matched and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Student updated successfully",
            modifiedCount: result.modifiedCount,
        });
    } catch (err) {
        console.error("Cannot Edit User", err);
        res.status(500).json({ error: "An error occurred while updating the student" });
    }
});


app.delete("/coginggita/students", async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ error: "Missing _id in the request body" });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(_id) })

        res.status(200).json({
            message: "Student Deleted successfully",
            modifiedCount: result.modifiedCount,
        });

    } catch (err) {
        console.error("Cannot Delete User", err);
        res.status(500).json({ error: "An error occurred while deleting the student" });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})



