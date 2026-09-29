import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppUrl, STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';

export default function WhatsAppButton() {
  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="mr-3 px-3 py-1.5 rounded-lg bg-charcoal-900 text-white text-xs font-semibold shadow-xl border border-charcoal-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block whitespace-nowrap">
        <span>Chat on WhatsApp (+92 335 1108300)</span>
      </div>

      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        className="relative w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
        title="Chat with Al Zaban Hardware Store on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
}
