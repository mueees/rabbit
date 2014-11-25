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

db.users.findOne();
db.posts.remove();
db.posts.findOne();

db.users.find({
    tokens: {
        $elemMatch : {
            token: '123123'
        }
    }
}).count()