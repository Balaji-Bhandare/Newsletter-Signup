const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const https = require('https'); //
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName + " " + lastName + " " + email);


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const apiKey = process.env.API_KEY;

    const url = "https://us21.api.mailchimp.com/3.0/lists/6723991961";
    const options = {
        method: "POST",
        auth: apiKey
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        let responseData = '';

    response.on('data', function(chunk){ 
        responseData += chunk;
    });

    response.on('end', function() {
        console.log(JSON.parse(responseData));
    });
    });

    request.write(jsonData); 

    request.end(); 

});

app.post("/failure", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("server is running on port 3000");
});

// 6723991961.