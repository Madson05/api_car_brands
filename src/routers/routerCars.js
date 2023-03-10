import express from "express";
import { promises as fs } from "fs";

const router = express.Router();
const fileName = "data/car-list.json";
const { readFile, writeFile } = fs;

router.get("/", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.get("/maisModelos", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    let numberMax = Math.max(...data.map((car) => car.models.length));

    let bigBrands = data
      .filter((car) => car.models.length === numberMax)
      .map((car) => car.brand);
    res.send(bigBrands);
  } catch (error) {
    next(error);
  }
});

router.get("/menosModelos", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    let numberMin = Math.min(...data.map((car) => car.models.length));

    let smallBrands = data
      .filter((car) => car.models.length === numberMin)
      .map((car) => car.brand);

    res.send(smallBrands);
  } catch (error) {
    next(error);
  }
});

router.get("/listaMaisModelos/:x", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    const x = req.params.x;
    const lista = data
      .sort((a, b) => {
        if (a.models.length > b.models.length) {
          return -1;
        } else if (a.models.length == b.models.length) {
          if (a.brand < b.brand) {
            return -1;
          } else {
            return 1;
          }
        } else return 0;
      })
      .map((car) => `${car.brand} - ${car.models.length}`);

    res.send(lista.slice(0, x));
  } catch (error) {
    next(error);
  }
});

router.get("/listaMenosModelos/:x", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    const x = req.params.x;
    const lista = data
      .sort((a, b) => {
        if (a.models.length < b.models.length) {
          return -1;
        } else if (a.models.length == b.models.length) {
          if (a.brand < b.brand) {
            return -1;
          } else {
            return 1;
          }
        } else return 0;
      })
      .map((car) => `${car.brand} - ${car.models.length}`);

    res.send(lista.slice(0, x));
  } catch (error) {
    next(error);
  }
});

router.post("/listaModelos", async (req, res, next) => {
  try {
    const brand = req.body.brand;
    if(!brand) throw new Error(`O parametro brand deve ser passado via arquivo JSON da seguinte forma: {'brand': 'marcaX'} (com aspas duplas)`)
    const data = JSON.parse(await fs.readFile(fileName));
    const models = data
      .filter((car) => brand.toUpperCase() === car.brand.toUpperCase())
      .map((car) => car.models);

    res.send(models);
  } catch (error) {
    next(error);
  }
});

router.use((error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

export default router;
