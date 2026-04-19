export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'hyperfocus'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

export interface TimerSettings {
  pomodoroDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  hyperfocusDuration: number
  hyperfocusBreakDuration: number
}
