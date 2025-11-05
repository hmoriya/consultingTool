# API経由での設計MDポスト方法

## API経由での設計MDポスト

設計MDを作成したら、以下のAPIエンドポイントにPUTリクエストを送信します：

### ドメイン言語定義の更新

```bash
# エンドポイント
PUT /api/parasol/services/{serviceId}/domain-language

# リクエストボディ
{
  "content": "<domain-language.mdの内容>"
}
```

**curlコマンド例**:
```bash
curl -X PUT http://localhost:3000/api/parasol/services/secure-access-service/domain-language \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "content": "# セキュアアクセスサービス ドメイン言語定義\n\n..."
}
EOF
```

### DB設計の更新

```bash
# エンドポイント
PUT /api/parasol/services/{serviceId}/database-design

# リクエストボディ
{
  "content": "<database-design.mdの内容>"
}
```

**curlコマンド例**:
```bash
curl -X PUT http://localhost:3000/api/parasol/services/secure-access-service/database-design \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "content": "# セキュアアクセスサービス データベース設計書\n\n..."
}
EOF
```

### API仕様の更新

```bash
# エンドポイント
PUT /api/parasol/services/{serviceId}/api-specification

# リクエストボディ
{
  "content": "<api-specification.mdの内容>"
}
```

### 統合仕様の更新

```bash
# エンドポイント
PUT /api/parasol/services/{serviceId}/integration-specification

# リクエストボディ
{
  "content": "<integration-specification.mdの内容>"
}
```

## Node.jsスクリプトでの一括更新

複数の設計MDを一度に更新する場合は、Node.jsスクリプトを使用します：

```javascript
const fs = require('fs');
const http = require('http');

function updateDesign(serviceSlug, type, filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const data = JSON.stringify({ content });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/parasol/services/${serviceSlug}/${type}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
      console.log(`✅ ${type} updated:`, res.statusCode);
    });
  });

  req.on('error', (e) => {
    console.error(`❌ ${type} error:`, e.message);
  });

  req.write(data);
  req.end();
}

// 使用例
updateDesign(
  'secure-access-service',
  'database-design',
  'docs/parasol/services/secure-access-service/database-design.md'
);
```

## 動作確認手順

設計MDをAPIでポストした後は、必ず以下の手順で動作確認を行います：

1. **ブラウザでパラソルページを開く**
   ```
   http://localhost:3000/parasol
   ```

2. **対象サービスを選択**
   - サービス一覧から更新したサービス（例: セキュアアクセスサービス）を選択

3. **各タブで表示を確認**
   - **ドメイン言語タブ**: クラス図が正しく表示されるか
   - **DB設計タブ**: ER図が正しく表示されるか
   - **API仕様タブ**: API定義が正しく表示されるか

4. **Mermaid描画エラーの確認**
   - ブラウザのコンソールを開き、Mermaidエラーがないか確認
   - エラーがある場合は、設計MDのフォーマットを修正

5. **再度APIでポスト**
   - 修正した設計MDを再度APIでポスト
   - ブラウザをリロードして確認

## トラブルシューティング

### Mermaid描画エラーが発生する場合

1. **既存Mermaidブロックの確認**
   - Markdownに既にMermaid ER図が存在するか確認
   - 存在する場合は、そのフォーマットが正しいか確認

2. **型名の確認**
   - Mermaid ER図では型名は小文字（例: `string`, `uuid`）
   - 大文字（`STRING`, `UUID`）はエラーの原因になる

3. **リレーションシップの構文確認**
   - 正: `User }o--|| Organization : "belongs to"`
   - 誤: `User ||--o{ Organization : "has many" ||--o{ User : "references"`（連続したリレーション）

### APIリクエストが失敗する場合

1. **サーバーが起動しているか確認**
   ```bash
   npm run dev
   ```

2. **serviceIdが正しいか確認**
   - データベース内のサービスslugと一致しているか
   - 例: `secure-access-service`（ハイフン区切り）

3. **JSONフォーマットの確認**
   - `content`フィールドに正しくMarkdownが格納されているか
   - 改行コードが適切にエスケープされているか