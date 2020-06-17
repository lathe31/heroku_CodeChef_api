const express = require("express");
const path = require("path");
const request_promise = require("request-promise");
const corn = require("node-cron");
const collectData = require("./collectData").collectData;
const convertToJSON = require("./convertToJSON").convertToJSON;

const app = express();

const site = "https://codechef.com";
const requestObject = {
  uri: `${site}/contests`,
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
  },
  gzip: true,
};

corn.schedule("*/59 * * * *", () => {
  request_promise(requestObject)
    .then((response) => collectData(response, site))
    .then(convertToJSON);
});

app.get("/json/:name", function (req, res, next) {
  var options = {
    root: __dirname,
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log(`Sent: ${fileName}`);
    }
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log(`Listening to port ${PORT}`);
