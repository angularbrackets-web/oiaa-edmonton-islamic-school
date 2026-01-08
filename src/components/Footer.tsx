'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import SocialLinks from '@/components/ui/SocialLinks'
import { CONTACT_INFO, QUICK_LINKS } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Site settings state
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})

  // Footer links state
  const [footerLinks, setFooterLinks] = useState<any>({
    main: [],
    admissions: [],
    resources: [],
    support: [],
    legal: []
  })

  // Fetch site settings from API
  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSiteSettings(data.settings)
        }
      })
      .catch(err => {
        console.error('Site settings fetch error:', err)
      })
  }, [])

  // Fetch footer links from API
  useEffect(() => {
    fetch('/api/footer-links')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.grouped) {
          setFooterLinks(data.grouped)
        }
      })
      .catch(err => {
        console.error('Footer links fetch error:', err)
      })
  }, [])

  // Contact info from site settings with fallbacks to constants
  const schoolName = siteSettings.school_name || CONTACT_INFO.school.name
  const schoolTagline = siteSettings.school_tagline || CONTACT_INFO.school.tagline
  const phone = siteSettings.contact_phone || CONTACT_INFO.phone.display
  const phoneLink = phone.replace(/\D/g, '')
  const emailGeneral = siteSettings.contact_email || CONTACT_INFO.emails.general
  const emailAdmissions = siteSettings.contact_admissions_email || CONTACT_INFO.emails.admissions
  const addressStreet = siteSettings.address_street || CONTACT_INFO.school.address.street
  const addressCity = siteSettings.address_city || CONTACT_INFO.school.address.city
  const addressProvince = siteSettings.address_province || CONTACT_INFO.school.address.province
  const addressPostal = siteSettings.address_postal || CONTACT_INFO.school.address.postalCode
  const addressCountry = siteSettings.address_country || CONTACT_INFO.school.address.country
  const hoursWeekday = siteSettings.hours_weekday || CONTACT_INFO.hours.school
  const hoursSaturday = siteSettings.hours_saturday || CONTACT_INFO.hours.saturday
  const hoursOffice = siteSettings.hours_office || CONTACT_INFO.hours.office

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
                  <h3 className="text-xl font-bold text-terracotta-red">{schoolName}</h3>
                  <p className="text-soft-beige-lightest text-sm">{schoolTagline}</p>
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
              {(footerLinks.main && footerLinks.main.length > 0 ? footerLinks.main : QUICK_LINKS.main).map((link: any) => (
                <li key={link.href || link.id}>
                  <a
                    href={link.href}
                    className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 flex items-center group"
                    target={link.open_in_new_tab ? '_blank' : undefined}
                    rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
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
                <Icon name="location" size={20} className="text-terracotta-red mr-2 mt-1 flex-shrink-0" aria-hidden={true} />
                <div className="text-soft-beige-lightest text-sm">
                  <p>{addressStreet}</p>
                  <p>{addressCity}, {addressProvince} {addressPostal}</p>
                  <p>{addressCountry}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Icon name="phone" size={18} className="text-terracotta-red mr-2 flex-shrink-0" aria-hidden={true} />
                <a
                  href={`tel:${phoneLink}`}
                  className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 text-sm"
                >
                  {phone}
                </a>
              </div>
              <div className="flex items-center">
                <Icon name="email" size={18} className="text-terracotta-red mr-2 flex-shrink-0" aria-hidden={true} />
                <a
                  href={`mailto:${emailGeneral}`}
                  className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 text-sm"
                >
                  {emailGeneral}
                </a>
              </div>
              <div className="flex items-center">
                <Icon name="graduation" size={18} className="text-terracotta-red mr-2 flex-shrink-0" aria-hidden={true} />
                <a
                  href={`mailto:${emailAdmissions}`}
                  className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300 text-sm"
                >
                  {emailAdmissions}
                </a>
              </div>
            </div>

            {/* School Hours */}
            <div className="mt-6">
              <h5 className="text-md font-semibold text-terracotta-red mb-2">School Hours</h5>
              <div className="text-soft-beige-lightest text-sm space-y-1">
                <p>{hoursWeekday}</p>
                <p>{hoursSaturday}</p>
                <p>{hoursOffice}</p>
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
                {(footerLinks.admissions && footerLinks.admissions.length > 0 ? footerLinks.admissions : QUICK_LINKS.admissions).map((link: any) => (
                  <li key={link.href || link.id}>
                    <a
                      href={link.href}
                      className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
                      target={link.open_in_new_tab ? '_blank' : undefined}
                      rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
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
                {(footerLinks.resources && footerLinks.resources.length > 0 ? footerLinks.resources : QUICK_LINKS.resources).map((link: any) => (
                  <li key={link.href || link.id}>
                    <a
                      href={link.href}
                      className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
                      target={link.open_in_new_tab ? '_blank' : undefined}
                      rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
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
                {(footerLinks.support && footerLinks.support.length > 0 ? footerLinks.support : QUICK_LINKS.support).map((link: any) => (
                  <li key={link.href || link.id}>
                    <a
                      href={link.href}
                      className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
                      target={link.open_in_new_tab ? '_blank' : undefined}
                      rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
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
                © {currentYear} {schoolName}. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              {(footerLinks.legal && footerLinks.legal.length > 0 ? footerLinks.legal : [
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Use' },
                { href: '/accessibility', label: 'Accessibility' },
                { href: '/sitemap', label: 'Sitemap' }
              ]).map((link: any) => (
                <a
                  key={link.href || link.id}
                  href={link.href}
                  className="text-soft-beige-lightest hover:text-terracotta-red transition-colors duration-300"
                  target={link.open_in_new_tab ? '_blank' : undefined}
                  rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
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