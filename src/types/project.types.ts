export interface Project {
  id: string
  name: string
  color: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export type CreateProjectInput = Pick<Project, 'name' | 'color'>
