const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');

const {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

const ClientId = "1000.L5SDOBSTN82CB7DI0MVKFOF5XAKDER";
const ClientSecret = "092b9f2a48ab592d2824f3583f6d0863fab81d7ab6";
const RedirectionUrl = "https://www.getpostman.com/oauth2/callback";

const PORT = 3000;

function getOAuthClient() {
    return new OAuth2(ClientId, ClientSecret, RedirectionUrl);
}



app.use(cors());

app.get('/auth', (req, res) => {


	var oauth2Client = getOAuthClient();
	var scopes = [
        'https://accounts.zoho.com/oauth/v2/auth?access_type=offline&prompt=consent'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        //use this below to force approval (will generate refresh_token)
        //approval_prompt : 'force'
    });
    var oauth2Client = getOAuthClient();
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
        console.log("tokens : ", tokens);
    if (!err) {
            oauth2Client.setCredentials(tokens);
            session["tokens"] = tokens;
            res.send(`
                <html>
                <body>
                    <h3>Login successful!!</h3>
                    <a href="/details">Go to details page</a>
                <body>
                <html>
            `);
        } else {
            res.send(`
                <html>
                <body>
                    <h3>Login failed!!</h3>
                </body>
                </html>
            `);
        }
    });

});


app.get('/', (req, res) => {
	var api_url = "https://www.zohoapis.com/crm/v2/settings/modules";
	var headers = {
		'Authorization': 'Zoho-oauthtoken 1000.49edde1b8e4f4c46d8f7a41efc99ed54.7af677ec568340f601a638c023c6b964'
	};

	request.get({url:api_url, headers: headers}, (error, response, body) => {
		res.send(body);
	});
});

app.get('/leads', (req, res) => {
	var url = 'https://www.zohoapis.com/crm/v2/leads';
	var headers = {
		'Authorization': 'Zoho-oauthtoken 1000.068a8578bce58f40d9fea10f7696a085.649871a4b93a4a6b3c32b646281d96af'
	};

	request.get({url:url, headers: headers}, (error, response, body) => {
		res.send(body);
	});
});


app.listen(PORT, () => console.log(`Express server currently running on port http://127.0.0.1:${PORT}`));