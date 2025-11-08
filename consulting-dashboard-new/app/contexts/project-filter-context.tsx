'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface ProjectFilterState {
  searchQuery: string
  statusFilter: string
  clientFilter: string
  pmFilter: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface ProjectFilterContextType {
  filters: ProjectFilterState
  updateFilter: (key: keyof ProjectFilterState,_value) => void
  resetFilters: () => void
}

const defaultFilters: ProjectFilterState = {
  searchQuery: '',
  statusFilter: 'all',
  clientFilter: 'all',
  pmFilter: 'all',
  sortBy: 'name',
  sortOrder: 'asc'
}

const ProjectFilterContext = createContext<ProjectFilterContextType | undefined>(undefined)

export function ProjectFilterProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [filters, setFilters] = useState<ProjectFilterState>(() => ({
    searchQuery: searchParams.get('search') || defaultFilters.searchQuery,
    statusFilter: searchParams.get('status') || defaultFilters.statusFilter,
    clientFilter: searchParams.get('client') || defaultFilters.clientFilter,
    pmFilter: searchParams.get('pm') || defaultFilters.pmFilter,
    sortBy: searchParams.get('sortBy') || defaultFilters.sortBy,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || defaultFilters.sortOrder
  }))

  const updateFilter = (key: keyof ProjectFilterState,_value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // URLを更新（デバウンス処理付き）
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== defaultFilters[key as keyof ProjectFilterState]) {
        params.set(key === 'searchQuery' ? 'search' : key, value)
      }
    })

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    // 検索クエリの場合はデバウンス
    if (key === 'searchQuery') {
      const timeoutId = setTimeout(() => {
        router.push(newUrl, { scroll: false })
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      router.push(newUrl, { scroll: false })
    }
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    router.push(pathname, { scroll: false })
  }

  // URL変更時にフィルターを同期
  useEffect(() => {
    setFilters({
      searchQuery: searchParams.get('search') || defaultFilters.searchQuery,
      statusFilter: searchParams.get('status') || defaultFilters.statusFilter,
      clientFilter: searchParams.get('client') || defaultFilters.clientFilter,
      pmFilter: searchParams.get('pm') || defaultFilters.pmFilter,
      sortBy: searchParams.get('sortBy') || defaultFilters.sortBy,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || defaultFilters.sortOrder
    })
  }, [searchParams])

  return (
    <ProjectFilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </ProjectFilterContext.Provider>
  )
}

export function useProjectFilters() {
  const context = useContext(ProjectFilterContext)
  if (context === undefined) {
    throw new Error('useProjectFilters must be used within a ProjectFilterProvider')
  }
  return context
}