import { useEffect, useRef, useState } from 'react'

/**
 * Port of HealingAgent_60秒ローディング.html — a 60 second loading screen
 * gates the delivery-note form. Healing Agent is expected to recover from
 * the automation's default timeout while this spinner is still showing.
 */
interface ProductRow {
  key: number
}

interface ListRow {
  date: string
  customer: string
  address: string
  warehouse: string
}

let rowKeySeq = 1

export function TimeoutHealingScenario() {
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [rows, setRows] = useState<ProductRow[]>([{ key: rowKeySeq++ }])
  const [listRows, setListRows] = useState<ListRow[]>([])
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    timerRef.current = window.setTimeout(() => setLoading(false), 60000)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const addRow = () => setRows((r) => [...r, { key: rowKeySeq++ }])
  const deleteRow = (key: number) => setRows((r) => r.filter((row) => row.key !== key))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const next: ListRow[] = []
    for (let i = 1; i <= 20; i++) {
      const d = i < 10 ? `0${i}` : `${i}`
      next.push({
        date: `2024/11/${d}`,
        customer: `得意先 ${i}`,
        address: `東京都中央区${i}-${i}-${i}`,
        warehouse: `倉庫 ${i}`,
      })
    }
    setListRows(next)
  }

  return (
    <div className="timeout-scope">
      <style>{`
        .timeout-scope {
          font-family: Arial, sans-serif; margin: 0; padding: 0;
          background: linear-gradient(135deg, #2b2b2b, #1e1e1e); color: #333;
          min-height: 600px;
        }
        .timeout-scope .header { text-align: center; padding: 20px; }
        .timeout-scope .header img { width: 150px; height: auto; margin-bottom: 10px; }
        .timeout-scope .header h1 { color: white; font-size: 24px; }
        .timeout-scope .form-container, .timeout-scope .list-container {
          width: 100%; max-width: 800px; background: white; margin: 40px auto;
          padding: 20px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          opacity: 1; transform: scale(1); transition: opacity 1s ease, transform 1s ease;
        }
        .timeout-scope .form-group { margin-bottom: 20px; }
        .timeout-scope label { display: block; font-weight: bold; margin-bottom: 5px; }
        .timeout-scope input, .timeout-scope select {
          width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc;
          border-radius: 4px; box-sizing: border-box;
        }
        .timeout-scope input:focus, .timeout-scope select:focus { border-color: #007BFF; outline: none; }
        .timeout-scope .table-container { margin-top: 20px; overflow-x: auto; }
        .timeout-scope table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .timeout-scope th, .timeout-scope td {
          border: 1px solid #ccc; padding: 10px; text-align: left;
          vertical-align: middle; box-sizing: border-box;
        }
        .timeout-scope th { background-color: #f2f2f2; }
        .timeout-scope .btn-add {
          display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF;
          border: none; border-radius: 4px; cursor: pointer; text-decoration: none; margin-top: 10px;
        }
        .timeout-scope .btn-add:hover { background-color: #0056b3; }
        .timeout-scope .form-footer { text-align: right; }
        .timeout-scope .btn-submit {
          display: inline-block; padding: 12px 24px; color: white; background-color: #28a745;
          border: none; border-radius: 4px; cursor: pointer; font-size: 16px;
        }
        .timeout-scope .btn-submit:hover { background-color: #218838; }
        .timeout-scope .delete-row-btn { color: red; cursor: pointer; }
        .timeout-scope .delete-row-btn:hover { text-decoration: underline; }
        .timeout-scope .completion-message {
          text-align: center; font-size: 24px; font-weight: bold; color: #28a745; margin-bottom: 20px;
        }
        .timeout-scope .loading-screen {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column;
          justify-content: center; align-items: center; z-index: 1000; color: white; text-align: center;
        }
        .timeout-scope .loading-spinner {
          border: 8px solid #f3f3f3; border-top: 8px solid #007BFF; border-radius: 50%;
          width: 60px; height: 60px; animation: timeout-spin 1s linear infinite; margin-bottom: 10px;
        }
        .timeout-scope .loading-text { font-size: 18px; }
        @keyframes timeout-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {loading && (
        <div className="loading-screen" id="loading-screen">
          <div className="loading-spinner"></div>
          <div className="loading-text">ローディング中</div>
        </div>
      )}

      <div className="header">
        <img src="https://upload.wikimedia.org/wikipedia/en/8/80/UiPath_2019_Corporate_Logo.png" alt="会社のロゴ" />
        <h1>納品書登録</h1>
      </div>

      {!loading && !submitted && (
        <div className="form-container show" id="form-section">
          <form id="deliveryForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="納品日">納品日</label>
              <input type="date" id="納品日" name="納品日" required />
            </div>
            <div className="form-group">
              <label htmlFor="得意先">得意先</label>
              <input type="text" id="得意先" name="得意先" placeholder="株式会社サンプル" />
            </div>
            <div className="form-group">
              <label htmlFor="届け先">届け先</label>
              <input type="text" id="届け先" name="届け先" placeholder="東京都中央区1-1-1" />
            </div>
            <div className="form-group">
              <label htmlFor="倉庫">倉庫</label>
              <input type="text" id="倉庫" name="倉庫" placeholder="第一倉庫" />
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>商品コード</th>
                    <th>入数</th>
                    <th>入数単位</th>
                    <th>売上数</th>
                    <th>単位</th>
                    <th>総数量</th>
                    <th>削除</th>
                  </tr>
                </thead>
                <tbody id="product-rows">
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td><input type="text" name="商品コード[]" placeholder="P12345" required /></td>
                      <td><input type="number" name="入数[]" placeholder="10" min={1} /></td>
                      <td>
                        <select name="単位[]">
                          <option>個</option>
                          <option>箱</option>
                        </select>
                      </td>
                      <td><input type="number" name="売上数[]" placeholder="5" min={1} /></td>
                      <td><input type="text" name="単位[]" placeholder="個" /></td>
                      <td><input type="number" name="総数量[]" placeholder="50" /></td>
                      <td>
                        <span className="delete-row-btn" onClick={() => deleteRow(row.key)}>削除</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="btn-add" id="add-row-btn" onClick={addRow}>行追加</button>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn-submit">送信</button>
            </div>
          </form>
        </div>
      )}

      {submitted && (
        <div className="list-container show" id="list-section">
          <div className="completion-message">送信が完了しました</div>
          <table>
            <thead>
              <tr>
                <th>納品日</th>
                <th>得意先</th>
                <th>届け先</th>
                <th>倉庫</th>
              </tr>
            </thead>
            <tbody id="list-rows">
              {listRows.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.customer}</td>
                  <td>{r.address}</td>
                  <td>{r.warehouse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
