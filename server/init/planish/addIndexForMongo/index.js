/*
* Create index
* db.records.ensureIndex( { userid: 1 } )
* db.collection.ensureIndex( { a: 1, b: 1, c: 1 } )
* db.collection.ensureIndex( { a: 1 }, { unique: true } )
*
* Remove index
* db.accounts.dropIndex( { "tax-id": 1 } )
*
* Rebuild index
* db.accounts.reIndex()
*
* */

db.posts.ensureIndex({pubdate: -1});
db.posts.ensureIndex({feedId: 1});
db.posts.ensureIndex({link: -1}, {unique: true, dropDups: true});
db.posts.ensureIndex({guid: -1}, {unique: true, dropDups: true});