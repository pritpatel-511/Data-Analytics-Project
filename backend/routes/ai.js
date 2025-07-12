const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { analyzeData } = require("../utils/aiAnalyzer");
const { protect } = require("../middleware/authMiddleware");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Graphlytics AI Insights",
  },
});

// 🔍 AI Insight Route
router.post("/insight", protect, async (req, res) => {
  const { data } = req.body;

  try {
    const localAnalysis = analyzeData(data);

    // 🔗 Generate recommendation with OpenRouter
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: "You are a skilled data scientist. Suggest appropriate charts based on a dataset.",
        },
        {
          role: "user",
          content: `Here is a sample of the dataset:\n${JSON.stringify(data.slice(0, 10))}\n\nSuggest the best chart and correlation insights.`,
        },
      ],
    });

    const aiRecommendation = response.choices[0].message.content;

    res.json({
      ...localAnalysis,
      recommendation: {
        chart: localAnalysis.recommendation.chart,
        description: aiRecommendation || localAnalysis.recommendation.description,
      },
    });
  } catch (err) {
    console.error("❌ AI Insight Error:", err);
    res.status(500).json({ message: "AI Insight Error", error: err.message });
  }
});

// 💬 AI Chat Assistant
router.post("/chat", protect, async (req, res) => {
  const { data, question } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant that answers questions about datasets." },
        { role: "user", content: `Here is my dataset: ${JSON.stringify(data.slice(0, 15))}` },
        { role: "user", content: `Question: ${question}` },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ message: "Chat error", error: err.message });
  }
});

module.exports = router;
