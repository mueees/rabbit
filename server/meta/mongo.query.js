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

// find document by subdocument
//userId : 54aa46a9f3d8f6b0065ca7eb
db.posts.find({}, {
    _id: 1,
    users: {
        $elemMatch: {
            'userId' : ObjectId('54aa46a9f3d8f6b0065ca7eb')
        }
    }
});

// find documents with subdocument
db.posts.aggregate(
    [
        {
            $match: {
                feedId: ObjectId('54aa63cd1588d62d0880dcdc')
            }
        },
        {$sort: {
            pubdate: -1
        }},
        {$skip: 0},
        {$limit : 10},
        {
            $project : {
                "users" : {
                    $cond : [ { $eq : [ "$users", [] ] }, [ null ], '$users' ]
                },
                title: 1,
                body: 1,
                image: 1,
                source: 1,
                feedId: 1,
                pubdate: 1
            }
        },
        {$unwind : "$users"},
        {
            $match: {
                $or :[
                    {"users.userId" : ObjectId("54aa63cd1588d62d0880dcd3")},
                    {"users" : null}
                ]
            }
        }
    ]
);

//remove expired tokens
db.users.update(
    {},
    {
        '$pull': {
            'tokens': {
                'date_expired': {
                    '$lt': new Date()
                }
            }
        }
    },
    {
        multi: true
    }
);