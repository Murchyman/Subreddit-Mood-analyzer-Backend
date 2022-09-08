const express = require("express");
const app = express();
const snoowrap = require("snoowrap");
const cors = require("cors");
const AWS = require("aws-sdk");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});

const s3 = new AWS.S3({
  accessKeyId: "ASIA5DYSEEJ4UKS5PKF3",
  secretAccessKey: "zX+gKU1OGAcIXIufraTonwrOPlPuoAmPsfcW4tVa",
  sessionToken:
    "IQoJb3JpZ2luX2VjEJL//////////wEaDmFwLXNvdXRoZWFzdC0yIkgwRgIhALUov9CzZy8H+EXZr0jhC+txTS7iqb9J/s42jyLEiQxnAiEAp0b4r5dmb06K9BBdbk23Zhqhs6xXZTfBhCjUZuyklV8qrwMIKxACGgw5MDE0NDQyODA5NTMiDIOPzsorsF4KWCezHiqMA9i6WQxcqDjuwE+0ht9g7j7qFfwNoZgTO41PsForegAq21zx+q+wq+fiLic9GfY4kNEnJ9gsDzg82wc9osbPmue+62X7VVSYRfGGYfI1OaWPhdtHUg6psAccK2S1A6Nykm6wbm0rXwALC3ANL6XbstxK0JrH1NFdHpzfoam5TAs3qniFn7X/bzkALyMFbpA39SQDcqA3RkNdQ9xYu4CD7Wqjir2XqI5dT6OTVCkNzzdJD3SF1xnRSmQ3PG64Vmuh6EErAuO5O5Cks2QjSPP13y5Cw6D6vKFkLYJN5Y9nnwAWUK6SYwR7jz15ZJCuELBoUmDyRXT6z6hU1XziGn2puivqlYSzZCrrPbZsDsP9NqaK9gBijz+iWu0Xks/kQ+4rqWtgRoUz+3ji8My3s/bz0Zh+UDBi0/d76KD5pPTO3NRADg4+pZM1tIV+gEV5vnzxxsYaElwC93ZDfumZyrSPGRaiLnLif71oItTUa7ZviD/irHn4tLRx8qiX3zHPM1ToEOKDk5uxCLd70I7EDDDp+OaYBjqlAe+mm64OwCpDauAOShMdJWzqIXMH/7IpQsKRf9mdkkspGcmdFwdYi7A2lOGjgJkBdCdQpgv6HeD0VwNn/VzCry56SDzy/uXU831FOS1Kqp21r7LJgyEawxxJjSDlfu9ZK1FiOcqqPaeB8q3FUkyljogOJRYYD6pU1FxwNMZ8LAa7HDVsC1SJ3q18v6n804TQKIaYbLlpaD1WCJ/xCPRRJ1+zWAG2ig==",
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

app.get("/counter", async (req, res) => {
  const bucketName = "mitchellbucketn11099887";
  const keyName = "index.json";
  const objectType = "application/json"; // type of file

  let data = await s3
    .getObject({
      Bucket: bucketName,
      Key: keyName,
    })
    .promise();

  console.log();

  const file = {
    counter: JSON.parse(data.Body.toString()).counter + 1,
  };

  var buffer = Buffer.from(JSON.stringify(file));

  const uploadedFile = s3
    .upload({
      Bucket: bucketName,
      Key: keyName,
      Body: buffer,
      ContentType: objectType,
    })
    .promise();

  res.json({
    counter: JSON.parse(data.Body.toString()).counter + 1,
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
