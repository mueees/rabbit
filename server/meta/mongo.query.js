db.posts.aggregate([
    {
        $group: {
            _id: "$body",
            num_products: {
                $sum: 1
            }
        }
    },
    {
        $match: {
            num_products: {
                $gte: 5
            }
        }
    }
]);