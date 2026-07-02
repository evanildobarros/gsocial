import { describe, it, expect } from 'vitest';
import { calculateProjectSROI, IMPACT_PROXIES } from './SROICalculator';

describe('SROICalculator - Motor de Cálculo S-ROI', () => {
    describe('IMPACT_PROXIES', () => {
        it('deve conter as proxies corretas definidas pela metodologia ESGporto', () => {
            expect(IMPACT_PROXIES).toHaveProperty('empregabilidade');
            expect(IMPACT_PROXIES).toHaveProperty('saneamento_basico');

            expect(IMPACT_PROXIES.empregabilidade.totalPorPessoa).toBe(43200);
            expect(IMPACT_PROXIES.saneamento_basico.totalPorFamilia).toBe(6500);
        });
    });

    describe('calculateProjectSROI', () => {
        it('deve retornar valores zerados se o investimento for nulo ou menor/igual a zero', () => {
            const resultZero = calculateProjectSROI(0, 100, 'empregabilidade');
            expect(resultZero.socialValue).toBe(0);
            expect(resultZero.ratio).toBe('0.00');

            const resultNegative = calculateProjectSROI(-1000, 50, 'empregabilidade');
            expect(resultNegative.socialValue).toBe(0);
            expect(resultNegative.ratio).toBe('0.00');
        });

        it('deve calcular corretamente o S-ROI para projetos de empregabilidade', () => {
            const investment = 100000; // R$ 100.000,00
            const beneficiaries = 10;
            const expectedSocialValue = beneficiaries * IMPACT_PROXIES.empregabilidade.totalPorPessoa; // 10 * 43200 = 432.000
            const expectedRatio = (expectedSocialValue / investment).toFixed(2); // 4.32

            const result = calculateProjectSROI(investment, beneficiaries, 'empregabilidade');

            expect(result.socialValue).toBe(expectedSocialValue);
            expect(result.ratio).toBe(expectedRatio);
            expect(result.message).toContain(`R$ ${expectedRatio}`);
        });

        it('deve calcular corretamente o S-ROI para projetos de saneamento básico', () => {
            const investment = 50000; // R$ 50.000,00
            const beneficiaries = 20;
            const expectedSocialValue = beneficiaries * IMPACT_PROXIES.saneamento_basico.totalPorFamilia; // 20 * 6500 = 130.000
            const expectedRatio = (expectedSocialValue / investment).toFixed(2); // 2.60

            const result = calculateProjectSROI(investment, beneficiaries, 'saneamento_basico');

            expect(result.socialValue).toBe(expectedSocialValue);
            expect(result.ratio).toBe(expectedRatio);
            expect(result.message).toContain(`R$ ${expectedRatio}`);
        });
    });
});
