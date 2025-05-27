import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_: Request, res: Response) => {
  res.send("hello mundo");
});

app.listen(port, () => {
  console.log(`running on http://localhost:${port}`);
});
