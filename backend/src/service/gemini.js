import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateLearningPath = async ({
  subject, currentLevel, targetLevel, learningStyle, requestUser
}) => {
  const prompt = `
Kamu adalah AI tutor yang merancang kurikulum belajar personal.

Buat learning path untuk:
- Topik: ${subject}
- Level saat ini: ${currentLevel}
- Target level: ${targetLevel}  
- Gaya belajar: ${learningStyle}
- Permintaan khusus user: ${requestUser}

Tugasmu adalah merancang STRUKTUR pembelajaran yang logis dan progresif.
Setiap checkpoint harus membangun pemahaman dari checkpoint sebelumnya.

Kembalikan HANYA JSON ini tanpa teks lain:
{
  "estimatedWeeks": Integer,
  "difficultyLevel": "beginner",
  "checkpoints": [
    {
      "orderIndex": 0,
      "title": "Judul topik spesifik",
      "description": "Apa yang akan dipelajari dan mengapa penting ( ini akan menjadi prompt pembuatan checkpoint, dan buatkan secara urutan)",
      "xpReward": 100
    }
  ]
}

Aturan:
- Buat tepat 4 checkpoint
- orderIndex mulai dari 0
- Urutan harus logis dari dasar ke mahir
- Title harus spesifik, bukan generik (contoh: "Limit dan Kekontinuan" bukan "Bab 1")
- description maksimal 10 kalimat, padat dan jelas
- xpReward: checkpoint awal 100, tengah 150, akhir 200
- difficultyLevel: sesuaikan dengan currentLevel user
- estimatedWeeks: perkiraan realistis berdasarkan kompleksitas topik
`

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json", // ← force JSON
    },
  });

  const raw = response.text;
  return JSON.parse(raw);
}