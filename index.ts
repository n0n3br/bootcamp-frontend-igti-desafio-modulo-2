import express from "express";
import routes from "./routes";

const app = express();
const port = 3000;

app.use(express.json());

routes(app);

app.listen(port, (err) => {
    if (err) console.log(err);

    console.log(`server running on port ${port}`);
});
