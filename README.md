# Healing Agent 検証アプリ (healing-agent-verify)

UiPath **Healing Agent** の動作検証用に作られた、ログイン不要の UiPath Coded Web App です。
Healing Agent 検証で使われている4つの単体テストページを1つのアプリに統合し、画面上部のナビゲーションまたは URL パラメータでシナリオを切り替えられます。

- **公開URL:** https://uijpnlabs-test.staging.uipath.host/healing-agent-verify
- ログイン・認証は不要です（`@uipath/uipath-typescript` SDK / OAuth は組み込んでいません）。

## シナリオ一覧

| # | シナリオ | 内容 |
|---|---|---|
| 1 | **Semantic** | ページ読み込みごとにA面（縦並び・ライト）/B面（横並び・ダーク）がランダムに切り替わる。B面の電話番号フィールドは aaname / placeholder が大きく変更されており、Fuzzy Search では救えず、Computer Vision（現在は Semantic）による Healing を検証します。 |
| 2 | **Fuzzy Match Label** | 送信ボタンのラベルが「登録」（変更前）から「記録」（変更後）に変わるケースを、画面内トグルまたはURLパラメータで再現。Fuzzy Match Label Healing を検証します。 |
| 3 | **60秒タイムアウト** | ページを開くと60秒間ローディング画面が表示されたあとにフォームが現れる。自動化のデフォルトタイムアウトを誘発し、Healing Agent による復旧を検証します。 |
| 4 | **ポップアップ** | ページを開くと「バージョンアップのお知らせ」ポップアップが表示される。Healing Agent がポップアップを自動的に検知して閉じるケースを検証します。 |

各シナリオのフォーム項目（id / label / placeholder）は元の検証用HTMLページと同一の値を保持しています。テスト対象の自動化（Coded Apps / RPA）を作成・検証する際の基準として使用できます。

## 使い方

### 画面から選ぶ

トップページのカード、または上部ナビゲーションのボタンからシナリオを選択します。

- **再読み込み**ボタン：表示中のシナリオを再マウントします。「Semantic」ではA面/B面を再抽選、「60秒タイムアウト」ではローディング時間をリセット、「ポップアップ」ではポップアップを再度表示します。
- **一覧へ**ボタン：トップページに戻ります。
- 右上のテーマ切り替えボタンは、アプリ全体の見た目（ライト/ダーク）を切り替えるもので、各シナリオ自体のA面/B面とは無関係です。

### URLパラメータで直接開く

`?appName=<値>` を付けると、対象シナリオを直接開いた状態でページを表示できます。シナリオを切り替えるとURLの `appName` も自動的に更新されるため、URLをブックマークや共有できます。

| シナリオ | 推奨値 | 受理する別表記 |
|---|---|---|
| Semantic | `Semantic` | `TargetDefinitionChange`, `TDC` |
| Fuzzy Match Label | `FuzzyMatchLabel` | `FuzzyMathLabel`, `FML` |
| 60秒タイムアウト | `Timeout60Sec` | `Timeout`, `60SecTimeout`, `Timeout60s` |
| ポップアップ | `Popup` | `PopupHealing` |

例:

https://uijpnlabs-test.staging.uipath.host/healing-agent-verify?appName=Semantic  

https://uijpnlabs-test.staging.uipath.host/healing-agent-verify?appName=FuzzyMatchLabel&label=pre  
https://uijpnlabs-test.staging.uipath.host/healing-agent-verify?appName=FuzzyMatchLabel&label=post  

https://uijpnlabs-test.staging.uipath.host/healing-agent-verify?appName=Timeout60Sec  

https://uijpnlabs-test.staging.uipath.host/healing-agent-verify?appName=Popup  


値の大文字・小文字、記号の有無は区別されません（`fuzzy-match-label` でも `FuzzyMatchLabel` と同じ扱いになります）。

#### Fuzzy Match Label の変更前/変更後を直接指定する

`appName=FuzzyMatchLabel` と併せて `label=<値>` を指定すると、送信ボタンの状態（登録/記録）も直接指定できます。

| 状態 | 推奨値 | 受理する別表記 |
|---|---|---|
| 変更前（ボタン表示: 登録） | `pre` | `before`, `登録` |
| 変更後（ボタン表示: 記録） | `post` | `after`, `記録` |

例:

```
https://uijpnlabs-test.staging.uipath.host/healing-agent-verify?appName=FuzzyMatchLabel&label=post
```

画面内のトグル（変更前/変更後ボタン）で切り替えた場合も、URLの `label` パラメータが自動的に更新されます。

## ローカルでの開発・動作確認

```bash
npm install
npm run dev
```

`http://localhost:5173` を開くとローカルで動作確認できます（ログイン不要）。ビルドの検証は以下で行います。

```bash
npm run build
```

## デプロイ（UiPath Coded Web App）

このアプリは `uip codedapp` CLI で Automation Cloud にデプロイされています。バージョンを更新して再デプロイする場合は以下の手順です。

```bash
# 1. ビルド
npm run build

# 2. パッケージング（バージョンを上げる）
uip codedapp pack dist -n healing-agent-verify --version <new-version>

# 3. 公開
uip codedapp publish -n healing-agent-verify --version <new-version> \
  --tenant-id "<TENANT_ID>" \
  --org-name "<ORG_NAME>"

# 4. デプロイ（既存アプリはアップグレードされ、URLは変わりません）
uip codedapp deploy -n healing-agent-verify \
  --folder-key "<FOLDER_KEY>" \
  --tenant-id "<TENANT_ID>" \
  --org-name "<ORG_NAME>"
```

> **注意**: 上記の `<TENANT_ID>`、`<ORG_NAME>`、`<FOLDER_KEY>` は環境固有の値です。実際のデプロイ時は、これらの値を置き換えてください。これらは機密情報であるため、コミット履歴には保存しないでください。

- `--tenant-id` は `uip codedapp publish` / `deploy` が要求する値です。テナント名からGUIDを調べる場合は次のコマンドを使います。

  ```bash
  uip admin tenants list --output json
  ```

## 実装メモ

- Vite + React + TypeScript + Tailwind CSS v4 + `@uipath/apollo-wind`（UiPath Apollo Vertex デザインシステム、ダークモード切替つき）で構築。
- ログイン不要の要件のため、`@uipath/uipath-typescript` SDK・OAuth（`uipath.json` の SDK 設定）は使用していません。`uip codedapp pack` が自動生成する `uipath.json` ファイルのみが含まれます。
- 各シナリオは `src/scenarios/` 配下に1ファイルずつ実装されており、元の検証用HTMLページのHTML構造・CSS・JavaScriptロジックを忠実に移植しています。
- `vite.config.ts` は `base: './'` を設定しています（UiPathプラットフォームがURLルーティングを行うため、相対パスが必須）。
- セキュリティ対策として、シナリオのスタイルを外部CSS（`src/scenarios/scenarios.css`）に分離し、インラインスタイルを排除しています。
- ポップアップ／60秒タイムアウト画面のロゴは、単色（黒）版のUiPathロゴを `src/assets/uipath-logo-mono.svg` としてバンドルし、外部URLへの依存なしで表示しています。
- URLパラメータのバリデーション機能を実装し、入力値のサイズ制限（50文字）を設けています。
- Content Security Policy（CSP）メタタグを `index.html` に設定し、XSS攻撃を軽減しています。
