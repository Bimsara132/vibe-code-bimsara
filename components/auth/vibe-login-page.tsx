'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { hasNonExpiredAuthToken } from '@/lib/iblai/auth-utils'
import { startEmailLogin, startGoogleLogin } from '@/lib/iblai/auth-spa'
import { LOGIN_BRAND } from '@/lib/iblai/login-brand'

import './vibe-login.css'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[1.375rem] shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function applyThemeColors() {
  const { colors } = LOGIN_BRAND
  const root = document.documentElement
  root.style.setProperty('--ibl', colors.ibl)
  root.style.setProperty('--ibl-indigo', colors.iblIndigo)
  root.style.setProperty('--accent', colors.accent)
  root.style.setProperty('--btn-primary-from', colors.btnPrimaryFrom)
  root.style.setProperty('--btn-primary-to', colors.btnPrimaryTo)
  root.style.setProperty('--btn-primary-hover-from', colors.btnPrimaryHoverFrom)
  root.style.setProperty('--btn-primary-hover-to', colors.btnPrimaryHoverTo)
}

function getViewportHeight() {
  if (typeof window === 'undefined') return 730
  if (window.innerWidth <= 768) {
    return Math.min(window.screen.height * 0.85, 650)
  }
  return window.innerHeight
}

function applyResponsiveSizes() {
  const maxHeight = Math.min(getViewportHeight(), 730)
  const isMobile = window.matchMedia('(max-width: 767px)').matches
  const root = document.documentElement

  let tier: {
    logoH: string
    controlH: string
    controlFont: string
    cardPad: string
    stackGap: string
  }

  if (isMobile) {
    if (maxHeight < 600) {
      tier = {
        logoH: '1.75rem',
        controlH: '2.75rem',
        controlFont: '0.875rem',
        cardPad: '1.25rem',
        stackGap: '1rem',
      }
    } else if (maxHeight < 700) {
      tier = {
        logoH: '2.5rem',
        controlH: '2.875rem',
        controlFont: '0.9375rem',
        cardPad: '1.5rem',
        stackGap: '1.125rem',
      }
    } else {
      tier = {
        logoH: '2.75rem',
        controlH: '3.125rem',
        controlFont: '1rem',
        cardPad: '1.75rem',
        stackGap: '1.25rem',
      }
    }
  } else if (maxHeight < 600) {
    tier = {
      logoH: '2.5rem',
      controlH: '2.5rem',
      controlFont: '0.9375rem',
      cardPad: '0.875rem',
      stackGap: '0.875rem',
    }
  } else if (maxHeight < 700) {
    tier = {
      logoH: '3.25rem',
      controlH: '2.75rem',
      controlFont: '1.0625rem',
      cardPad: '1.125rem',
      stackGap: '1.125rem',
    }
  } else {
    tier = {
      logoH: '4rem',
      controlH: '3.25rem',
      controlFont: '1.0625rem',
      cardPad: '1.625rem',
      stackGap: '1.375rem',
    }
  }

  root.style.setProperty('--logo-h', tier.logoH)
  root.style.setProperty('--control-h', tier.controlH)
  root.style.setProperty('--control-font', tier.controlFont)
  root.style.setProperty('--card-pad', tier.cardPad)
  root.style.setProperty('--stack-gap', tier.stackGap)
  root.style.setProperty('--brand-font', isMobile ? '1.875rem' : '2.625rem')
}

function applySectionGap() {
  const isMobile = window.matchMedia('(max-width: 767px)').matches
  const gap = isMobile ? LOGIN_BRAND.sectionGapMobile : LOGIN_BRAND.sectionGap
  document.documentElement.style.setProperty('--section-gap', gap)
}

function applyLayout() {
  applyThemeColors()
  applySectionGap()
  applyResponsiveSizes()
}

export function VibeLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = LOGIN_BRAND.pageTitle
    applyLayout()
    const onResize = () => applyLayout()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (hasNonExpiredAuthToken()) {
      const redirectPath = localStorage.getItem('redirectTo') || '/app'
      router.replace(redirectPath)
    }
  }, [router])

  const handleEmailSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const value = email.trim()
      if (!value) {
        setEmailError('Please enter your email')
        return
      }
      if (!value.includes('@')) {
        setEmailError('Please enter a valid email')
        return
      }
      setEmailError('')
      setSubmitting(true)
      startEmailLogin(value)
    },
    [email],
  )

  const handleGoogle = useCallback(() => {
    setSubmitting(true)
    void startGoogleLogin().catch(() => {
      setSubmitting(false)
    })
  }, [])

  return (
    <main className="vibe-login">
      <div className="vibe-login__inner">
        <div className="vibe-login__logo-row">
          <Image
            src={LOGIN_BRAND.logoUrl}
            alt={LOGIN_BRAND.brandName}
            width={80}
            height={80}
            className="vibe-login__logo object-contain"
            priority
          />
          <span className="vibe-login__brand">{LOGIN_BRAND.brandName}</span>
        </div>

        <div className="vibe-login__main">
          <div className="vibe-login__hero">
            <h1 className="vibe-login__title">{LOGIN_BRAND.title}</h1>
            <p className="vibe-login__tagline">{LOGIN_BRAND.subtitle}</p>
          </div>

          <div className="vibe-login__card">
            <form className="vibe-login__stack" onSubmit={handleEmailSubmit} noValidate>
              <div>
                <input
                  className={`vibe-login__input${emailError ? ' vibe-login__input--error' : ''}`}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (emailError) setEmailError('')
                  }}
                  placeholder={LOGIN_BRAND.emailPlaceholder}
                  autoComplete="email"
                  required
                  disabled={submitting}
                />
                {emailError ? <p className="vibe-login__error">{emailError}</p> : null}
              </div>

              <button
                type="submit"
                className="vibe-login__btn vibe-login__btn--primary"
                disabled={submitting}
              >
                {submitting ? 'Please wait…' : LOGIN_BRAND.primaryButtonText}
              </button>

              <div className="vibe-login__divider">OR</div>

              <button
                type="button"
                className="vibe-login__btn vibe-login__btn--outline"
                onClick={handleGoogle}
                disabled={submitting}
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="vibe-login__legal">
                <a href={LOGIN_BRAND.termsUrl} target="_blank" rel="noreferrer">
                  Terms of Use
                </a>
                <span className="sep">|</span>
                <a href={LOGIN_BRAND.privacyUrl} target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
