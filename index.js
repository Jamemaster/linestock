const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios");
const qs = require("qs");

const config = {
  channelAccessToken: "44PoV5jes2d4YNh0IwEOZbhyphoVu5lohrjg2doNyUQ6UmMHe0KrAK8woVNOWSVaARmMxZiYmvyMMbhSGwLk08Yg5CUcS2pxi5Dz9r+M+RpBgeIhO2umjqWEZqnhZtetAKOz812JReLVxf9G3QP10wdB04t89/1O/w1cDnyilFU=", // add your channel access token
  channelSecret: "a4481907cd83292502221f39eb7cc2ac", // add your channel secret
};

const APPS_SCRIPT_URL = "xxx"; // add your google app script url

const app = express();

app.get("/api", (req, res) => res.send("Hello World!"));

app.post("/api/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);
async function handleEvent(event) {
  console.log("event", event);
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  try {
    const data = await axios.post(
      APPS_SCRIPT_URL,
      qs.stringify({
        text: event.message.text,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(data.data);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: data.data.message,
    });
  } catch (err) {
    console.error(err);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "กรุณาลองใหม่อีกครั้งค่ะ",
    });
  }
}

module.exports = app;
