export type SuggestionType =
  | 'student_at_risk'
  | 'student_excellence'
  | 'missing_assessment'
  | 'learning_gap'

export interface AISuggestion {
  id: string
  type: SuggestionType
  message: string
  confidence: number
  studentId?: string
  classId?: string
}
