module.exports = {
    'secretKey': '11111-22222-12345-54321',
    'mongoUrl' : 'mongodb://localhost:27017/testDB',
    'facebook': {
        clientID: '11111',
        clientSecret: '15365456',
        callbackURL: 'http://localhost:3443/users/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
}