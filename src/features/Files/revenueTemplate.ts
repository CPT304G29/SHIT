export function buildRevenueImportTemplateRows() {
  return [
    {
      date: '2026-05-14',
      periodType: 'day',
      revenue: 1250.5,
      source: 'UNIQLO Store A',
      note: 'Example daily revenue row',
    },
    {
      date: '2026-05',
      periodType: 'month',
      revenue: 38600,
      source: 'UNIQLO Store A',
      note: 'Example monthly revenue row',
    },
    {
      date: '2026-Q2',
      periodType: 'quarter',
      revenue: 108900,
      source: 'UNIQLO Store A',
      note: 'Example quarterly revenue row',
    },
  ];
}

export function buildRevenueImportInstructionRows() {
  return [
    {
      Field: 'date',
      Required: 'Yes',
      Description: 'Reporting period. Use YYYY-MM-DD for day, YYYY-MM for month, or YYYY-QN for quarter.',
      Example: '2026-05-14',
    },
    {
      Field: 'periodType',
      Required: 'No',
      Description: 'Allowed values: day, month, quarter. Defaults to day if empty.',
      Example: 'day',
    },
    {
      Field: 'revenue',
      Required: 'Yes',
      Description: 'Revenue amount in normal currency units, not cents.',
      Example: '1250.50',
    },
    {
      Field: 'source',
      Required: 'No',
      Description: 'Where the imported revenue came from.',
      Example: 'UNIQLO Store A',
    },
    {
      Field: 'note',
      Required: 'No',
      Description: 'Free-form notes for the imported row.',
      Example: 'Weekend promotion',
    },
  ];
}
