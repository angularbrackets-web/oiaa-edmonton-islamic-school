import Icon from '@/components/ui/Icon'
import { SOCIAL_LINKS } from '@/lib/constants'

interface SocialLinksProps {
  variant?: 'footer' | 'contact'
  className?: string
}

export default function SocialLinks({ variant = 'footer', className = '' }: SocialLinksProps) {
  if (variant === 'footer') {
    return (
      <div className={`flex space-x-4 ${className}`}>
        {SOCIAL_LINKS.map((social) => (
          <a 
            key={social.name}
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-terracotta-red hover:bg-terracotta-red-dark rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label={social.name}
          >
            <Icon name={social.icon} size={20} className="text-white" aria-hidden="true" />
          </a>
        ))}
      </div>
    )
  }

  // Contact variant - simpler styling
  return (
    <div className={`inline-flex space-x-6 ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <a 
          key={social.name}
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-wood hover:text-soft-beige-lightest transition-colors duration-300" 
          aria-label={social.name}
        >
          <Icon name={social.icon} size={28} aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}