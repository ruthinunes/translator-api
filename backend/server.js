const express = require("express");
const routerUrls = require("./routes/routes");
const app = express();
const port = 80;

app.use(express.json());
app.use("/api", routerUrls);

app.listen(port, () => {
  console.log(`Servidor rodando na porta:${port}`);
});
