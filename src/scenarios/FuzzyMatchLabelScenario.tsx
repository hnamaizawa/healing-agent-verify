import { useEffect, useRef, useState } from 'react'
import './scenarios.css'

/**
 * Port of Fuzzy_match_label_pre.html / _post.html. The two reference pages
 * are identical except the submit button text (登録 → 記録); a toggle
 * reproduces both states on one screen instead of two separate files.
 */
interface FuzzyMatchLabelScenarioProps {
  /** Initial 変更前(登録)/変更後(記録) state — set from the `?label=` URL parameter. */
  initialIsPost?: boolean
}

export function FuzzyMatchLabelScenario({ initialIsPost = false }: FuzzyMatchLabelScenarioProps) {
  const [isPost, setIsPost] = useState(initialIsPost)
  const [message, setMessage] = useState<'none' | 'submitted' | 'deleted'>('none')

  // Keep `?label=pre|post` in sync with the toggle so the current state is
  // bookmarkable/shareable, e.g. ?appName=FuzzyMatchLabel&label=post.
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('label', isPost ? 'post' : 'pre')
    window.history.replaceState({}, '', url.toString())
  }, [isPost])

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    if (nameRef.current) nameRef.current.value = ''
    if (emailRef.current) emailRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    if (phoneRef.current) phoneRef.current.value = ''
  }

  const submitForm = () => {
    setMessage('submitted')
    resetForm()
  }

  const deleteForm = () => {
    setMessage('deleted')
    resetForm()
  }

  return (
    <div className="fml-scope">
      <div className="mb-4 flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">ラベル変更シミュレーション:</span>
        <button
          type="button"
          className="rounded border px-2 py-1"
          onClick={() => setIsPost(false)}
          disabled={!isPost}
        >
          変更前（登録）
        </button>
        <button
          type="button"
          className="rounded border px-2 py-1"
          onClick={() => setIsPost(true)}
          disabled={isPost}
        >
          変更後（記録）
        </button>
      </div>

      <div className="container" id="form-container">
        <h2>個人情報登録フォーム</h2>

        <div className="screen" id="screen">
          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input type="text" id="name" placeholder="名前を入力" ref={nameRef} />
          </div>
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input type="email" id="email" placeholder="メールアドレスを入力" ref={emailRef} />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input type="password" id="password" placeholder="パスワードを入力" ref={passwordRef} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">電話番号</label>
            <input type="tel" id="phone" placeholder="電話番号を入力" ref={phoneRef} />
          </div>
          <div className="button-container">
            <button type="button" className="delete-btn" onClick={deleteForm}>削除</button>
            <button type="button" className="btn" onClick={submitForm}>{isPost ? '記録' : '登録'}</button>
          </div>
        </div>

        <div className="message" id="message" style={{ display: message === 'submitted' ? 'block' : 'none' }}>
          登録されました！
        </div>
        <div className="message" id="deleteMessage" style={{ display: message === 'deleted' ? 'block' : 'none' }}>
          削除されました！
        </div>
      </div>
    </div>
  )
}
