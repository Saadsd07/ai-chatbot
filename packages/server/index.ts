import dotenv from 'dotenv';
import express from 'express';
import router from './routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

// app.post('/api/chat', async(req:Request, res:Response) => {
//    const { prompt } = req.body;
//    const response = await client.models.generateContent({
//     model: "gemini-2.5-flash-lite",
//     contents: prompt,
//     config: {
//     temperature: 0.3,
//     maxOutputTokens: 180,
//   },

//   });

//    res.json({ message: response.text});
// });

/**before refactoring */
// app.post("/api/chat", async (req, res) => {
//    const parseResult = chatSchema.safeParse(req.body);
//    if(!parseResult.success){
//       res.status(400).json(parseResult.error.format())
//    }
//    try{
//       const { prompt, conversationId } = req.body;

//   if (!conversations.has(conversationId)) {
//     conversations.set(conversationId, []);
//   }

//   const history = conversations.get(conversationId)!;

//   history.push({ role: "user", text: prompt });

//   const trimmed = history.slice(-12); // sliding window

//   const response = await client.models.generateContent({
//     model: "gemini-2.5-flash-lite",
//     contents: trimmed.map(m => ({
//       role: m.role,
//       parts: [{ text: m.text }],
//     })),
//     config: {
//       temperature: 0.3,
//       maxOutputTokens: 180,
//     },
//   });

//   const aiText = response.text??"";

//   history.push({ role: "model", text: aiText });

//   conversations.set(conversationId, history.slice(-20));

//   res.json({ message: aiText });

//    }catch(error){
//       res.status(500).json({"error":"Failed to generate a response"})

//    }

// });

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
