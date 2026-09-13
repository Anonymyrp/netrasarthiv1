import { useState } from 'react'
import {
  IndianRupee,
  ScanText,
  MessageSquareText,
  TrafficCone,
  Eye,
  ChevronDown,
} from 'lucide-react'

const sections = [
  {
    id: 'vision',
    number: '01',
    title: 'Vision & Recognition',
    description: 'Understand your surroundings with on-device intelligence.',
    features: [
      {
        id: 'currency',
        icon: IndianRupee,
        title: 'Indian Currency Detection',
        description:
          'Identify Indian currency notes and determine their denomination through the device.',
        how: 'Hold a note in front of the camera. The device identifies it on-device and speaks the denomination aloud.',
        capabilities: [
          'Identifies ₹10, ₹20, ₹50, ₹100, ₹200 and ₹500 notes',
          'Works in real time with voice output',
          'Handles worn or folded notes',
        ],
        offline: 'No internet connection required.',
      },
      {
        id: 'ocr',
        icon: ScanText,
        title: 'OCR Mode',
        description:
          'Read printed text such as signs, labels, documents, and other text in your surroundings.',
        how: 'The camera captures visible text, processes it on the device, and converts it into speech.',
        capabilities: [
          'Recognizes Hindi and English text',
          'Works in real time',
          'Supports signboards, labels, documents and everyday objects',
          'Provides voice output',
        ],
        offline: 'No internet connection required.',
      },
    ],
  },
  {
    id: 'ai',
    number: '02',
    title: 'AI Assistance',
    description: 'Get guidance and answers, anytime.',
    features: [
      {
        id: 'hindi-ai',
        icon: MessageSquareText,
        title: 'Offline Hindi AI Assistant',
        description:
          'Ask questions and get helpful guidance in natural Hindi, even without an internet connection.',
        how: 'Ask a question by voice. The on-device assistant understands natural Hindi and responds with spoken guidance.',
        capabilities: [
          'Natural Hindi conversations',
          'Help with routes, objects and everyday tasks',
          'Answers in real time with voice output',
        ],
        offline: 'No internet connection required.',
      },
    ],
  },
  {
    id: 'mobility',
    number: '03',
    title: 'Road & Mobility',
    description: 'Navigate the world more confidently.',
    features: [
      {
        id: 'traffic',
        icon: TrafficCone,
        title: 'Traffic Signal Detection',
        description:
          'Detect traffic signals and receive audio feedback to help you understand the current signal state.',
        how: 'The camera watches the signal ahead and announces changes with audio feedback as you wait or cross.',
        capabilities: [
          'Detects red, yellow and green signals',
          'Audio alerts on signal change',
          'Works in real time',
        ],
        offline: 'No internet connection required.',
      },
      {
        id: 'independence',
        icon: Eye,
        title: 'Built for greater independence',
        description:
          'Everyday guidance with real-world support to help you move through the world with confidence.',
        how: 'Vision, assistance and mobility features work together through simple voice-first controls.',
        capabilities: [
          'Voice-first controls',
          'Audio feedback for every action',
          'Designed for everyday independence',
        ],
        offline: 'Core features work without internet.',
      },
    ],
  },
]

function FeatureCard({ feature, open, onToggle }) {
  const Icon = feature.icon
  return (
    <div
      className={`glass-card rounded-card transition-colors ${
        open ? 'border-[rgba(185,115,85,0.5)]' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="w-10 h-10 rounded-full bg-accent-light border border-[rgba(185,115,85,0.25)] text-accent-primary flex items-center justify-center shrink-0">
          <Icon size={19} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-text-primary leading-snug">
            {feature.title}
          </span>
          <span className="block text-xs text-text-secondary leading-relaxed mt-0.5">
            {feature.description}
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-text-muted transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease ${
          open ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="px-4 pb-5 pt-1">
            <div className="pt-4 border-t border-[rgba(62,58,56,0.08)] grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
              <div className="md:pr-5">
                <p className="text-xs font-bold text-text-primary">How it works</p>
                <p className="text-xs text-text-secondary leading-relaxed mt-1.5">
                  {feature.how}
                </p>
              </div>
              <div className="md:px-5 md:border-l md:border-[rgba(62,58,56,0.08)]">
                <p className="text-xs font-bold text-text-primary">Key capabilities</p>
                <ul className="list-disc pl-4 mt-1.5 flex flex-col gap-1 marker:text-accent-primary">
                  {feature.capabilities.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-text-secondary leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:pl-5 md:border-l md:border-[rgba(62,58,56,0.08)]">
                <p className="text-xs font-bold text-text-primary">Works offline</p>
                <p className="text-xs text-text-secondary leading-relaxed mt-1.5">
                  {feature.offline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Features() {
  const [openSections, setOpenSections] = useState({
    vision: true,
    ai: false,
    mobility: false,
  })
  const [openCards, setOpenCards] = useState({ currency: true })

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleCard = (id) =>
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="px-4 md:px-8 py-6 w-full flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.2em] text-accent-primary">
              FEATURES
            </p>
            <h1 className="text-2xl md:text-[1.7rem] font-extrabold tracking-tight text-text-primary mt-1">
              Explore Our Features
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
              Simple tools, powerful impact. Designed to make every journey
              safer and more independent.
            </p>
          </div>
          <p className="italic font-serif text-sm text-text-secondary leading-relaxed shrink-0 md:text-right md:max-w-[190px] md:pt-7">
            Technology for a more inclusive tomorrow.
          </p>
        </div>

        {sections.map((section) => {
          const sectionOpen = openSections[section.id] !== false
          return (
            <section key={section.id} aria-label={section.title}>
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={sectionOpen}
                className="w-full flex items-start gap-4 text-left group"
              >
                <span className="text-sm font-bold text-accent-primary pt-0.5 shrink-0">
                  {section.number}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-bold text-text-primary leading-snug group-hover:text-accent-secondary transition-colors">
                    {section.title}
                  </span>
                  <span className="block text-xs text-text-secondary mt-0.5">
                    {section.description}
                  </span>
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 mt-0.5 text-text-muted transition-transform duration-300 ${
                    sectionOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease ${
                  sectionOpen
                    ? '[grid-template-rows:1fr]'
                    : '[grid-template-rows:0fr]'
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="flex flex-col gap-3 pt-4">
                    {section.features.map((feature) => (
                      <FeatureCard
                        key={feature.id}
                        feature={feature}
                        open={!!openCards[feature.id]}
                        onToggle={() => toggleCard(feature.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )
        })}
    </div>
  )
}

export default Features
