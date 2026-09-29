import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Truck,
  Layers,
  ArrowRight
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { STORE_ADDRESS, STORE_PHONE, STORE_WHATSAPP_NUMBER, STORE_EMAIL, getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-charcoal-950 text-white p-8 sm:p-14 border border-charcoal-800 shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity filter blur-[1px]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Township, Lahore, Pakistan
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            About Al Zaban Hardware Store
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Al Zaban Hardware Store is a Lahore-based hardware and tools business dedicated to supplying reliable, high-grade tools, building materials, and workshop equipment to professionals, builders, contractors, and DIY enthusiasts across Lahore and Pakistan.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900">
            Quality-Focused Product Selection
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We curate genuine, durable hardware and tools from established manufacturers including Stanley, Ingco, Total, Bosch, Makita, and Dewalt. Every item meets stringent safety and performance requirements.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900">
            Comprehensive Hardware Catalog
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            From heavy-duty rotary hammers and impact drills to plumbing fittings, fasteners, electrical conduits, and workshop storage accessories, we maintain ready inventory for projects of any scale.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-charcoal-900">
            Customer-Focused Service
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Our experienced hardware staff provides personalized technical advice, project bill-of-quantities assistance, and rapid order fulfillment with prompt delivery across Lahore.
          </p>
        </div>
      </div>

      {/* Lahore Location Spotlight */}
      <div className="bg-charcoal-900 rounded-3xl p-8 sm:p-12 text-white border border-charcoal-800 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Lahore Showroom & Distribution
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Serving Township and Greater Lahore
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Conveniently situated in Sector B-1 of Township, Lahore, Al Zaban Hardware Store operates as both a direct walk-in hardware store and an efficient distribution center for contractors, builders, and tradesmen.
          </p>
          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{STORE_ADDRESS}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{STORE_PHONE}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">WA</span>
              <span>+92 335 1108300</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{STORE_EMAIL}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-4 text-center">
          <h3 className="text-base font-bold text-white">Have a Hardware Requirement?</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Connect directly with our Township store team for stock availability, contractor pricing, or store visits.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-xs transition-colors"
            >
              Visit Contact Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
