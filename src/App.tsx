import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { Home, LayoutGrid } from 'lucide-react'
import { Button } from '@uipath/apollo-wind/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@uipath/apollo-wind/components/ui/card'
import { ThemeToggle } from './components/Theme'
import { TargetDefinitionChangeScenario } from './scenarios/TargetDefinitionChangeScenario'
import { FuzzyMatchLabelScenario } from './scenarios/FuzzyMatchLabelScenario'
import { TimeoutHealingScenario } from './scenarios/TimeoutHealingScenario'
import { PopupHealingScenario } from './scenarios/PopupHealingScenario'

type ScenarioId = 'tdc' | 'fml' | 'timeout' | 'popup'

interface ScenarioDef {
  id: ScenarioId
  title: string
  summary: string
  /** Canonical value for the `?appName=` URL parameter (see ALIASES below for accepted spellings). */
  appName: string
  Component: ComponentType
}

const SCENARIOS: ScenarioDef[] = [
  {
    id: 'tdc',
    title: 'Target Definition Change',
    appName: 'TargetDefinitionChange',
    summary:
      '電話番号セレクターの aaname / placeholder を大きく変更。Fuzzy Search では救えず、Computer Vision（現在は Semantic）による Healing を検証します。読取精度の比較対象。',
    Component: TargetDefinitionChangeScenario,
  },
  {
    id: 'fml',
    title: 'Fuzzy Match Label',
    appName: 'FuzzyMatchLabel',
    summary:
      '送信ボタンのラベルが「登録」→「記録」に変わった場合の Fuzzy Match Label Healing を検証します。',
    Component: FuzzyMatchLabelScenario,
  },
  {
    id: 'timeout',
    title: '60秒タイムアウト',
    appName: 'Timeout60Sec',
    summary:
      '60秒のローディング画面でタイムアウトを誘発し、Healing Agent による復旧を検証します。',
    Component: TimeoutHealingScenario,
  },
  {
    id: 'popup',
    title: 'ポップアップ',
    appName: 'Popup',
    summary:
      '画面ロード時に出現するポップアップを Healing Agent が自動的にクローズするケースを検証します。',
    Component: PopupHealingScenario,
  },
]

// Extra accepted spellings per scenario for the `?appName=` query parameter,
// matched case- and separator-insensitively (see normalize()).
const APP_NAME_ALIASES: Record<ScenarioId, string[]> = {
  tdc: ['TargetDefinitionChange', 'TDC'],
  fml: ['FuzzyMatchLabel', 'FuzzyMathLabel', 'FML'],
  timeout: ['Timeout60Sec', 'Timeout', '60SecTimeout', 'Timeout60s'],
  popup: ['Popup', 'PopupHealing'],
}

// URL parameter size limit for security
const MAX_PARAM_LENGTH = 50

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function resolveScenarioIdFromAppName(raw: string | null): ScenarioId | null {
  if (!raw) return null
  // Validate parameter size to prevent potential DoS or injection attacks
  if (raw.length > MAX_PARAM_LENGTH) {
    console.warn(`Invalid appName parameter: exceeds maximum length of ${MAX_PARAM_LENGTH}`)
    return null
  }
  const target = normalize(raw)
  for (const s of SCENARIOS) {
    if (APP_NAME_ALIASES[s.id].some((alias) => normalize(alias) === target)) {
      return s.id
    }
  }
  return null
}

function readAppNameFromLocation(): ScenarioId | null {
  return resolveScenarioIdFromAppName(new URLSearchParams(window.location.search).get('appName'))
}

// `?label=` picks Fuzzy Match Label's 変更前(登録)/変更後(記録) state directly,
// e.g. ?appName=FuzzyMatchLabel&label=post.
const LABEL_POST_ALIASES = ['post', 'after', '記録']
const LABEL_PRE_ALIASES = ['pre', 'before', '登録']

function resolveIsPostFromLabelParam(raw: string | null): boolean | undefined {
  if (!raw) return undefined
  // Validate parameter size
  if (raw.length > MAX_PARAM_LENGTH) {
    console.warn(`Invalid label parameter: exceeds maximum length of ${MAX_PARAM_LENGTH}`)
    return undefined
  }
  const trimmed = raw.trim()
  const lower = trimmed.toLowerCase()
  if (LABEL_POST_ALIASES.some((a) => a === lower || a === trimmed)) return true
  if (LABEL_PRE_ALIASES.some((a) => a === lower || a === trimmed)) return false
  return undefined
}

function App() {
  const [activeId, setActiveId] = useState<ScenarioId | null>(readAppNameFromLocation)
  const [reloadKeys, setReloadKeys] = useState<Record<ScenarioId, number>>({
    tdc: 0,
    fml: 0,
    timeout: 0,
    popup: 0,
  })

  // Keep the `?appName=` URL parameter in sync with the selected scenario,
  // so the current screen can be bookmarked/shared/deep-linked.
  useEffect(() => {
    const url = new URL(window.location.href)
    const active = SCENARIOS.find((s) => s.id === activeId)
    if (active) {
      url.searchParams.set('appName', active.appName)
    } else {
      url.searchParams.delete('appName')
    }
    window.history.replaceState({}, '', url.toString())
  }, [activeId])

  const selectScenario = (id: ScenarioId) => {
    if (activeId === id) {
      // Re-selecting an already-open scenario remounts it, re-running its
      // "on read" logic (fresh random A/B pick, timer reset, popup reopen)
      // — the SPA equivalent of reloading the original standalone page.
      setReloadKeys((prev) => ({ ...prev, [id]: prev[id] + 1 }))
    } else {
      setActiveId(id)
    }
  }

  const active = SCENARIOS.find((s) => s.id === activeId)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <LayoutGrid className="h-5 w-5 shrink-0 text-primary" />
          <h1 className="truncate text-base font-semibold">Healing Agent 検証アプリ</h1>
        </div>
        <div className="flex items-center gap-2">
          {active && (
            <Button variant="outline" size="sm" onClick={() => selectScenario(active.id)}>
              再読み込み
            </Button>
          )}
          {active && (
            <Button variant="ghost" size="sm" onClick={() => setActiveId(null)}>
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">一覧へ</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto border-b px-4 py-2 sm:px-6">
        {SCENARIOS.map((s) => (
          <Button
            key={s.id}
            variant={activeId === s.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => selectScenario(s.id)}
            className="shrink-0"
          >
            {s.title}
          </Button>
        ))}
      </nav>

      <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {!active && (
          <div className="grid gap-4 sm:grid-cols-2">
            {SCENARIOS.map((s) => (
              <Card
                key={s.id}
                className="cursor-pointer transition hover:shadow-md"
                onClick={() => selectScenario(s.id)}
              >
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{s.summary}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {active && (
          <div className="rounded-lg border bg-card p-4 sm:p-6">
            {active.id === 'fml' ? (
              <FuzzyMatchLabelScenario
                key={reloadKeys.fml}
                initialIsPost={resolveIsPostFromLabelParam(new URLSearchParams(window.location.search).get('label'))}
              />
            ) : (
              <active.Component key={reloadKeys[active.id]} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
