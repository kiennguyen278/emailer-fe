export interface WorkflowDTO {
  id: number;
  userId: number;
  name: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  triggerConditions: TriggerConditionDTO[];
  steps: WorkflowStepDTO[];
}

export interface TriggerConditionDTO {
  conditionType: string;
  conditionData: string;
  logicOperator: string;
  position: number;
}

export interface WorkflowStepDTO {
  stepType: string;
  stepData: string;
  position: number;
}


export interface Tag {
  id: number;
  name: string;
}

export interface SequenceDTO {
  id: number,
  name: string
}

export interface EmailTemplateDTO {
  id: number;
  name: string;
}
