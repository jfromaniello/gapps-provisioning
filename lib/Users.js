var request = require('request'),
  async = require('async'),
  GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;

var Feed = require('./Feed');

/**
 * [Users description]
 *
 * options: 
 *   - domain
 *   - access_token
 *
 *  optionally:
 *   - client_id
 *   - client_secret
 *   - refresh_token
 */
function Users(options){
  this.options = options;
  if(options.refresh_token){
    this._tokenProvider = new GoogleTokenProvider(options);
  }

  this._getToken = function (callback) {
    if(this._tokenProvider) {
      return this._tokenProvider.getToken(callback);
    }
    callback(null, this.options.access_token);
  };

}

Users.prototype.getPage = function (url, done) {
  
  if(typeof url === 'function'){
    done = url;
    url = null;
  }

  url = url || 'https://apps-apis.google.com/a/feeds/' + this.options.domain + '/user/2.0';

  this._getToken(function (err, token){
    if (err) return done(err);
    request.get({
      url: url,
      qs: { alt: 'json' },
      headers: { 
        'Authorization': 'OAuth ' + token 
      }
    }, function (err, resp, body) {
      if (err) return done(err);

      if(~resp.headers['content-type'].indexOf('application/json')){
        body = JSON.parse(body);
        return done(null, new Feed(body.feed));
      } 
      if (resp.statusCode === 401) {
        return done(new Error('unauthorized'));
      }
      return done(new Error(body));
    });
  }.bind(this));
};

Users.prototype.getAll = function(done) {
  var results = [];
  async.whilst(
    function () {
      return results.length === 0 || !!results.slice(-1)[0].getNextLink();
    },
    function (callback) {
      var url = results.length > 0 ? results.slice(-1)[0].getNextLink() : null;

      this.getPage(url, function (err, result) { 
        if(err) return callback(err);
        results.push(result);
        callback();
      });
      
    }.bind(this),
    function (err) {
      if (err) return done(err);

      var entries = results.reduce(function (prev, current) {
        return prev.concat(current.entry);
      }, []);

      done(null, results, entries);
    }
  );
};

module.exports = Users;