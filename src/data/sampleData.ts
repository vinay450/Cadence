export interface SalesData {
  quarter: string
  region: string
  productCategory: string
  revenue: number
  unitsSold: number
  profitMargin: number
  customerCount: number
}

// Static sample data for consistent demo results
export const salesData: SalesData[] = [
  // Q1 2024
  {
    quarter: 'Q1 2024',
    region: 'North America',
    productCategory: 'Software Solutions',
    revenue: 520000,
    unitsSold: 1050,
    profitMargin: 28,
    customerCount: 525
  },
  {
    quarter: 'Q1 2024',
    region: 'North America',
    productCategory: 'Hardware Products',
    revenue: 480000,
    unitsSold: 480,
    profitMargin: 25,
    customerCount: 240
  },
  {
    quarter: 'Q1 2024',
    region: 'North America',
    productCategory: 'Cloud Services',
    revenue: 450000,
    unitsSold: 900,
    profitMargin: 27,
    customerCount: 450
  },
  {
    quarter: 'Q1 2024',
    region: 'North America',
    productCategory: 'Professional Services',
    revenue: 380000,
    unitsSold: 380,
    profitMargin: 24,
    customerCount: 190
  },
  {
    quarter: 'Q1 2024',
    region: 'North America',
    productCategory: 'Support & Maintenance',
    revenue: 420000,
    unitsSold: 840,
    profitMargin: 26,
    customerCount: 420
  },
  {
    quarter: 'Q1 2024',
    region: 'Europe',
    productCategory: 'Software Solutions',
    revenue: 460000,
    unitsSold: 920,
    profitMargin: 26,
    customerCount: 460
  },
  {
    quarter: 'Q1 2024',
    region: 'Europe',
    productCategory: 'Hardware Products',
    revenue: 420000,
    unitsSold: 420,
    profitMargin: 24,
    customerCount: 210
  },
  {
    quarter: 'Q1 2024',
    region: 'Europe',
    productCategory: 'Cloud Services',
    revenue: 400000,
    unitsSold: 800,
    profitMargin: 25,
    customerCount: 400
  },
  {
    quarter: 'Q1 2024',
    region: 'Europe',
    productCategory: 'Professional Services',
    revenue: 340000,
    unitsSold: 340,
    profitMargin: 23,
    customerCount: 170
  },
  {
    quarter: 'Q1 2024',
    region: 'Europe',
    productCategory: 'Support & Maintenance',
    revenue: 380000,
    unitsSold: 760,
    profitMargin: 25,
    customerCount: 380
  },
  {
    quarter: 'Q1 2024',
    region: 'Asia Pacific',
    productCategory: 'Software Solutions',
    revenue: 410000,
    unitsSold: 820,
    profitMargin: 25,
    customerCount: 410
  },
  {
    quarter: 'Q1 2024',
    region: 'Asia Pacific',
    productCategory: 'Hardware Products',
    revenue: 380000,
    unitsSold: 380,
    profitMargin: 23,
    customerCount: 190
  },
  {
    quarter: 'Q1 2024',
    region: 'Asia Pacific',
    productCategory: 'Cloud Services',
    revenue: 360000,
    unitsSold: 720,
    profitMargin: 24,
    customerCount: 360
  },
  {
    quarter: 'Q1 2024',
    region: 'Asia Pacific',
    productCategory: 'Professional Services',
    revenue: 300000,
    unitsSold: 300,
    profitMargin: 22,
    customerCount: 150
  },
  {
    quarter: 'Q1 2024',
    region: 'Asia Pacific',
    productCategory: 'Support & Maintenance',
    revenue: 340000,
    unitsSold: 680,
    profitMargin: 24,
    customerCount: 340
  },
  {
    quarter: 'Q1 2024',
    region: 'Latin America',
    productCategory: 'Software Solutions',
    revenue: 350000,
    unitsSold: 700,
    profitMargin: 24,
    customerCount: 350
  },
  {
    quarter: 'Q1 2024',
    region: 'Latin America',
    productCategory: 'Hardware Products',
    revenue: 320000,
    unitsSold: 320,
    profitMargin: 22,
    customerCount: 160
  },
  {
    quarter: 'Q1 2024',
    region: 'Latin America',
    productCategory: 'Cloud Services',
    revenue: 300000,
    unitsSold: 600,
    profitMargin: 23,
    customerCount: 300
  },
  {
    quarter: 'Q1 2024',
    region: 'Latin America',
    productCategory: 'Professional Services',
    revenue: 250000,
    unitsSold: 250,
    profitMargin: 21,
    customerCount: 125
  },
  {
    quarter: 'Q1 2024',
    region: 'Latin America',
    productCategory: 'Support & Maintenance',
    revenue: 280000,
    unitsSold: 560,
    profitMargin: 23,
    customerCount: 280
  },
  {
    quarter: 'Q1 2024',
    region: 'Middle East & Africa',
    productCategory: 'Software Solutions',
    revenue: 300000,
    unitsSold: 600,
    profitMargin: 23,
    customerCount: 300
  },
  {
    quarter: 'Q1 2024',
    region: 'Middle East & Africa',
    productCategory: 'Hardware Products',
    revenue: 280000,
    unitsSold: 280,
    profitMargin: 21,
    customerCount: 140
  },
  {
    quarter: 'Q1 2024',
    region: 'Middle East & Africa',
    productCategory: 'Cloud Services',
    revenue: 260000,
    unitsSold: 520,
    profitMargin: 22,
    customerCount: 260
  },
  {
    quarter: 'Q1 2024',
    region: 'Middle East & Africa',
    productCategory: 'Professional Services',
    revenue: 220000,
    unitsSold: 220,
    profitMargin: 20,
    customerCount: 110
  },
  {
    quarter: 'Q1 2024',
    region: 'Middle East & Africa',
    productCategory: 'Support & Maintenance',
    revenue: 240000,
    unitsSold: 480,
    profitMargin: 22,
    customerCount: 240
  },

  // Adding South Asia entries
  {
    quarter: 'Q1 2024',
    region: 'South Asia',
    productCategory: 'Software Solutions',
    revenue: 330000,
    unitsSold: 660,
    profitMargin: 23,
    customerCount: 330
  },
  {
    quarter: 'Q1 2024',
    region: 'South Asia',
    productCategory: 'Hardware Products',
    revenue: 300000,
    unitsSold: 300,
    profitMargin: 21,
    customerCount: 150
  },
  {
    quarter: 'Q1 2024',
    region: 'South Asia',
    productCategory: 'Cloud Services',
    revenue: 280000,
    unitsSold: 560,
    profitMargin: 22,
    customerCount: 280
  },
  {
    quarter: 'Q1 2024',
    region: 'South Asia',
    productCategory: 'Professional Services',
    revenue: 240000,
    unitsSold: 240,
    profitMargin: 20,
    customerCount: 120
  },
  {
    quarter: 'Q1 2024',
    region: 'South Asia',
    productCategory: 'Support & Maintenance',
    revenue: 260000,
    unitsSold: 520,
    profitMargin: 22,
    customerCount: 260
  },

  // Adding Oceania entries
  {
    quarter: 'Q1 2024',
    region: 'Oceania',
    productCategory: 'Software Solutions',
    revenue: 290000,
    unitsSold: 580,
    profitMargin: 22,
    customerCount: 290
  },
  {
    quarter: 'Q1 2024',
    region: 'Oceania',
    productCategory: 'Hardware Products',
    revenue: 260000,
    unitsSold: 260,
    profitMargin: 20,
    customerCount: 130
  },
  {
    quarter: 'Q1 2024',
    region: 'Oceania',
    productCategory: 'Cloud Services',
    revenue: 240000,
    unitsSold: 480,
    profitMargin: 21,
    customerCount: 240
  },
  {
    quarter: 'Q1 2024',
    region: 'Oceania',
    productCategory: 'Professional Services',
    revenue: 210000,
    unitsSold: 210,
    profitMargin: 19,
    customerCount: 105
  },
  {
    quarter: 'Q1 2024',
    region: 'Oceania',
    productCategory: 'Support & Maintenance',
    revenue: 230000,
    unitsSold: 460,
    profitMargin: 21,
    customerCount: 230
  },

  // Q2 2024
  {
    quarter: 'Q2 2024',
    region: 'North America',
    productCategory: 'Software Solutions',
    revenue: 550000,
    unitsSold: 1100,
    profitMargin: 29,
    customerCount: 550
  },
  {
    quarter: 'Q2 2024',
    region: 'North America',
    productCategory: 'Hardware Products',
    revenue: 510000,
    unitsSold: 510,
    profitMargin: 26,
    customerCount: 255
  },
  {
    quarter: 'Q2 2024',
    region: 'Europe',
    productCategory: 'Software Solutions',
    revenue: 490000,
    unitsSold: 980,
    profitMargin: 27,
    customerCount: 490
  },
  {
    quarter: 'Q2 2024',
    region: 'Europe',
    productCategory: 'Hardware Products',
    revenue: 450000,
    unitsSold: 450,
    profitMargin: 25,
    customerCount: 225
  },
  {
    quarter: 'Q2 2024',
    region: 'Asia Pacific',
    productCategory: 'Software Solutions',
    revenue: 430000,
    unitsSold: 860,
    profitMargin: 26,
    customerCount: 430
  },
  {
    quarter: 'Q2 2024',
    region: 'Asia Pacific',
    productCategory: 'Hardware Products',
    revenue: 400000,
    unitsSold: 400,
    profitMargin: 24,
    customerCount: 200
  },

  // Q2 2024 South Asia
  {
    quarter: 'Q2 2024',
    region: 'South Asia',
    productCategory: 'Software Solutions',
    revenue: 346500,
    unitsSold: 690,
    profitMargin: 24,
    customerCount: 345
  },
  {
    quarter: 'Q2 2024',
    region: 'South Asia',
    productCategory: 'Hardware Products',
    revenue: 315000,
    unitsSold: 315,
    profitMargin: 22,
    customerCount: 157
  },
  {
    quarter: 'Q2 2024',
    region: 'South Asia',
    productCategory: 'Cloud Services',
    revenue: 294000,
    unitsSold: 588,
    profitMargin: 23,
    customerCount: 294
  },
  {
    quarter: 'Q2 2024',
    region: 'South Asia',
    productCategory: 'Professional Services',
    revenue: 252000,
    unitsSold: 252,
    profitMargin: 21,
    customerCount: 126
  },
  {
    quarter: 'Q2 2024',
    region: 'South Asia',
    productCategory: 'Support & Maintenance',
    revenue: 273000,
    unitsSold: 546,
    profitMargin: 23,
    customerCount: 273
  },

  // Q2 2024 Oceania
  {
    quarter: 'Q2 2024',
    region: 'Oceania',
    productCategory: 'Software Solutions',
    revenue: 304500,
    unitsSold: 609,
    profitMargin: 23,
    customerCount: 304
  },
  {
    quarter: 'Q2 2024',
    region: 'Oceania',
    productCategory: 'Hardware Products',
    revenue: 273000,
    unitsSold: 273,
    profitMargin: 21,
    customerCount: 136
  },
  {
    quarter: 'Q2 2024',
    region: 'Oceania',
    productCategory: 'Cloud Services',
    revenue: 252000,
    unitsSold: 504,
    profitMargin: 22,
    customerCount: 252
  },
  {
    quarter: 'Q2 2024',
    region: 'Oceania',
    productCategory: 'Professional Services',
    revenue: 220500,
    unitsSold: 220,
    profitMargin: 20,
    customerCount: 110
  },
  {
    quarter: 'Q2 2024',
    region: 'Oceania',
    productCategory: 'Support & Maintenance',
    revenue: 241500,
    unitsSold: 483,
    profitMargin: 22,
    customerCount: 241
  },

  // Q3 2024
  {
    quarter: 'Q3 2024',
    region: 'North America',
    productCategory: 'Software Solutions',
    revenue: 580000,
    unitsSold: 1160,
    profitMargin: 30,
    customerCount: 580
  },
  {
    quarter: 'Q3 2024',
    region: 'North America',
    productCategory: 'Hardware Products',
    revenue: 540000,
    unitsSold: 540,
    profitMargin: 27,
    customerCount: 270
  },
  {
    quarter: 'Q3 2024',
    region: 'Europe',
    productCategory: 'Software Solutions',
    revenue: 520000,
    unitsSold: 1040,
    profitMargin: 28,
    customerCount: 520
  },
  {
    quarter: 'Q3 2024',
    region: 'Europe',
    productCategory: 'Hardware Products',
    revenue: 480000,
    unitsSold: 480,
    profitMargin: 26,
    customerCount: 240
  },
  {
    quarter: 'Q3 2024',
    region: 'Asia Pacific',
    productCategory: 'Software Solutions',
    revenue: 450000,
    unitsSold: 900,
    profitMargin: 27,
    customerCount: 450
  },
  {
    quarter: 'Q3 2024',
    region: 'Asia Pacific',
    productCategory: 'Hardware Products',
    revenue: 420000,
    unitsSold: 420,
    profitMargin: 25,
    customerCount: 210
  },

  // Q3 2024 South Asia
  {
    quarter: 'Q3 2024',
    region: 'South Asia',
    productCategory: 'Software Solutions',
    revenue: 363825,
    unitsSold: 724,
    profitMargin: 25,
    customerCount: 362
  },
  {
    quarter: 'Q3 2024',
    region: 'South Asia',
    productCategory: 'Hardware Products',
    revenue: 330750,
    unitsSold: 330,
    profitMargin: 23,
    customerCount: 165
  },
  {
    quarter: 'Q3 2024',
    region: 'South Asia',
    productCategory: 'Cloud Services',
    revenue: 308700,
    unitsSold: 617,
    profitMargin: 24,
    customerCount: 308
  },
  {
    quarter: 'Q3 2024',
    region: 'South Asia',
    productCategory: 'Professional Services',
    revenue: 264600,
    unitsSold: 264,
    profitMargin: 22,
    customerCount: 132
  },
  {
    quarter: 'Q3 2024',
    region: 'South Asia',
    productCategory: 'Support & Maintenance',
    revenue: 286650,
    unitsSold: 573,
    profitMargin: 24,
    customerCount: 286
  },

  // Q3 2024 Oceania
  {
    quarter: 'Q3 2024',
    region: 'Oceania',
    productCategory: 'Software Solutions',
    revenue: 319725,
    unitsSold: 639,
    profitMargin: 24,
    customerCount: 319
  },
  {
    quarter: 'Q3 2024',
    region: 'Oceania',
    productCategory: 'Hardware Products',
    revenue: 286650,
    unitsSold: 286,
    profitMargin: 22,
    customerCount: 143
  },
  {
    quarter: 'Q3 2024',
    region: 'Oceania',
    productCategory: 'Cloud Services',
    revenue: 264600,
    unitsSold: 529,
    profitMargin: 23,
    customerCount: 264
  },
  {
    quarter: 'Q3 2024',
    region: 'Oceania',
    productCategory: 'Professional Services',
    revenue: 231525,
    unitsSold: 231,
    profitMargin: 21,
    customerCount: 115
  },
  {
    quarter: 'Q3 2024',
    region: 'Oceania',
    productCategory: 'Support & Maintenance',
    revenue: 253575,
    unitsSold: 507,
    profitMargin: 23,
    customerCount: 253
  },

  // Q4 2024
  {
    quarter: 'Q4 2024',
    region: 'North America',
    productCategory: 'Software Solutions',
    revenue: 620000,
    unitsSold: 1240,
    profitMargin: 31,
    customerCount: 620
  },
  {
    quarter: 'Q4 2024',
    region: 'North America',
    productCategory: 'Hardware Products',
    revenue: 580000,
    unitsSold: 580,
    profitMargin: 28,
    customerCount: 290
  },
  {
    quarter: 'Q4 2024',
    region: 'Europe',
    productCategory: 'Software Solutions',
    revenue: 550000,
    unitsSold: 1100,
    profitMargin: 29,
    customerCount: 550
  },
  {
    quarter: 'Q4 2024',
    region: 'Europe',
    productCategory: 'Hardware Products',
    revenue: 510000,
    unitsSold: 510,
    profitMargin: 27,
    customerCount: 255
  },
  {
    quarter: 'Q4 2024',
    region: 'Asia Pacific',
    productCategory: 'Software Solutions',
    revenue: 480000,
    unitsSold: 960,
    profitMargin: 28,
    customerCount: 480
  },
  {
    quarter: 'Q4 2024',
    region: 'Asia Pacific',
    productCategory: 'Hardware Products',
    revenue: 450000,
    unitsSold: 450,
    profitMargin: 26,
    customerCount: 225
  },

  // Q4 2024 South Asia
  {
    quarter: 'Q4 2024',
    region: 'South Asia',
    productCategory: 'Software Solutions',
    revenue: 382016,
    unitsSold: 760,
    profitMargin: 26,
    customerCount: 380
  },
  {
    quarter: 'Q4 2024',
    region: 'South Asia',
    productCategory: 'Hardware Products',
    revenue: 347287,
    unitsSold: 346,
    profitMargin: 24,
    customerCount: 173
  },
  {
    quarter: 'Q4 2024',
    region: 'South Asia',
    productCategory: 'Cloud Services',
    revenue: 324135,
    unitsSold: 648,
    profitMargin: 25,
    customerCount: 324
  },
  {
    quarter: 'Q4 2024',
    region: 'South Asia',
    productCategory: 'Professional Services',
    revenue: 277830,
    unitsSold: 277,
    profitMargin: 23,
    customerCount: 138
  },
  {
    quarter: 'Q4 2024',
    region: 'South Asia',
    productCategory: 'Support & Maintenance',
    revenue: 300982,
    unitsSold: 601,
    profitMargin: 25,
    customerCount: 300
  },

  // Q4 2024 Oceania
  {
    quarter: 'Q4 2024',
    region: 'Oceania',
    productCategory: 'Software Solutions',
    revenue: 335711,
    unitsSold: 671,
    profitMargin: 25,
    customerCount: 335
  },
  {
    quarter: 'Q4 2024',
    region: 'Oceania',
    productCategory: 'Hardware Products',
    revenue: 300982,
    unitsSold: 300,
    profitMargin: 23,
    customerCount: 150
  },
  {
    quarter: 'Q4 2024',
    region: 'Oceania',
    productCategory: 'Cloud Services',
    revenue: 277830,
    unitsSold: 555,
    profitMargin: 24,
    customerCount: 277
  },
  {
    quarter: 'Q4 2024',
    region: 'Oceania',
    productCategory: 'Professional Services',
    revenue: 243101,
    unitsSold: 242,
    profitMargin: 22,
    customerCount: 121
  },
  {
    quarter: 'Q4 2024',
    region: 'Oceania',
    productCategory: 'Support & Maintenance',
    revenue: 266253,
    unitsSold: 532,
    profitMargin: 24,
    customerCount: 266
  }
] 