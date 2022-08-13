import "./App.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useState } from "react";
function App() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
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
