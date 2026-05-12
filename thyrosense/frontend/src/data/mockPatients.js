const healthy = [
  {
    id: 'pt-001', name: 'Amara Osei', email: 'amara.osei@email.com', age: 34, sex: 'F',
    dob: '1992-03-14', phone: '+1 (555) 201-3344', lastVisit: '2026-05-01',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-001a', date: '2026-05-01T09:15:00.000Z',
        predicted_class: 'healthy', confidence: 0.94, cluster_id: 1,
        top_features: [{ feature: 'TSH', shap_value: 0.38 }, { feature: 'FTI', shap_value: 0.21 }, { feature: 'TT4', shap_value: 0.15 }],
        clinical_interpretation: 'All thyroid markers within normal reference ranges.',
        form_data: { age: 34, sex: 'F', TSH: 2.1, T3: 1.4, TT4: 95, FTI: 105 },
      },
    ],
  },
  {
    id: 'pt-002', name: 'Carlos Mendez', email: 'carlos.m@email.com', age: 51, sex: 'M',
    dob: '1975-07-22', phone: '+1 (555) 302-4455', lastVisit: '2026-04-18',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-002a', date: '2026-04-18T11:30:00.000Z',
        predicted_class: 'healthy', confidence: 0.91, cluster_id: 1,
        top_features: [{ feature: 'TSH', shap_value: 0.31 }, { feature: 'T3', shap_value: 0.19 }, { feature: 'TT4', shap_value: 0.12 }],
        clinical_interpretation: 'Thyroid function normal for age group.',
        form_data: { age: 51, sex: 'M', TSH: 1.8, T3: 1.2, TT4: 88, FTI: 98 },
      },
    ],
  },
  {
    id: 'pt-003', name: 'Priya Nair', email: 'priya.nair@email.com', age: 28, sex: 'F',
    dob: '1998-01-05', phone: '+1 (555) 403-5566', lastVisit: '2026-05-05',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-003a', date: '2026-05-05T08:00:00.000Z',
        predicted_class: 'healthy', confidence: 0.97, cluster_id: 1,
        top_features: [{ feature: 'FTI', shap_value: 0.42 }, { feature: 'TSH', shap_value: 0.29 }, { feature: 'T3', shap_value: 0.11 }],
        clinical_interpretation: 'Excellent thyroid health. No intervention required.',
        form_data: { age: 28, sex: 'F', TSH: 2.4, T3: 1.5, TT4: 102, FTI: 110 },
      },
    ],
  },
  {
    id: 'pt-004', name: 'James Whitfield', email: 'j.whitfield@email.com', age: 43, sex: 'M',
    dob: '1983-09-30', phone: '+1 (555) 504-6677', lastVisit: '2026-04-25',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-004a', date: '2026-04-25T14:20:00.000Z',
        predicted_class: 'healthy', confidence: 0.89, cluster_id: 2,
        top_features: [{ feature: 'TSH', shap_value: 0.27 }, { feature: 'TT4', shap_value: 0.22 }, { feature: 'FTI', shap_value: 0.18 }],
        clinical_interpretation: 'No abnormalities detected in thyroid panel.',
        form_data: { age: 43, sex: 'M', TSH: 2.0, T3: 1.3, TT4: 91, FTI: 101 },
      },
    ],
  },
  {
    id: 'pt-005', name: 'Fatima Al-Hassan', email: 'fatima.alh@email.com', age: 38, sex: 'F',
    dob: '1988-06-12', phone: '+1 (555) 605-7788', lastVisit: '2026-05-08',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-005a', date: '2026-05-08T10:45:00.000Z',
        predicted_class: 'healthy', confidence: 0.93, cluster_id: 1,
        top_features: [{ feature: 'TSH', shap_value: 0.35 }, { feature: 'FTI', shap_value: 0.23 }, { feature: 'T3', shap_value: 0.14 }],
        clinical_interpretation: 'Thyroid function within normal limits.',
        form_data: { age: 38, sex: 'F', TSH: 2.2, T3: 1.4, TT4: 97, FTI: 107 },
      },
    ],
  },
  {
    id: 'pt-006', name: 'Dmitri Volkov', email: 'd.volkov@email.com', age: 56, sex: 'M',
    dob: '1970-11-18', phone: '+1 (555) 706-8899', lastVisit: '2026-04-10',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-006a', date: '2026-04-10T13:00:00.000Z',
        predicted_class: 'healthy', confidence: 0.88, cluster_id: 2,
        top_features: [{ feature: 'TT4', shap_value: 0.29 }, { feature: 'TSH', shap_value: 0.24 }, { feature: 'FTI', shap_value: 0.16 }],
        clinical_interpretation: 'Annual screening normal. Continue annual monitoring.',
        form_data: { age: 56, sex: 'M', TSH: 1.9, T3: 1.1, TT4: 86, FTI: 96 },
      },
    ],
  },
  {
    id: 'pt-007', name: 'Ngozi Eze', email: 'ngozi.eze@email.com', age: 31, sex: 'F',
    dob: '1995-04-03', phone: '+1 (555) 807-9900', lastVisit: '2026-05-10',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-007a', date: '2026-05-10T09:30:00.000Z',
        predicted_class: 'healthy', confidence: 0.96, cluster_id: 1,
        top_features: [{ feature: 'FTI', shap_value: 0.40 }, { feature: 'TSH', shap_value: 0.28 }, { feature: 'TT4', shap_value: 0.17 }],
        clinical_interpretation: 'Healthy thyroid profile. No follow-up required.',
        form_data: { age: 31, sex: 'F', TSH: 2.3, T3: 1.5, TT4: 100, FTI: 109 },
      },
    ],
  },
  {
    id: 'pt-008', name: 'Samuel Park', email: 's.park@email.com', age: 47, sex: 'M',
    dob: '1979-08-20', phone: '+1 (555) 908-1011', lastVisit: '2026-04-30',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-008a', date: '2026-04-30T15:00:00.000Z',
        predicted_class: 'healthy', confidence: 0.90, cluster_id: 2,
        top_features: [{ feature: 'TSH', shap_value: 0.33 }, { feature: 'T3', shap_value: 0.20 }, { feature: 'FTI', shap_value: 0.15 }],
        clinical_interpretation: 'Routine panel normal. No thyroid disorder detected.',
        form_data: { age: 47, sex: 'M', TSH: 1.7, T3: 1.2, TT4: 90, FTI: 99 },
      },
    ],
  },
  {
    id: 'pt-009', name: 'Isabel Sousa', email: 'isabel.s@email.com', age: 24, sex: 'F',
    dob: '2002-02-14', phone: '+1 (555) 109-2122', lastVisit: '2026-05-03',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-009a', date: '2026-05-03T11:00:00.000Z',
        predicted_class: 'healthy', confidence: 0.95, cluster_id: 1,
        top_features: [{ feature: 'TSH', shap_value: 0.39 }, { feature: 'FTI', shap_value: 0.24 }, { feature: 'TT4', shap_value: 0.13 }],
        clinical_interpretation: 'All values normal. Healthy thyroid function confirmed.',
        form_data: { age: 24, sex: 'F', TSH: 2.5, T3: 1.6, TT4: 104, FTI: 112 },
      },
    ],
  },
  {
    id: 'pt-010', name: 'Henry Kimura', email: 'h.kimura@email.com', age: 61, sex: 'M',
    dob: '1965-12-01', phone: '+1 (555) 210-3233', lastVisit: '2026-04-15',
    riskLevel: 'low', status: 'stable',
    predictions: [
      {
        id: 'pred-010a', date: '2026-04-15T10:00:00.000Z',
        predicted_class: 'healthy', confidence: 0.87, cluster_id: 2,
        top_features: [{ feature: 'TT4', shap_value: 0.30 }, { feature: 'TSH', shap_value: 0.22 }, { feature: 'T3', shap_value: 0.14 }],
        clinical_interpretation: 'Thyroid markers acceptable for age. Annual re-check advised.',
        form_data: { age: 61, sex: 'M', TSH: 2.0, T3: 1.1, TT4: 84, FTI: 94 },
      },
    ],
  },
]

const hypothyroid = [
  {
    id: 'pt-011', name: 'Eleanor Marsh', email: 'e.marsh@email.com', age: 54, sex: 'F',
    dob: '1972-05-09', phone: '+1 (555) 311-4344', lastVisit: '2026-05-07',
    riskLevel: 'high', status: 'monitoring',
    predictions: [
      {
        id: 'pred-011a', date: '2026-05-07T09:00:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.92, cluster_id: 3,
        top_features: [{ feature: 'TSH', shap_value: -0.55 }, { feature: 'FTI', shap_value: -0.33 }, { feature: 'TT4', shap_value: -0.28 }],
        clinical_interpretation: 'Elevated TSH with reduced FTI suggests primary hypothyroidism.',
        form_data: { age: 54, sex: 'F', TSH: 8.4, T3: 0.8, TT4: 58, FTI: 62 },
      },
      {
        id: 'pred-011b', date: '2026-03-12T14:30:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.88, cluster_id: 3,
        top_features: [{ feature: 'TSH', shap_value: -0.48 }, { feature: 'FTI', shap_value: -0.29 }, { feature: 'T3', shap_value: -0.21 }],
        clinical_interpretation: 'Persistent hypothyroid pattern. Consider dose adjustment.',
        form_data: { age: 54, sex: 'F', TSH: 7.1, T3: 0.9, TT4: 62, FTI: 67 },
      },
    ],
  },
  {
    id: 'pt-012', name: 'Robert Okafor', email: 'r.okafor@email.com', age: 67, sex: 'M',
    dob: '1959-10-25', phone: '+1 (555) 412-5455', lastVisit: '2026-04-22',
    riskLevel: 'high', status: 'treatment',
    predictions: [
      {
        id: 'pred-012a', date: '2026-04-22T10:15:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.89, cluster_id: 3,
        top_features: [{ feature: 'TSH', shap_value: -0.61 }, { feature: 'TT4', shap_value: -0.38 }, { feature: 'FTI', shap_value: -0.31 }],
        clinical_interpretation: 'TSH markedly elevated. Treatment response suboptimal.',
        form_data: { age: 67, sex: 'M', TSH: 10.2, T3: 0.7, TT4: 52, FTI: 56 },
      },
    ],
  },
  {
    id: 'pt-013', name: 'Mei-Ling Chen', email: 'meiling.c@email.com', age: 42, sex: 'F',
    dob: '1984-03-17', phone: '+1 (555) 513-6566', lastVisit: '2026-05-02',
    riskLevel: 'medium', status: 'monitoring',
    predictions: [
      {
        id: 'pred-013a', date: '2026-05-02T13:45:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.82, cluster_id: 3,
        top_features: [{ feature: 'TSH', shap_value: -0.44 }, { feature: 'T3', shap_value: -0.25 }, { feature: 'FTI', shap_value: -0.19 }],
        clinical_interpretation: 'Mildly elevated TSH. Subclinical hypothyroidism pattern.',
        form_data: { age: 42, sex: 'F', TSH: 5.9, T3: 1.0, TT4: 71, FTI: 76 },
      },
    ],
  },
  {
    id: 'pt-014', name: 'Tom Andersen', email: 't.andersen@email.com', age: 59, sex: 'M',
    dob: '1967-07-04', phone: '+1 (555) 614-7677', lastVisit: '2026-04-28',
    riskLevel: 'medium', status: 'stable',
    predictions: [
      {
        id: 'pred-014a', date: '2026-04-28T11:30:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.78, cluster_id: 4,
        top_features: [{ feature: 'TSH', shap_value: -0.36 }, { feature: 'TT4', shap_value: -0.24 }, { feature: 'T3', shap_value: -0.17 }],
        clinical_interpretation: 'Borderline TSH elevation. Lifestyle monitoring recommended.',
        form_data: { age: 59, sex: 'M', TSH: 4.8, T3: 1.0, TT4: 75, FTI: 80 },
      },
    ],
  },
  {
    id: 'pt-015', name: 'Sophia Reyes', email: 's.reyes@email.com', age: 36, sex: 'F',
    dob: '1990-01-28', phone: '+1 (555) 715-8788', lastVisit: '2026-05-06',
    riskLevel: 'medium', status: 'monitoring',
    predictions: [
      {
        id: 'pred-015a', date: '2026-05-06T09:20:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.84, cluster_id: 3,
        top_features: [{ feature: 'FTI', shap_value: -0.41 }, { feature: 'TSH', shap_value: -0.37 }, { feature: 'TT4', shap_value: -0.22 }],
        clinical_interpretation: 'Post-partum thyroiditis pattern. Repeat in 6 weeks.',
        form_data: { age: 36, sex: 'F', TSH: 6.3, T3: 0.9, TT4: 68, FTI: 72 },
      },
    ],
  },
  {
    id: 'pt-016', name: 'Marcus Webb', email: 'm.webb@email.com', age: 48, sex: 'M',
    dob: '1978-09-11', phone: '+1 (555) 816-9899', lastVisit: '2026-04-19',
    riskLevel: 'high', status: 'treatment',
    predictions: [
      {
        id: 'pred-016a', date: '2026-04-19T14:00:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.91, cluster_id: 3,
        top_features: [{ feature: 'TSH', shap_value: -0.58 }, { feature: 'FTI', shap_value: -0.35 }, { feature: 'TT4', shap_value: -0.27 }],
        clinical_interpretation: 'High TSH, low T4. Overt hypothyroidism requiring treatment.',
        form_data: { age: 48, sex: 'M', TSH: 9.7, T3: 0.7, TT4: 54, FTI: 59 },
      },
      {
        id: 'pred-016b', date: '2026-02-05T10:00:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.86, cluster_id: 3,
        top_features: [{ feature: 'TSH', shap_value: -0.51 }, { feature: 'TT4', shap_value: -0.30 }, { feature: 'FTI', shap_value: -0.24 }],
        clinical_interpretation: 'Progressive hypothyroid trend. Levothyroxine initiated.',
        form_data: { age: 48, sex: 'M', TSH: 8.1, T3: 0.8, TT4: 59, FTI: 64 },
      },
    ],
  },
  {
    id: 'pt-017', name: 'Aisha Diallo', email: 'a.diallo@email.com', age: 45, sex: 'F',
    dob: '1981-06-06', phone: '+1 (555) 917-0910', lastVisit: '2026-05-09',
    riskLevel: 'medium', status: 'monitoring',
    predictions: [
      {
        id: 'pred-017a', date: '2026-05-09T12:00:00.000Z',
        predicted_class: 'hypothyroid', confidence: 0.80, cluster_id: 4,
        top_features: [{ feature: 'TSH', shap_value: -0.39 }, { feature: 'T3', shap_value: -0.26 }, { feature: 'FTI', shap_value: -0.18 }],
        clinical_interpretation: 'Mild TSH elevation. Continue monitoring, diet review advised.',
        form_data: { age: 45, sex: 'F', TSH: 5.4, T3: 1.0, TT4: 74, FTI: 79 },
      },
    ],
  },
]

const hyperthyroid = [
  {
    id: 'pt-018', name: 'Lena Fischer', email: 'lena.f@email.com', age: 29, sex: 'F',
    dob: '1997-04-22', phone: '+1 (555) 118-1223', lastVisit: '2026-05-04',
    riskLevel: 'high', status: 'treatment',
    predictions: [
      {
        id: 'pred-018a', date: '2026-05-04T08:30:00.000Z',
        predicted_class: 'hyperthyroid', confidence: 0.93, cluster_id: 5,
        top_features: [{ feature: 'TSH', shap_value: 0.65 }, { feature: 'FTI', shap_value: 0.47 }, { feature: 'TT4', shap_value: 0.38 }],
        clinical_interpretation: 'Suppressed TSH with markedly elevated FTI. Graves disease pattern.',
        form_data: { age: 29, sex: 'F', TSH: 0.04, T3: 3.8, TT4: 168, FTI: 182 },
      },
      {
        id: 'pred-018b', date: '2026-03-01T09:00:00.000Z',
        predicted_class: 'hyperthyroid', confidence: 0.90, cluster_id: 5,
        top_features: [{ feature: 'TSH', shap_value: 0.59 }, { feature: 'FTI', shap_value: 0.41 }, { feature: 'T3', shap_value: 0.32 }],
        clinical_interpretation: 'TSH undetectable. Antithyroid therapy initiated.',
        form_data: { age: 29, sex: 'F', TSH: 0.02, T3: 3.5, TT4: 158, FTI: 175 },
      },
    ],
  },
  {
    id: 'pt-019', name: 'Victor Aguila', email: 'v.aguila@email.com', age: 35, sex: 'M',
    dob: '1991-11-15', phone: '+1 (555) 219-2334', lastVisit: '2026-04-26',
    riskLevel: 'high', status: 'treatment',
    predictions: [
      {
        id: 'pred-019a', date: '2026-04-26T11:00:00.000Z',
        predicted_class: 'hyperthyroid', confidence: 0.88, cluster_id: 5,
        top_features: [{ feature: 'FTI', shap_value: 0.52 }, { feature: 'TSH', shap_value: 0.48 }, { feature: 'TT4', shap_value: 0.34 }],
        clinical_interpretation: 'Toxic multinodular goitre suspected. Refer to endocrinology.',
        form_data: { age: 35, sex: 'M', TSH: 0.07, T3: 3.2, TT4: 152, FTI: 171 },
      },
    ],
  },
  {
    id: 'pt-020', name: 'Grace Okonkwo', email: 'g.okonkwo@email.com', age: 41, sex: 'F',
    dob: '1985-02-28', phone: '+1 (555) 320-3445', lastVisit: '2026-05-01',
    riskLevel: 'high', status: 'monitoring',
    predictions: [
      {
        id: 'pred-020a', date: '2026-05-01T14:00:00.000Z',
        predicted_class: 'hyperthyroid', confidence: 0.85, cluster_id: 5,
        top_features: [{ feature: 'TSH', shap_value: 0.56 }, { feature: 'T3', shap_value: 0.43 }, { feature: 'FTI', shap_value: 0.36 }],
        clinical_interpretation: 'Suppressed TSH, elevated T3. Thyrotoxicosis in remission phase.',
        form_data: { age: 41, sex: 'F', TSH: 0.09, T3: 2.9, TT4: 140, FTI: 158 },
      },
    ],
  },
  {
    id: 'pt-021', name: 'Daniel Kraft', email: 'd.kraft@email.com', age: 53, sex: 'M',
    dob: '1973-08-07', phone: '+1 (555) 421-4556', lastVisit: '2026-04-12',
    riskLevel: 'high', status: 'treatment',
    predictions: [
      {
        id: 'pred-021a', date: '2026-04-12T10:30:00.000Z',
        predicted_class: 'hyperthyroid', confidence: 0.87, cluster_id: 5,
        top_features: [{ feature: 'TT4', shap_value: 0.49 }, { feature: 'FTI', shap_value: 0.44 }, { feature: 'TSH', shap_value: 0.41 }],
        clinical_interpretation: 'Overt hyperthyroidism. Beta-blocker added for symptom control.',
        form_data: { age: 53, sex: 'M', TSH: 0.06, T3: 3.4, TT4: 161, FTI: 178 },
      },
    ],
  },
]

const bindingProtein = [
  {
    id: 'pt-022', name: 'Yasmin Al-Farsi', email: 'yasmin.af@email.com', age: 39, sex: 'F',
    dob: '1987-10-10', phone: '+1 (555) 522-5667', lastVisit: '2026-05-05',
    riskLevel: 'medium', status: 'monitoring',
    predictions: [
      {
        id: 'pred-022a', date: '2026-05-05T09:45:00.000Z',
        predicted_class: 'binding_protein_disorder', confidence: 0.81, cluster_id: 6,
        top_features: [{ feature: 'T4U', shap_value: 0.58 }, { feature: 'FTI', shap_value: -0.39 }, { feature: 'TT4', shap_value: 0.31 }],
        clinical_interpretation: 'Elevated TT4 with abnormal T4 uptake ratio. TBG excess likely.',
        form_data: { age: 39, sex: 'F', TSH: 2.1, T3: 1.6, TT4: 148, FTI: 79 },
      },
    ],
  },
  {
    id: 'pt-023', name: 'Ben Ashworth', email: 'b.ashworth@email.com', age: 46, sex: 'M',
    dob: '1980-05-21', phone: '+1 (555) 623-6778', lastVisit: '2026-04-20',
    riskLevel: 'medium', status: 'stable',
    predictions: [
      {
        id: 'pred-023a', date: '2026-04-20T13:15:00.000Z',
        predicted_class: 'binding_protein_disorder', confidence: 0.77, cluster_id: 6,
        top_features: [{ feature: 'FTI', shap_value: -0.42 }, { feature: 'T4U', shap_value: 0.51 }, { feature: 'TT4', shap_value: 0.27 }],
        clinical_interpretation: 'Discordant TT4/FTI. TBG deficiency pattern observed.',
        form_data: { age: 46, sex: 'M', TSH: 1.9, T3: 1.3, TT4: 141, FTI: 74 },
      },
    ],
  },
  {
    id: 'pt-024', name: 'Chiara Romano', email: 'c.romano@email.com', age: 33, sex: 'F',
    dob: '1993-07-17', phone: '+1 (555) 724-7889', lastVisit: '2026-05-08',
    riskLevel: 'medium', status: 'monitoring',
    predictions: [
      {
        id: 'pred-024a', date: '2026-05-08T11:30:00.000Z',
        predicted_class: 'binding_protein_disorder', confidence: 0.79, cluster_id: 6,
        top_features: [{ feature: 'T4U', shap_value: 0.54 }, { feature: 'TT4', shap_value: 0.34 }, { feature: 'FTI', shap_value: -0.44 }],
        clinical_interpretation: 'OCP-related TBG elevation. Functional euthyroid state confirmed.',
        form_data: { age: 33, sex: 'F', TSH: 2.3, T3: 1.7, TT4: 154, FTI: 77 },
      },
    ],
  },
]

export const mockPatients = [...healthy, ...hypothyroid, ...hyperthyroid, ...bindingProtein]

export const getPatientById = (id) => mockPatients.find(p => p.id === id) || null

export const getLatestClass = (patient) => patient.predictions[patient.predictions.length - 1]?.predicted_class || null

export const getClassCounts = () =>
  mockPatients.reduce((acc, p) => {
    const cls = getLatestClass(p) || 'unknown'
    acc[cls] = (acc[cls] || 0) + 1
    return acc
  }, {})

export const getAllPredictions = () =>
  mockPatients.flatMap(p => p.predictions.map(pred => ({ ...pred, patient: p })))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

export const getHighRiskPatients = () => mockPatients.filter(p => p.riskLevel === 'high')

export const getAvgConfidence = () => {
  const all = getAllPredictions()
  return all.reduce((sum, p) => sum + (p.confidence || 0), 0) / all.length
}

export const getPredictionsThisMonth = () => {
  const now = new Date()
  return getAllPredictions().filter(p => {
    const d = new Date(p.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
}
