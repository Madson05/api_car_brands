import express from "express";

import routerCars from "./routers/routerCars.js"

const app = express();
const port = 3000;


app.use(express.json());

app.use("/marcas", routerCars)


app.listen(port, () => {
  console.log(`API started on port ${port}`)
})

