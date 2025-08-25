export const CONTACT_INFO = {
  school: {
    name: 'OIA Academy Edmonton',
    tagline: 'Islamic Excellence in Education',
    address: {
      street: '123 Islamic Center Drive',
      city: 'Edmonton',
      province: 'AB',
      postalCode: 'T6X 1A1',
      country: 'Canada'
    }
  },
  phone: {
    display: '(780) 123-4567',
    link: '+17801234567'
  },
  emails: {
    general: 'info@oiaaedmonton.ca',
    admissions: 'admissions@oiaaedmonton.ca'
  },
  hours: {
    school: 'Monday - Friday: 8:00 AM - 3:30 PM',
    saturday: 'Saturday: 9:00 AM - 2:00 PM', 
    office: 'Office: 8:00 AM - 4:00 PM'
  },
  tour: {
    availability: 'Monday-Friday 9:00 AM - 2:00 PM',
    description: 'Individual or family tours welcome'
  }
}

export const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/oiaaedmonton',
    icon: 'facebook'
  },
  {
    name: 'Instagram', 
    url: 'https://instagram.com/oiaaedmonton',
    icon: 'instagram'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/oiaaedmonton', 
    icon: 'twitter'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/oiaaedmonton',
    icon: 'youtube'
  }
]

export const QUICK_LINKS = {
  main: [
    { label: 'About Us', href: '#about' },
    { label: 'Academic Programs', href: '#programs' },
    { label: 'News & Updates', href: '/news' },
    { label: 'Events', href: '/events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Careers', href: '/careers' }
  ],
  admissions: [
    { label: 'Apply Now', href: '/admissions' },
    { label: 'Requirements', href: '/admissions/requirements' },
    { label: 'Tuition & Fees', href: '/admissions/tuition' },
    { label: 'Schedule a Tour', href: '/admissions/tour' }
  ],
  resources: [
    { label: 'Parent Portal', href: '/parents' },
    { label: 'Student Portal', href: '/students' },
    { label: 'Academic Calendar', href: '/calendar' },
    { label: 'Student Handbook', href: '/handbook' }
  ],
  support: [
    { label: 'Donate', href: '/donate' },
    { label: 'Volunteer', href: '/volunteer' },
    { label: 'Fundraising Events', href: '/fundraising' },
    { label: 'Contact Support', href: '#contact' }
  ]
}