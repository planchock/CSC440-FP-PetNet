const express = require("express");
const router = require("./routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
