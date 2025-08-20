'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
}

export default function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={className}>{text}</span>
  }

  const words = text.split(' ')
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="mr-2 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}