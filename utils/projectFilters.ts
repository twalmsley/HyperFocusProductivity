import type { Project } from '~/types/project'

export interface ProjectFilters {
  search: string
  state: string
}

export type ProjectState = 'No Tasks' | 'Not Started' | 'In Progress' | 'Completed'

export function getProjectState(project: Project): ProjectState {
  const taskCount = project._count?.tasks || 0
  
  if (taskCount === 0) {
    return 'No Tasks'
  }
  
  // If we have tasks data, use it to determine state
  if (project.tasks && project.tasks.length > 0) {
    const allBacklog = project.tasks.every(task => task.status === 'BACKLOG')
    const allCompleted = project.tasks.every(task => task.status === 'DONE')
    
    if (allCompleted) {
      return 'Completed'
    } else if (allBacklog) {
      return 'Not Started'
    } else {
      return 'In Progress'
    }
  }
  
  // If we don't have tasks data, we can't determine the exact state
  // This would require fetching tasks or having the data available
  return 'In Progress'
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

    // State filter
    if (filters.state) {
      const projectState = getProjectState(project)
      if (projectState !== filters.state) {
        return false
      }
    }

    return true
  })
} 