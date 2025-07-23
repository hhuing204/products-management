const { uniqueId } = require("lodash")
const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")

mongoose.plugin(slug)

const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    tags: Array,
    brand: String,
    sku: String,
    weight: Number,
    image: Array,
    thumbnail: String,
    status: String,
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    // deletedAt: Date,
    deletedBy:{
        account_id: String,
        deletedAt: Date
    },
    updatedBy:[{
        account_id: String,
        updatedAt: Date
    }],
    position: Number,
    featured: String,
}, 
{
    timestamps: true
})

const Product = mongoose.model("Product", productSchema, "products")

module.exports = Product