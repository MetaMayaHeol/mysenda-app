import OpenAI from 'openai'

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set. Embedding generation will be skipped.')
    return null
  }
  return new OpenAI({ apiKey })
}

export async function generateEmbedding(text: string) {
  if (!text) return null
  
  const openai = getOpenAI()
  if (!openai) return null

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' '),
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    // Don't throw, just return null so we don't break the app flow
    return null
  }
}
