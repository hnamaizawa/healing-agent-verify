import { useState } from 'react'

/**
 * Port of HealingAgent_popups.html — an overlay popup covers the form on
 * load; Healing Agent is expected to detect and dismiss it automatically.
 */
export function PopupHealingScenario() {
  const [overlayOpen, setOverlayOpen] = useState(true)

  return (
    <div className="popup-scope">
      <style>{`
        .popup-scope {
          font-family: Arial, sans-serif; margin: 0; padding: 0;
          background: linear-gradient(135deg, #2b2b2b, #1e1e1e); color: #333;
          min-height: 600px; position: relative;
        }
        .popup-scope .header { text-align: center; padding: 20px; }
        .popup-scope .header img { width: 150px; height: auto; margin-bottom: 10px; }
        .popup-scope .header h1 { color: white; font-size: 24px; }
        .popup-scope .form-container {
          width: 100%; max-width: 800px; background: white; margin: 40px auto;
          padding: 20px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .popup-scope .form-group { margin-bottom: 20px; }
        .popup-scope label { display: block; font-weight: bold; margin-bottom: 5px; }
        .popup-scope input, .popup-scope select {
          width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc;
          border-radius: 4px; box-sizing: border-box;
        }
        .popup-scope input:focus, .popup-scope select:focus { border-color: #007BFF; outline: none; }
        .popup-scope .btn-submit {
          display: inline-block; padding: 12px 24px; color: white; background-color: #28a745;
          border: none; border-radius: 4px; cursor: pointer; font-size: 16px;
        }
        .popup-scope .btn-submit:hover { background-color: #218838; }
        .popup-scope table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .popup-scope th, .popup-scope td { border: 1px solid #ccc; padding: 10px; text-align: left; }
        .popup-scope th { background: #f2f2f2; }
        .popup-scope .overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.7); z-index: 1000; display: flex;
          justify-content: center; align-items: center;
        }
        .popup-scope .popup {
          background: white; padding: 20px; border-radius: 8px; text-align: center;
          width: 90%; max-width: 400px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .popup-scope .popup h2 { font-size: 20px; margin-bottom: 10px; }
        .popup-scope .popup p { font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
        .popup-scope .popup .close-btn {
          background: #007BFF; color: white; border: none; padding: 10px 20px;
          border-radius: 4px; cursor: pointer; font-size: 14px;
        }
        .popup-scope .popup .close-btn:hover { background: #0056b3; }
      `}</style>

      <div className="header">
        <img src="https://upload.wikimedia.org/wikipedia/en/8/80/UiPath_2019_Corporate_Logo.png" alt="会社のロゴ" />
        <h1>納品書登録</h1>
      </div>

      {overlayOpen && (
        <div className="overlay" id="overlay" style={{ display: 'flex' }}>
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
