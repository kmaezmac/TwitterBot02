import express from "express";
import { TwitterApi } from "twitter-api-v2";
import process from "process";
import pg from 'pg';
import https from 'https';

// consumer keys - api key
const appKey = process.env.TWITTER_API_KEY;
// consumer keys - api key secret
const appSecret = process.env.TWITTER_API_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const client = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
});

client.readWrite;

const app = express();

const greet = async () => {
    https.get('https://amazon-explorer.onrender.com/search2', (resp) =>{
        let data = ''; 
        // A chunk of data has been received. 
        resp.on('data', (chunk) => { 
            data += chunk; 
        }); 
    
        // The whole response has been received. Print out the result. 
        resp.on('end', () => {
            var body = JSON.parse(data)
            console.log(body); 
            console.log(body.length);
            if(body.length == 0){
                return false;
            }
            var random = Math.floor(Math.random() * (body.length));
            console.log(random);
            var text = "【" + body[random].price +"円" + "】"
            var url = body[random].url;
            var title = body[random].title.substring(0,41);
            client.v2.tweet(text + " " + url + " " +title + " #セール" + " #Amazon");
            return true;
        }); 
    
    }).on("error", (err) => { 
        console.log("Error: " + err.message); 
        return false;
    })
};

app.get("/tweet", (req, res) => {
    try {
        var result = false;
        while(!result){
            result = greet();
            console.log("りざると" + result);
        }
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/", (req, res) => {
    try {
        console.log("ログ定期実行")
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);