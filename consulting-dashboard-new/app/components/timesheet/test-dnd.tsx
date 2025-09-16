'use client'

import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'

function DraggableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-4 bg-blue-500 text-white rounded cursor-move"
    >
      Drag me ({id})
    </div>
  )
}

function DroppableZone({ id }: { id: string }) {
  const { isOver, setNodeRef } = useDroppable({ id })
  
  return (
    <div
      ref={setNodeRef}
      className={`p-8 border-2 border-dashed rounded ${
        isOver ? 'border-green-500 bg-green-50' : 'border-gray-300'
      }`}
    >
      Drop here ({id})
    </div>
  )
}

export function TestDnd() {
  const [result, setResult] = useState<string>('')

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setResult(`Dragged ${active.id} to ${over?.id || 'nowhere'}`)
  }

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold">Drag & Drop Test</h2>
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          <DraggableItem id="item-1" />
          <DraggableItem id="item-2" />
          <DraggableItem id="item-3" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <DroppableZone id="zone-1" />
          <DroppableZone id="zone-2" />
        </div>
      </DndContext>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          Result: {result}
        </div>
      )}
    </div>
  )
}