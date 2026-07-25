import { config } from "../config.js";

const SYSTEM_PROMPT = `Eres Fex, un chatbot de IA experto en programacion.
Responde en el idioma del usuario. Ayuda con arquitectura, debugging, frontend,
backend, bases de datos, despliegue, seguridad y buenas practicas. Se concreto,
explica los pasos importantes y pide contexto solo cuando sea necesario.`;

export async function generateReply({ messages, memories }) {
  const memoryText = memories.length
    ? `Memoria del usuario:\n${memories.map((m) => `- ${m.key}: ${m.value}`).join("\n")}`
    : "Memoria del usuario: sin datos guardados.";

  const promptMessages = [
    { role: "system", content: `${SYSTEM_PROMPT}\n\n${memoryText}` },
    ...messages.map((m) => ({
      role: m.sender === "ASSISTANT" ? "assistant" : "user",
      content: m.content
    }))
  ];

  if (config.aiProvider === "openai-compatible") {
    return generateOpenAICompatible(promptMessages);
  }
  return generateOllama(promptMessages);
}

async function generateOllama(messages) {
  const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: config.ollamaModel,
      messages,
      stream: false
    })
  });

  if (!response.ok) throw new Error(`Ollama error ${response.status}`);
  const data = await response.json();
  return data.message?.content || "No pude generar una respuesta.";
}

async function generateOpenAICompatible(messages) {
  const response = await fetch(`${config.compatibleBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.compatibleApiKey}`
    },
    body: JSON.stringify({
      model: config.compatibleModel,
      messages,
      temperature: 0.2
    })
  });

  if (!response.ok) throw new Error(`AI provider error ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No pude generar una respuesta.";
}

