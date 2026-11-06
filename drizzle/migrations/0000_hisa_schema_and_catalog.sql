-- Contact inquiries (insert-only from the public site)
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  area text not null,
  message text not null check (char_length(message) between 1 and 4000),
  locale text not null default 'pt' check (locale in ('pt', 'en')),
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint contact_inquiries_area_check check (area in ('music', 'academy', 'sounds', 'custom', 'brands', 'consulting', 'show'))
);

grant insert on public.contact_inquiries to anon, authenticated;
grant all on public.contact_inquiries to service_role;

alter table public.contact_inquiries enable row level security;

create policy "Anyone can send a contact inquiry"
on public.contact_inquiries
for insert
to anon, authenticated
with check (status = 'new');

-- Catalog products (public storefront content)
create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  catalog text not null check (catalog in ('academy', 'sounds')),
  category text not null check (category in ('courses', 'lessons', 'analyses', 'workshops', 'mentorship', 'samples', 'bundles', 'midi', 'drums', 'presets', 'vocals')),
  slug text not null unique,
  title_pt text not null,
  title_en text not null,
  meta_pt text not null,
  meta_en text not null,
  price_cents integer not null check (price_cents >= 0),
  position integer not null default 0,
  is_published boolean not null default true,
  starts_at timestamptz,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

grant select on public.catalog_products to anon, authenticated;
grant all on public.catalog_products to service_role;

alter table public.catalog_products enable row level security;

create policy "Published catalog products are public"
on public.catalog_products
for select
to anon, authenticated
using (is_published = true);

-- Catalog seed migrated from the source site (14 published products).
insert into public.catalog_products (id, catalog, category, slug, title_pt, title_en, meta_pt, meta_en, price_cents, position, is_published, starts_at, content) values
('503e6a01-354e-4d97-89ec-2e2924b38082', 'academy', 'courses', 'introducao-producao-musical', 'Introdução a Produção Musical', 'Introduction to Music Production', '3 horas', '3 hours', 39900, 1, true, null, '{"modules":{"en":[{"title":"01 · Listening and reference","detail":"Analyse tracks and turn references into production decisions."},{"title":"02 · Rhythm and harmony","detail":"Drum programming, groove and the chords that hold the song."},{"title":"03 · Mix and master","detail":"Balance, depth and finishing for streaming."}],"pt":[{"title":"01 · Escuta e referência","detail":"Analisar faixas e transformar referências em decisões de produção."},{"title":"02 · Ritmo e harmonia","detail":"Programação de bateria, groove e os acordes que sustentam a canção."},{"title":"03 · Mix e master","detail":"Balanço, profundidade e finalização para streaming."}]},"summary":{"en":"From the first sound to the master: the technical and creative base to produce your own tracks.","pt":"Do primeiro som ao master: a base técnica e criativa para produzir suas próprias faixas."},"includes":{"en":["On-demand video lessons","FL Studio project files","Completion certificate"],"pt":["Aulas em vídeo sob demanda","Arquivos de projeto em FL Studio","Certificado de conclusão"]}}'::jsonb),
('26f6cb83-6748-4c22-addc-a42dfb7d7f3b', 'academy', 'courses', 'producao-musical-intermediaria', 'Produção Musical Intermediária', 'Intermediate Music Production', '5 horas', '5 hours', 49900, 2, true, null, '{"modules":{"en":[{"title":"01 · Sonic identity","detail":"Finding the signature of your sound."},{"title":"02 · Synthesis and texture","detail":"Synthesizers, samples and layers."},{"title":"03 · Voice and production","detail":"Writing, recording and treating the voice at the centre of the track."}],"pt":[{"title":"01 · Identidade sonora","detail":"Encontrar a assinatura do seu som."},{"title":"02 · Síntese e textura","detail":"Sintetizadores, samples e camadas."},{"title":"03 · Voz e produção","detail":"Compor, gravar e tratar a voz no centro da faixa."}]},"summary":{"en":"For those already producing who want their own sound: arrangement, texture and sonic identity.","pt":"Para quem já produz e quer som próprio: arranjo, textura e identidade sonora."},"includes":{"en":["On-demand video lessons","Commented listening sessions","Project files"],"pt":["Aulas em vídeo sob demanda","Sessões de escuta comentada","Arquivos de projeto"]}}'::jsonb),
('cdd7c44a-4b01-413c-9418-e1efbc22c66f', 'academy', 'courses', 'producao-musical-avancada', 'Produção Musical Avançada', 'Advanced Music Production', '6 horas', '6 hours', 59900, 3, true, null, '{"modules":{"en":[{"title":"01 · Artistic direction","detail":"Deciding what the work needs before opening the software."},{"title":"02 · Creative engineering","detail":"Processing, saturation and space."},{"title":"03 · Mixing and master","detail":"Balance, depth and delivery for streaming."}],"pt":[{"title":"01 · Direção artística","detail":"Decidir o que a obra precisa antes de abrir o software."},{"title":"02 · Engenharia criativa","detail":"Processamento, saturação e espaço."},{"title":"03 · Mixagem e master","detail":"Balanço, profundidade e entrega para streaming."}]},"summary":{"en":"High-level production: artistic direction, mixing and master for release.","pt":"Produção de alto nível: direção artística, mixagem e master para lançamento."},"includes":{"en":["On-demand video lessons","HISA release case studies","Individual feedback session"],"pt":["Aulas em vídeo sob demanda","Estudos de caso de lançamentos HISA","Sessão de feedback individual"]}}'::jsonb),
('42b4d6e0-4858-4a74-af0a-7f2b4ccd701b', 'academy', 'analyses', 'analisando-britney-spears', 'Analisando a Discografia da Britney Spears', 'Analyzing Britney Spears'' Discography', '2 horas', '2 hours', 5990, 4, true, null, '{"modules":{},"summary":{"en":"A track-by-track reading of the discography that redefined 2000s pop.","pt":"Uma leitura faixa por faixa da discografia que redefiniu o pop dos anos 2000."},"includes":{"en":["Video analysis (2h)","Map of sonic references","Instant access"],"pt":["Análise em vídeo (2h)","Mapa de referências sonoras","Acesso imediato"]}}'::jsonb),
('d74fe223-d25a-4e23-a9ed-be27a7f2c043', 'academy', 'lessons', 'teoria-musical-para-producao', 'Teoria Musical para Produção', 'Music Theory for Production', '1h30', '1h30', 8990, 5, true, null, '{"modules":{},"summary":{"en":"The theory production needs: chords, scales and harmonic function without academicism.","pt":"A teoria que a produção precisa: acordes, escalas e função harmônica sem academicismo."},"includes":{"en":["Recorded lesson (1h30)","PDF material","Instant access"],"pt":["Aula gravada (1h30)","Material em PDF","Acesso imediato"]}}'::jsonb),
('b1462834-d07b-4509-9623-5baf5c765e5f', 'academy', 'lessons', 'harmonias-vocais', 'Como Criar Harmonias Vocais', 'How to Create Vocal Harmonies', '1h15', '1h15', 7990, 6, true, null, '{"modules":{},"summary":{"en":"Vocal layers that sound like a choir: from unison to four-part harmony.","pt":"Camadas vocais que soam como um coral: do uníssono à harmonia de quatro vozes."},"includes":{"en":["Recorded lesson (1h15)","Vocal presets","Instant access"],"pt":["Aula gravada (1h15)","Presets de voz","Acesso imediato"]}}'::jsonb),
('67b04a3f-5e89-4774-9697-88dd8339fb9e', 'academy', 'workshops', 'workshop-mixagem-ao-vivo', 'Workshop: Mixagem ao Vivo', 'Workshop: Live Mixing', '2 horas', '2 hours', 12900, 7, true, '2027-01-23T22:00:00+00:00'::timestamptz, '{"modules":{},"summary":{"en":"A track opened live, from first cut to master, with real-time questions.","pt":"Uma faixa aberta ao vivo, do primeiro corte ao master, com perguntas em tempo real."},"includes":{"en":["Live session (2h)","30-day recording access","Open Q&A room"],"pt":["Encontro ao vivo (2h)","Gravação por 30 dias","Sala de perguntas aberta"]}}'::jsonb),
('c49d1c4f-29f5-4e94-9d5c-5b4df5103150', 'academy', 'mentorship', 'sessao-mentoria-artistica', 'Sessão de Mentoria Artística', 'Artistic Mentorship Session', '1 hora', '1 hour', 24900, 8, true, null, '{"modules":{},"summary":{"en":"One hour of listening devoted to your project: direction, repertoire and next steps.","pt":"Uma hora de escuta dedicada ao seu projeto: direção, repertório e próximos passos."},"includes":{"en":["1h individual session","Written action plan","30-day follow-up"],"pt":["Sessão individual de 1h","Plano de ação por escrito","Acompanhamento por 30 dias"]}}'::jsonb),
('071e8a1f-045e-46f8-89cc-36f3c4f3f817', 'sounds', 'drums', 'hisa-drum-kit-vol-1', 'HISA Drum Kit Vol. 1', 'HISA Drum Kit Vol. 1', '120 samples · WAV 24-bit', '120 samples · 24-bit WAV', 8900, 1, true, null, '{"modules":{},"summary":{"en":"Analogue drums processed by HISA: impact and texture for tracks that need weight.","pt":"Bateria analógica processada por HISA: impacto e textura para faixas que precisam de peso."},"includes":{"en":["120 samples, 24-bit WAV","One-shots and loops","Commercial licence"],"pt":["120 samples WAV 24-bit","One-shots e loops","Licença para uso comercial"]}}'::jsonb),
('dbb6abfa-1aaa-4fc6-8407-ed0bfbd723a1', 'sounds', 'samples', 'neon-textures', 'Neon Textures', 'Neon Textures', '80 loops · 48 kHz', '80 loops · 48 kHz', 5900, 2, true, null, '{"modules":{},"summary":{"en":"Night textures recorded to synthesizers and tape, ready for atmosphere.","pt":"Texturas noturnas gravadas em sintetizadores e fita, prontas para atmosfera."},"includes":{"en":["80 loops · 48 kHz","Textures and layers","Commercial licence"],"pt":["80 loops · 48 kHz","Texturas e camadas","Licença comercial"]}}'::jsonb),
('9d7ac45f-c4c8-4074-846b-ce008e2fbef3', 'sounds', 'midi', 'midi-progressions-vol-2', 'MIDI Progressions Vol. 2', 'MIDI Progressions Vol. 2', '60 progressões', '60 progressions', 3900, 3, true, null, '{"modules":{},"summary":{"en":"Harmonic progressions ready to be rewritten with your sound.","pt":"Progressões harmônicas prontas para reescrever com o seu som."},"includes":{"en":["60 MIDI progressions","Files for any DAW","Commercial licence"],"pt":["60 progressões MIDI","Arquivos para qualquer DAW","Licença comercial"]}}'::jsonb),
('5169a354-905b-4cc4-8a10-8ef81a059fea', 'sounds', 'vocals', 'vocal-chops-harmonies', 'Vocal Chops & Harmonies', 'Vocal Chops & Harmonies', '95 vocais', '95 vocals', 6900, 4, true, null, '{"modules":{},"summary":{"en":"Processed voices and harmonies to open the top of your production.","pt":"Vozes processadas e harmonias para abrir o topo da sua produção."},"includes":{"en":["95 vocals · WAV","Chops, phrases and harmonies","Commercial licence"],"pt":["95 vocais · WAV","Chops, frases e harmonias","Licença comercial"]}}'::jsonb),
('89d89d4f-0490-4134-8b5b-16ff076eac7e', 'sounds', 'presets', 'analog-presets', 'Analog Presets', 'Analog Presets', '70 presets', '70 presets', 4900, 5, true, null, '{"modules":{},"summary":{"en":"Analogue-inspired presets for the synthesizers you already use.","pt":"Presets de inspiração analógica para os sintetizadores que você já usa."},"includes":{"en":["70 presets","Serum · Vital · Sylenth","Commercial licence"],"pt":["70 presets","Serum · Vital · Sylenth","Licença comercial"]}}'::jsonb),
('cf20101c-58c5-4528-8625-f74e654b80e2', 'sounds', 'bundles', 'complete-producer-bundle', 'BUNDLE: COMPLETE HISA PACK VOL 1', 'BUNDLE: COMPLETE HISA PACK VOL 1', '4 packs incluídos', '4 packs included', 19900, 6, true, null, '{"modules":{},"summary":{"en":"The four volumes of the HISA catalogue in a single pack, with real savings.","pt":"Os quatro volumes do catálogo HISA em um único pacote, com economia real."},"includes":{"en":["4 packs included","35% savings","Commercial licence"],"pt":["4 packs incluídos","Economia de 35%","Licença comercial"]}}'::jsonb)
on conflict (slug) do nothing;
