// import 'dotenv/config'
// export const generateLearningPath = async ({
//   subject, currentLevel, targetLevel, learningStyle,RequestUser
// }) => {
// const prompt = `
// Kamu adalah AI tutor. Buat learning path untuk topik berikut dalam format JSON.
 
// Topik: ${subject}
// Level sekarang: ${currentLevel}
// Target level: ${targetLevel}
// Gaya belajar: ${learningStyle}
// Request User: ${RequestUser}
 
// Kembalikan HANYA JSON dengan struktur ini, tanpa teks lain:
// {
//   "estimatedWeeks": 8,
//   "checkpoints": [
//     {
//       "title": "Judul checkpoint",
//       "description": "Deskripsi singkat",
//       "materialContent": "Materi dalam format markdown...",
//       "Prompt" : "Isi Prompt singkat
//       "xpReward": 100,
   
//       ]
//     }
//   ]
// }
 
// Buat tepat 8 checkpoint, setiap checkpoint berikan prompt jelas apa aja yang perlu dipelajarin 
// `
// console.log(process.env.OPENROUTER_API_KEY);
//  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     'HTTP-Referer': 'http://localhost:3000',
//   },
//     body: JSON.stringify({
//     model: 'qwen/qwen3.6-plus:free',
//     messages: [{ role: 'user', content: prompt }],
//     response_format: { type: 'json_object' },
//     temperature: 0.7,
//   }),
// })

// const data = await response.json();
// console.log("status:", response.status);
// console.log("data:", JSON.stringify(data, null, 2)); // ← tambah ini
// const raw = data.choices[0].message.content;

// return JSON.parse(raw);
// }
