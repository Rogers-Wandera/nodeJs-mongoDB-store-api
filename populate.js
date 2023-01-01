require('dotenv').config();

const connectDB = require('./db/connect');
const productModel = require('./models/product');

const productJson = require('./products.json');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        await productModel.deleteMany();
        await productModel.create(productJson)
        console.log('success')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start();