import { describe, expect, it } from 'vitest';
import {
  buildRevenueImportInstructionRows,
  buildRevenueImportTemplateRows,
} from '../revenueTemplate';

describe('revenue import template', () => {
  it('provides fillable example rows', () => {
    const rows = buildRevenueImportTemplateRows();

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({
      date: '2026-05-14',
      periodType: 'day',
      revenue: 1250.5,
    });
    expect(rows[2]).toMatchObject({
      date: '2026-Q2',
      periodType: 'quarter',
    });
  });

  it('documents required import fields', () => {
    const rows = buildRevenueImportInstructionRows();

    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ Field: 'date', Required: 'Yes' }),
        expect.objectContaining({ Field: 'revenue', Required: 'Yes' }),
        expect.objectContaining({ Field: 'periodType', Required: 'No' }),
      ])
    );
  });
});
