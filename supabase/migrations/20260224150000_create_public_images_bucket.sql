-- Insertion du bucket 'public_images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('public_images', 'public_images', true)
ON CONFLICT (id) DO NOTHING;

-- Création des politiques pour le bucket
CREATE POLICY "Les images sont visibles par tout le monde"
ON storage.objects FOR SELECT
USING (bucket_id = 'public_images');

CREATE POLICY "Les utilisateurs connectés peuvent ajouter des images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'public_images' AND auth.role() = 'authenticated');
