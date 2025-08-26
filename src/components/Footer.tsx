'use client'

import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import SocialLinks from '@/components/ui/SocialLinks'
import { CONTACT_INFO, QUICK_LINKS } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deep-charcoal text-warm-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* School Information */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4">
                  <Image
                    src="/images/OIA_Academy_Logo.png"
                    alt="OIA Academy Edmonton - Omar Ibn Al-Khattab Academy"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-terracotta-red">{CONTACT_INFO.school.name}</h3>
                  <p className="text-soft-beige-lightest text-sm">{CONTACT_INFO.school.tagline}</p>
                </div>
              </div>
              <p className="text-soft-beige-lightest leading-relaxed mb-6">
                Preparing tomorrow's Muslim leaders today through quality Islamic education, 
                strong academic programs, and character development rooted in Islamic values.
              </p>
              <div className="arabic-text text-sage-green text-lg mb-4">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-terracotta-red mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.main.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-terracotta-red rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-bold text-terracotta-red mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <Icon name="location" size={20} className="text-terracotta-red mr-2 mt-1 flex-shrink-0" aria-hidden="true" />
                <div className="text-soft-beige-lightest text-sm">
                  <p>{CONTACT_INFO.school.address.street}</p>
                  <p>{CONTACT_INFO.school.address.city}, {CONTACT_INFO.school.address.province} {CONTACT_INFO.school.address.postalCode}</p>
                  <p>{CONTACT_INFO.school.address.country}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Icon name="phone" size={18} className="text-terracotta-red mr-2 flex-shrink-0" aria-hidden="true" />
                <a 
                  href={`tel:${CONTACT_INFO.phone.link}`} 
                  className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 text-sm"
                >
                  {CONTACT_INFO.phone.display}
                </a>
              </div>
              <div className="flex items-center">
                <Icon name="email" size={18} className="text-terracotta-red mr-2 flex-shrink-0" aria-hidden="true" />
                <a 
                  href={`mailto:${CONTACT_INFO.emails.general}`} 
                  className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 text-sm"
                >
                  {CONTACT_INFO.emails.general}
                </a>
              </div>
              <div className="flex items-center">
                <Icon name="graduation" size={18} className="text-terracotta-red mr-2 flex-shrink-0" aria-hidden="true" />
                <a 
                  href={`mailto:${CONTACT_INFO.emails.admissions}`} 
                  className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 text-sm"
                >
                  {CONTACT_INFO.emails.admissions}
                </a>
              </div>
            </div>

            {/* School Hours */}
            <div className="mt-6">
              <h5 className="text-md font-semibold text-terracotta-red mb-2">School Hours</h5>
              <div className="text-soft-beige-lightest text-sm space-y-1">
                <p>{CONTACT_INFO.hours.school}</p>
                <p>{CONTACT_INFO.hours.saturday}</p>
                <p>{CONTACT_INFO.hours.office}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Links Section */}
        <div className="border-t border-soft-beige/20 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Admissions */}
            <div>
              <h4 className="text-md font-bold text-terracotta-red mb-3">Admissions</h4>
              <ul className="space-y-2 text-sm">
                {QUICK_LINKS.admissions.map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href} 
                      className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-md font-bold text-terracotta-red mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                {QUICK_LINKS.resources.map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href} 
                      className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-md font-bold text-terracotta-red mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                {QUICK_LINKS.support.map((link) => (
                  <li key={link.href}>
                    <a 
                      href={link.href} 
                      className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-soft-beige/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Social Media */}
            <div className="mb-6 md:mb-0">
              <h4 className="text-md font-bold text-terracotta-red mb-3">Follow Us</h4>
              <SocialLinks variant="footer" />
            </div>

            {/* Newsletter Signup */}
            <div className="text-center md:text-right">
              <h4 className="text-md font-bold text-terracotta-red mb-3">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-white text-deep-teal border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent transition-all duration-200"
                />
                <button className="bg-terracotta-red hover:bg-terracotta-red-dark text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-deep-charcoal-light border-t border-soft-beige/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            
            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              <p className="text-soft-beige-lightest">
                © {currentYear} {CONTACT_INFO.school.name}. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              <a 
                href="/privacy" 
                className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
              >
                Terms of Use
              </a>
              <a 
                href="/accessibility" 
                className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
              >
                Accessibility
              </a>
              <a 
                href="/sitemap" 
                className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
              >
                Sitemap
              </a>
            </div>

            {/* Accreditation/Status */}
            <div className="mt-4 md:mt-0">
              <p className="text-soft-beige-lightest text-xs">
                Accredited by Alberta Education
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}