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

db.posts.remove();

db.users.find({
    tokens: {
        $elemMatch : {
            token: '123123'
        }
    }
}).count();

//find feed by query req
db.feeds.find({
    name: {
        $regex: 'oto',
        $options: 'i'
    }
}).pretty();