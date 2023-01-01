const productModel = require('../models/product');

const getProductStaticRoute = async (req,res) => {
    const products = await productModel.find({company: 'ikea'})
    res.status(200).json({ products, productsLength: products.length })
}

const getProductRoute = async (req,res) => {
    const { featured,company,name,sort,fields,numericFilters } = req.query;

    const queryObject = {};

    if(featured){
        queryObject.featured = featured === 'true' ? true : false;
    }

    if(company){
        queryObject.company = company;
    }

    if(name){
        queryObject.name = { $regex: name, $options: 'i'};
    }

    let results = productModel.find(queryObject);

    if(sort){
        const sortList = sort.split(",").join(" ")
        results.sort(sortList)
    }else{
        results.sort('createdAt')
    }

    if(fields){
        const fieldsList = fields.split(",").join(" ")
        results.select(fieldsList)
    }

    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':"lt",
            '<=':"lte"
        }

        const regEx = /\b(<|>|>=|=|<|<=)\b/g;

        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
          );
          const options = ['price', 'rating'];
          filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
              queryObject[field] = { [operator]: Number(value) };
            }
          });
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    results.skip(skip).limit(limit)

    

    const products = await results;

    res.status(200).json({ products, productsLength: products.length })
}

module.exports = {
    getProductStaticRoute,
    getProductRoute
}