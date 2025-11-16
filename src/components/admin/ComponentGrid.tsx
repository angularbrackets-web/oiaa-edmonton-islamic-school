'use client'

import { useState } from 'react'
import { ReusableComponent } from '@/types/cms'
import ComponentCard from './ComponentCard'
import EditComponentModal from './EditComponentModal'

interface ComponentGridProps {
  components: ReusableComponent[]
  onDelete: (id: string) => void
  onUpdate: (component: ReusableComponent) => void
}

export default function ComponentGrid({
  components,
  onDelete,
  onUpdate
}: ComponentGridProps) {
  const [editingComponent, setEditingComponent] = useState<ReusableComponent | null>(null)

  const handleEdit = (component: ReusableComponent) => {
    setEditingComponent(component)
  }

  const handleUpdate = (updated: ReusableComponent) => {
    onUpdate(updated)
    setEditingComponent(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <ComponentCard
            key={component.id}
            component={component}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingComponent && (
        <EditComponentModal
          component={editingComponent}
          onClose={() => setEditingComponent(null)}
          onUpdated={handleUpdate}
        />
      )}
    </>
  )
}
