
const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")

mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema({
    title: String,
    description: String,
    parent_id: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
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

const ProductCategory = mongoose.model("Product-category", productCategorySchema, "products-category")

module.exports = ProductCategory