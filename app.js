//TODO: need to persist connection to db rather than open a new connection for every request
//TODO: factor out the repeated code into a method

var mongoClient = require('mongodb').MongoClient,
	mongoObjectId = require('mongodb').ObjectID,
	_ = require('underscore'),
	validateRequest;

module.exports =  function(dbUrl) {

	var self = this;

	this.getCollection = function(request, reply, options) {

			var requestObject = self._createRequestObject(request);

			mongoClient.connect(dbUrl, function(err, db) {
				if (err) {throw err;}
				db.collection(options.collectionName).find(requestObject, options.projection).toArray( function (err, data) {
					
					var page = parseInt(request.query.page),
						perPage = parseInt(request.query.per_page);
				if ((page === 0 || page) && perPage) {

						reply({
							items: data.slice(page*perPage,(page*perPage) + perPage),
							total_count: data.length
						});	
					}
					else {
						reply(data);
					}
					db.close();
				}) 
			});

		}

	this.addObject = function(request, reply, options) {

		var requestObject = self._createRequestObject(request);
		mongoClient.connect(dbUrl, function(err, db) {
			if (err) {throw err;}
			db.collection(options.collectionName).insert(requestObject, function (err, data) {
				if (err) {throw err};
				reply(data[0]);
				db.close();
			}) 
		});
	}

	this.getObject = function(request, reply, options) {
		var requestObject = self._createRequestObject(request);

		mongoClient.connect(dbUrl, function(err, db) {
			if (err) {throw err;}
			db.collection(options.collectionName).find(requestObject, options.projection).toArray( function (err, data) {
				if (data.length > 1) {
					throw new Error('Oops, a request for a single object has returned multiple objects.');
				}
				reply(data[0]);
				db.close();
			});
		});
	}

	this.updateObject = function(request, reply, options) {

		var requestObject = self._createRequestObject(request);
		mongoClient.connect(dbUrl, function(err, db) {
			if (err) {throw err;}
			//NOTE: added this if statement from _createRequestObject b/c something weird was happening with mongodb hex strings for objectid when
			//they got passed between functions (and/or extended with _)
			//TODO: refactor
			if (request.params && request.params._id && request.params._id.length === 24) {
				request.params._id = new mongoObjectId(request.params._id);
			}
			db.collection(options.collectionName).save(requestObject, function(err, data) {
				if (err) {throw err;}
				// reply(requestObject); //TODO: this is kind of hacky. should return data but it's just a count
				self.getObject(request, reply, options);
				db.close();
			});
		});
	}
	


	this.deleteObject = function(request, reply, options) {
		var requestObject = self._createRequestObject(request);
		mongoClient.connect(dbUrl, function(err, db) {
			if (err) {throw err;}
			db.collection(options.collectionName).remove( requestObject, function(err, number) {
				if(err) {
					throw err;
				}
				else {
					reply();
				}
				db.close();
			});	

		});
	}

	this._createRequestObject = function(request) {

		if (request.params && request.params._id && request.params._id.length === 24) {
			'request id is being converted to mongoid'
			request.params._id = new mongoObjectId(request.params._id);
		}

		return  _.extend( request.params || {}, request.payload || {});

	}

}
