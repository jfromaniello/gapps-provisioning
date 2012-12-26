var Users = require('../lib/Users'),
  testingKeys = require('../testing-keys');

describe('Users module', function () {

  var users = new Users({
    client_id:      testingKeys.client_id,
    client_secret:  testingKeys.client_secret,
    refresh_token:  testingKeys.refresh_token,
    domain:         testingKeys.domain
  });
  
  it('retrieve a list of users', function (done) {
    users.getPage(function (err, result) {
      if (err) return done(err);
      result.should.have.property('entry');
      done();
    });
  });
  
  it('can fetch an specific page of users', function (done) {
    var page ='https://apps-apis.google.com/a/feeds/' + testingKeys.domain + '/user/2.0';
    users.getPage(page, function (err, result) {
      if (err) return done(err);
      result.should.have.property('entry');
      done();
    });
  });
  
  it('should return proper error with an invalid access token', function (done) {
    var usersFail = new Users({
      client_id:      testingKeys.client_id,
      client_secret:  testingKeys.client_secret,
      access_token:   'wrong!',
      domain:         testingKeys.domain
    });
    usersFail.getPage(function (err) {
      err.message.should.be.eql('unauthorized');
      done();
    });
  });

  it.only('can fetch all users', function (done) {
    users.getAll(function (err, results, entries) {
      results[0].should.have.property('entry');

      var allEntries = results.reduce(function (prev, currentFeed) {
        return prev.concat(currentFeed.entry);
      }, []);

      entries.length.should.eql(allEntries.length);

      done();
    });
  });
});