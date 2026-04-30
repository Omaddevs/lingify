-- ═══════════════════════════════════════════════════════════════════════════
--  LINGIFY — Supabase PostgreSQL Schema
--  Version: 1.0
--  Run this in Supabase SQL Editor to set up the database
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT,
  username            TEXT UNIQUE,
  email               TEXT,
  avatar_url          TEXT,
  role                TEXT DEFAULT 'student' CHECK (role IN ('student','teacher','admin')),
  level               TEXT DEFAULT 'A0'      CHECK (level IN ('A0','A1','A2','B1','B2','C1','C2')),
  plan                TEXT DEFAULT 'free'    CHECK (plan IN ('free','premium')),
  streak_count        INTEGER DEFAULT 0,
  total_xp            INTEGER DEFAULT 0,
  last_active_date    DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  goals               TEXT[],   -- e.g. ['IELTS','Speaking']
  daily_time          TEXT DEFAULT '20 min',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── LESSON PROGRESS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id   TEXT NOT NULL,
  completed   BOOLEAN DEFAULT FALSE,
  xp_earned   INTEGER DEFAULT 0,
  score       INTEGER,           -- quiz score percent
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ── VOCABULARY ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocabulary (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  word          TEXT NOT NULL,
  definition    TEXT,
  translation   TEXT,
  example       TEXT,
  pronunciation TEXT,
  level         TEXT DEFAULT 'Intermediate',
  folder_id     UUID,
  mastery       INTEGER DEFAULT 0 CHECK (mastery BETWEEN 0 AND 5),
  next_review   TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── VOCABULARY FOLDERS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocab_folders (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name    TEXT NOT NULL,
  color   TEXT DEFAULT '#6366f1',
  emoji   TEXT DEFAULT '📚',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from vocabulary to folders
ALTER TABLE vocabulary ADD CONSTRAINT fk_vocab_folder
  FOREIGN KEY (folder_id) REFERENCES vocab_folders(id) ON DELETE SET NULL;

-- ── TEST RESULTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_results (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  test_id       TEXT NOT NULL,
  test_title    TEXT,
  test_type     TEXT,           -- IELTS, TOEFL, SAT
  band_score    DECIMAL(3,1),
  correct       INTEGER,
  total         INTEGER,
  answers       JSONB,          -- {questionId: answer}
  section       TEXT,           -- listening, reading, writing, speaking
  taken_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── MESSAGES ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  type            TEXT DEFAULT 'text' CHECK (type IN ('text','audio','image')),
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── PARTNERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  partner_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','blocked')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, partner_id)
);

-- ── SPEAKING SESSIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS speaking_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic       TEXT,
  persona     TEXT,
  duration    INTEGER,           -- seconds
  word_count  INTEGER,
  xp_earned   INTEGER DEFAULT 0,
  score       JSONB,             -- {fluency, grammar, vocabulary, coherence, overall}
  started_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── COURSES (Teacher Marketplace) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  price        INTEGER DEFAULT 0,   -- UZS (0 = free)
  level        TEXT,
  category     TEXT,
  thumbnail    TEXT,
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  rating       DECIMAL(2,1) DEFAULT 0,
  student_count INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_lessons (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  UUID REFERENCES courses(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video','doc','text')),
  content_url  TEXT,
  duration   INTEGER,    -- minutes
  order_num  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS enrollments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  paid_at     TIMESTAMPTZ,
  progress    INTEGER DEFAULT 0,   -- percent
  UNIQUE(user_id, course_id)
);

-- ── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT,           -- xp_earned, streak, test_result, message, etc.
  title      TEXT NOT NULL,
  body       TEXT,
  data       JSONB,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PAYMENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,   -- UZS
  currency    TEXT DEFAULT 'UZS',
  type        TEXT CHECK (type IN ('premium_monthly','premium_yearly','course')),
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  provider    TEXT,               -- payme, click, uzum
  reference   TEXT,               -- provider transaction ID
  course_id   UUID REFERENCES courses(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_folders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;

-- Profiles: users see their own profile
CREATE POLICY "Users can view own profile"    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles readable"      ON profiles FOR SELECT USING (TRUE);

-- Lesson progress: own data only
CREATE POLICY "Own lesson progress"           ON lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Vocabulary: own data only
CREATE POLICY "Own vocabulary"                ON vocabulary     FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own vocab folders"             ON vocab_folders  FOR ALL USING (auth.uid() = user_id);

-- Test results: own data only
CREATE POLICY "Own test results"              ON test_results   FOR ALL USING (auth.uid() = user_id);

-- Messages: sender or receiver
CREATE POLICY "Message participants"          ON messages       FOR ALL USING (
  auth.uid() = sender_id OR
  auth.uid() IN (SELECT user1_id FROM conversations WHERE id = conversation_id UNION
                 SELECT user2_id FROM conversations WHERE id = conversation_id)
);

-- Partners: own connections
CREATE POLICY "Own partners"                  ON partners       FOR ALL USING (auth.uid() = user_id OR auth.uid() = partner_id);

-- Speaking sessions: own data
CREATE POLICY "Own speaking sessions"         ON speaking_sessions FOR ALL USING (auth.uid() = user_id);

-- Notifications: own only
CREATE POLICY "Own notifications"             ON notifications  FOR ALL USING (auth.uid() = user_id);

-- Payments: own only
CREATE POLICY "Own payments"                  ON payments       FOR ALL USING (auth.uid() = user_id);

-- Courses: published courses visible to all, own drafts visible to teacher
CREATE POLICY "Published courses"             ON courses FOR SELECT USING (status = 'published' OR auth.uid() = teacher_id);
CREATE POLICY "Teacher manages courses"       ON courses FOR ALL   USING (auth.uid() = teacher_id);

-- ═══════════════════════════════════════════════════════════════════════════
--  TRIGGERS — auto-update updated_at
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    split_part(NEW.email, '@', 1) || '_' || substring(NEW.id::text, 1, 4)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
--  INDEXES (performance)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user   ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_user        ON vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_review      ON vocabulary(user_id, next_review);
CREATE INDEX IF NOT EXISTS idx_test_results_user      ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation  ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user     ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_status         ON courses(status, category);

-- ═══════════════════════════════════════════════════════════════════════════
--  SAMPLE DATA (optional)
-- ═══════════════════════════════════════════════════════════════════════════
-- Run separately if you want demo data in development:
/*
INSERT INTO courses (teacher_id, title, description, price, level, category, status)
VALUES
  ('YOUR_TEACHER_UUID', 'IELTS 7.0+ Masterclass', 'IELTS Academic 7.0+ uchun to''liq kurs', 299000, 'B2', 'IELTS', 'published'),
  ('YOUR_TEACHER_UUID', 'Ingliz tilini 0 dan B1 gacha', 'Boshlang''ich uchun kurs', 199000, 'A1', 'Beginner', 'published');
*/
