import { ClipboardList, FileCheck2, Mail, UserCheck } from 'lucide-react'

const STEPS = [
  {
    icon: FileCheck2,
    title: 'Lue palveluehdot',
    body: 'Hyväksy ehdot, joissa kerrotaan miten opetuskorjaamo toimii ja mitä työn vastaanottaminen edellyttää.',
  },
  {
    icon: ClipboardList,
    title: 'Täytä hakemus',
    body: 'Kerro ajoneuvosta ja työstä, jonka toivot tehtävän. Valitse työtyyppi: kevyt, raskas tai korityö.',
  },
  {
    icon: UserCheck,
    title: 'Opettaja arvioi',
    body: 'Opettaja tarkistaa, sopiiko työ opiskelijaryhmän opetussuunnitelmaan ja korjaamon resursseihin.',
  },
  {
    icon: Mail,
    title: 'Saat vastauksen',
    body: 'Opettaja ottaa sinuun yhteyttä sähköpostitse. Vasta silloin sovitaan ajoneuvon luovutuksesta.',
  },
]

export function HowItWorks() {
  return (
    <section id="tietoa" aria-labelledby="how-title" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:px-6 md:pt-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Näin palvelu toimii</p>
          <h2 id="how-title" className="mt-2 text-balance font-heading text-3xl font-bold tracking-tight">
            Hakemuksesta opetustyöksi neljässä vaiheessa
          </h2>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-4 rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-sm font-semibold text-muted-foreground tabular-nums">
                  Vaihe {i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-sans text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
