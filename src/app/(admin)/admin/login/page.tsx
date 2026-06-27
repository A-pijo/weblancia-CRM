"use client"

import { useActionState, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { login } from "@/lib/auth/actions"

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: 5 + ((i * 37 + 13) % 90),
  top: 5 + ((i * 73 + 7) % 90),
  yAnim: -30 * (0.5 + ((i * 11 + 3) % 10) / 10),
  duration: 3 + ((i * 7 + 5) % 4),
  delay: ((i * 13 + 11) % 50) / 10,
}))

const CURRENT_YEAR = new Date().getFullYear()

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {visible ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  )
}

const featureCards = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Services CMS",
    desc: "Manage all service offerings with rich content",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Portfolio Manager",
    desc: "Showcase projects with media and case studies",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: "SEO Center",
    desc: "Audit metadata, optimize rankings, track pages",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: "Academy Platform",
    desc: "Create courses, workshops, certificates & more",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const statVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay: 1 + i * 0.12 },
  }),
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#020617] overflow-hidden">
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-b from-[#09090B] via-[#111827] to-[#1E293B]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }} />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#C86544]/15 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C86544]/10 via-transparent to-transparent blur-[80px]" />
        <div className="absolute top-[40%] right-[-15%] w-[400px] h-[400px] rounded-full bg-gradient-to-l from-[#C86544]/8 to-transparent blur-[120px]" />
        {[
          { size: 280, x: "20%", y: "15%", blur: 60, delay: 0 },
          { size: 200, x: "65%", y: "25%", blur: 50, delay: 2 },
          { size: 180, x: "35%", y: "60%", blur: 45, delay: 4 },
          { size: 140, x: "75%", y: "70%", blur: 40, delay: 6 },
        ].map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/[0.06]"
            style={{
              width: c.size,
              height: c.size,
              left: c.x,
              top: c.y,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: c.delay,
            }}
          />
        ))}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute w-[2px] h-[2px] rounded-full bg-white/30"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, p.yAnim],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
        <div className="relative z-10 flex flex-col justify-center px-16 w-full max-w-[500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] font-medium text-white/60 tracking-[0.15em] uppercase mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C86544]" />
              Weblancia Admin
            </span>
            <h1 className="text-[42px] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-5">
              Manage your digital agency
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C86544] via-[#DD7D5A] to-[#E89575]">
                from one intelligent workspace.
              </span>
            </h1>
            <p className="text-[18px] text-[#94A3B8] leading-relaxed max-w-md mb-10">
              Enterprise-grade content management system built for modern agencies. Services, projects, blog, academy — all in one powerful dashboard.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 mb-12"
          >
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C86544]/20 to-[#C86544]/5 flex items-center justify-center text-[#C86544] group-hover:from-[#C86544]/30 group-hover:to-[#C86544]/10 transition-all duration-300 shrink-0">
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{card.title}</p>
                  <p className="text-[13px] text-white/40">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="flex items-center gap-10 pt-6 border-t border-white/[0.06]"
          >
            {[
              { value: "150+", label: "Projects" },
              { value: "40+", label: "Services" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={statVariants}
              >
                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-[13px] text-white/40 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 relative bg-[#0F172A]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[420px] lg:max-w-[480px] relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-[#C86544]/10 via-transparent to-transparent rounded-3xl blur-2xl" />
          <div
            className="relative rounded-[20px] sm:rounded-[28px] px-6 sm:px-10 lg:px-14 py-10 sm:py-14"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
            }}
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C86544] to-[#E07A57] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#C86544]/25">
                <span className="text-white text-2xl font-bold">W</span>
              </div>
              <h2 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-[15px] text-[#94A3B8] mt-2">Sign in to your Admin Dashboard</p>
            </div>
            <form action={formAction} className="space-y-5">
              <AnimatePresence>
                {state?.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl"
                  >
                    {state.error}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative">
                <motion.label
                  htmlFor="email"
                  className="block text-[14px] font-medium text-[#94A3B8] mb-2"
                  animate={{
                    color: emailFocused ? "#C86544" : "#94A3B8",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Email Address
                </motion.label>
                <div
                  className="relative rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: emailFocused ? "0 0 0 1px #C86544, 0 0 20px rgba(200,101,68,0.15)" : "0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4L12 13 2 4" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="w-full h-14 pl-12 pr-4 bg-[#020617] border-0 rounded-2xl text-[16px] text-white placeholder-[#475569] focus:outline-none"
                    placeholder="you@agency.com"
                    style={{ background: "#020617" }}
                  />
                </div>
              </div>
              <div className="relative">
                <motion.label
                  htmlFor="password"
                  className="block text-[14px] font-medium text-[#94A3B8] mb-2"
                  animate={{
                    color: passwordFocused ? "#C86544" : "#94A3B8",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Password
                </motion.label>
                <div
                  className="relative rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: passwordFocused ? "0 0 0 1px #C86544, 0 0 20px rgba(200,101,68,0.15)" : "0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full h-14 pl-12 pr-12 bg-[#020617] border-0 rounded-2xl text-[16px] text-white placeholder-[#475569] focus:outline-none"
                    placeholder="Enter your password"
                    style={{ background: "#020617" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-sm text-[#94A3B8] cursor-pointer select-none group">
                  <div className="relative w-[18px] h-[18px]">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 rounded-md border border-white/[0.12] bg-white/[0.04] peer-checked:bg-[#C86544] peer-checked:border-[#C86544] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C86544]/30 transition-all duration-200" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="group-hover:text-white transition-colors">Remember me</span>
                </label>
                <span className="text-sm text-[#64748B] cursor-not-allowed select-none">Forgot password?</span>
              </div>
              <motion.button
                type="submit"
                disabled={pending}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full h-14 rounded-2xl font-semibold text-[15px] text-white overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #C86544, #E07A57)",
                  boxShadow: "0 8px 32px rgba(200,101,68,0.35)",
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(135deg, #DD7D5A, #EC8B68)",
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {pending ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      Sign In
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </span>
              </motion.button>
            </form>
            <div className="mt-10 text-center">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[12px] text-white/30 tracking-wide">Protected</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <p className="text-[13px] text-white/40 mb-4 flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Protected by{" "}
                <span
                  className="relative group/tooltip"
                  title="Security powered by RDHT Web Security Suite"
                >
                  <a
                    href="https://rdht-security.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 underline-offset-2 decoration-white/20 hover:text-[#C86544] hover:underline transition-all duration-200"
                  >
                    RDHT Web Security Suite
                  </a>
                </span>
              </p>
              <div className="flex items-center justify-center gap-3">
                {[
                  { label: "Enterprise Security", emoji: "🛡️" },
                  { label: "Encrypted Sessions", emoji: "🔐" },
                  { label: "Continuous Protection", emoji: "⚡" },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.06] text-[11px] text-white/50"
                  >
                    <span className="text-[13px]">{badge.emoji}</span>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-[12px] text-white/25">
            &copy; {CURRENT_YEAR} Weblancia. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
