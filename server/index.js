import express from "express";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors())

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('/CreateAccount', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  console.log('Received username:', username);
  console.log('Received password:', password);
  res.status(200).json({ message: 'Usename and Password updated' });
});