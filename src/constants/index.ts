


import { AspectId, AspectDetail, PipelineStage } from '../../types';

// Import meta-prompts for the comprehensive planning pipeline
import { META_PROMPT_PLANNING_GOOGLE_SEARCH_RESEARCH } from './metaPrompts/planningGoogleSearchResearch';
import { META_PROMPT_PLANNING_SMART_GOALS } from './metaPrompts/planningSMARTGoals';
import { META_PROMPT_PLANNING_AUDIENCE_ANALYSIS } from './metaPrompts/planningAudienceAnalysis';
import { META_PROMPT_PLANNING_THEME_SLOGAN } from './metaPrompts/planningThemeSlogan';
import { META_PROMPT_PLANNING_CORE_TEAM_ROLES } from './metaPrompts/planningCoreTeamRoles';
import { META_PROMPT_PLANNING_GAMIFICATION_IDEATION } from './metaPrompts/planningGamificationIdeation';
import { META_PROMPT_PLANNING_BUDGET } from './metaPrompts/planningBudget';
import { META_PROMPT_PLANNING_RISK_ASSESSMENT } from './metaPrompts/planningRiskAssessment';
import { META_PROMPT_PREPARATION_VENUE_LOGISTICS } from './metaPrompts/preparationVenueLogistics';
import { META_PROMPT_PREPARATION_CONTENT_GAMIFICATION } from './metaPrompts/preparationContentGamification';
import { META_PROMPT_PREPARATION_PROMOTION_STRATEGY } from './metaPrompts/preparationPromotionStrategy';
import { META_PROMPT_PREPARATION_BILL_OF_MATERIALS } from './metaPrompts/preparationBillOfMaterials';
import { META_PROMPT_EXECUTION_RUNBOOK_EMERGENCY } from './metaPrompts/executionRunbookEmergency';
import { META_PROMPT_EXECUTION_POST_EVENT_EVALUATION } from './metaPrompts/executionPostEventEvaluation';
import { META_PROMPT_EXECUTION_MONITORING_OPTIMIZATION } from './metaPrompts/executionMonitoringOptimization';


export const PIPELINE_STAGES: PipelineStage[] = ['research', 'planning', 'preparation', 'execution_evaluation'];

export const ASPECT_DETAILS: Record<string, AspectDetail> = {
  // New Optional Step
  [AspectId.PLANNING_GOOGLE_SEARCH_RESEARCH]: {
    id: AspectId.PLANNING_GOOGLE_SEARCH_RESEARCH,
    nameKey: 'aspect.planningGoogleSearchResearch.name',
    descriptionKey: 'aspect.planningGoogleSearchResearch.description',
    metaPrompt: META_PROMPT_PLANNING_GOOGLE_SEARCH_RESEARCH,
    isCore: false,
    category: 'research',
  },

  // Stage 1: Planning
  [AspectId.PLANNING_SMART_GOALS]: { 
    id: AspectId.PLANNING_SMART_GOALS, 
    nameKey: 'aspect.planningSMARTGoals.name', 
    descriptionKey: 'aspect.planningSMARTGoals.description', 
    metaPrompt: META_PROMPT_PLANNING_SMART_GOALS, 
    isCore: true, 
    category: 'planning', 
  },
  [AspectId.PLANNING_AUDIENCE_ANALYSIS]: { 
    id: AspectId.PLANNING_AUDIENCE_ANALYSIS, 
    nameKey: 'aspect.planningAudienceAnalysis.name', 
    descriptionKey: 'aspect.planningAudienceAnalysis.description', 
    metaPrompt: META_PROMPT_PLANNING_AUDIENCE_ANALYSIS, 
    isCore: true, 
    category: 'planning', 
  },
  [AspectId.PLANNING_THEME_SLOGAN]: {
    id: AspectId.PLANNING_THEME_SLOGAN,
    nameKey: 'aspect.planningThemeSlogan.name',
    descriptionKey: 'aspect.planningThemeSlogan.description',
    metaPrompt: META_PROMPT_PLANNING_THEME_SLOGAN,
    isCore: false,
    category: 'planning',
  },
  [AspectId.PLANNING_CORE_TEAM_ROLES]: { 
    id: AspectId.PLANNING_CORE_TEAM_ROLES, 
    nameKey: 'aspect.planningCoreTeamRoles.name', 
    descriptionKey: 'aspect.planningCoreTeamRoles.description', 
    metaPrompt: META_PROMPT_PLANNING_CORE_TEAM_ROLES, 
    isCore: false, 
    category: 'planning', 
  },
  [AspectId.PLANNING_GAMIFICATION_IDEATION]: {
    id: AspectId.PLANNING_GAMIFICATION_IDEATION,
    nameKey: 'aspect.planningGamificationIdeation.name',
    descriptionKey: 'aspect.planningGamificationIdeation.description',
    metaPrompt: META_PROMPT_PLANNING_GAMIFICATION_IDEATION,
    isCore: true,
    category: 'planning',
  },
  [AspectId.PLANNING_BUDGET]: { 
    id: AspectId.PLANNING_BUDGET, 
    nameKey: 'aspect.planningBudget.name', 
    descriptionKey: 'aspect.planningBudget.description', 
    metaPrompt: META_PROMPT_PLANNING_BUDGET, 
    isCore: true, 
    category: 'planning', 
  },
  [AspectId.PLANNING_RISK_ASSESSMENT]: { 
    id: AspectId.PLANNING_RISK_ASSESSMENT, 
    nameKey: 'aspect.planningRiskAssessment.name', 
    descriptionKey: 'aspect.planningRiskAssessment.description', 
    metaPrompt: META_PROMPT_PLANNING_RISK_ASSESSMENT, 
    isCore: true, 
    category: 'planning', 
  },

  // Stage 2: Preparation
  [AspectId.PREPARATION_VENUE_LOGISTICS]: { 
    id: AspectId.PREPARATION_VENUE_LOGISTICS, 
    nameKey: 'aspect.preparationVenueLogistics.name', 
    descriptionKey: 'aspect.preparationVenueLogistics.description', 
    metaPrompt: META_PROMPT_PREPARATION_VENUE_LOGISTICS, 
    isCore: false, 
    category: 'preparation', 
  },
  [AspectId.PREPARATION_CONTENT_GAMIFICATION]: { 
    id: AspectId.PREPARATION_CONTENT_GAMIFICATION, 
    nameKey: 'aspect.preparationContentGamification.name', 
    descriptionKey: 'aspect.preparationContentGamification.description', 
    metaPrompt: META_PROMPT_PREPARATION_CONTENT_GAMIFICATION, 
    isCore: true, 
    category: 'preparation', 
  },
  [AspectId.PREPARATION_PROMOTION_STRATEGY]: { 
    id: AspectId.PREPARATION_PROMOTION_STRATEGY, 
    nameKey: 'aspect.preparationPromotionStrategy.name', 
    descriptionKey: 'aspect.preparationPromotionStrategy.description', 
    metaPrompt: META_PROMPT_PREPARATION_PROMOTION_STRATEGY, 
    isCore: false, 
    category: 'preparation', 
  },
  [AspectId.PREPARATION_BILL_OF_MATERIALS]: { 
    id: AspectId.PREPARATION_BILL_OF_MATERIALS, 
    nameKey: 'aspect.preparationBillOfMaterials.name', 
    descriptionKey: 'aspect.preparationBillOfMaterials.description', 
    metaPrompt: META_PROMPT_PREPARATION_BILL_OF_MATERIALS, 
    isCore: true, 
    category: 'preparation', 
  },
  
  // Stage 3: Execution & Evaluation
  [AspectId.EXECUTION_RUNBOOK_EMERGENCY]: { 
    id: AspectId.EXECUTION_RUNBOOK_EMERGENCY, 
    nameKey: 'aspect.executionRunbookEmergency.name', 
    descriptionKey: 'aspect.executionRunbookEmergency.description', 
    metaPrompt: META_PROMPT_EXECUTION_RUNBOOK_EMERGENCY, 
    isCore: true, 
    category: 'execution_evaluation', 
  },
  [AspectId.EXECUTION_POST_EVENT_EVALUATION]: { 
    id: AspectId.EXECUTION_POST_EVENT_EVALUATION, 
    nameKey: 'aspect.executionPostEventEvaluation.name', 
    descriptionKey: 'aspect.executionPostEventEvaluation.description', 
    metaPrompt: META_PROMPT_EXECUTION_POST_EVENT_EVALUATION, 
    isCore: true, 
    category: 'execution_evaluation', 
  },
  [AspectId.EXECUTION_MONITORING_OPTIMIZATION]: {
    id: AspectId.EXECUTION_MONITORING_OPTIMIZATION,
    nameKey: 'aspect.executionMonitoringOptimization.name',
    descriptionKey: 'aspect.executionMonitoringOptimization.description',
    metaPrompt: META_PROMPT_EXECUTION_MONITORING_OPTIMIZATION,
    isCore: true,
    category: 'execution_evaluation',
  },
};