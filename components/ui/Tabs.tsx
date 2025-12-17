'use client'

import React, { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

type TabsProps = {
  defaultValue: string
  children: ReactNode
  className?: string
}

type TabsListProps = {
  children: ReactNode
  className?: string
}

type TabsTriggerProps = {
  value: string
  children: ReactNode
  className?: string
}

type TabsContentProps = {
  value: string
  children: ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({
  activeTab: '',
  setActiveTab: () => {},
})

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn("flex border-b border-gray-200 mb-4", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-4 py-2 font-medium text-sm transition-colors border-b-2",
        isActive
          ? 'border-green-500 text-green-600'
          : 'border-transparent text-gray-500 hover:text-gray-700',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = React.useContext(TabsContext)

  if (activeTab !== value) {
    return null
  }

  return <div className={className}>{children}</div>
}
