export type DataDomain = 
  | 'medical' 
  | 'financial' 
  | 'software' 
  | 'scientific' 
  | 'environmental' 
  | 'social' 
  | 'educational' 
  | 'auto_detect';

export interface DomainMetadata {
  name: DataDomain;
  description: string;
  commonMetrics: string[];
  typicalColumns: string[];
  specialConsiderations: string[];
}

export const domainMetadata: Record<DataDomain, DomainMetadata> = {
  medical: {
    name: 'medical',
    description: 'Healthcare and medical research data',
    commonMetrics: [
      'Patient outcomes',
      'Treatment efficacy',
      'Mortality rates',
      'Readmission rates'
    ],
    typicalColumns: [
      'Patient ID',
      'Diagnosis',
      'Treatment',
      'Vital signs',
      'Lab results'
    ],
    specialConsiderations: [
      'HIPAA compliance',
      'Patient privacy',
      'Statistical significance in clinical trials'
    ]
  },
  financial: {
    name: 'financial',
    description: 'Financial and business data',
    commonMetrics: [
      'ROI',
      'Revenue growth',
      'Profit margins',
      'Market share'
    ],
    typicalColumns: [
      'Transaction ID',
      'Amount',
      'Date',
      'Account type',
      'Currency'
    ],
    specialConsiderations: [
      'Currency normalization',
      'Seasonal adjustments',
      'Risk metrics'
    ]
  },
  software: {
    name: 'software',
    description: 'Software development and performance metrics',
    commonMetrics: [
      'Response time',
      'Error rates',
      'User engagement',
      'Code coverage'
    ],
    typicalColumns: [
      'Timestamp',
      'Event type',
      'User ID',
      'Version',
      'Platform'
    ],
    specialConsiderations: [
      'Performance benchmarks',
      'Version compatibility',
      'System dependencies'
    ]
  },
  scientific: {
    name: 'scientific',
    description: 'Scientific research and experimental data',
    commonMetrics: [
      'Statistical significance',
      'Experimental controls',
      'Measurement accuracy',
      'Reproducibility'
    ],
    typicalColumns: [
      'Sample ID',
      'Measurement',
      'Control group',
      'Variables',
      'Conditions'
    ],
    specialConsiderations: [
      'Experimental design',
      'Measurement uncertainty',
      'Control variables'
    ]
  },
  environmental: {
    name: 'environmental',
    description: 'Environmental and climate data',
    commonMetrics: [
      'Temperature changes',
      'Emission levels',
      'Biodiversity indices',
      'Resource consumption'
    ],
    typicalColumns: [
      'Location',
      'Timestamp',
      'Measurement type',
      'Value',
      'Units'
    ],
    specialConsiderations: [
      'Seasonal variations',
      'Geographic correlations',
      'Long-term trends'
    ]
  },
  social: {
    name: 'social',
    description: 'Social media and demographic data',
    commonMetrics: [
      'Engagement rates',
      'Demographic distribution',
      'Sentiment analysis',
      'Network effects'
    ],
    typicalColumns: [
      'User ID',
      'Interaction type',
      'Timestamp',
      'Location',
      'Demographics'
    ],
    specialConsiderations: [
      'Privacy concerns',
      'Demographic bias',
      'Cultural context'
    ]
  },
  educational: {
    name: 'educational',
    description: 'Educational and learning analytics',
    commonMetrics: [
      'Academic performance',
      'Completion rates',
      'Learning outcomes',
      'Engagement levels'
    ],
    typicalColumns: [
      'Student ID',
      'Course',
      'Grade',
      'Attendance',
      'Activities'
    ],
    specialConsiderations: [
      'Student privacy',
      'Learning styles',
      'Educational standards'
    ]
  },
  auto_detect: {
    name: 'auto_detect',
    description: 'Automatically detect the data domain',
    commonMetrics: [],
    typicalColumns: [],
    specialConsiderations: [
      'Domain will be inferred from data patterns',
      'May require additional context',
      'Analysis may be more general'
    ]
  }
}; 