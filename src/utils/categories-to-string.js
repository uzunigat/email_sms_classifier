const categoriesToString = (categories) => {
    return categories.map((category) => {
        return `${category.name}: ${category.description}`
    }).join("\n")
}

module.exports = {
    categoriesToString
}