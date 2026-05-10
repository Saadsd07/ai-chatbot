import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("hello world");
});

app.get('/api/hello', (req, res) => {
  res.json({ message: "hello world" });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 