const { uniqueId } = require("lodash")
const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")

mongoose.plugin(slug)

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
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
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    position: Number
}, {
    timestamps: true
})

const Product = mongoose.model("Product", productSchema, "products")

module.exports = Product