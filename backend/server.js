const express = require("express");
const app = express();
const snoowrap = require("snoowrap");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

var r = new snoowrap({
  userAgent: "reddit-bot-example-node",
  clientId: "DKCuiCwF2L9k84u0-2-3gw",
  clientSecret: "axoXnfERIXa9e0hStJQXdC9m6VGd3A",
  username: "Murchyman19",
  password: "Murchyman.3",
});

app.use(cors());

app.get("/test", (req, res) => {
  res.json({
    message: "It works!",
  });
}),
  app.get("/sub/:subreddit", async (req, res) => {
    const posts = await r
      .getSubreddit(req.params.subreddit)
      .getHot()
      .map((post) => post.title);

    const prompt = `describe in 3 words the mood of a subreddit based on these posts made by users: ${posts.slice(
      0,
      10
    )}`;

    const response = await openai
      .createCompletion({
        model: "text-davinci-002",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1486,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((response) => {
        final = response.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, "");
        console.log(final);
        res.json({
          message: final,
        });
      });
  });

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});