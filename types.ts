

export type ProjectType = 'app' | 'physical';

export enum AspectId {
  // New Optional Step
  PLANNING_GOOGLE_SEARCH_RESEARCH = 'PLANNING_GOOGLE_SEARCH_RESEARCH',

  // Stage 1: Planning
  PLANNING_SMART_GOALS = 'PLANNING_SMART_GOALS',
  PLANNING_AUDIENCE_ANALYSIS = 'PLANNING_AUDIENCE_ANALYSIS',
  PLANNING_THEME_SLOGAN = 'PLANNING_THEME_SLOGAN',
  PLANNING_CORE_TEAM_ROLES = 'PLANNING_CORE_TEAM_ROLES',
  PLANNING_GAMIFICATION_IDEATION = 'PLANNING_GAMIFICATION_IDEATION', // New Step
  PLANNING_BUDGET = 'PLANNING_BUDGET',
  PLANNING_RISK_ASSESSMENT = 'PLANNING_RISK_ASSESSMENT',

  // Stage 2: Preparation
  PREPARATION_VENUE_LOGISTICS = 'PREPARATION_VENUE_LOGISTICS',
  PREPARATION_CONTENT_GAMIFICATION = 'PREPARATION_CONTENT_GAMIFICATION', // Renamed
  PREPARATION_PROMOTION_STRATEGY = 'PREPARATION_PROMOTION_STRATEGY',
  PREPARATION_BILL_OF_MATERIALS = 'PREPARATION_BILL_OF_MATERIALS',

  // Stage 3: Execution & Evaluation
  EXECUTION_RUNBOOK_EMERGENCY = 'EXECUTION_RUNBOOK_EMERGENCY',
  EXECUTION_POST_EVENT_EVALUATION = 'EXECUTION_POST_EVENT_EVALUATION',
  EXECUTION_MONITORING_OPTIMIZATION = 'EXECUTION_MONITORING_OPTIMIZATION', // New Step
}

export type PipelineStage = 'research' | 'planning' | 'preparation' | 'execution_evaluation';

export interface AspectOption {
  id: AspectId;
  nameKey: string;
  descriptionKey?: string;
  isCore?: boolean;
  category: PipelineStage;
}

export interface AspectDetail extends AspectOption {
  metaPrompt: string;
}

export interface User {
  email: string;
  isSubscribed: boolean;
}

export type ProcessStageStatus = 'pending' | 'processing' | 'completed' | 'error' | 'stopped' | 'cancelled' | 'stale';

export type PipelineStatus = 'idle' | 'processing' | 'stopped' | 'completed' | 'error';

export interface AspectProgress extends AspectDetail {
  name: string; 
  description?: string;
  status: ProcessStageStatus;
  output: string | null;
  error: string | null;
  selected: boolean;
  lockedSelection: boolean;
}