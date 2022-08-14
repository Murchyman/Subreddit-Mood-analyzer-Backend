import "./App.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
function App() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [views, setViews] = useState("loading...");

  useEffect(() => {
    fetch(
      "http://localhost:3001/counter"
    )
      .then((res) => res.json())
      .then((data) => {
        setViews(data.counter);
      });
  }, []);


  const sendQuery = async () => {
    setResult("loading...");
    if (value === "") {
      alert("Please enter a query");
    } else {
      //fetch
      const response = await fetch(`http://localhost:3001/sub/${value}`);
      const data = await response.json();
      setResult(data.message);
    }
  };

  return (
    <div className="App">
      <div className="viewCounter">
        <h3>View Counter</h3>
        <h4>{views}</h4>
      </div>
      <img
        src={"https://www.redditinc.com/assets/images/site/reddit-logo.png"}
        className="App-logo"
        alt="logo"
      />
      <h1>Enter a subreddit and get back the mood of that subreddit!</h1>
      <div className="body">
        <TextField
          onChange={(e) => {
            setValue(e.target.value);
          }}
          id="outlined"
          label="subreddit"
          value={value}
        />
        <br />
        <Button onClick={sendQuery} variant="contained">
          Submit
        </Button>
        <br />
        {result}
      </div>
    </div>
  );
}

export default App;
