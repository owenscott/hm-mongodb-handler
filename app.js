var mongoClient = require('mongodb').MongoClient,
	mongoObjectId = require('mongodb').ObjectID,
	dbConfig = require('./../conf/db-config.js'),
	_ = require('underscore'),
	validateRequest;


module.exports =  function(dbUrl) {

	var self = this;

	this.getCollection = function(request, reply, options) {

			var requestObject = self._createRequestObject(request);

			mongoClient.connect(dbUrl, function(err, db) {
				if (err) {throw err;}
				db.collection(options.collectionName).find(requestObject, options.projection).toArray( function (err, data) {
					reply(data);
				}) 
			});

		}

	this.addObject = function(request, reply, options) {
	}

	this.getObject = function(request, reply, options) {
	}

	this.updateObject = function(request, reply, options) {
	}

	this.deleteObject = function(request, reply, options) {
	}

	this._createRequestObject = function(request) {

		if (request.params && request.params._id) {
			request.params._id = mongoObjectId(request.params._id);
		}
		
		return  _.extend( request.params || {}, request.payload || {});

	}

}

		// mongoClient.connect(dbConfig.DB_URL, function(err, db) {


		// 	//create object for document requests by merging the payload and parameters
		// 	//payload = the json data sent via a post or put request
		// 	//params = everything that was in the URL string (excluding the final )
		// 	if (request.params && request.params._id) {
		// 		request.params._id = mongoObjectId(request.params._id);
		// 	}
		// 	var requestObject = _.extend( request.params || {}, request.payload || {});

		// 	//get request for a collection
		// 	if (request.method === 'get' && options.resourceType === 'collection') {
		// 		db.collection(collection).find(requestObject, options.projection).toArray( function (err, data) {
		// 			if (err) {
		// 				throw err;
		// 			}
		// 			console.log('A new request for a collection');
		// 			console.log(requestObject);
		// 			reply(data);
		// 			db.close();
		// 		});
		// 	}
		// 	//post request to add a document to a collection
		// 	else if (request.method === 'post' && options.resourceType === 'collection') {
		// 		db.collection(collection).insert(requestObject, function(err, data) {
		// 			if (err) {
		// 				throw err;
		// 			}
		// 			console.log(JSON.stringify(data));
		// 			//replies data[0] because backbone expects a json object and mongo returns an array with one object
		// 			reply(data[0]);
		// 			db.close();
		// 		});
		// 	}
		// 	//get request for a document
		// 	else if (request.method === 'get' && options.resourceType === 'document') {
		// 		db.collection(collection).find(requestObject, options.projection).toArray( function (err, data) {
		// 			if (err) {
		// 				throw err;
		// 			}
		// 			if (data.length > 1) {
		// 				throw new Error('Oops, a request for a single object has returned multiple objects.');
		// 			}
		// 			reply(data[0]);
		// 			db.close();
		// 		});
		// 	}
		// 	//put request to update a document 
		// 	else if (request.method === 'put' && options.resourceType === 'document') {
		// 		db.collection(collection).save(requestObject, function(err, data) {
		// 			if(err) {
		// 				throw err;
		// 			}
		// 			else {
		// 				reply(data[0]);
		// 			}
		// 			db.close();
		// 		});
		// 	}
		// 	//delete request to remove a document
		// 	else if (request.method === 'delete' && options.resourceType === 'document') {
		// 		db.collection(collection).remove( requestObject, function(err, number) {
		// 			if(err) {
		// 				throw err;
		// 			}
		// 			else {

		// 				console.log(number + ' documents deleted from collection ' + collection);
		// 				reply();
		// 			}
		// 			db.close();
		// 		});
		// 	}
		// 	//throw an error b/c no handler
		// 	else {
		// 		throw new Error('No handler exists for the type of request sent.');
		// 	}

		// 	//queries the db for all documents in the collection, returning all fields except for those excluded
		// 	db.collection(collection).find( options.query, options.projection || {} ).toArray( function (err, data) {
		// 		if (err) {
		// 			throw err;
		// 		}
		// 		reply(data);
		// 		db.close();
		// 	});

		// });