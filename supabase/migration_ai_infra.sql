-- AI Infrastructure Migration

-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create embeddings table for RAG (Retrieval Augmented Generation)
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL, -- The text chunk
  metadata JSONB, -- Context (e.g. source url, guide_id, service_id)
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create HNSW index for fast similarity search
CREATE INDEX IF NOT EXISTS knowledge_embeddings_embedding_idx 
ON knowledge_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- 4. Enable RLS on embeddings
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow public read (agent needs to read, usually via service role, but good to have policy)
CREATE POLICY "Enable read access for all users" 
ON knowledge_embeddings FOR SELECT 
USING (true);

-- Allow insert only by admin/service_role
CREATE POLICY "Enable insert for admins only" 
ON knowledge_embeddings FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  )
);

-- 5. Create function to match embeddings (Semantic Search)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 6. API Keys for Agent Authentication (Secure access for n8n/Flowise)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g. "n8n-agent"
  key_hash TEXT NOT NULL, -- We store the HASH, not the key itself
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- RLS for API Keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Only admins can see/manage API keys
CREATE POLICY "Admins can manage api keys" 
ON api_keys 
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE is_admin = true
  )
);
