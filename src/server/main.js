import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import passport from "passport";
import appID from 'ibmcloud-appid';
import bodyParser from 'body-parser';
import 'dotenv/config';

const WebAppStrategy = appID.WebAppStrategy;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Warning The default server-side session storage implementation, MemoryStore, 
// is purposely not designed for a production environment. It will 
// leak memory under most conditions, it does not scale past a single process, 
// and is meant for debugging and developing.
// For a list of stores, see compatible session stores below
// https://www.npmjs.com/package/express-session#compatible-session-stores
app.use(session({
	secret: '123456',
	resave: false,
	saveUninitialized: true,
  proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new WebAppStrategy({
	tenantId: process.env.TENANT_ID,
	clientId: process.env.CLIENT_ID,
	secret: process.env.SECRET,
	oauthServerUrl: process.env.OAUTH_SERVER_URL,
	redirectUri: process.env.REDIRECT_URI
}));

// Configure passport.js with user serialization/deserialization. This is required
// for authenticated session persistence across HTTP requests. See passport.js docs
// for additional information http://passportjs.org/docs
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME,
  {
    failureRedirect: '/error',
    session: false, // w3id login loops unless session is set to false, but auth still fails even though statusCode is 200
    failureMessage: true
  }
));

// Explicit login endpoint. Will always redirect browser to login widget due to {forceLogin: true}. If forceLogin is set to false the redirect to login widget will not occur if user is already authenticated
app.get('/api/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
	successRedirect: '/',
	forceLogin: true
}));

// Protect the entire app
app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME))

app.get('/error', (req, res) => {
  console.log('//////////////////////////////////////////////////');
  console.log('error route');
  console.log(req.session);
  console.log(res.statusCode);
  console.log('//////////////////////////////////////////////////');
	res.send('Authentication Error');
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
