/**
 * Gemini AI Context-Aware Translation Service
 * Uses Google Gemini API to contextually translate municipal infrastructure terms,
 * officer sanction remarks, and citizen complaints into Tamil, Hindi, etc.
 */
const DEFAULT_GEMINI_KEY = "";
export async function translateWithGemini(
  text: string,
  targetLang: "ta" | "hi" | "en",
  apiKey?: string
): Promise<string> {
  if (!text || text.trim() === "" || targetLang === "en") return text;
  const langNames = {
    ta: "Tamil (தமிழ்)",
    hi: "Hindi (हिंदी)",
    en: "English",
  };
  const prompt = `You are an official Indian Government Smart City e-Governance translator. Translate the following municipal infrastructure text accurately into natural ${langNames[targetLang]}. Preserve official government terminology (e.g. Sanction Order, Zone, Trenching, Grievance). Return ONLY the translated text without explanation or quotation marks. Text: "${text}"`;
  const key = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || DEFAULT_GEMINI_KEY;
  if (!key) {
    console.info("Gemini API key not provided; fallback to standard translation.");
    return text;
  }
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`Gemini API error ${response.status}`);
    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return result || text;
  } catch (err) {
    console.warn("Gemini AI Translation notice:", err);
    return text;
  }
}

/**
 * Gemini AI Tamil Complaint Processor
 * Detects if a citizen grievance is written in Tamil, and uses Gemini AI
 * to generate an accurate English translation for Department Officers.
 */
export async function processCitizenComplaintTranslation(
  description: string
): Promise<{ isTamil: boolean; finalDescription: string; englishTranslation: string }> {
  if (!description || description.trim() === "") {
    return { isTamil: false, finalDescription: description, englishTranslation: description };
  }

  const containsTamil = /[\u0B80-\u0BFF]/.test(description);

  if (!containsTamil) {
    return { isTamil: false, finalDescription: description, englishTranslation: description };
  }

  try {
    const prompt = `You are a Smart City municipal grievance assistant. Translate the following Tamil citizen complaint into formal English for government officers to resolve. Return ONLY the English translation. Tamil text: "${description}"`;
    const key = (import.meta as any).env?.VITE_GEMINI_API_KEY || DEFAULT_GEMINI_KEY;

    if (!key) {
      return { isTamil: true, finalDescription: description, englishTranslation: description };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      return { isTamil: true, finalDescription: description, englishTranslation: description };
    }

    const data = await response.json();
    const englishTranslation = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || description;

    // Combine original Tamil text with AI English Translation for official clarity
    const combinedDesc = `${description}\n\n[🤖 AI Gemini Translation to English]: ${englishTranslation}`;

    return {
      isTamil: true,
      finalDescription: combinedDesc,
      englishTranslation,
    };
  } catch (err) {
    console.warn("Gemini Tamil complaint processing notice:", err);
    return { isTamil: true, finalDescription: description, englishTranslation: description };
  }
}
