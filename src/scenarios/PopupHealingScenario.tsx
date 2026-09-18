import { useState } from 'react'
import './scenarios.css'
import uipathLogo from '../assets/uipath-logo-mono.svg'

/**
 * Port of HealingAgent_popups.html — an overlay popup covers the form on
 * load; Healing Agent is expected to detect and dismiss it automatically.
 */
export function PopupHealingScenario() {
  const [overlayOpen, setOverlayOpen] = useState(true)

  return (
    <div className="popup-scope">
      <div className="header">
        <img src={uipathLogo} alt="UiPath ロゴ" />
        <h1>納品書登録</h1>
      </div>

      {overlayOpen && (
        <div className="overlay" id="overlay">
          <div className="popup">
            <h2>バージョンアップのお知らせ</h2>
            <p>
              日頃よりご利用いただきありがとうございます。システムの更なる向上を目指し、
              以下の日程でバージョンアップに伴うシステムメンテナンスを実施いたします。
              <br /><br />
              <strong>メンテナンス日時:</strong> 2026年12月27日(日) AM0:00 〜 PM6:00
              <br /><br />
              この間、システムをご利用いただけませんのでご注意ください。お客様にはご迷惑をお掛けしますが、
              ご理解とご協力を賜りますようお願い申し上げます。
            </p>
            <button className="close-btn" id="close-btn" onClick={() => setOverlayOpen(false)}>閉じる</button>
          </div>
        </div>
      )}

      <div className="form-container">
        <form id="deliveryForm" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="得意先">得意先</label>
            <input type="text" id="得意先" name="得意先" placeholder="株式会社サンプル" required />
          </div>
          <div className="form-group">
            <label htmlFor="納品日">納品日</label>
            <input type="date" id="納品日" name="納品日" required />
          </div>
          <div className="form-group">
            <label htmlFor="届け先">届け先</label>
            <input type="text" id="届け先" name="届け先" placeholder="東京都中央区1-1-1" required />
          </div>
          <div className="form-group">
            <label htmlFor="倉庫">倉庫</label>
            <input type="text" id="倉庫" name="倉庫" placeholder="第一倉庫" required />
          </div>

          <table>
            <thead>
              <tr>
                <th>商品コード</th>
                <th>入数</th>
                <th>入数単位</th>
                <th>売上数</th>
                <th>単位</th>
                <th>総数量</th>
              </tr>
            </thead>
            <tbody id="product-rows">
              <tr>
                <td><input type="text" name="商品コード[]" placeholder="P12345" required /></td>
                <td><input type="number" name="入数[]" placeholder="10" min={1} /></td>
                <td>
                  <select name="単位[]">
                    <option>個</option>
                    <option>箱</option>
                  </select>
                </td>
                <td><input type="number" name="売上数[]" placeholder="5" min={1} /></td>
                <td><input type="text" name="単位[]" placeholder="個" required /></td>
                <td><input type="number" name="総数量[]" placeholder="50" required /></td>
              </tr>
            </tbody>
          </table>

          <div className="form-footer">
            <button type="submit" className="btn-submit">送信</button>
          </div>
        </form>
      </div>
    </div>
  )
}
