# Issue #102: パラソル設計の詳細ケーパビリティ・オペレーション構造化

## 概要
4つのサービス（project-success-service、revenue-optimization-service、talent-optimization-service、secure-access-service）の詳細なケーパビリティとオペレーション設計を、パラソルAPIが認識できるディレクトリ構造に配置する。

## 背景
- 各サービスの詳細設計が`capabilities-and-operations.md`という単一ファイルにまとまっている
- APIインポートには以下の構造が必要：
  ```
  services/{service-name}/
    ├── service.md
    ├── capabilities/
    │   └── {capability-name}/
    │       ├── capability.md
    │       └── operations/
    │           └── {operation-name}/
    │               ├── operation.md
    │               ├── pages/
    │               └── tests/
  ```

## 対象サービスと規模

### 1. project-success-service
- **4ケーパビリティ**：
  1. プロジェクトを計画し実行する能力 (3オペレーション)
  2. タスクを管理し完遂する能力 (3オペレーション)
  3. リスクを予見し対処する能力 (3オペレーション)
  4. 成果物を管理し品質を保証する能力 (3オペレーション)
- **合計**: 12オペレーション、48ユースケース

### 2. revenue-optimization-service
- **4ケーパビリティ**：
  1. 収益を認識し最大化する能力 (3オペレーション)
  2. コストを統制し最適化する能力 (3オペレーション)
  3. 予算を策定し統制する能力 (3オペレーション)
  4. 収益性を分析し改善する能力 (3オペレーション)
- **合計**: 12オペレーション

### 3. talent-optimization-service
- **4ケーパビリティ**：
  1. メンバーを管理し育成する能力 (3オペレーション)
  2. チームを編成し最適化する能力 (3オペレーション)
  3. スキルを可視化し開発する能力 (3オペレーション)
  4. リソースを最適に配分する能力 (3オペレーション)
- **合計**: 12オペレーション

### 4. secure-access-service
- **4ケーパビリティ**：
  1. ユーザーを認証し管理する能力 (3オペレーション)
  2. アクセス権限を制御する能力 (3オペレーション)
  3. 組織構造を管理する能力 (3オペレーション)
  4. セキュリティを監査し保証する能力 (3オペレーション)
- **合計**: 12オペレーション

## 作業タスク

### Phase 1: ディレクトリ構造作成
- [x] project-success-service: 4ケーパビリティ × 3オペレーション × pages/tests（完了）
- [x] revenue-optimization-service: 4ケーパビリティ × 3オペレーション × pages/tests（完了）
- [ ] talent-optimization-service: 4ケーパビリティ × 3オペレーション × pages/tests
- [ ] secure-access-service: 4ケーパビリティ × 3オペレーション × pages/tests

### Phase 2: ケーパビリティファイル作成（4サービス × 4ケーパビリティ = 16ファイル）
- [x] project-success-service: 4 capability.md（完了）
- [x] revenue-optimization-service: 4 capability.md（完了）
- [ ] talent-optimization-service: 4 capability.md
- [ ] secure-access-service: 4 capability.md

### Phase 3: オペレーションファイル作成（4サービス × 12オペレーション = 48ファイル）
- [x] project-success-service: 12 operation.md（完了）
- [ ] revenue-optimization-service: 1/12 operation.md（残り11ファイル）
  - [x] 1-1: 収益を認識し計上する
  - [ ] 1-2: 請求書を発行し入金を管理する
  - [ ] 1-3: 収益を予測し機会を最大化する
  - [ ] 2-1: コストを記録し分類する
  - [ ] 2-2: コストトレンドを分析する
  - [ ] 2-3: コストを配分し最適化する
  - [ ] 3-1: 予算を策定する
  - [ ] 3-2: 予算を承認し確定する
  - [ ] 3-3: 予算を監視し統制する
  - [ ] 4-1: 収益性を計算する
  - [ ] 4-2: 収益性トレンドを分析する
  - [ ] 4-3: 改善アクションを提案する
- [ ] talent-optimization-service: 12 operation.md
  - [ ] 1-1: メンバー情報を登録する
  - [ ] 1-2: スキルを評価し育成する
  - [ ] 1-3: キャリアパスを設計する
  - [ ] 2-1: チームを編成する
  - [ ] 2-2: チームパフォーマンスを最適化する
  - [ ] 2-3: チームコラボレーションを促進する
  - [ ] 3-1: スキルマトリクスを作成する
  - [ ] 3-2: スキルギャップを分析する
  - [ ] 3-3: スキル開発計画を実行する
  - [ ] 4-1: リソース需要を予測する
  - [ ] 4-2: リソースを配分する
  - [ ] 4-3: リソース稼働を最適化する
- [ ] secure-access-service: 12 operation.md
  - [ ] 1-1: ユーザーを登録する
  - [ ] 1-2: 認証を実行する
  - [ ] 1-3: セッションを管理する
  - [ ] 2-1: ロールを定義する
  - [ ] 2-2: 権限を割り当てる
  - [ ] 2-3: アクセスを制御する
  - [ ] 3-1: 組織構造を定義する
  - [ ] 3-2: 組織階層を管理する
  - [ ] 3-3: 組織変更を適用する
  - [ ] 4-1: アクセスログを記録する
  - [ ] 4-2: セキュリティ監査を実施する
  - [ ] 4-3: 異常アクセスを検知する

### Phase 4: APIインポート
- [x] project-success-serviceをインポート（完了：4ケーパビリティ、12オペレーション）
- [ ] revenue-optimization-serviceをインポート
- [ ] talent-optimization-serviceをインポート
- [ ] secure-access-serviceをインポート

### Phase 5: 検証
- [x] project-success-service: インポート結果確認（12オペレーション登録済み）
- [ ] revenue-optimization-service: インポート結果確認
- [ ] talent-optimization-service: インポート結果確認
- [ ] secure-access-service: インポート結果確認
- [ ] ドメイン言語との整合性確認（全サービス完了後）

## 現在の進捗

### 完了（2025-09-30時点）
- ✅ project-success-service: 100%完了
  - ディレクトリ構造: 4ケーパビリティ × 12オペレーション
  - capability.md: 4ファイル
  - operation.md: 12ファイル
  - APIインポート: 成功
- ✅ データベース重複削除とCLAUDE.md更新
- ✅ .envと.env.exampleの接続文字列修正

### 進行中
- ⏳ revenue-optimization-service: 約40%完了
  - ディレクトリ構造: 完了
  - capability.md: 4ファイル完了
  - operation.md: 1/12ファイル完了（残り11ファイル）

### 残作業
- ⏳ revenue-optimization-service: 残り11 operation.md + APIインポート
- ⏳ talent-optimization-service: ディレクトリ + 4 capability.md + 12 operation.md + APIインポート
- ⏳ secure-access-service: ディレクトリ + 4 capability.md + 12 operation.md + APIインポート

## 残り作業量
- **ファイル数**: 43ファイル（11 + 16 + 16）
- **推定時間**: 約5-6時間

## 推定作業時間
- ディレクトリ構造作成: 30分
- ケーパビリティファイル作成: 2時間（16ファイル）
- オペレーションファイル作成: 4時間（48ファイル）
- APIインポートと検証: 1時間
- **合計**: 約7-8時間

## 成果物
- 4サービス × 4ケーパビリティ × 3オペレーション = 48個のoperation.mdファイル
- 16個のcapability.mdファイル
- APIインポート済みの48オペレーション

## 参照ファイル
- `/docs/parasol/services/project-success-service/capabilities-and-operations.md`
- `/docs/parasol/services/revenue-optimization-service/capabilities-and-operations.md`
- `/docs/parasol/services/talent-optimization-service/capabilities-and-operations.md`
- `/docs/parasol/services/secure-access-service/capabilities-and-operations.md`

## 実装方針
1. 既存の`capabilities-and-operations.md`から情報を抽出
2. 各オペレーションの情報を個別のoperation.mdに分割
3. 各ケーパビリティの情報をcapability.mdにまとめる
4. プロセスフロー（Mermaid図）、KPI、ビジネスルールなど全情報を保持
5. 1サービスずつ完成させてAPIインポートで確認

## 備考
- 既存の簡易ケーパビリティ（project-leadership等）は削除または置換
- ディレクトリ名は英語ケバブケース（例：plan-and-execute-project）
- ファイル内の表示名は日本語を使用