const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 80;

app.use(express.json());
dotenv.config();

// Configurar CORS para permitir solicitações do seu frontend
const corsOptions = {
  origin: "https://ruthinunes.github.io",
  optionsSuccessStatus: 200, // para compatibilidade com navegadores antigos
};

app.use(cors(corsOptions));

// Endpoint para obter os idiomas
app.get("/languages", async (req, res) => {
  try {
    const response = await axios.get(
      `https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.API_KEY}&target=pt`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os idiomas" });
  }
});

// Endpoint para traduzir texto
app.post("/translate", async (req, res) => {
  const { inputText, inputLanguage, outputLanguage } = req.body;

  try {
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single`,
      {
        params: {
          client: "gtx",
          sl: inputLanguage,
          tl: outputLanguage,
          dt: "t",
          q: inputText,
        },
      }
    );
    const translatedText = response.data[0].map((item) => item[0]).join("");
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: "Erro ao traduzir o texto" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta:${port}`);
});
