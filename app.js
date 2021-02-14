const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
    const data = {
        members: [{
            email_address: req.body.email,
            status: "subscribed",
            merge_fields: {
                FNAME: req.body.first,
                LNAME: req.body.second,
            }
        }]
    };
    const jData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/317a3cd36a";
    const options = {
        method: "POST",
        auth: "Dostov:e54259d49808f1e2c5f73af84ad80934-us1",
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        } 
        response.on("data", function (data) {

            console.log(JSON.parse(data));
        })
    })
    request.write(jData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});