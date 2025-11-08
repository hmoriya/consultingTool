# UC-020: スキルギャップ特定

## 概要
タスク要件とチームスキルのギャップを特定し、トレーニングや外部リソース活用を提案。

## インターフェース定義
```typescript
interface SkillGap {
  requiredSkills: string[];
  availableSkills: string[];
  gaps: SkillDeficiency[];
  trainingRecommendations: TrainingPlan[];
}
```

## 更新履歴
| バージョン | 更新日 | 更新者 | 更新内容 |
|-----------|--------|---------|----------|
| 1.0 | 2024-11-05 | Claude Code | 初版作成 |