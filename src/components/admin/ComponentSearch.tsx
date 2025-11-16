'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { COMPONENT_CATEGORIES, ComponentCategory } from '@/types/cms'

interface ComponentSearchProps {
  onSearch: (query: string, category: string) => void
}

export default function ComponentSearch({ onSearch }: ComponentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearch(query, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onSearch(searchQuery, category)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-soft-beige p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-deep-teal/50" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search components by name or description..."
            className="w-full pl-10 pr-4 py-2 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {Object.entries(COMPONENT_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
