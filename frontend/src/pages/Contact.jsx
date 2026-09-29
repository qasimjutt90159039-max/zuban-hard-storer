import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useToast } from '../context/ToastContext';
import { STORE_ADDRESS, STORE_PHONE, STORE_WHATSAPP_NUMBER, STORE_EMAIL, getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been received. Our team will contact you shortly.', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight mb-2">
          Contact Al Zaban Hardware Store
        </h1>
        <p className="text-sm text-gray-500">
          Get in touch with our team in Township, Lahore for tool inquiries, wholesale supply, or store visits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards (Left 1 Col) */}
        <div className="space-y-4">
          {/* Address Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-charcoal-900">Physical Store Location</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {STORE_ADDRESS}
            </p>
          </div>

          {/* Phone & WhatsApp Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-charcoal-900">Telephone & WhatsApp</h3>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-gray-400">Phone: </span>
                <a href="tel:+924235110830" className="font-bold text-charcoal-900 hover:text-amber-600">
                  {STORE_PHONE}
                </a>
              </div>
              <div>
                <span className="text-gray-400">WhatsApp: </span>
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-600 hover:underline"
                >
                  +92 335 1108300
                </a>
              </div>
            </div>
          </div>

          {/* Email & Support */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-charcoal-900">Official Email</h3>
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="text-xs font-semibold text-charcoal-900 hover:text-amber-600 block"
            >
              {STORE_EMAIL}
            </a>
          </div>

          {/* Business Hours */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-charcoal-900">Opening Hours</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Monday - Saturday:</span>
                <span className="font-semibold text-charcoal-900">9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold text-charcoal-900">Closed (Online Orders Active)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right 2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-charcoal-900 mb-1">
              Send us a Message
            </h2>
            <p className="text-xs text-gray-500">
              Have an inquiry about product specifications, stock levels, or contractor pricing? Fill out the form below.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Message Dispatched</h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you for contacting Al Zaban Hardware Store. A store representative will follow up with you promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-800 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Farooq"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. asad@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +92 321 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bulk Screw Order or Drill Availability"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your hardware requirements or project specifications..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-charcoal-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Location & Map — Township, Lahore
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Plot #3, Sector B-1, Block 11, Township, Lahore 54770, Pakistan
          </p>
        </div>

        {/* Responsive Google Maps Embed */}
        <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
          <iframe
            title="Al Zaban Hardware Store Location Township Lahore"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Township+Sector+B-1+Lahore+Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
