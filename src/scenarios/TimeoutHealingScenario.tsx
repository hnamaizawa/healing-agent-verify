import { useEffect, useRef, useState } from 'react'
import './scenarios.css'
import uipathLogo from '../assets/uipath-logo-mono.svg'

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
      {loading && (
        <div className="loading-screen" id="loading-screen">
          <div className="loading-spinner"></div>
          <div className="loading-text">ローディング中</div>
        </div>
      )}

      <div className="header">
        <img src={uipathLogo} alt="UiPath ロゴ" />
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
