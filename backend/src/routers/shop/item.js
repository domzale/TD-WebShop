const router = require("express").Router();
const pth = "../../";
const { DatabasePool } = require(pth + "database");
const { ItemService } = require(pth + "services/item");

const pool = new DatabasePool();
const itemService = new ItemService(pool.get());

router.get("/type", async (request, response) => {
  itemService.getAllItemTypes(response);
});

router.get("/", async (request, response) => {
  itemService.getAllItemsForType(request, response);
});

module.exports = router;
