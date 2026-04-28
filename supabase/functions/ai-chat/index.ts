// POST /functions/v1/ai-chat
// Body: { transcript: string, topic: string }
// Returns: { response: string }
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `You are an encouraging English language tutor helping a student practice speaking.
Keep your responses concise (2-3 sentences), natural, and educational.
Gently correct any grammar mistakes in the student's message.
Stay on the conversation topic provided.`

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { transcript, topic } = await req.json()

    if (!transcript?.trim()) {
      return new Response(JSON.stringify({ error: 'transcript is required' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Topic: ${topic}\nStudent said: "${transcript}"\n\nRespond naturally as a tutor.`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!chatRes.ok) {
      const err = await chatRes.text()
      throw new Error(`OpenAI Chat error: ${err}`)
    }

    const data = await chatRes.json()
    const response = data.choices[0]?.message?.content ?? 'I did not understand. Please try again.'

    return new Response(JSON.stringify({ response }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
