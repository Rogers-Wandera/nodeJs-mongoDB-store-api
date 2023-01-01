require("dotenv").config();

const express = require("express");

const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleWare = require("./middleware/not-found");

const connectDB = require("./db/connect");
const router = require("./routes/products");

const app = express();

app.use(express.json());

app.get("/", (req,res) => {
    res.send("<h1>Welcome to our store api</h1> <a href='/api/v1/products'>View Products</a>")
})

app.use("/api/v1/products", router)

app.use(errorHandlerMiddleware)
app.use("*", notFoundMiddleWare);

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{{
            console.log(`Server running on port ${port}`)
        }})
    } catch (error) {
        console.log(error)
    }
}

start();