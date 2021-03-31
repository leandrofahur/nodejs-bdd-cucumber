const express = require("express");
const app = express();

app.use(express.json({ extended: false }));

const data = [
  {
    name: "Leandro Machado",
    age: 31,
  },
];

app.get("/", (req, res) => {
  res.status(200).json({ method: "GET", statusCode: 200, message: data });
});

app.post("/", (req, res) => {
  const { name, age } = req.body;

  const index = data.findIndex((x) => x.name === name && x.age === age);

  index === -1 ? data.push({ name, age }) : data;

  res.status(200).json({ method: "POST", statusCode: 200, message: data });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, (req, res) => {
  console.log(`Server up and running on port ${PORT}`);
});
