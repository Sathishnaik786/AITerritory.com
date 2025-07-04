// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROMPT_TEMPLATES = {
  twitter: (input) => `Repurpose the following content as a Twitter thread:\n\n${input}\n\nThread:`,
  linkedin: (input) => `Repurpose the following content as a LinkedIn post:\n\n${input}\n\nLinkedIn Post:`,
  newsletter: (input) => `Repurpose the following content as a newsletter section:\n\n${input}\n\nNewsletter:`,
  youtube: (input) => `Repurpose the following content as a YouTube video script:\n\n${input}\n\nYouTube Script:`,
  instagram: (input) => `Repurpose the following content as an Instagram caption:\n\n${input}\n\nInstagram Caption:`,
};

// Handler for repurpose (feature disabled)
module.exports = async function repurposeHandler(req, res) {
  return res.status(503).json({ error: 'AI repurposing is currently disabled.' });
};

exports.repurpose = async (req, res, next) => {
  try {
    const { input, formats } = req.body;
    if (!input || !formats || !Array.isArray(formats) || formats.length === 0) {
      return res.status(400).json({ error: 'Input and formats are required.' });
    }
    const results = {};
    for (const format of formats) {
      const prompt = PROMPT_TEMPLATES[format]?.(input) || input;
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that repurposes content for different social formats.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 600,
        });
        results[format] = completion.choices[0].message.content.trim();
      } catch (err) {
        console.error('OpenAI error for format', format, err?.response?.data || err?.message || err);
        results[format] = 'Error generating content.';
      }
    }
    res.json({ results });
  } catch (err) {
    next(err);
  }
}; 