module.exports.newPriceProducts = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(2);
        return item;
      })
    return newProducts
}

module.exports.newPriceProduct = (product) => {
  const priceNew = product.priceNew = (product.price*(100 - product.discountPercentage)/100).toFixed(2);
  return Number(priceNew)
}