const express = require("express");
const cors = require("cors");
const router = express.Router();
const dotenv = require("dotenv");
const axios = require("axios");

// Configure CORS to allow frontend requests
const corsOptions = {
  origin: "https://ruthinunes.github.io",
  optionsSuccessStatus: 200, // for compatibility with older browsers
};

dotenv.config();
router.use(cors(corsOptions));

// Endpoint to get the languages
router.get("/languages", async (req, res) => {
  try {
    const response = await axios.get(
      `https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.API_KEY}&target=pt`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os idiomas" });
  }
});

// Endpoint to translate text
router.post("/translate", async (req, res) => {
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

module.exports = router;
