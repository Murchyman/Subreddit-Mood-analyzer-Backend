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
  accessKeyId: "ASIA5DYSEEJ4QXFYKGHH",
  secretAccessKey: "D9TOzFl1Rr0aaq/o0FXFc3UcQYjb5CoAayjuQ519",
  sessionToken:
    "IQoJb3JpZ2luX2VjEJj//////////wEaDmFwLXNvdXRoZWFzdC0yIkcwRQIhAODM7OsAAqF+fAsom/sLbWjZtmtYWLxQPYs175jUU/KHAiAq3nm5/agG8fIkNjCleXm2vL3gGr1OQsbjNUAjbLfVtiqvAwgxEAIaDDkwMTQ0NDI4MDk1MyIMTXAWCInXClgEU2ZcKowDKAsQLPA7U+duDJ6bRuvDiW1I/n1hhpabU3mef7pExN7k10+SWV7LAX6hhZigEOtPeqAt9Wwsrd3HDlgN8cs1SbEovWy9I6Ex6BvKgB08CfZQ5tI1ZWt8Wg+4axSIY+SAAoAFOf93meVL6EY5woC6SHc0UZlDgHr7T4v3kCBDVYamTLNdoQXsys1NTc+E7uuMuiAL2T5cvDCdoDZKVh2K7gFpWuJfa1UeKycFgq4IxhxU2Yl+tzkt8KfzgJ4QSlQxYSiGqw6mMoijL4OGK5LP7a+dIvIFw4J/w5XgG3QcBSBDoE9e0taJWQdggPdwUqOqKYDIi03JLHKJsMnns1QOeGYAqiLuHu+XywmQbOzrfXeCh8h43l7mKOpXqh9Q+wrVwgAGViWBtw+TJTAP33P56M4PVGmJxY14ml/+8hTqICSo1XAUwLGXDajT36sbLLBt6iyobbMcjtl/Hobvhe6XqKJVw3DyKvlbHodsEIAy1z79FiCGtLL23ISITWel5/GR6AWAsY9+5TADRyWyMLeZ6JgGOqYB7/St4Om3Qm5zrBd3B5c5XwdNq8ff0th7ZZ1kP9s016vDpQXe/YPB3FLmYJhYPaQaBvV7B3dKfV2cIFcV6ELZs+J7YGsgppvaqzzL8R0x+nu+9wGEu8DpX4UkrJx/YSC13R7NF3ykX5pgThwPV7qMLq6IfoW8yq32iC6fa0pdTfBwDCJePAy7Y9jmEvFLwa4Dinnfs/WH1cXNMxpXBeza4ZkVQb7c6Q==",
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

    //if subreddit is not found
    if (posts.length === 0) {
      res.json({
        message: "Subreddit not found",
      });
      return;
    }

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
