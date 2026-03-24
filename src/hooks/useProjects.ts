import { useEffect, useCallback } from 'react'
import { useProjectStore } from '@stores/projectStore'
import { useAuthStore } from '@stores/authStore'
import * as projectService from '@services/project.service'
import { DND_INITIAL_ORDER_STEP } from '@config/constants'
import type { CreateProjectInput } from '@/types'

export function useProjects() {
  const store = useProjectStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) return
    store.setLoading(true)
    const unsub = projectService.subscribeToProjects(user.uid, (projects) => {
      store.setProjects(projects)
      store.setLoading(false)
    })
    return unsub
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  const createProject = useCallback(
    async (input: CreateProjectInput) => {
      if (!user) return
      const maxOrder = store.projects.length > 0
        ? Math.max(...store.projects.map((p) => p.order))
        : 0
      const project = await projectService.createProject(user.uid, input, maxOrder + DND_INITIAL_ORDER_STEP)
      store.addProject(project)
    },
    [user, store],
  )

  const deleteProject = useCallback(
    async (projectId: string) => {
      if (!user) return
      store.removeProject(projectId)
      await projectService.deleteProject(user.uid, projectId)
    },
    [user, store],
  )

  return {
    projects: store.projects,
    isLoading: store.isLoading,
    createProject,
    deleteProject,
  }
}
