import { useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import LeadsList from './components/LeadsList'

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Brighte Eats</h1>
      </header>
      <main className="app-main">
        <section className="card">
          <RegistrationForm onSuccess={() => setRefreshKey((k) => k + 1)} />
        </section>
        <section className="card">
          <LeadsList key={refreshKey} />
        </section>
      </main>
    </div>
  )
}
