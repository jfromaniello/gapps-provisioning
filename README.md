(Unofficial) [Google Apps Provisioning Api](https://developers.google.com/google-apps/provisioning/reference) client library.


## Installation

  npm install gapps-provisioning

## Usage

~~~javascript

var UsersClient = require('gapps-provisioning').Users;

var usersClient = new UsersClient({
  domain:       'a-gapps-domain.com',
  access_token: 'administrator access token for my application'
});

usersClient.getAll(function (err, feeds, users) {
  //..
});
~~~

Otherwise request the first ```access_token``` with [the offline option](https://developers.google.com/accounts/docs/OAuth2WebServer#offline) and provide a ```refresh_token```, ```client_id``` and ```client_secret``` as follows:

~~~javascript

var UsersClient = require('gapps-provisioning').Users;

var usersClient = new UsersClient({
  domain:        'mydomain.com',
  refresh_token: 'x',
  client_id:     'my app client id',
  client_secret: 'my app client secret'
  /* optionally the first token 
  access_token:  'y',
  expires_in:    '3000'
   */
});
~~~

## Users.getAll(callback)

Fetch all the users from the provisioning API for an specific domain. The provisioning API always return 100 entries per request, so if the domain has more than 100 this method will executed more n requests to fetch them all.

Callback has the following arguments:

-   **err**: if a request return error it will be here
-   **results**: an array of all feeds returned
-   **entries**: all users 


## Users.getPage([url], callback)

As explained above, the provisioning api return the slices of 100 users. This method only fetch one page. If the ```url``` argument is omitted it will retrieve only the first page. Otherwise it will retrieve the page specified in the url.

For instance if you want to get only the two first pages:

~~~javascript
users.getPage(function (err, firstPage) {
  //firstPage.entry <<< the 100 first users are here.

  users.getPage(firstPage.getNextLink(), function (err, secondPage) {
    //secondPage.entry <<< the following users are herer.
    //secondPage.getNextLink() <<< a link to third page.
  });
});
~~~

## Todo 

The **Google Provisioning API** is much bigger than this, it has **Groups**, **Nicknames** and so on. You can also create, modify and delete users, groups and nicknames. All this is not supported yet, I will add new things as I need and I will kindly accept pull requests.

If you add other consumer of feeds, please refactorize the Users class.

## Develop

You will need a Google Apps account, credentials for some application and the admin of the Google Apps account to authorize your application. Then create a ```testing-keys.js``` file in the root of the folder with the following data:

~~~javascript
module.exports = {
  "client_id":              "your client id",
  "client_secret":          "your client secret",
  "domain":                 "the-domain-of-the-gapps-account.com",
  "refresh_token":          "an-admin-refresh-token"
};
~~~

## License

**MIT**