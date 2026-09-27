import { useEffect, useRef, useState } from 'react'

const API_URL = "https://mindscore-ai-n3ng.onrender.com";

const response = await fetch(`${API_URL}/predict`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});

const result = await response.json();

const PLATFORMS = [
  'Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
  'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat',
]

const emptyForm = {
  age: '', gender: '', country: '', academic_level: '',
  most_used_platform: '', purpose_of_use: '', avg_daily_usage_hours: '', daily_unlocks: '',
  study_hours: '', physical_activity_hours: '', sleep_hours_per_night: '', stress_level: '',
}

const numberFields = new Set([
  'age', 'avg_daily_usage_hours', 'daily_unlocks',
  'study_hours', 'physical_activity_hours', 'sleep_hours_per_night',
])

const STEPS = [
  { key: 'about', label: 'About you', desc: 'Basic profile', icon: 'user' },
  { key: 'usage', label: 'Platform use', desc: 'Screen habits', icon: 'phone' },
  { key: 'life', label: 'Daily life', desc: 'Routine & stress', icon: 'moon' },
]

const ROMAN = ['I', 'II', 'III']

function Icon({ name, className }) {
  const paths = {
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
    phone: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h4',
    moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z',
    back: 'M15 6l-6 6 6 6',
    forward: 'M9 6l6 6-6 6',
    check: 'M20 7 10 17l-5-5',
    alert: 'M12 9v4m0 4h.01M10.3 3.9 2.5 18a1.5 1.5 0 0 0 1.3 2.2h16.4a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-3.4 0Z',
    clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    book: 'M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5V5.5ZM20 5.5c0-.83-.67-1.5-1.5-1.5H13v16h5.5c.83 0 1.5-.67 1.5-1.5V5.5Z',
    shield: 'M12 3.2 19 6v6c0 4.6-3 7.9-7 9-4-1.1-7-4.4-7-9V6l7-2.8Z',
    pulse: 'M3 12h3.4l1.8-4.5L11.4 18l2.4-9 1.6 3.5H21',
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

function signalStatus(kind, value) {
  if (Number.isNaN(value)) return 'neutral'
  if (kind === 'sleep') return value < 6 ? 'danger' : value < 7 ? 'warn' : 'good'
  if (kind === 'screen') return value <= 2.5 ? 'good' : value <= 5 ? 'warn' : 'danger'
  if (kind === 'activity') return value >= 1 ? 'good' : value >= 0.3 ? 'warn' : 'danger'
  return 'neutral'
}

function stressStatus(level) {
  if (level === 'Low') return 'good'
  if (level === 'Medium') return 'warn'
  return 'danger'
}

function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

function Gauge({ score }) {
  const clamped = Math.max(0, Math.min(10, score))
  const [display, setDisplay] = useState(0)
  const r = 68
  const c = 2 * Math.PI * r
  const [dash, setDash] = useState(c)

  useEffect(() => {
    const target = c - (clamped / 10) * c
    const id = requestAnimationFrame(() => setDash(target))
    const start = performance.now()
    const dur = 900
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setDisplay(clamped * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(id); cancelAnimationFrame(raf) }
  }, [clamped, c])

  let band = 'On track for the balanced range', bandColor = 'var(--success)'
  if (clamped <= 3) { band = 'Below the balanced range'; bandColor = 'var(--danger)' }
  else if (clamped <= 6) { band = 'Approaching the balanced range'; bandColor = 'var(--warn)' }

  return (
    <div className="gauge-widget">
      <div className="gauge">
        <svg viewBox="0 0 160 160" className="gauge-ring">
          <circle cx="80" cy="80" r={r} className="gauge-track" />
          <circle
            cx="80" cy="80" r={r} className="gauge-progress"
            style={{ stroke: bandColor, strokeDasharray: c, strokeDashoffset: dash }}
          />
        </svg>
        <div className="gauge-center">
          <span className="gauge-number">{display.toFixed(1)}</span>
          <span className="gauge-sub">/ 10</span>
        </div>
      </div>
      <p className="gauge-caption" style={{ color: bandColor }}>{band}</p>
    </div>
  )
}

function SignalTile({ icon, label, value, status }) {
  const statusLabel = { good: 'Healthy', warn: 'Watch', danger: 'Attention', neutral: '' }[status]
  return (
    <div className={`signal-tile signal-${status}`}>
      <span className="signal-icon"><Icon name={icon} className="i-sm" /></span>
      <div className="signal-body">
        <p className="signal-label">{label}</p>
        <p className="signal-value">{value}</p>
      </div>
      {statusLabel && <span className={`signal-flag flag-${status}`}>{statusLabel}</span>}
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState(emptyForm)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('fwd')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const formRef = useRef(null)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function goNext() {
    if (formRef.current && !formRef.current.reportValidity()) return
    setDirection('fwd')
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  function goBack() {
    setDirection('back')
    setStep((s) => Math.max(0, s - 1))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (formRef.current && !formRef.current.reportValidity()) return
    setStatus('loading')
    setError('')
    try {
      const payload = { ...form }
      for (const key of numberFields) {
        payload[key] = key === 'age' || key === 'daily_unlocks'
          ? parseInt(payload[key], 10)
          : parseFloat(payload[key])
      }
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(
          body?.detail
            ? (Array.isArray(body.detail) ? body.detail.map((d) => d.msg).join(', ') : String(body.detail))
            : 'The server could not process that request.'
        )
      }
      const data = await res.json()
      setResult(data.predicted_mental_health_score)
      setStatus('done')
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "We couldn't connect to the server. Please make sure it's running and try again."
          : (err.message || 'Something went wrong. Please try again.')
      )
      setStatus('error')
    }
  }

  function handleReset() {
    setForm(emptyForm)
    setStep(0)
    setStatus('idle')
    setResult(null)
    setError('')
  }

  const showForm = status === 'idle' || status === 'loading' || status === 'error'

  return (
    <div className="dashboard">
      <aside className="side">
        <div className="brand">
          <span className="brand-mark"><Icon name="pulse" className="i-md" /></span>
          <div>
            <p className="brand-name">MindScore <em>AI</em></p>
            <p className="brand-tag">Student Mental Health Score Prediction System</p>
          </div>
        </div>

        {showForm ? (
          <ol className="ledger">
            {STEPS.map((s, i) => (
              <li key={s.key} className={`ledger-item ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}>
                <span className="ledger-num">{i < step ? <Icon name="check" className="i-sm" /> : ROMAN[i]}</span>
                <div>
                  <p className="ledger-label">{s.label}</p>
                  <p className="ledger-desc">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="side-note">
            <Icon name="check" className="i-md" />
            <p>Assessment complete. Review your result and the signals behind it.</p>
          </div>
        )}

        <div className="side-foot">
          <Icon name="shield" className="i-sm" />
          <p>A statistical estimate, not a clinical diagnosis. Answers stay in this session only.</p>
        </div>
      </aside>

      <main className="stage">
        <div className="stage-top">
          <div className="chip">
            <Icon name="clock" className="i-sm" /> Takes about 2 minutes
          </div>
        </div>

        {showForm && (
          <div className="card form-card">
            <div className="form-card-head">
              <span className="form-card-num">{ROMAN[step]}</span>
              <div>
                <h2>{STEPS[step].label}</h2>
                <p>{STEPS[step].desc}</p>
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit}>
              <div key={step} className={`step-panel anim-${direction}`}>
                {step === 0 && (
                  <section className="section">
                    <div className="grid grid-3">
                      <Field label="Age">
                        <input type="number" min="10" max="100" required placeholder="e.g. 21"
                          value={form.age} onChange={(e) => update('age', e.target.value)} />
                      </Field>
                      <Field label="Gender">
                        <select required value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                          <option value="" disabled>Select</option>
                          <option>Female</option><option>Male</option>
                        </select>
                      </Field>
                      <Field label="Country">
                        <input type="text" required placeholder="e.g. Nepal"
                          value={form.country} onChange={(e) => update('country', e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid grid-1">
                      <Field label="Academic level">
                        <select required value={form.academic_level} onChange={(e) => update('academic_level', e.target.value)}>
                          <option value="" disabled>Select</option>
                          <option>High School</option><option>Undergraduate</option><option>Graduate</option>
                        </select>
                      </Field>
                    </div>
                  </section>
                )}

                {step === 1 && (
                  <section className="section">
                    <div className="grid grid-2">
                      <Field label="Most-used platform">
                        <select required value={form.most_used_platform} onChange={(e) => update('most_used_platform', e.target.value)}>
                          <option value="" disabled>Select</option>
                          {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                        </select>
                      </Field>
                      <Field label="Main reason you use it">
                        <select required value={form.purpose_of_use} onChange={(e) => update('purpose_of_use', e.target.value)}>
                          <option value="" disabled>Select</option>
                          <option>Entertainment</option><option>Networking</option><option>Education</option><option>News</option>
                        </select>
                      </Field>
                      <Field label="Average daily use" hint="Hours per day">
                        <input type="number" min="0" max="24" step="0.1" required placeholder="e.g. 4"
                          value={form.avg_daily_usage_hours} onChange={(e) => update('avg_daily_usage_hours', e.target.value)} />
                      </Field>
                      <Field label="Phone unlocks" hint="Roughly per day">
                        <input type="number" min="0" required placeholder="e.g. 60"
                          value={form.daily_unlocks} onChange={(e) => update('daily_unlocks', e.target.value)} />
                      </Field>
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="section">
                    <div className="grid grid-3">
                      <Field label="Study" hint="Hours per day">
                        <input type="number" min="0" max="24" step="0.1" required placeholder="e.g. 3"
                          value={form.study_hours} onChange={(e) => update('study_hours', e.target.value)} />
                      </Field>
                      <Field label="Physical activity" hint="Hours per day">
                        <input type="number" min="0" max="24" step="0.1" required placeholder="e.g. 1"
                          value={form.physical_activity_hours} onChange={(e) => update('physical_activity_hours', e.target.value)} />
                      </Field>
                      <Field label="Sleep" hint="Hours per night">
                        <input type="number" min="0" max="24" step="0.1" required placeholder="e.g. 7"
                          value={form.sleep_hours_per_night} onChange={(e) => update('sleep_hours_per_night', e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid grid-1">
                      <Field label="Typical stress level">
                        <select required value={form.stress_level} onChange={(e) => update('stress_level', e.target.value)}>
                          <option value="" disabled>Select</option>
                          <option>Low</option><option>Medium</option><option>High</option><option>Very High</option>
                        </select>
                      </Field>
                    </div>
                  </section>
                )}
              </div>

              <div className="actions">
                {step > 0 && (
                  <button type="button" className="ghost" onClick={goBack}>
                    <Icon name="back" className="i-sm" /> Back
                  </button>
                )}
                <div className="actions-spacer" />
                {step < STEPS.length - 1 ? (
                  <button type="button" className="primary" onClick={goNext}>
                    Continue <Icon name="forward" className="i-sm" />
                  </button>
                ) : (
                  <button type="submit" className="primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Scoring…' : 'Get my score'}
                  </button>
                )}
              </div>
            </form>

            {status === 'error' && (
              <div className="inline-error">
                <Icon name="alert" className="i-sm" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {status === 'done' && result !== null && (
          <div className="card result-card">
            <div className="result-head">
              <h2>Estimated wellbeing score</h2>
              <p>Based on the profile, habits and routine you entered</p>
            </div>
            <Gauge score={result} />

            <div className="signal-grid">
              <SignalTile icon="moon" label="Sleep / night" value={`${form.sleep_hours_per_night}h`}
                status={signalStatus('sleep', parseFloat(form.sleep_hours_per_night))} />
              <SignalTile icon="phone" label="Platform use" value={`${form.avg_daily_usage_hours}h/day`}
                status={signalStatus('screen', parseFloat(form.avg_daily_usage_hours))} />
              <SignalTile icon="book" label="Study time" value={`${form.study_hours}h/day`} status="neutral" />
              <SignalTile icon="alert" label="Stress level" value={form.stress_level}
                status={stressStatus(form.stress_level)} />
            </div>

            <p className="panel-note">
              This is a statistical estimate from a small project model, not a clinical
              assessment. If you're struggling, a counselor or doctor is a better place to
              start than any score.
            </p>
            <button type="button" className="ghost pill" onClick={handleReset}>Start over</button>
          </div>
        )}
      </main>
    </div>
  )
}
