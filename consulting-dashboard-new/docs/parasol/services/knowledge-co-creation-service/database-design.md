# データベース設計: ナレッジ共創サービス

## 設計概要
**データベース**: SQLite (開発環境) / PostgreSQL (本番環境想定)
**文字エンコーディング**: UTF-8
**タイムゾーン**: UTC

## 論理設計

### ER図

```mermaid
erDiagram
    knowledge {
        UUID id PK
        VARCHAR(255) title UK
        TEXT summary
        TEXT content
        VARCHAR(20) category
        VARCHAR(20) type
        UUID author_id FK
        UUID project_id FK
        JSON tags
        JSON keywords
        VARCHAR(20) status
        VARCHAR(20) visibility
        VARCHAR(20) version
        UUID previous_version_id FK
        INTEGER view_count
        INTEGER like_count
        TIMESTAMP published_at
        DATE expires_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    documents {
        UUID id PK
        UUID knowledge_id FK
        VARCHAR(255) name
        TEXT description
        VARCHAR(20) file_type
        VARCHAR(100) mime_type
        INTEGER size
        TEXT url
        VARCHAR(100) checksum
        UUID uploaded_by FK
        VARCHAR(20) access_level
        INTEGER download_count
        TIMESTAMP last_accessed_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    best_practices {
        UUID id PK
        VARCHAR(255) title
        TEXT description
        TEXT context
        TEXT problem
        TEXT solution
        JSON benefits
        TEXT implementation
        JSON prerequisites
        JSON limitations
        JSON alternative_approaches
        VARCHAR(20) category
        UUID industry_id FK
        JSON project_ids
        UUID validated_by FK
        DATE validated_at
        DECIMAL effectiveness_score
        DECIMAL adoption_rate
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    experts {
        UUID id PK
        UUID user_id FK UK
        JSON expertise_areas
        INTEGER years_of_experience
        JSON certifications
        JSON publications
        JSON projects
        TEXT bio
        VARCHAR(20) availability_status
        DECIMAL consultation_rate
        DECIMAL rating
        INTEGER review_count
        JSON languages
        VARCHAR(20) preferred_contact_method
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    questions {
        UUID id PK
        VARCHAR(255) title
        TEXT content
        UUID asked_by FK
        VARCHAR(20) category
        JSON tags
        VARCHAR(20) status
        VARCHAR(20) priority
        INTEGER view_count
        INTEGER answer_count
        UUID accepted_answer_id FK
        JSON related_knowledge_ids
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    answers {
        UUID id PK
        UUID question_id FK
        TEXT content
        UUID answered_by FK
        BOOLEAN is_accepted
        INTEGER vote_count
        JSON references
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    learning_paths {
        UUID id PK
        VARCHAR(255) title
        TEXT description
        VARCHAR(100) target_role
        VARCHAR(20) target_level
        INTEGER estimated_duration
        JSON prerequisites
        JSON objectives
        JSON modules
        JSON assessment_criteria
        UUID created_by FK
        JSON endorsed_by
        INTEGER completion_count
        DECIMAL average_rating
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    knowledge_shares {
        UUID id PK
        VARCHAR(255) title
        TEXT description
        VARCHAR(20) type
        UUID presenter_id FK
        TIMESTAMP scheduled_at
        INTEGER duration
        VARCHAR(100) location
        BOOLEAN is_virtual
        TEXT meeting_url
        INTEGER max_participants
        INTEGER registered_count
        INTEGER attended_count
        TEXT recording_url
        JSON materials
        JSON feedback
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    knowledge ||--o{ documents : "has"
    questions ||--o{ answers : "has"
```

## 物理設計

### テーブル作成SQL

#### knowledgeテーブル
```sql
CREATE TABLE knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('Technical', 'Business', 'Process', 'Tool', 'Domain')),
    type VARCHAR(20) NOT NULL CHECK (type IN ('Article', 'FAQ', 'HowTo', 'BestPractice', 'LessonLearned')),
    author_id UUID NOT NULL,
    project_id UUID,
    tags JSON,
    keywords JSON,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Draft', 'Review', 'Published', 'Archived')),
    visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('Public', 'Internal', 'Restricted')),
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    previous_version_id UUID REFERENCES knowledge(id) ON DELETE SET NULL,
    view_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMP,
    expires_at DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_knowledge_status_published CHECK (
        (status = 'Published' AND published_at IS NOT NULL) OR
        (status != 'Published')
    ),
    CONSTRAINT check_knowledge_view_count CHECK (view_count >= 0),
    CONSTRAINT check_knowledge_like_count CHECK (like_count >= 0)
);

CREATE INDEX idx_knowledge_title ON knowledge(title);
CREATE INDEX idx_knowledge_author_id ON knowledge(author_id);
CREATE INDEX idx_knowledge_project_id ON knowledge(project_id);
CREATE INDEX idx_knowledge_category ON knowledge(category);
CREATE INDEX idx_knowledge_type ON knowledge(type);
CREATE INDEX idx_knowledge_status ON knowledge(status);
CREATE INDEX idx_knowledge_published_at ON knowledge(published_at);
CREATE INDEX idx_knowledge_tags ON knowledge USING GIN (tags);
```

#### documentsテーブル
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_id UUID REFERENCES knowledge(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('PDF', 'Word', 'Excel', 'PPT', 'Image', 'Video', 'Other')),
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    checksum VARCHAR(100) NOT NULL,
    uploaded_by UUID NOT NULL,
    access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('Public', 'Internal', 'Confidential')),
    download_count INTEGER NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_document_size CHECK (size > 0),
    CONSTRAINT check_document_download_count CHECK (download_count >= 0)
);

CREATE INDEX idx_documents_knowledge_id ON documents(knowledge_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_file_type ON documents(file_type);
```

#### best_practicesテーブル
```sql
CREATE TABLE best_practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    context TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    benefits JSON NOT NULL,
    implementation TEXT NOT NULL,
    prerequisites JSON,
    limitations JSON,
    alternative_approaches JSON,
    category VARCHAR(20) NOT NULL,
    industry_id UUID,
    project_ids JSON,
    validated_by UUID,
    validated_at DATE,
    effectiveness_score DECIMAL(3, 1),
    adoption_rate DECIMAL(5, 2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_bp_effectiveness CHECK (effectiveness_score IS NULL OR (effectiveness_score >= 1 AND effectiveness_score <= 10)),
    CONSTRAINT check_bp_adoption CHECK (adoption_rate IS NULL OR (adoption_rate >= 0 AND adoption_rate <= 100))
);

CREATE INDEX idx_bp_category ON best_practices(category);
CREATE INDEX idx_bp_industry_id ON best_practices(industry_id);
CREATE INDEX idx_bp_validated_by ON best_practices(validated_by);
CREATE INDEX idx_bp_effectiveness ON best_practices(effectiveness_score DESC);
```

#### expertsテーブル
```sql
CREATE TABLE experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    expertise_areas JSON NOT NULL,
    years_of_experience INTEGER NOT NULL,
    certifications JSON,
    publications JSON,
    projects JSON,
    bio TEXT,
    availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('Available', 'Busy', 'Unavailable')),
    consultation_rate DECIMAL(10, 2),
    rating DECIMAL(3, 2),
    review_count INTEGER NOT NULL DEFAULT 0,
    languages JSON,
    preferred_contact_method VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_expert_experience CHECK (years_of_experience >= 0),
    CONSTRAINT check_expert_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
    CONSTRAINT check_expert_review_count CHECK (review_count >= 0)
);

CREATE INDEX idx_experts_user_id ON experts(user_id);
CREATE INDEX idx_experts_availability ON experts(availability_status);
CREATE INDEX idx_experts_rating ON experts(rating DESC);
CREATE INDEX idx_experts_areas ON experts USING GIN (expertise_areas);
```

#### questionsテーブル
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    asked_by UUID NOT NULL,
    category VARCHAR(20) NOT NULL,
    tags JSON,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Open', 'Answered', 'Closed')),
    priority VARCHAR(20) CHECK (priority IN ('High', 'Medium', 'Low')),
    view_count INTEGER NOT NULL DEFAULT 0,
    answer_count INTEGER NOT NULL DEFAULT 0,
    accepted_answer_id UUID,
    related_knowledge_ids JSON,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_question_view_count CHECK (view_count >= 0),
    CONSTRAINT check_question_answer_count CHECK (answer_count >= 0)
);

CREATE INDEX idx_questions_asked_by ON questions(asked_by);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
```

#### answersテーブル
```sql
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    answered_by UUID NOT NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    vote_count INTEGER NOT NULL DEFAULT 0,
    references JSON,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_answer_vote_count CHECK (vote_count >= 0)
);

CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_answered_by ON answers(answered_by);
CREATE INDEX idx_answers_is_accepted ON answers(is_accepted);
CREATE INDEX idx_answers_vote_count ON answers(vote_count DESC);
```

#### learning_pathsテーブル
```sql
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_role VARCHAR(100),
    target_level VARCHAR(20),
    estimated_duration INTEGER NOT NULL,
    prerequisites JSON,
    objectives JSON NOT NULL,
    modules JSON NOT NULL,
    assessment_criteria JSON,
    created_by UUID NOT NULL,
    endorsed_by JSON,
    completion_count INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3, 2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_lp_duration CHECK (estimated_duration > 0),
    CONSTRAINT check_lp_completion CHECK (completion_count >= 0),
    CONSTRAINT check_lp_rating CHECK (average_rating IS NULL OR (average_rating >= 1 AND average_rating <= 5))
);

CREATE INDEX idx_lp_target_role ON learning_paths(target_role);
CREATE INDEX idx_lp_target_level ON learning_paths(target_level);
CREATE INDEX idx_lp_created_by ON learning_paths(created_by);
CREATE INDEX idx_lp_rating ON learning_paths(average_rating DESC);
```

#### knowledge_sharesテーブル
```sql
CREATE TABLE knowledge_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Presentation', 'Workshop', 'Seminar', 'Discussion')),
    presenter_id UUID NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    location VARCHAR(100),
    is_virtual BOOLEAN NOT NULL DEFAULT FALSE,
    meeting_url TEXT,
    max_participants INTEGER,
    registered_count INTEGER NOT NULL DEFAULT 0,
    attended_count INTEGER,
    recording_url TEXT,
    materials JSON,
    feedback JSON,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_ks_duration CHECK (duration > 0),
    CONSTRAINT check_ks_registered CHECK (registered_count >= 0),
    CONSTRAINT check_ks_attended CHECK (attended_count IS NULL OR attended_count >= 0),
    CONSTRAINT check_ks_max_participants CHECK (max_participants IS NULL OR (max_participants > 0 AND registered_count <= max_participants))
);

CREATE INDEX idx_ks_presenter_id ON knowledge_shares(presenter_id);
CREATE INDEX idx_ks_scheduled_at ON knowledge_shares(scheduled_at);
CREATE INDEX idx_ks_type ON knowledge_shares(type);
```

## パフォーマンス設計

### インデックス戦略
- **ナレッジ検索**: title, category, tags, statusによる複合検索
- **エキスパート検索**: expertise_areas, availability_status, ratingによる検索
- **質問検索**: category, status, created_atによる時系列検索

### 複合インデックス
```sql
CREATE INDEX idx_knowledge_status_published ON knowledge(status, published_at DESC);
CREATE INDEX idx_questions_status_created ON questions(status, created_at DESC);
CREATE INDEX idx_experts_availability_rating ON experts(availability_status, rating DESC);
```

## セキュリティ設計

### アクセス制御
```sql
CREATE ROLE knowledge_reader;
CREATE ROLE knowledge_writer;
CREATE ROLE knowledge_admin;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO knowledge_reader;
GRANT SELECT, INSERT, UPDATE ON knowledge, documents, questions, answers TO knowledge_writer;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO knowledge_admin;
```

### 行レベルセキュリティ
```sql
CREATE POLICY knowledge_visibility_policy ON knowledge
    FOR SELECT
    USING (
        visibility = 'Public' OR
        (visibility = 'Internal' AND current_user_organization_id() IS NOT NULL) OR
        (visibility = 'Restricted' AND author_id = current_user_id())
    );
```

## 運用設計

### バックアップ戦略
- **フルバックアップ**: 日次
- **差分バックアップ**: 6時間毎
- **保管期間**: 90日
- **リストアテスト**: 週次

### 監視項目
- テーブルサイズ: knowledge(100万件), questions(50万件)
- クエリレスポンス時間: 検索50ms以下
- ストレージ使用量: documents用ストレージ監視

### データアーカイブ
```sql
-- 1年以上前のアーカイブ済みナレッジを移動
INSERT INTO knowledge_archive
SELECT * FROM knowledge
WHERE status = 'Archived' AND updated_at < NOW() - INTERVAL '1 year';
```
