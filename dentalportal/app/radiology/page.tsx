'use client'

import { useState } from 'react'
import Navbar from '../../app/client/Navbar'
import Footer from '../../app/client/Footer'
import {
  Scan,
  CheckCircle,
  XCircle,
  RotateCcw,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react'

export default function RadiologyPage() {
  const [selectedCase, setSelectedCase] = useState<number | null>(null)

  const cases = [
    {
      id: 1,
      title: 'Posterior Bitewing – Caries Detection',
      modality: 'Bitewing',
      status: 'Not Started',
      score: null
    },
    {
      id: 2,
      title: 'Periapical – Chronic Apical Periodontitis',
      modality: 'Periapical',
      status: 'Completed',
      score: 82
    },
    {
      id: 3,
      title: 'OPG – Impacted Third Molar',
      modality: 'OPG',
      status: 'Retry',
      score: 58
    }
  ]

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-linear-to-b from-gray-50 to-white overflow-x-hidden">

        {/* HERO */}
        <section className="relative bg-lin-to-br from-emerald-50 via-white to-emerald-50/30 border-b border-emerald-100">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-lin(circle_at_1px_1px,rgba(16,185,129,0.1)_1px,transparent_0)] bg-size-[40px_40px]" />
          </div>

          <div className="relative container mx-auto px-4 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 border border-emerald-200 text-emerald-700 text-sm font-medium mb-6">
                <Scan className="w-4 h-4 mr-2" />
                Radiology Training
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Diagnostic
                <span className="block text-transparent bg-clip-text bg-lin-to-r from-emerald-600 to-emerald-800 mt-2">
                  Radiology Cases
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Interpret real dental radiographs, make diagnostic decisions, 
                and measure your clinical accuracy through structured case-based learning.
              </p>
            </div>
          </div>
        </section>

        {/* DASHBOARD */}
        <section className="py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                          {c.modality}
                        </span>

                        {c.status === 'Completed' && (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        )}
                        {c.status === 'Retry' && (
                          <RotateCcw className="w-5 h-5 text-orange-500" />
                        )}
                        {c.status === 'Not Started' && (
                          <Layers className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {c.title}
                      </h3>

                      <div className="text-sm text-gray-600 mb-4">
                        Status:{' '}
                        <span className="font-medium">{c.status}</span>
                      </div>

                      {c.score !== null && (
                        <div className="mb-4 flex items-center gap-2 text-sm">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          <span className="text-gray-700">
                            Previous Accuracy:
                          </span>
                          <span className="font-semibold text-emerald-700">
                            {c.score}%
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedCase(c.id)}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Start Case
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* INFO PANEL */}
              <div className="mt-16 p-8 bg-lin-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 text-center">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    How Radiology Training Works
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    Each case simulates a real clinical scenario. You will inspect the
                    radiograph without hints, select all relevant findings, submit your
                    interpretation, and receive accuracy-based feedback with learning points.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-xl border">
                      🦷 Observe radiograph carefully
                    </div>
                    <div className="bg-white p-4 rounded-xl border">
                      🧠 Decide true vs false findings
                    </div>
                    <div className="bg-white p-4 rounded-xl border">
                      📊 Review accuracy & feedback
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
