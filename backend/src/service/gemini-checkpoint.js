// src/service/gemini-checkpoint.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateCheckpointMaterial = async ({
  subject,
  checkpointTitle,
  checkpointDescription,
  orderIndex,
  totalCheckpoints,
  currentLevel,
  targetLevel,
  learningStyle,
  description
}) => {
  const prompt = `
Kamu adalah AI tutor expert yang membuat materi pembelajaran berkualitas tinggi.

Konteks pembelajaran:
- Mata pelajaran: ${subject}
- Level user: ${currentLevel} → target ${targetLevel}
- Gaya belajar: ${learningStyle} 
- Ini adalah checkpoint ke-${orderIndex + 1} dari ${totalCheckpoints}

Checkpoint yang harus dibuat materinya:
- Judul: ${checkpointTitle}
- Fokus: ${checkpointDescription}

-deskripsi dari checkpoint ini : ${description}
Tugasmu:
1. Buat materi pembelajaran yang MENDALAM dan MUDAH DIPAHAMI
2. Sesuaikan gaya penjelasan dengan gaya belajar user (${learningStyle})
3. Buat 5 soal latihan yang menguji pemahaman, bukan hafalan
4. Soal harus RELEVAN dengan materi yang diajarkan di checkpoint ini

Kembalikan HANYA JSON ini tanpa teks lain:
{
  "materialContent": "string markdown lengkap disini ( buatkan selengkap mungkin tentang materi ini agar menjadi penuntun jalan yang baik bagi user untuk belajar) ",
  "exercises": [
    {
      "orderIndex": 0,
      "question": "Pertanyaan spesifik dan jelas?",
      "options": ["A. opsi pertama", "B. opsi kedua", "C. opsi ketiga", "D. opsi keempat"],
      "correctAnswer": "A",
      "explanation": "Penjelasan detail kenapa A benar dan kenapa B/C/D salah",
      "difficulty": "easy"
    }
  ]
}

Aturan materialContent:
- Gunakan format Markdown: ##, ###, **bold**, bullet points, code block jika perlu
- Mulai dengan penjelasan konsep dasar
- Berikan MINIMAL 2 contoh konkret atau analogi
- Jika ada rumus/kode, jelaskan baris per baris
- Akhiri dengan rangkuman poin-poin kunci
- Panjang minimal 500 kata, maksimal 3000 kata
- JANGAN gunakan LaTeX atau formula matematika dengan simbol $ atau \\
- Untuk rumus, tulis dalam bentuk teks biasa. Contoh: "lim(x→c) f(x) = L" bukan "$$\\lim_{x \\to c}$$"
- JANGAN gunakan notasi seperti $x$, $$formula$$, \\lim, \\frac, dll

Aturan exercises:
- 5 soal dengan distribusi: 2 easy, 2 medium, 1 hard
- Soal easy: menguji pemahaman konsep dasar
- Soal medium: menguji penerapan konsep
- Soal hard: menguji analisis dan kombinasi konsep
- correctAnswer hanya huruf: "A", "B", "C", atau "D"
- explanation harus menjelaskan KENAPA benar DAN kenapa opsi lain salah
- Jangan buat soal yang bisa dijawab tanpa membaca materi
`

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const raw = response.text;
  return JSON.parse(raw);
};