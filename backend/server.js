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
  accessKeyId: "ASIA5DYSEEJ43SA47GEB",
  secretAccessKey: "6IJr8VAsBGrkqfvS0FLeGk8mGy6sJKqGjxV4lA",
  sessionToken:
    "IQoJb3JpZ2luX2VjECAaDmFwLXNvdXRoZWFzdC0yIkcwRQIhAKQOla0ldBePUPV9DkGjHk/o+WqcpX2t84yKhe6AmZzwAiB3lEqfW9vQsxtGpLgVl5tvcXM4FVR+NwfFtrc6kGi1hCq5Awi5//////////8BEAIaDDkwMTQ0NDI4MDk1MyIMthWhsqN+zWCb7if1Ko0DE9CUXx9q/DvcMEWHabnVDscveh4EdOwWpiYQmy9CN86fjY2ylotM/GYSVt++a6ocuXzlD0avlTogXzFaRtOnQU7ksh7YczilikXkq+kYsLzTKpjKbgg9n3oL6sWVJkcNuomBUOrGMEKlWpox+soXrSHPukBB0kN59CbHoTctoXca1nqQIRht6MpiGs+5UfaVRLpzNkuycFjSvzDTc2FVJbUyGeUOpiYAFjGfudM19Alrvp6Q6hlnuSAvwnQi+ZWVz1KCMg3WCGaR0GSIjPUnBUJLTCOR1M6G2DXZvUWsP/mP5x0kgb41HmzqnLBV5EIYm2dL/YGrfFn1R/51Bz8TY3Db2iTA47iwPLBa9fDXX/LjZo50rGQvV0tJyh+pIzRbFc4p45Y4n+5DBQWTg3t2fnSfhL+6IKwhzqbmOBtdXSzRL8L5+/bdhQxlfW9QZAeYv4Rv2GJMQTeu/1+ouYLeSkbAVmb/rdCBwWr4rfVkOK4DUQ7GG7GOhEyxYOFI0GHR1/77XXdPlRAo8C1EiDCploaZBjqmAbMVqGkeEiucCN7dY9k7jZDDYgXo8bSxvn5nk42yOddv5ONep2KtkSi0z85j4LlM+oCl2sc+eFKjDjo29mHBaM6lLC8rJluW5MmOkymPLm+B9ZjUzpJ4a1wWwBL67kI1KF5IBcOeev/OXv4B8joaiFMSJU2aaZBO+EKhnoF1avxOAKQH2E9iT9wy3a6uOjXeF76WTsJx7ythpAFhSDfdaxj+VSJVxks=",
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
  try {
    const bucketName = "mitchellbucketn11099887";
    const keyName = "index.json";
    const objectType = "application/json"; // type of file

    let data = await s3
      .getObject({
        Bucket: bucketName,
        Key: keyName,
      })
      .promise();

    const file = {
      counter: JSON.parse(data.Body.toString()).counter + 1,
    };

    var buffer = Buffer.from(JSON.stringify(file));

    s3.upload({
      Bucket: bucketName,
      Key: keyName,
      Body: buffer,
      ContentType: objectType,
    }).promise();

    res.json({
      counter: JSON.parse(data.Body.toString()).counter + 1,
    });
  } catch (e) {
    console.log(e);
    res.json({
      counter: "credentials expired",
    });
  }
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
