export type DataDomain = 'general' | 'financial' | 'scientific' | 'business' | 'social';

export interface DataDomainInfo {
  name: string;
  description: string;
  commonMetrics: string[];
  commonColumns: string[];
  commonChallenges: string[];
}

export const dataDomains: Record<DataDomain, DataDomainInfo> = {
  general: {
    name: 'general',
    description: 'General purpose data analysis',
    commonMetrics: [
      'Summary statistics',
      'Trends over time',
      'Correlations',
      'Distribution analysis'
    ],
    commonColumns: [
      'ID',
      'Date',
      'Category',
      'Value',
      'Name'
    ],
    commonChallenges: [
      'Data quality',
      'Missing values',
      'Outlier detection',
      'Data normalization'
    ]
  },
  financial: {
    name: 'financial',
    description: 'Financial and economic data analysis',
    commonMetrics: [
      'ROI',
      'Growth rates',
      'Risk metrics',
      'Market trends'
    ],
    commonColumns: [
      'Transaction ID',
      'Amount',
      'Date',
      'Account',
      'Category'
    ],
    commonChallenges: [
      'Data accuracy',
      'Time series analysis',
      'Risk assessment',
      'Regulatory compliance'
    ]
  },
  scientific: {
    name: 'scientific',
    description: 'Scientific research and experimental data',
    commonMetrics: [
      'Statistical significance',
      'Error rates',
      'Experimental outcomes',
      'Control group comparisons'
    ],
    commonColumns: [
      'Sample ID',
      'Measurement',
      'Time',
      'Condition',
      'Result'
    ],
    commonChallenges: [
      'Experimental design',
      'Statistical validity',
      'Reproducibility',
      'Data standardization'
    ]
  },
  business: {
    name: 'business',
    description: 'Business operations and performance data',
    commonMetrics: [
      'KPIs',
      'Sales metrics',
      'Customer metrics',
      'Operational efficiency'
    ],
    commonColumns: [
      'Customer ID',
      'Product',
      'Sales',
      'Date',
      'Region'
    ],
    commonChallenges: [
      'Data integration',
      'Real-time analysis',
      'Performance tracking',
      'Market analysis'
    ]
  },
  social: {
    name: 'social',
    description: 'Social and behavioral data analysis',
    commonMetrics: [
      'Engagement rates',
      'Behavioral patterns',
      'Network analysis',
      'Sentiment analysis'
    ],
    commonColumns: [
      'User ID',
      'Action',
      'Timestamp',
      'Platform',
      'Location'
    ],
    commonChallenges: [
      'Privacy concerns',
      'Data collection',
      'Pattern recognition',
      'Behavioral analysis'
    ]
  }
}; 