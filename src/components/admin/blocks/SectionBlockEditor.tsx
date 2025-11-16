/**
 * Section Block Editor Component
 *
 * Admin interface for editing Section container blocks
 */
'use client'

import { SectionBlockContent } from '@/types/cms'

interface SectionBlockEditorProps {
  content: SectionBlockContent
  onChange: (content: SectionBlockContent) => void
}

export default function SectionBlockEditor({ content, onChange }: SectionBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📦 Section Container</h4>
        <p className="text-sm text-blue-700">
          This is a container block that groups other blocks together.
        </p>
        <p className="text-sm text-blue-700 mt-2">
          Use the <strong>Layout & Styling</strong> controls below to set:
        </p>
        <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
          <li>Background color for the entire section</li>
          <li>Padding inside the section</li>
          <li>Container width (narrow/contained/wide/full)</li>
          <li>Spacing around the section</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            💡 <strong>Tip:</strong> After saving this section, you'll be able to add blocks inside it
            from the page editor.
          </p>
        </div>
      </div>
    </div>
  )
}
