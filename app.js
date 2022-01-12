const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { status } = require("express/lib/response");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req,res) => {
    
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res) => {
    
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    const data = {
        'members': [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ],
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/listid"

    const options = {
        
        method: "POST",
        auth: "any string:api key"
    }

    const request = https.request(url, options, (response) => {
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
        request.write(jsonData);
        request.end();
})

app.post("/failure", (req,res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000");
})

// a723e028e63acef4cb5c104b141d189a-us20
// 3bcecadbc8
