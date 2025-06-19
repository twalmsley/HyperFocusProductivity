import type { Project } from '~/types/project'

export interface ProjectFilters {
  search: string
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  return projects.filter(project => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const nameMatch = project.name.toLowerCase().includes(searchLower)
      const descriptionMatch = project.description?.toLowerCase().includes(searchLower) || false
      
      if (!nameMatch && !descriptionMatch) {
        return false
      }
    }

    return true
  })
} 