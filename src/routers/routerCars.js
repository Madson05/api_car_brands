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

router.get("/moreCars", async (req, res, next) => {
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

router.get("/lessCars", async (req, res, next) => {
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

router.get("/moreCars/:quantity", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    const quantity = req.params.quantity;
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

    res.send(lista.slice(0, quantity));
  } catch (error) {
    next(error);
  }
});

router.get("/lessCars/:quantity", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    const quantity = req.params.quantity;
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

    res.send(lista.slice(0, quantity));
  } catch (error) {
    next(error);
  }
});

router.use((error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

export default router;
