// POST /functions/v1/ai-speak
// Body: { text: string, voice?: 'alloy'|'echo'|'fable'|'onyx'|'nova'|'shimmer' }
// Returns: audio/mpeg stream
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { text, voice = 'alloy' } = await req.json()

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'tts-1', input: text, voice }),
    })

    if (!ttsRes.ok) {
      const err = await ttsRes.text()
      throw new Error(`OpenAI TTS error: ${err}`)
    }

    return new Response(ttsRes.body, {
      headers: { ...CORS, 'Content-Type': 'audio/mpeg' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
