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
  accessKeyId: "ASIA5DYSEEJ44XE6MYQL",
  secretAccessKey: "wSFaqeqnCX+MRaUdFte3MvutnDZN8WzNpoUhvkz6",
  sessionToken:
    "IQoJb3JpZ2luX2VjEDcaDmFwLXNvdXRoZWFzdC0yIkcwRQIhAK28jxSx/o+03M7J5k6TW61i6XOXXsSSw+cWXTaU+f3hAiB3CDSs4/o0T5rld5knLFusWgjDeyDNS3Jh8j2PONggRiq4Awig//////////8BEAIaDDkwMTQ0NDI4MDk1MyIM7E4TVHi+mdryhLAIKowDqky271yp/4qyUago/ECn7r6S5W8jQdaUXgmk1GAOkG0qOiK0F2SZveWseiYF5o24dfjRJOGbDrV1a0Qcw2Bo3t0iStIkQ6FyjceHyMfCDL98S3ywl0deCLA6CIVw0aL2pzJfZYHse28i/BpAKK8RCF4zvAne4HeM4THR2DprBO7VHQ4JE7YKtZwsSudYR22CqLLiRBiapdFqQWZze4M+6E2ckj7Esms0reAppsUi5U5xl2s4jzzcIU2/qZczICVHyajAVHTn/8Z+TpXtX3R1kip+vJ4XHgEFRb06UROclYwASzfx+MMEvS+wvyrwKxbGscgpLC7g/BikSmyu+QS8jWgcVGrmJThneoCa7xT0Td0ioHVhUW4lIqIYlzx7/xpiiZQVDLeDu40LXeWhnUDaNNKlWLPe+zMO7AGNUBHEgOG23qR89AqYmBX0sDggV6wYU869aGobXm2C34Yd+lVdfUWrc0ldxEBPoA8dfERvk2FgekbA1jx+ZQGwcB3LKP29pQ1yv+2zpJXQNuKZMN7B4pcGOqYB8tGuqrvFw2DRP8SdoJ9LH+Hzl/wfwEhKO/eOY1rNZACFFsGuLALQZiDhQ0mIkgzLUKxWTNLyDeSIs84c1xxmAsQ6Kp/VqnTkGK9vxwVwgjUaHxNIXBExzTT9J4IeQ2zRYAgZb76OxdJj6MXbD9jD+zoOq9pnEHx1UklU62ZGeEO3t3mpkSlNBPlGe9A7MBdqLlb8anLUEMeDBtmL9h17Ye2qWvRuDQ==",
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

let data = await s3.getObject({
  Bucket: bucketName,
  Key: keyName,
}).promise();

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
    })
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
