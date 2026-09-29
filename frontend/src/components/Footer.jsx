import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  ShieldCheck,
  Truck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { STORE_PHONE, STORE_WHATSAPP_NUMBER, STORE_ADDRESS, STORE_EMAIL, getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal-950 text-gray-400 text-sm border-t border-charcoal-800">
      {/* Top Value Banner */}
      <div className="border-b border-charcoal-800/80 py-8 px-4 bg-charcoal-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">100% Genuine Tools</div>
              <div className="text-xs text-gray-400 mt-0.5">Directly sourced manufacturer hardware</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Swift Lahore Delivery</div>
              <div className="text-xs text-gray-400 mt-0.5">Free delivery on orders over Rs. 5,000</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Township Store Open Daily</div>
              <div className="text-xs text-gray-400 mt-0.5">Mon - Sat: 9:00 AM - 8:00 PM</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">WhatsApp & Phone Support</div>
              <div className="text-xs text-gray-400 mt-0.5">Expert hardware advice & quotes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Store Intro */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-charcoal-950 font-black">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Al Zaban Hardware Store
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Al Zaban Hardware Store is a premier hardware, tools, building and industrial supplies merchant based in Township, Lahore. We equip builders, contractors, trade professionals, and DIY builders with industrial-grade tools.
            </p>
            <div className="pt-1">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-600/30 transition-all"
              >
                Inquire on WhatsApp (+92 335 1108300)
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Shop Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/hand-tools" className="hover:text-amber-400 transition-colors">
                  Hand Tools
                </Link>
              </li>
              <li>
                <Link to="/category/power-tools" className="hover:text-amber-400 transition-colors">
                  Power Tools
                </Link>
              </li>
              <li>
                <Link to="/category/plumbing-supplies" className="hover:text-amber-400 transition-colors">
                  Plumbing Supplies
                </Link>
              </li>
              <li>
                <Link to="/category/electrical-supplies" className="hover:text-amber-400 transition-colors">
                  Electrical Supplies
                </Link>
              </li>
              <li>
                <Link to="/category/fasteners" className="hover:text-amber-400 transition-colors">
                  Fasteners & Screws
                </Link>
              </li>
              <li>
                <Link to="/category/safety-equipment" className="hover:text-amber-400 transition-colors">
                  Safety Equipment
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-amber-400 font-semibold hover:underline">
                  All 12 Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About Our Store
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-amber-400 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Shipping & Lahore Delivery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Township Store Pickup
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-4">
              Contact Store
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{STORE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+924235110830" className="hover:text-amber-400 transition-colors">
                  {STORE_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">WA</span>
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors text-amber-400 font-medium"
                >
                  +92 335 1108300
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-amber-400 transition-colors">
                  {STORE_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Back to Top */}
      <div className="bg-black/40 border-t border-charcoal-800/80 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            © {new Date().getFullYear()} <strong className="text-gray-200">Al Zaban Hardware Store</strong>. All rights reserved. Plot #3, Sector B-1, Block 11, Township, Lahore.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Cash on Delivery & Bank Transfer</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded bg-charcoal-800 hover:bg-amber-500 hover:text-charcoal-950 text-gray-300 transition-colors flex items-center gap-1"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
