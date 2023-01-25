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

router.get("/moreCars", async (req, res, next)=> {
  const data = JSON.parse(await readFile(fileName));
  let brandWithMoreModels = ["", 0];

  data.map((brand) => {
    if(brand.models.length > brandWithMoreModels[1]){
      brandWithMoreModels[0] = brand.brand;
      brandWithMoreModels[1] = brand.models.length;
    } 
  })
  res.send(brandWithMoreModels[0])
});

router.get("/lessCars", async (req, res, next)=> {
  const data = JSON.parse(await readFile(fileName));
  let brandWithLessModels = ["", data[0].models.length];

  data.map((brand) => {
    if(brand.models.length < brandWithLessModels[1]){
      brandWithLessModels[0] = brand.brand;
      brandWithLessModels[1] = brand.models.length;
    } 
  })
  res.send(brandWithLessModels[0])
});

router.use((error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

export default router;
