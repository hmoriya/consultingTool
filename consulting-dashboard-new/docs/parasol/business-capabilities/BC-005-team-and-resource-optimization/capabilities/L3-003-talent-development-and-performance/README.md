# L3-003: Talent Development & Performance

**作成日**: 2025-10-31
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: manage-and-develop-members

---

## 📋 What: この能力の定義

### 能力の概要
人材を育成しパフォーマンスを向上させる能力。メンバー管理、パフォーマンス評価、キャリア開発を通じて、組織の人的資本を最大化します。

### 実現できること
- メンバー情報の一元管理
- 定期的なパフォーマンス評価
- キャリア開発計画の策定
- フィードバックと育成支援
- 後継者計画の策定

### 必要な知識
- 人材育成手法
- パフォーマンス管理フレームワーク
- キャリア開発理論
- フィードバック技法
- タレントマネジメント

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: TalentAggregate ([../../domain/README.md](../../domain/README.md#talent-aggregate))
- **Entities**: Member, PerformanceReview, CareerPlan, DevelopmentGoal
- **Value Objects**: PerformanceRating, CareerStage, DevelopmentStatus

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/members - メンバー登録
  - POST /api/performance/reviews - 評価実施
  - POST /api/careers/plans - キャリア計画

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: members, performance_reviews, career_plans, development_goals

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **パフォーマンス評価**: 多基準意思決定分析（MCDA: Multi-Criteria Decision Analysis）
- **キャリアパス推薦**: 協調フィルタリング + コンテンツベースフィルタリング
- **目標達成度計算**: OKR（Objectives and Key Results）フレームワーク
- **デザインパターン**:
  - Template Method Pattern（評価プロセスのテンプレート化）
  - State Pattern（キャリアステージの状態管理）
  - Observer Pattern（目標達成度変更の通知）

#### 推奨ライブラリ・フレームワーク
- **評価分析**: [Apache Commons Math](https://commons.apache.org/proper/commons-math/) - 統計分析
- **レポート生成**: [pdfmake](https://github.com/bpampuch/pdfmake) - パフォーマンスレポートPDF生成
- **可視化**: [Chart.js](https://www.chartjs.org/) - パフォーマンス推移グラフ、スキルレーダーチャート
- **OKR管理**: カスタムOKRエンジン（目標ツリー管理）

### パフォーマンス考慮事項

#### スケーラビリティ
- **評価計算**: 10,000メンバー の一括評価を30分以内
- **キャリア推薦**: 1,000職種 × 100スキルパターン のマッチングを10秒以内
- **レポート生成**: 100ページのパフォーマンスレポートを60秒以内

#### キャッシュ戦略
- **メンバー情報**: Redis cache（TTL: 30分、メンバー更新時に無効化）
- **パフォーマンス履歴**: Redis cache（TTL: 1時間、新規評価時に追加更新）
- **キャリアパス**: Redis cache（TTL: 1日、組織変更時に無効化）

#### 最適化ポイント
- **バッチ評価**: 評価期間終了時に一括計算
- **インデックス活用**: `performance_reviews(member_id, review_date)`, `career_plans(member_id, status)`
- **パーティション**: performance_reviewsを年度別にパーティション分割

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-003: Access Control & Security** - ユーザー情報、評価権限
  - 使用API: `GET /api/bc-003/users/{userId}` - ユーザー詳細
  - 使用API: `POST /api/bc-003/authorize` - 評価実施権限チェック
- **BC-004: Organizational Structure & Governance** - 組織階層、上司関係
  - 使用API: `GET /api/bc-004/organization-units/{unitId}/manager` - 直属上司
- **BC-005-L3-001: Resource Planning & Allocation** - 稼働実績データ
  - 使用API: `GET /api/bc-005/resources/{resourceId}/utilization` - 稼働率
- **BC-006: Knowledge Management & Learning** - 学習履歴、研修受講状況
  - 使用API: `GET /api/bc-006/learning/{userId}/history` - 学習履歴

#### 提供API（他BCから利用）
- **BC-001, BC-005-L3-002**: パフォーマンス情報を提供
  - `GET /api/bc-005/members/{memberId}/performance` - 個人パフォーマンス
  - `GET /api/bc-005/members/{memberId}/career-plan` - キャリア計画
  - `GET /api/bc-005/teams/{teamId}/performance-summary` - チーム別パフォーマンス

### データ整合性要件

#### トランザクション境界
- **評価実施**: PerformanceReview + DevelopmentGoal 更新を1トランザクションで実行
- **キャリア計画策定**: CareerPlan + DevelopmentGoal を原子的に作成
- **整合性レベル**: 強整合性（ACID準拠）

#### データ制約
- 評価期間の重複禁止（1メンバー1期間につき1評価）
- 評価確定後の変更禁止（status = 'finalized'）
- キャリア計画の目標期限は現在日時より未来
- パフォーマンススコアは0.0-5.0の範囲

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003認証機能）
- **必要権限**:
  - 評価実施: `performance:review:create`（上司・評価者のみ）
  - 自己評価: `performance:self-review:create`（本人のみ）
  - キャリア計画作成: `career:plan:create`（本人・上司・HR）

#### データ保護
- **機密度**: パフォーマンス評価はConfidential（最高機密）
- **監査ログ**: 全ての評価実施・キャリア計画変更を記録
- **アクセス制御**:
  - 本人: 自分の評価・キャリア計画のみ閲覧可能
  - 上司: 直属部下の評価・キャリア計画を閲覧・編集可能
  - HR: 全メンバーの評価・キャリア計画を閲覧可能

### スケーラビリティ制約

#### 最大同時処理
- **評価作成**: 100リクエスト/秒
- **評価検索**: 500リクエスト/秒（キャッシュ活用）
- **レポート生成**: 10リクエスト/秒（重い処理）

#### データ量上限
- **アクティブメンバー数**: 10,000メンバー
- **評価レコード**: 200,000件/年（半期評価×2回）
- **キャリア計画**: 50,000件（アクティブプラン）

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Talent Aggregate** ([../../domain/README.md#talent-aggregate](../../domain/README.md#talent-aggregate))
  - Member（集約ルート）: メンバーライフサイクル管理
  - PerformanceReview: パフォーマンス評価
  - CareerPlan: キャリア計画
  - DevelopmentGoal: 育成目標

#### Value Objects
- **PerformanceRating**: 評価レーティング（1-5段階）
- **CareerStage**: キャリアステージ（Junior/Middle/Senior/Expert）
- **DevelopmentStatus**: 育成状況（Not Started/In Progress/Completed）

### 呼び出すAPI例

#### メンバー登録
```http
POST /api/v1/bc-005/members
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user-uuid",
  "employeeId": "EMP-2025-001",
  "joinDate": "2025-01-15",
  "currentRole": "Software Engineer",
  "department": "Engineering",
  "careerStage": "middle"
}

Response:
{
  "memberId": "member-uuid",
  "userId": "user-uuid",
  "employeeId": "EMP-2025-001",
  "careerStage": "middle",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### パフォーマンス評価実施
```http
POST /api/v1/bc-005/performance/reviews
Content-Type: application/json

{
  "memberId": "member-uuid",
  "reviewPeriod": {
    "startDate": "2025-04-01",
    "endDate": "2025-09-30"
  },
  "reviewType": "semi_annual",
  "reviewerId": "manager-uuid",
  "ratings": {
    "technicalSkills": 4.5,
    "communication": 4.0,
    "leadership": 3.5,
    "problemSolving": 4.5,
    "teamwork": 4.0
  },
  "overallRating": 4.1,
  "strengths": "優れた技術力と問題解決能力",
  "areasForImprovement": "リーダーシップスキルの向上",
  "comments": "チームの技術的リーダーとして活躍"
}

Response:
{
  "reviewId": "review-uuid",
  "memberId": "member-uuid",
  "reviewPeriod": {
    "startDate": "2025-04-01",
    "endDate": "2025-09-30"
  },
  "overallRating": 4.1,
  "status": "draft",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### キャリア計画策定
```http
POST /api/v1/bc-005/careers/plans
Content-Type: application/json

{
  "memberId": "member-uuid",
  "targetRole": "Senior Software Engineer",
  "targetDate": "2026-04-01",
  "currentCareerStage": "middle",
  "targetCareerStage": "senior",
  "developmentGoals": [
    {
      "goalType": "skill_development",
      "description": "リーダーシップスキル向上",
      "targetDate": "2025-12-31",
      "metrics": "チームリード経験3回以上"
    },
    {
      "goalType": "certification",
      "description": "AWS認定ソリューションアーキテクト取得",
      "targetDate": "2025-08-31",
      "metrics": "認定試験合格"
    }
  ]
}

Response:
{
  "careerPlanId": "plan-uuid",
  "memberId": "member-uuid",
  "targetRole": "Senior Software Engineer",
  "targetDate": "2026-04-01",
  "goalCount": 2,
  "status": "active",
  "createdAt": "2025-11-03T10:00:00Z"
}
```

#### パフォーマンス履歴取得
```http
GET /api/v1/bc-005/members/{memberId}/performance-history?startDate=2024-01-01&endDate=2025-10-31

Response:
{
  "memberId": "member-uuid",
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2025-10-31"
  },
  "reviews": [
    {
      "reviewId": "review-uuid-1",
      "reviewPeriod": "2025-04-01 - 2025-09-30",
      "overallRating": 4.1,
      "reviewDate": "2025-10-15"
    },
    {
      "reviewId": "review-uuid-2",
      "reviewPeriod": "2024-10-01 - 2025-03-31",
      "overallRating": 3.8,
      "reviewDate": "2025-04-15"
    }
  ],
  "ratingTrend": {
    "direction": "improving",
    "averageRating": 3.95,
    "latestRating": 4.1
  }
}
```

#### フィードバック記録
```http
POST /api/v1/bc-005/members/{memberId}/feedback
Content-Type: application/json

{
  "feedbackType": "continuous",
  "providedBy": "manager-uuid",
  "category": "technical_excellence",
  "content": "先週のコードレビューでの洞察力に感謝します",
  "visibility": "private"
}

Response:
{
  "feedbackId": "feedback-uuid",
  "memberId": "member-uuid",
  "providedBy": "manager-uuid",
  "providedAt": "2025-11-03T10:00:00Z",
  "status": "delivered"
}
```

### データアクセスパターン

#### 読み取り
- **members テーブル**:
  - インデックス: `idx_members_user_id`（ユーザー別メンバー）
  - インデックス: `idx_members_employee_id`（社員番号検索）
- **performance_reviews テーブル**:
  - インデックス: `idx_performance_member_id_date`（メンバー別評価履歴）
  - インデックス: `idx_performance_reviewer_id`（評価者別レビュー）
  - パーティション: 年度別パーティション
- **career_plans テーブル**:
  - インデックス: `idx_career_member_id_status`（メンバー別アクティブプラン）

#### 書き込み
- **評価実施トランザクション**:
  ```sql
  BEGIN;
  INSERT INTO performance_reviews (...) VALUES (...);
  UPDATE development_goals SET progress = ?, updated_at = NOW() WHERE member_id = ?;
  INSERT INTO notifications (user_id, type, content) VALUES (?, 'performance_review_completed', '評価が完了しました');
  COMMIT;
  ```
- **キャリア計画策定トランザクション**:
  ```sql
  BEGIN;
  INSERT INTO career_plans (...) VALUES (...);
  INSERT INTO development_goals (...) VALUES (...), (...);
  UPDATE members SET career_stage = ?, updated_at = NOW() WHERE id = ?;
  COMMIT;
  ```

#### キャッシュアクセス
- **メンバー情報キャッシュ**:
  ```
  Key: `member:{memberId}:profile`
  Value: JSON（基本情報 + キャリアステージ）
  TTL: 1800秒（30分）
  ```
- **パフォーマンス履歴キャッシュ**:
  ```
  Key: `member:{memberId}:performance:history`
  Value: JSON配列（過去の評価データ）
  TTL: 3600秒（1時間）
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: メンバーを登録・管理する | 基本情報の管理 | 2-3個 | register-and-manage-members |
| **OP-002**: パフォーマンスを評価する | 定期評価の実施 | 2-3個 | evaluate-performance |
| **OP-003**: キャリアを開発・支援する | キャリアパス策定 | 2-3個 | develop-and-support-career |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6-9個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/manage-and-develop-members/](../../../../services/talent-optimization-service/capabilities/manage-and-develop-members/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-003 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
