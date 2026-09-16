import { useRef, useState } from 'react'

/**
 * Port of Computer_Vision.html — kept byte-for-byte identical in ids,
 * classes, labels and placeholders. Screen B's phone field diverges from
 * screen A enough (aaname + placeholder) that Fuzzy Search selectors can't
 * heal it; only Computer Vision / Semantic healing recovers it.
 */
type Side = 'a' | 'b'

function rollSide(): Side {
  return Math.random() > 0.5 ? 'a' : 'b'
}

export function TargetDefinitionChangeScenario() {
  const [side] = useState<Side>(rollSide)
  const [messageVisible, setMessageVisible] = useState(false)
  const hideTimer = useRef<number | undefined>(undefined)

  const fullNameRef = useRef<HTMLInputElement>(null)
  const emailAddressRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const phoneNumberRef = useRef<HTMLInputElement>(null)

  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const userPasswordRef = useRef<HTMLInputElement>(null)

  const showMessage = () => {
    setMessageVisible(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setMessageVisible(false), 3000)
  }

  const submitFormA = () => {
    showMessage()
    if (fullNameRef.current) fullNameRef.current.value = ''
    if (emailAddressRef.current) emailAddressRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    if (phoneNumberRef.current) phoneNumberRef.current.value = ''
  }

  const submitFormB = () => {
    showMessage()
    if (emailRef.current) emailRef.current.value = ''
    if (phoneRef.current) phoneRef.current.value = ''
    if (nameRef.current) nameRef.current.value = ''
    if (userPasswordRef.current) userPasswordRef.current.value = ''
  }

  return (
    <div className="tdc-scope">
      <style>{`
        .tdc-scope { display: flex; justify-content: center; align-items: flex-start; }
        .tdc-scope .container {
          background-color: white; padding: 20px; border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px;
          transition: width 0.5s ease, height 0.5s ease;
        }
        .tdc-scope .container h2 { text-align: center; margin-bottom: 20px; }
        .tdc-scope .form-group { margin-bottom: 15px; position: relative; }
        .tdc-scope .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .tdc-scope .form-group input {
          padding: 10px; border: 1px solid #ccc; border-radius: 5px;
          box-sizing: border-box; width: 100%;
        }
        .tdc-scope .submit-btn {
          width: 100%; padding: 10px; background-color: #007bff; color: white;
          border: none; border-radius: 5px; cursor: pointer;
        }
        .tdc-scope .submit-btn:hover { background-color: #0056b3; }
        .tdc-scope .message { text-align: center; color: green; margin-top: 20px; }
        .tdc-scope .screen-a { font-family: 'Arial', sans-serif; }
        .tdc-scope .screen-a .form-group label { color: #000000; }
        .tdc-scope .screen-a .form-group { margin-bottom: 20px; }
        .tdc-scope .screen-a .form-group input { background-color: #e7f3ff; }
        .tdc-scope .screen-b {
          font-family: 'Courier New', monospace; background-color: #2c2c2c;
          color: #ffffff; padding: 30px; border-radius: 15px; position: relative;
        }
        .tdc-scope .screen-b .form-group {
          margin-bottom: 50px; display: inline-block; width: 45%; vertical-align: top;
        }
        .tdc-scope .screen-b .form-group label { color: #ffffff; position: relative; margin-bottom: 5px; }
        .tdc-scope .screen-b .form-group input {
          background-color: #444; border: 1px solid #555; color: #ffffff;
          position: relative; width: 100%;
        }
        .tdc-scope .screen-b .form-group input::placeholder { color: #aaa; }
        .tdc-scope .screen-b .submit-btn { background-color: #555; color: #ffffff; width: 100%; }
        .tdc-scope .screen-b .submit-btn:hover { background-color: #777; }
        .tdc-scope .screen-b-container { width: 800px; max-width: 800px; height: auto; }
      `}</style>

      <div className={side === 'b' ? 'container screen-b-container' : 'container'} id="form-container">
        <h2>個人情報登録フォーム</h2>

        {side === 'a' && (
          <div className="screen-a" style={{ display: 'block' }}>
            <div className="form-group">
              <label htmlFor="full-name">名前</label>
              <input type="text" id="full-name" placeholder="名前を入力" ref={fullNameRef} />
            </div>
            <div className="form-group">
              <label htmlFor="email-address">メールアドレス</label>
              <input type="email" id="email-address" placeholder="メールアドレスを入力" ref={emailAddressRef} />
            </div>
            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input type="password" id="password" placeholder="パスワードを入力" ref={passwordRef} />
            </div>
            <div className="form-group">
              <label htmlFor="phone-number">電話番号</label>
              <input type="tel" id="phone-number" placeholder="電話番号を入力" ref={phoneNumberRef} />
            </div>
            <button type="button" className="submit-btn" onClick={submitFormA}>登録</button>
          </div>
        )}

        {side === 'b' && (
          <div className="screen-b" style={{ display: 'block' }}>
            <div className="form-group" id="email-group">
              <label htmlFor="email">メールアドレス</label>
              <input type="email" id="email" placeholder="メールアドレスを入力" ref={emailRef} />
            </div>
            <div className="form-group" id="phone-group">
              <label htmlFor="phone">☎（外線電話番号）</label>
              <input type="tel" id="phone" placeholder="　電話番号を入力" ref={phoneRef} />
            </div>
            <div className="form-group" id="name-group">
              <label htmlFor="name">名前</label>
              <input type="text" id="name" placeholder="名前を入力" ref={nameRef} />
            </div>
            <div className="form-group" id="password-group">
              <label htmlFor="user-password">パスワード</label>
              <input type="password" id="user-password" placeholder="パスワードを入力" ref={userPasswordRef} />
            </div>
            <button type="button" className="submit-btn" onClick={submitFormB}>登録</button>
          </div>
        )}

        <div className="message" id="message" style={{ display: messageVisible ? 'block' : 'none' }}>
          登録されました！
        </div>
      </div>
    </div>
  )
}
