import app from "./server.js";

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});