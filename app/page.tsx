'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Sparkles,
  X,
  Film,
  Heart,
  Languages,
} from 'lucide-react'

const membershipText = {
  'zh-TW': {
    title: 'Membership',
    currentStatus: '目前會員狀態',
    active: '使用中',
    paused: '已暫停',
    cancelled: '已取消',
    currentPlan: '目前方案',
    nextBillingDate: '下次扣款日',
    choosePlan: '選擇或切換會員方案',
    monthly: '每月',
    selectPlan: '選擇此方案',
    currentUsing: '目前使用中',
    renewalPayment: '續訂與付款方式',
    autoRenew: '自動續訂',
    autoRenewDesc: '到期後自動延續目前方案或取消',
    paymentMethod: '付款方式',
    comingSoon: '即將上線',
    plusAi: 'AI雷達: GPT-5.4 mini 模型每周上限150則',
    premiumAi: 'AI雷達: 每月GPT-5 mini 模型無限使用',
    adFree: 'Vibelink 零廣告體驗',
  },
  en: {
    title: 'Membership',
    currentStatus: 'Current Membership',
    active: 'Active',
    paused: 'Paused',
    cancelled: 'Cancelled',
    currentPlan: 'Current Plan',
    nextBillingDate: 'Next Billing Date',
    choosePlan: 'Choose or Change Plan',
    monthly: 'month',
    selectPlan: 'Choose This Plan',
    currentUsing: 'Current Plan',
    renewalPayment: 'Renewal & Payment',
    autoRenew: 'Auto Renewal',
    autoRenewDesc: 'Automatically renew or cancel your current plan after expiration',
    paymentMethod: 'Payment Method',
    comingSoon: 'Coming Soon',
    plusAi: 'AI Radar: GPT-5.4 mini model, 150 uses per week',
    premiumAi: 'AI Radar: Unlimited GPT-5 mini model usage monthly',
    adFree: 'Ad-free Vibelink experience',
  },
} as const

type Locale = keyof typeof membershipText

const languageOptions = [
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
] as const

function getPlans(t: (typeof membershipText)[Locale]) {
  return [
    {
      id: 'plus',
      name: 'Vibe Plus',
      price: 250,
      recommended: false,
      features: {
        vibeTv: [{ label: t.comingSoon, included: true }],
        vibelink: [
          { label: t.plusAi, included: true },
          { label: t.adFree, included: false },
        ],
      },
    },
    {
      id: 'premium',
      name: 'Vibe Premium',
      price: 390,
      recommended: true,
      features: {
        vibeTv: [{ label: t.comingSoon, included: true }],
        vibelink: [
          { label: t.premiumAi, included: true },
          { label: t.adFree, included: true },
        ],
      },
    },
  ] as const
}

type Plan = ReturnType<typeof getPlans>[number]
type PlanId = Plan['id']
type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

function FeatureRow({ label, included }: { label: string; included: boolean }) {
  const isComingSoon = label === '即將上線' || label === 'Coming Soon'

  return (
    <div
      className={`flex items-start gap-2 text-[18px] ${
        included ? 'text-white' : 'text-white/60'
      }`}
    >
      <div className="mt-[2px] shrink-0">
        {included ? (
          isComingSoon ? (
            <Sparkles className="h-[16px] w-[16px] text-fuchsia-300" strokeWidth={2.8} />
          ) : (
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          )
        ) : (
          <X className="h-5 w-5 text-white/45" />
        )}
      </div>

      <span>{label}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  let icon = null

  if (children === 'Vibe TV') {
    icon = <Film className="h-5 w-5 text-current" />
  } else if (children === 'Vibelink') {
    icon = <Heart className="h-5 w-5 text-current" />
  }

  return (
    <div className="flex items-center gap-2 text-[18px] font-semibold italic text-white">
      {icon}
      <span>{children}</span>
    </div>
  )
}

function PlanCard({
  plan,
  currentPlan,
  selectedPlan,
  onSelect,
  t,
}: {
  plan: Plan
  currentPlan: PlanId
  selectedPlan: PlanId
  onSelect: (planId: PlanId) => void
  t: (typeof membershipText)[Locale]
}) {
  const isCurrent = currentPlan === plan.id
  const isSelected = selectedPlan === plan.id

  return (
    <div
      className={`relative rounded-[26px] border border-white/15 bg-gradient-to-br from-[#22152f]/80 via-[#120f1d]/78 to-black/78 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200
      ${plan.id === 'premium' ? 'scale-[1.02] ring-2 ring-fuchsia-500/80 shadow-[0_12px_48px_rgba(217,70,239,0.18)]' : ''}
      ${isSelected ? 'border-fuchsia-400/50' : ''}`}
    >
      <div className="mb-4">
        <div className="text-[20px] font-semibold tracking-wide text-white">
          <span>{plan.name}</span>
          <span className="text-white/70"> : </span>
          <span>{plan.price}NTD</span>
          <span className="text-white/60"> / {t.monthly}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3 border-t border-white/12 pt-4">
          <SectionTitle>Vibelink</SectionTitle>
          {plan.features.vibelink.map((feature) => (
            <FeatureRow key={feature.label} {...feature} />
          ))}
        </div>

        <div className="space-y-3 border-t border-white/12 pt-4">
          <SectionTitle>Vibe TV</SectionTitle>
          {plan.features.vibeTv.map((feature) => (
            <FeatureRow key={feature.label} {...feature} />
          ))}
        </div>
      </div>

      <button
        onClick={() => onSelect(plan.id)}
        className={`mt-6 h-12 w-full rounded-full text-[16px] font-semibold transition-all ${
          isCurrent
            ? 'border border-white/10 bg-white/10 text-white/45'
            : 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-[0_8px_24px_rgba(217,70,239,0.28)] hover:scale-[1.01]'
        }`}
      >
        {isCurrent ? t.currentUsing : t.selectPlan}
      </button>
    </div>
  )
}

export default function Page() {
  const [locale, setLocale] = useState<Locale>('zh-TW')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)

  const t = membershipText[locale]
  const plans = useMemo(() => getPlans(t), [t])

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('premium')
  const [currentPlan] = useState<PlanId>('premium')
  const [status] = useState<SubscriptionStatus>('active')
  const [autoRenew, setAutoRenew] = useState(true)

  const activePlan = useMemo(
    () => plans.find((plan) => plan.id === currentPlan) ?? plans[0],
    [plans, currentPlan]
  )

  const currentLanguageLabel =
    languageOptions.find((item) => item.value === locale)?.label ?? '繁體中文'

  const nextBillingDate = '2026 / 04 / 28'

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_28%),linear-gradient(180deg,_#16101f_0%,_#09090d_55%,_#040405_100%)] text-white">
      <div className="mx-auto w-full max-w-[430px] px-4 py-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">{t.title}</h1>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
              className="flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md transition active:scale-[0.96]"
            >
              <Languages className="h-4 w-4 text-fuchsia-200" strokeWidth={2.4} />
              <span>{currentLanguageLabel}</span>
            </button>

            <AnimatePresence>
              {isLanguageMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-[46px] z-[30] w-[150px] overflow-hidden rounded-[18px] border border-white/12 bg-[#15101f]/95 p-1 shadow-[0_14px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                >
                  {languageOptions.map((item) => {
                    const active = item.value === locale

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setLocale(item.value)
                          setIsLanguageMenuOpen(false)
                        }}
                        className={`flex h-11 w-full items-center justify-between rounded-[14px] px-3 text-left text-[14px] font-semibold transition ${
                          active
                            ? 'bg-fuchsia-500/18 text-fuchsia-100'
                            : 'text-white/75 active:bg-white/8'
                        }`}
                      >
                        <span>{item.label}</span>
                        {active && (
                          <Check className="h-4 w-4 text-fuchsia-200" strokeWidth={2.8} />
                        )}
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/12 bg-gradient-to-br from-[#241630]/78 via-[#12111a]/72 to-black/72 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-white">{t.currentStatus}</div>

            <div className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-sm font-semibold text-fuchsia-200">
              {status === 'active' ? t.active : status === 'paused' ? t.paused : t.cancelled}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="mb-1 text-sm text-white/55">{t.currentPlan}</div>
              <div className="text-lg font-bold text-white">{activePlan.name}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="mb-1 text-sm text-white/55">{t.nextBillingDate}</div>
              <div className="text-lg font-bold text-white">{nextBillingDate}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">{t.choosePlan}</h2>
        </div>

        <div className="flex flex-col gap-5 pb-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={currentPlan}
              selectedPlan={selectedPlan}
              onSelect={setSelectedPlan}
              t={t}
            />
          ))}
        </div>

        <div className="rounded-[28px] border border-white/12 bg-gradient-to-br from-[#241630]/78 via-[#12111a]/72 to-black/72 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="mb-3 text-lg font-semibold text-white">{t.renewalPayment}</div>

          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
            <div>
              <div className="font-medium text-white">{t.autoRenew}</div>
              <div className="text-sm text-white/55">{t.autoRenewDesc}</div>
            </div>

            <button
              onClick={() => setAutoRenew((prev) => !prev)}
              className={`relative h-7 w-14 rounded-full transition ${
                autoRenew ? 'bg-fuchsia-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  autoRenew ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="text-sm text-white/55">{t.paymentMethod}</div>
            <div className="mt-1 font-semibold text-white">Visa •••• 0726</div>
          </div>
        </div>
      </div>
    </div>
  )
}