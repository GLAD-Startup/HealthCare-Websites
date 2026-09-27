import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  MessageSquare,
  ArrowLeft,
  Stethoscope,
  Heart,
  Pill,
  Thermometer,
  ShieldPlus,
  Syringe,
} from 'lucide-react';

interface NotFoundViewProps {
  attemptedRoute?: string;
  onNavigate: (tab: 'dashboard' | 'patients' | 'followups' | 'whatsapp') => void;
}

/* ── Floating medical icon config ──────────────────────────── */
const FLOATING_ICONS = [
  { Icon: Stethoscope, size: 28, left: '8%',  top: '18%', delay: '0s',    dur: '7s'  },
  { Icon: Heart,       size: 22, left: '85%', top: '12%', delay: '1.2s',  dur: '8s'  },
  { Icon: Pill,        size: 24, left: '72%', top: '70%', delay: '0.6s',  dur: '6.5s'},
  { Icon: Thermometer, size: 20, left: '15%', top: '72%', delay: '2s',    dur: '9s'  },
  { Icon: ShieldPlus,  size: 26, left: '90%', top: '45%', delay: '0.8s',  dur: '7.5s'},
  { Icon: Syringe,     size: 21, left: '5%',  top: '48%', delay: '1.6s',  dur: '8.5s'},
];

const QUICK_LINKS = [
  { tab: 'dashboard'  as const, label: 'Dashboard',   icon: LayoutDashboard, desc: 'Overview & analytics'      },
  { tab: 'patients'   as const, label: 'Patients',     icon: Users,           desc: 'Patient directory'          },
  { tab: 'followups'  as const, label: 'Follow-ups',   icon: CalendarClock,   desc: 'Scheduled consultations'    },
  { tab: 'whatsapp'   as const, label: 'WhatsApp',     icon: MessageSquare,   desc: 'Message center'             },
];

export const NotFoundView: React.FC<NotFoundViewProps> = ({ attemptedRoute, onNavigate }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden select-none">

      {/* ── Subtle radial gradient background ──────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(15,118,110,0.06) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(254,249,195,0.18) 0%, transparent 60%)',
        }}
      />

      {/* ── Floating medical icons ─────────────────────────── */}
      {FLOATING_ICONS.map(({ Icon, size, left, top, delay, dur }, i) => (
        <div
          key={i}
          className="pointer-events-none absolute opacity-0"
          style={{
            left,
            top,
            animation: `notFoundFloat ${dur} ease-in-out ${delay} infinite`,
          }}
        >
          <Icon
            style={{ width: size, height: size }}
            className="text-[#0F766E]/[0.07]"
            strokeWidth={1.5}
          />
        </div>
      ))}

      {/* ── Central content card ───────────────────────────── */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 py-10 sm:px-10 sm:py-14 max-w-xl w-full transition-all duration-700 ease-out"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg ring-1 ring-[#E2E8F0] mb-6 transition-transform duration-300 hover:scale-105">
          <img
            src="/Vrindavan_Healthcare_logo.png"
            alt="Vrindavan Healthcare"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 404 Typography */}
        <h1
          className="text-[96px] sm:text-[120px] font-semibold leading-none tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #0F766E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-semibold text-[#0F172A] mt-2 mb-2">
          Page not found
        </h2>

        <p className="text-sm sm:text-base text-[#64748B] max-w-sm leading-relaxed mb-1">
          The section you're looking for doesn't exist in the clinic CRM, or may have been moved.
        </p>

        {attemptedRoute && (
          <p className="text-xs text-[#94A3B8] font-mono mt-1 mb-4 px-3 py-1.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
            Route: <span className="text-[#475569]">#{attemptedRoute}</span>
          </p>
        )}

        {/* Primary CTA */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="btn-primary h-10 px-5 gap-2 mt-4 mb-8 text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs mb-6">
          <div className="flex-1 h-px bg-[#E2E8F0]" />
          <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">or go to</span>
          <div className="flex-1 h-px bg-[#E2E8F0]" />
        </div>

        {/* Quick navigation cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
          {QUICK_LINKS.map(({ tab, label, icon: Icon, desc }, idx) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F0FDFA] hover:border-[#0F766E]/30 transition-all duration-200 shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${300 + idx * 80}ms`,
                transitionProperty: 'opacity, transform, background-color, border-color, box-shadow',
                transitionDuration: '500ms, 500ms, 200ms, 200ms, 200ms',
              }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center group-hover:bg-[#0F766E] group-hover:border-[#0F766E] transition-colors duration-200">
                <Icon className="w-4 h-4 text-[#0F766E] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-[#0F172A] block leading-tight">{label}</span>
                <span className="text-[10px] text-[#94A3B8] leading-tight hidden sm:block mt-0.5">{desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom branding ────────────────────────────────── */}
      <p
        className="absolute bottom-6 text-[11px] text-[#CBD5E1] tracking-wide transition-opacity duration-700"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        Vrindavan Healthcare · Clinic CRM
      </p>
    </div>
  );
};
