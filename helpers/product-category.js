const ProductCategory = require("../models/product-category.model")

const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: "false"
    })

    let allSub = [...subs]

    for (const sub of subs){
      const childs = await getSubCategory(sub.id)
      allSub = allSub.concat(childs)
    }
    return allSub
  }

  module.exports.getListChildCategory = async (parent_id) => {
    const listChild = await getSubCategory(parent_id)
    return listChild
  }