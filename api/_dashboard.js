/*
 * ---------------------------------------------------------------------------
 * METRIC PACK - the dashboard the learner analyses during the session
 * ---------------------------------------------------------------------------
 * Extracted from KPI_Performance_Dashboard_Critical_Thinking.xlsx (contact
 * centre KPI workbook, LOB X, month M1 / Q1, weeks 1-4, 60 phone consultants
 * across four teams). Every figure below is the workbook's own: team, week and
 * tenure figures are unweighted means of agent-week rates, exactly as the
 * workbook's pivot tables compute them, so what the learner reads here matches
 * what they would read in Excel.
 *
 * This is the single source of truth for the embedded dashboard. The browser
 * renders it (GET /api/config) and the coach reasons about it (dashboardBrief()
 * in _prompts.js), so the learner and the coach always see the same numbers.
 *
 * To assign a different metric, change DASHBOARD.focus to another kpi id. To
 * load a different period or organisation, replace the arrays below, keeping
 * the shape: kpis / weeks / teams / tenure / reasons / callTypes / qaAudits /
 * agents / caveats. Nothing in the UI or in the prompts is hard-coded to CSAT.
 * ---------------------------------------------------------------------------
 */

export const DASHBOARD = {
  meta: {
    title: 'Contact Centre KPI Dashboard',
    org: 'Customer support, LOB X',
    scope: '60 phone consultants, 4 teams, 4 team managers',
    period: 'Month M1 (Q1), weeks 1-4',
    source: 'KPI_Performance_Dashboard_Critical_Thinking.xlsx'
  },

  /* The metric under review. Change this id to reassign the session. */
  focus: 'csat',

  totals: {
    calls: 30681,
    surveys: 12444.65,
    surveyReturnRate: 0.4056,
    agents: 60,
    teams: 4
  },

  kpis: [
    {
      id: 'csat',
      name: 'CSAT',
      full: 'Customer Satisfaction',
      source: 'External - survey',
      question: '"From 1-5, how satisfied are you with our customer service today?"',
      calculation: 'Count of positive responses / overall count of responses',
      notes: 'Positive: 4-5. Negative: 1-3.',
      value: 0.7898,
      target: 0.9,
      format: 'pct',
      better: 'higher'
    },
    {
      id: 'nps',
      name: 'NPS',
      full: 'Net Promoter Score',
      source: 'External - survey',
      question: '"On a scale of 0 to 10, how likely are you to recommend our business to a friend or colleague?"',
      calculation: '%Promoters - %Detractors',
      notes: 'Detractor: 0-6. Passive: 7-8. Promoter: 9-10.',
      value: 0.5081,
      target: 0.65,
      format: 'pct',
      better: 'higher'
    },
    {
      id: 'fcr',
      name: 'FCR',
      full: 'First Call Resolution',
      source: 'External - survey',
      question: '"Was your issue resolved?"',
      calculation: 'Number of "Yes" / overall answer count',
      notes: 'Binary question, Yes or No.',
      value: 0.6888,
      target: 0.8,
      format: 'pct',
      better: 'higher'
    },
    {
      id: 'qa',
      name: 'QA',
      full: 'Quality score',
      source: 'Internal - QA audit',
      question: 'Soft skills, case management, workflow and policy adherence',
      calculation: 'Count of reviews with a passing score / count of total reviews',
      notes: 'Passing score for an individual review is 90. Does not reflect productivity or resolution rates.',
      value: 0.8649,
      target: 0.9,
      format: 'pct',
      better: 'higher'
    },
    {
      id: 'aht',
      name: 'AHT',
      full: 'Average Handling Time',
      source: 'Internal - CRM stats',
      question: 'Average time of handling a phone interaction',
      calculation: 'Total talk time / total number of calls',
      notes: 'Talk time includes hold time and after-call work.',
      value: 21.6673,
      target: 20,
      format: 'min',
      better: 'lower'
    }
  ],

  weeks: [
    {
      "csat": 0.7996,
      "nps": 0.5128,
      "fcr": 0.6978,
      "qa": 0.8668,
      "aht": 21.7773,
      "surveys": 2972.1,
      "calls": 7242,
      "agents": 60,
      "week": "Week 1",
      "surveyShare": 0.2388
    },
    {
      "csat": 0.7949,
      "nps": 0.507,
      "fcr": 0.6898,
      "qa": 0.8592,
      "aht": 22.0032,
      "surveys": 4081.8,
      "calls": 7431,
      "agents": 60,
      "week": "Week 2",
      "surveyShare": 0.328
    },
    {
      "csat": 0.7858,
      "nps": 0.5021,
      "fcr": 0.6857,
      "qa": 0.8582,
      "aht": 21.9738,
      "surveys": 2610.7,
      "calls": 7857,
      "agents": 60,
      "week": "Week 3",
      "surveyShare": 0.2098
    },
    {
      "csat": 0.7788,
      "nps": 0.5104,
      "fcr": 0.6822,
      "qa": 0.8754,
      "aht": 20.915,
      "surveys": 2780.1,
      "calls": 8151,
      "agents": 60,
      "week": "Week 4",
      "surveyShare": 0.2234
    }
  ],

  teams: [
    {
      "csat": 0.8656,
      "nps": 0.6157,
      "fcr": 0.7689,
      "qa": 0.9545,
      "aht": 16.807,
      "surveys": 2255.6,
      "calls": 8550,
      "agents": 15,
      "team": "Alpha",
      "manager": "Carla Castro",
      "surveyShare": 0.1813,
      "impactCsat": -0.0029
    },
    {
      "csat": 0.7921,
      "nps": 0.5107,
      "fcr": 0.6793,
      "qa": 0.8549,
      "aht": 21.4589,
      "surveys": 2824.5,
      "calls": 7721,
      "agents": 15,
      "team": "Beta",
      "manager": "Robin Nash",
      "surveyShare": 0.227,
      "impactCsat": -0.0174
    },
    {
      "csat": 0.7128,
      "nps": 0.4036,
      "fcr": 0.6223,
      "qa": 0.7932,
      "aht": 25.4625,
      "surveys": 3292.8,
      "calls": 6911,
      "agents": 15,
      "team": "Gamma",
      "manager": "Anika Singh",
      "surveyShare": 0.2646,
      "impactCsat": -0.0464
    },
    {
      "csat": 0.7886,
      "nps": 0.5024,
      "fcr": 0.6848,
      "qa": 0.8571,
      "aht": 22.9408,
      "surveys": 4071.7,
      "calls": 7499,
      "agents": 15,
      "team": "Delta",
      "manager": "Anthony Goff",
      "surveyShare": 0.3272,
      "impactCsat": -0.0188
    }
  ],

  tenure: [
    {
      "csat": 0.6339,
      "nps": 0.1968,
      "fcr": 0.5386,
      "qa": 0.6985,
      "aht": 30.9927,
      "surveys": 4441.5,
      "calls": 7026,
      "agents": 20,
      "bucket": "0-6 months",
      "surveyShare": 0.3569
    },
    {
      "csat": 0.8211,
      "nps": 0.6015,
      "fcr": 0.7136,
      "qa": 0.917,
      "aht": 19.4099,
      "surveys": 3878.3,
      "calls": 12655,
      "agents": 25,
      "bucket": "6-12 months",
      "surveyShare": 0.3116
    },
    {
      "csat": 0.9453,
      "nps": 0.7675,
      "fcr": 0.848,
      "qa": 1.0,
      "aht": 12.9958,
      "surveys": 4124.8,
      "calls": 11000,
      "agents": 15,
      "bucket": "12-48 months",
      "surveyShare": 0.3315
    }
  ],

  reasons: [
    {
      "csat": 0.7604,
      "nps": 0.451,
      "fcr": 0.6481,
      "qa": 0.8236,
      "aht": 24.1034,
      "surveys": 5292.6,
      "calls": 11352,
      "agents": 24,
      "label": "Product Function",
      "surveyShare": 0.4253
    },
    {
      "csat": 0.8735,
      "nps": 0.6697,
      "fcr": 0.7689,
      "qa": 0.9558,
      "aht": 16.8385,
      "surveys": 2091.8,
      "calls": 6054,
      "agents": 11,
      "label": "General",
      "surveyShare": 0.1681
    },
    {
      "csat": 0.5958,
      "nps": 0.2058,
      "fcr": 0.5198,
      "qa": 0.6718,
      "aht": 31.6169,
      "surveys": 2032.6,
      "calls": 2968,
      "agents": 9,
      "label": "Purchases",
      "surveyShare": 0.1633
    },
    {
      "csat": 0.8448,
      "nps": 0.5791,
      "fcr": 0.7497,
      "qa": 0.9431,
      "aht": 17.8289,
      "surveys": 1589.6,
      "calls": 6330,
      "agents": 12,
      "label": "Onboarding (trial)",
      "surveyShare": 0.1277
    },
    {
      "csat": 0.9304,
      "nps": 0.7509,
      "fcr": 0.8351,
      "qa": 0.9929,
      "aht": 13.6322,
      "surveys": 1438.1,
      "calls": 3977,
      "agents": 6,
      "label": "Customer Loyalty and Retention",
      "surveyShare": 0.1156
    }
  ],

  callTypes: [
    {
      "label": "Product and Service Malfunctions",
      "csat": 0.7976,
      "share": 0.148,
      "nps": 0.5525,
      "aht": 21.0938,
      "fcr": 0.685
    },
    {
      "label": "Outages",
      "csat": 0.7868,
      "share": 0.1434,
      "nps": 0.4605,
      "aht": 22.4095,
      "fcr": 0.6784
    },
    {
      "label": "Password reset",
      "csat": 0.7532,
      "share": 0.1299,
      "nps": 0.435,
      "aht": 25.0731,
      "fcr": 0.6432
    },
    {
      "label": "Access support",
      "csat": 0.7285,
      "share": 0.1233,
      "nps": 0.4139,
      "aht": 25.4947,
      "fcr": 0.6276
    },
    {
      "label": "Cancellation requests",
      "csat": 0.9376,
      "share": 0.0935,
      "nps": 0.7643,
      "aht": 13.3825,
      "fcr": 0.8471
    },
    {
      "label": "basic how-to guides",
      "csat": 0.8713,
      "share": 0.0486,
      "nps": 0.6752,
      "aht": 16.1279,
      "fcr": 0.7771
    },
    {
      "label": "Billing discrepancies",
      "csat": 0.5899,
      "share": 0.0398,
      "nps": 0.2156,
      "aht": 34.7193,
      "fcr": 0.5213
    },
    {
      "label": "Invoices",
      "csat": 0.6734,
      "share": 0.0331,
      "nps": 0.3541,
      "aht": 27.012,
      "fcr": 0.5776
    },
    {
      "label": "Refunds",
      "csat": 0.6812,
      "share": 0.0316,
      "nps": 0.3406,
      "aht": 27.1451,
      "fcr": 0.5811
    },
    {
      "label": "Product benefits",
      "csat": 0.8965,
      "share": 0.0314,
      "nps": 0.7074,
      "aht": 15.2149,
      "fcr": 0.8134
    },
    {
      "label": "Individual Pricing Offers",
      "csat": 0.891,
      "share": 0.0267,
      "nps": 0.6933,
      "aht": 16.1658,
      "fcr": 0.7915
    },
    {
      "label": "Discounts",
      "csat": 0.8937,
      "share": 0.0263,
      "nps": 0.7055,
      "aht": 15.4776,
      "fcr": 0.8038
    },
    {
      "label": "Follow-up on dissatisfied customers",
      "csat": 0.8691,
      "share": 0.0246,
      "nps": 0.6436,
      "aht": 16.822,
      "fcr": 0.7501
    },
    {
      "label": "Pricing",
      "csat": 0.7877,
      "share": 0.0234,
      "nps": 0.4179,
      "aht": 19.5615,
      "fcr": 0.6944
    },
    {
      "label": "Unexpected charges",
      "csat": 0.5859,
      "share": 0.0224,
      "nps": 0.1877,
      "aht": 30.5116,
      "fcr": 0.5116
    },
    {
      "label": "Product feature information",
      "csat": 0.7927,
      "share": 0.0218,
      "nps": 0.3891,
      "aht": 22.3271,
      "fcr": 0.6829
    },
    {
      "label": "Subscribtion renewals",
      "csat": 0.5994,
      "share": 0.0178,
      "nps": 0.2208,
      "aht": 29.0706,
      "fcr": 0.4904
    },
    {
      "label": "Subscription types",
      "csat": 0.8633,
      "share": 0.0145,
      "nps": 0.6402,
      "aht": 17.0922,
      "fcr": 0.7674
    }
  ],

  qaAudits: {
    "audits": 1079,
    "passThreshold": 90,
    "passing": 11,
    "meanScore": 71.27,
    "agentRelated": 571,
    "notAgentRelated": 508,
    "drivers": [
      {
        "label": "Agent",
        "count": 407
      },
      {
        "label": "Process",
        "count": 249
      },
      {
        "label": "Other",
        "count": 186
      },
      {
        "label": "Product",
        "count": 173
      },
      {
        "label": "Policy",
        "count": 57
      },
      {
        "label": "Issue out of scope",
        "count": 7
      }
    ],
    "topCauses": [
      {
        "label": "Case management",
        "count": 268
      },
      {
        "label": "Related to another agent",
        "count": 80
      },
      {
        "label": "Unclear what contributed to CSAT",
        "count": 74
      },
      {
        "label": "Channel effectiveness",
        "count": 73
      },
      {
        "label": "Survey",
        "count": 73
      },
      {
        "label": "Incorrect/delayed resolution",
        "count": 59
      },
      {
        "label": "Expected behaviour of product",
        "count": 55
      },
      {
        "label": "Support Tools",
        "count": 42
      }
    ]
  },

  agents: [
    {
      "name": "Cathy Roberts",
      "team": "Alpha",
      "tenure": "0-6 months",
      "nps": 0.1067,
      "csat": 0.7471,
      "fcr": 0.6351,
      "aht": 26.9856,
      "qa": 0.8558,
      "calls": 338
    },
    {
      "name": "Jared Rice",
      "team": "Alpha",
      "tenure": "0-6 months",
      "nps": 0.1126,
      "csat": 0.7255,
      "fcr": 0.6453,
      "aht": 21.0638,
      "qa": 0.8946,
      "calls": 317
    },
    {
      "name": "Bobby Powell",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.5121,
      "csat": 0.8718,
      "fcr": 0.7642,
      "aht": 16.2711,
      "qa": 0.9318,
      "calls": 536
    },
    {
      "name": "Rex Warren",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.516,
      "csat": 0.8802,
      "fcr": 0.7689,
      "aht": 16.6819,
      "qa": 0.9409,
      "calls": 515
    },
    {
      "name": "Rodolfo Johnson",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.509,
      "csat": 0.845,
      "fcr": 0.7443,
      "aht": 15.8686,
      "qa": 0.9566,
      "calls": 528
    },
    {
      "name": "Marie Bryan",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.5141,
      "csat": 0.8508,
      "fcr": 0.7539,
      "aht": 18.603,
      "qa": 0.9474,
      "calls": 513
    },
    {
      "name": "Gwendolyn Hopkins",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.5091,
      "csat": 0.8304,
      "fcr": 0.7411,
      "aht": 19.0473,
      "qa": 0.936,
      "calls": 490
    },
    {
      "name": "Dennis Baldwin",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.5158,
      "csat": 0.8383,
      "fcr": 0.7307,
      "aht": 17.6686,
      "qa": 0.9625,
      "calls": 513
    },
    {
      "name": "Doris Cohen",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.5138,
      "csat": 0.8278,
      "fcr": 0.7401,
      "aht": 18.0236,
      "qa": 0.9537,
      "calls": 488
    },
    {
      "name": "Juana Lamb",
      "team": "Alpha",
      "tenure": "6-12 months",
      "nps": 0.5122,
      "csat": 0.8549,
      "fcr": 0.7707,
      "aht": 17.9132,
      "qa": 0.9381,
      "calls": 501
    },
    {
      "name": "Kelley Mullins",
      "team": "Alpha",
      "tenure": "12-48 months",
      "nps": 0.6251,
      "csat": 0.9361,
      "fcr": 0.8658,
      "aht": 12.6454,
      "qa": 1,
      "calls": 842
    },
    {
      "name": "Mamie Townsend",
      "team": "Alpha",
      "tenure": "12-48 months",
      "nps": 0.6132,
      "csat": 0.9297,
      "fcr": 0.837,
      "aht": 13.1745,
      "qa": 1,
      "calls": 749
    },
    {
      "name": "Rosa Blake",
      "team": "Alpha",
      "tenure": "12-48 months",
      "nps": 0.6147,
      "csat": 0.9366,
      "fcr": 0.8537,
      "aht": 12.3523,
      "qa": 1,
      "calls": 756
    },
    {
      "name": "Trevor Harrison",
      "team": "Alpha",
      "tenure": "12-48 months",
      "nps": 0.6002,
      "csat": 0.9516,
      "fcr": 0.8419,
      "aht": 13.2844,
      "qa": 1,
      "calls": 782
    },
    {
      "name": "Orlando Delgado",
      "team": "Alpha",
      "tenure": "12-48 months",
      "nps": 0.6133,
      "csat": 0.9591,
      "fcr": 0.8415,
      "aht": 12.5223,
      "qa": 1,
      "calls": 682
    },
    {
      "name": "Florence Schwartz",
      "team": "Beta",
      "tenure": "0-6 months",
      "nps": 0.1616,
      "csat": 0.664,
      "fcr": 0.5131,
      "aht": 29.7768,
      "qa": 0.7175,
      "calls": 344
    },
    {
      "name": "Roxanne Collins",
      "team": "Beta",
      "tenure": "0-6 months",
      "nps": 0.2384,
      "csat": 0.651,
      "fcr": 0.533,
      "aht": 34.2673,
      "qa": 0.6066,
      "calls": 354
    },
    {
      "name": "Abraham Stewart",
      "team": "Beta",
      "tenure": "0-6 months",
      "nps": 0.1458,
      "csat": 0.626,
      "fcr": 0.5405,
      "aht": 28.4691,
      "qa": 0.6855,
      "calls": 388
    },
    {
      "name": "Bridget Allison",
      "team": "Beta",
      "tenure": "0-6 months",
      "nps": 0.1968,
      "csat": 0.667,
      "fcr": 0.5534,
      "aht": 29.172,
      "qa": 0.6551,
      "calls": 385
    },
    {
      "name": "Harvey Wilkerson",
      "team": "Beta",
      "tenure": "0-6 months",
      "nps": 0.1235,
      "csat": 0.6517,
      "fcr": 0.5201,
      "aht": 27.3707,
      "qa": 0.7275,
      "calls": 355
    },
    {
      "name": "Rochelle Owen",
      "team": "Beta",
      "tenure": "6-12 months",
      "nps": 0.4101,
      "csat": 0.76,
      "fcr": 0.6304,
      "aht": 22.8531,
      "qa": 0.8497,
      "calls": 503
    },
    {
      "name": "Donna Bishop",
      "team": "Beta",
      "tenure": "6-12 months",
      "nps": 0.4154,
      "csat": 0.7526,
      "fcr": 0.609,
      "aht": 23.0717,
      "qa": 0.8651,
      "calls": 520
    },
    {
      "name": "Elizabeth Cox",
      "team": "Beta",
      "tenure": "6-12 months",
      "nps": 0.4074,
      "csat": 0.7639,
      "fcr": 0.6429,
      "aht": 22.8037,
      "qa": 0.855,
      "calls": 497
    },
    {
      "name": "Denise Coleman",
      "team": "Beta",
      "tenure": "6-12 months",
      "nps": 0.5181,
      "csat": 0.8536,
      "fcr": 0.7636,
      "aht": 17.7687,
      "qa": 0.9374,
      "calls": 503
    },
    {
      "name": "Perry Pena",
      "team": "Beta",
      "tenure": "6-12 months",
      "nps": 0.5181,
      "csat": 0.8297,
      "fcr": 0.7607,
      "aht": 16.881,
      "qa": 0.9585,
      "calls": 489
    },
    {
      "name": "Alfonso Davis",
      "team": "Beta",
      "tenure": "6-12 months",
      "nps": 0.5093,
      "csat": 0.87,
      "fcr": 0.7493,
      "aht": 17.865,
      "qa": 0.9654,
      "calls": 522
    },
    {
      "name": "Boyd Gordon",
      "team": "Beta",
      "tenure": "12-48 months",
      "nps": 0.6213,
      "csat": 0.9406,
      "fcr": 0.8444,
      "aht": 11.8209,
      "qa": 1,
      "calls": 747
    },
    {
      "name": "Gladys Wilkins",
      "team": "Beta",
      "tenure": "12-48 months",
      "nps": 0.6367,
      "csat": 0.9343,
      "fcr": 0.8575,
      "aht": 13.2391,
      "qa": 1,
      "calls": 724
    },
    {
      "name": "Janet Ramsey",
      "team": "Beta",
      "tenure": "12-48 months",
      "nps": 0.6113,
      "csat": 0.9601,
      "fcr": 0.8388,
      "aht": 14.2004,
      "qa": 1,
      "calls": 709
    },
    {
      "name": "Lena Rodriguez",
      "team": "Beta",
      "tenure": "12-48 months",
      "nps": 0.6144,
      "csat": 0.9454,
      "fcr": 0.8331,
      "aht": 12.3236,
      "qa": 1,
      "calls": 681
    },
    {
      "name": "Velma Medina",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1478,
      "csat": 0.595,
      "fcr": 0.5195,
      "aht": 32.9865,
      "qa": 0.6733,
      "calls": 383
    },
    {
      "name": "Harriet Chandler",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1525,
      "csat": 0.593,
      "fcr": 0.5083,
      "aht": 31.3626,
      "qa": 0.6598,
      "calls": 311
    },
    {
      "name": "Ray Torres",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1764,
      "csat": 0.5808,
      "fcr": 0.5185,
      "aht": 34.702,
      "qa": 0.6865,
      "calls": 342
    },
    {
      "name": "Edward Cobb",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1556,
      "csat": 0.5859,
      "fcr": 0.5244,
      "aht": 31.7948,
      "qa": 0.6728,
      "calls": 337
    },
    {
      "name": "Lois Casey",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1382,
      "csat": 0.5851,
      "fcr": 0.5331,
      "aht": 30.0377,
      "qa": 0.7124,
      "calls": 368
    },
    {
      "name": "Olga Elliott",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1766,
      "csat": 0.5994,
      "fcr": 0.4904,
      "aht": 29.0706,
      "qa": 0.6778,
      "calls": 326
    },
    {
      "name": "Jane Carroll",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1501,
      "csat": 0.5859,
      "fcr": 0.5116,
      "aht": 30.5116,
      "qa": 0.6459,
      "calls": 365
    },
    {
      "name": "Marian Howell",
      "team": "Gamma",
      "tenure": "0-6 months",
      "nps": 0.1685,
      "csat": 0.599,
      "fcr": 0.524,
      "aht": 34.7366,
      "qa": 0.5963,
      "calls": 414
    },
    {
      "name": "Floyd Brooks",
      "team": "Gamma",
      "tenure": "6-12 months",
      "nps": 0.3894,
      "csat": 0.7764,
      "fcr": 0.6378,
      "aht": 22.4953,
      "qa": 0.8536,
      "calls": 502
    },
    {
      "name": "Sherman Parker",
      "team": "Gamma",
      "tenure": "6-12 months",
      "nps": 0.4284,
      "csat": 0.7617,
      "fcr": 0.6221,
      "aht": 23.9863,
      "qa": 0.8518,
      "calls": 503
    },
    {
      "name": "Rudy Goodman",
      "team": "Gamma",
      "tenure": "6-12 months",
      "nps": 0.509,
      "csat": 0.8722,
      "fcr": 0.7442,
      "aht": 18.396,
      "qa": 0.9628,
      "calls": 506
    },
    {
      "name": "Norman Holt",
      "team": "Gamma",
      "tenure": "6-12 months",
      "nps": 0.5164,
      "csat": 0.8339,
      "fcr": 0.7816,
      "aht": 18.7555,
      "qa": 0.958,
      "calls": 515
    },
    {
      "name": "Arnold Walters",
      "team": "Gamma",
      "tenure": "6-12 months",
      "nps": 0.5321,
      "csat": 0.8349,
      "fcr": 0.7203,
      "aht": 16.675,
      "qa": 0.9467,
      "calls": 493
    },
    {
      "name": "Terrell Mills",
      "team": "Gamma",
      "tenure": "12-48 months",
      "nps": 0.6072,
      "csat": 0.934,
      "fcr": 0.8521,
      "aht": 12.7413,
      "qa": 1,
      "calls": 802
    },
    {
      "name": "Heather Mann",
      "team": "Gamma",
      "tenure": "12-48 months",
      "nps": 0.5954,
      "csat": 0.9539,
      "fcr": 0.8472,
      "aht": 13.6863,
      "qa": 1,
      "calls": 744
    },
    {
      "name": "Clay Dixon",
      "team": "Delta",
      "tenure": "0-6 months",
      "nps": 0.196,
      "csat": 0.6319,
      "fcr": 0.5714,
      "aht": 28.3359,
      "qa": 0.6048,
      "calls": 373
    },
    {
      "name": "Erin Paul",
      "team": "Delta",
      "tenure": "0-6 months",
      "nps": 0.1942,
      "csat": 0.6357,
      "fcr": 0.5229,
      "aht": 29.1546,
      "qa": 0.733,
      "calls": 363
    },
    {
      "name": "Felicia Adkins",
      "team": "Delta",
      "tenure": "0-6 months",
      "nps": 0.1618,
      "csat": 0.6599,
      "fcr": 0.5384,
      "aht": 35.2114,
      "qa": 0.7473,
      "calls": 383
    },
    {
      "name": "Alma Crawford",
      "team": "Delta",
      "tenure": "0-6 months",
      "nps": 0.1365,
      "csat": 0.6478,
      "fcr": 0.5256,
      "aht": 38.1166,
      "qa": 0.7283,
      "calls": 281
    },
    {
      "name": "Brandy Sanchez",
      "team": "Delta",
      "tenure": "0-6 months",
      "nps": 0.1085,
      "csat": 0.6717,
      "fcr": 0.5425,
      "aht": 36.7283,
      "qa": 0.6887,
      "calls": 299
    },
    {
      "name": "Bill Hale",
      "team": "Delta",
      "tenure": "6-12 months",
      "nps": 0.4274,
      "csat": 0.7687,
      "fcr": 0.6254,
      "aht": 23.2193,
      "qa": 0.8623,
      "calls": 518
    },
    {
      "name": "Jose Maldonado",
      "team": "Delta",
      "tenure": "6-12 months",
      "nps": 0.3939,
      "csat": 0.7634,
      "fcr": 0.6636,
      "aht": 23.1425,
      "qa": 0.8506,
      "calls": 495
    },
    {
      "name": "Billie Hardy",
      "team": "Delta",
      "tenure": "6-12 months",
      "nps": 0.3977,
      "csat": 0.7631,
      "fcr": 0.6389,
      "aht": 23.8608,
      "qa": 0.8341,
      "calls": 498
    },
    {
      "name": "Shari Wright",
      "team": "Delta",
      "tenure": "6-12 months",
      "nps": 0.5257,
      "csat": 0.8473,
      "fcr": 0.7606,
      "aht": 17.9114,
      "qa": 0.9232,
      "calls": 498
    },
    {
      "name": "Elmer Gibbs",
      "team": "Delta",
      "tenure": "6-12 months",
      "nps": 0.5142,
      "csat": 0.827,
      "fcr": 0.7363,
      "aht": 17.5778,
      "qa": 0.9372,
      "calls": 514
    },
    {
      "name": "Bennie Peterson",
      "team": "Delta",
      "tenure": "6-12 months",
      "nps": 0.5153,
      "csat": 0.8388,
      "fcr": 0.7391,
      "aht": 17.9079,
      "qa": 0.9462,
      "calls": 495
    },
    {
      "name": "Steven Nina",
      "team": "Delta",
      "tenure": "12-48 months",
      "nps": 0.6098,
      "csat": 0.9334,
      "fcr": 0.8543,
      "aht": 13.0421,
      "qa": 1,
      "calls": 713
    },
    {
      "name": "Marry Williams",
      "team": "Delta",
      "tenure": "12-48 months",
      "nps": 0.6056,
      "csat": 0.9475,
      "fcr": 0.8628,
      "aht": 13.638,
      "qa": 1,
      "calls": 667
    },
    {
      "name": "Josh Jhonson",
      "team": "Delta",
      "tenure": "12-48 months",
      "nps": 0.6138,
      "csat": 0.9529,
      "fcr": 0.8513,
      "aht": 12.9883,
      "qa": 1,
      "calls": 678
    },
    {
      "name": "Karen Lopez",
      "team": "Delta",
      "tenure": "12-48 months",
      "nps": 0.6282,
      "csat": 0.9392,
      "fcr": 0.8383,
      "aht": 13.2773,
      "qa": 1,
      "calls": 724
    }
  ],

  /*
   * Facts about how this dashboard was built. They are shown to the learner and
   * given to the coach as data, not as conclusions - none of them says what the
   * numbers mean.
   */
  caveats: [
    'CSAT, NPS and FCR all come from the same customer survey. 12,444.65 surveys were returned against 30,681 calls, a 40.6% return rate. The dashboard shows nothing about the 59.4% who did not answer.',
    'Team, week and tenure figures are unweighted means of agent-week rates: an agent with 20 surveys counts the same as an agent with 300. Recomputed from the underlying responses, overall CSAT is 0.7935 rather than 0.7898.',
    'Survey counts are not whole numbers. The source data holds apportioned values, so a "survey count" of 2,255.6 is a weighted quantity, not a count of people.',
    'Two different quality numbers exist. The CRM QA score is 0.8649 against a 0.90 target. The audit sample is 1,079 audits with a mean score of 71.27, of which 11 reach the 90 pass mark. The workbook does not reconcile them.',
    'The team summary sheet records Gamma\'s survey count as 260.4; the KPI pivot for the same team and period records 3,292.8.',
    'Shrinkage and attendance return errors in the source workbook and are not shown here.',
    'Attrition is recorded as 15% (20 of 23) on a separate sheet whose dates run April to August 2022 and do not line up with this reporting period.',
    'This is one month. Any trend on this dashboard is four weekly points, and there is no prior month to compare against.'
  ]
};

/* Look up a KPI definition by id. */
export function kpi(id, d = DASHBOARD) {
  return d.kpis.find((k) => k.id === id) || null;
}

/* The focus KPI plus its week-one-to-week-four movement. */
export function headline(d = DASHBOARD) {
  const k = kpi(d.focus, d);
  const first = d.weeks[0][d.focus];
  const last = d.weeks[d.weeks.length - 1][d.focus];
  return {
    id: k.id,
    name: k.name,
    value: k.value,
    target: k.target,
    gap: +(k.value - k.target).toFixed(4),
    weekChange: +(last - first).toFixed(4),
    format: k.format,
    better: k.better
  };
}
