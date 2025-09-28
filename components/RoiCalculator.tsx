import React, { useState, useMemo, FC } from 'react';
import type { RoiInput, RoiMetrics } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const calculateRoi = (input: RoiInput): RoiMetrics => {
    const { propertyPrice, downPaymentPercent, interestRatePercent, loanTermYears, closingCostsPercent, monthlyRentalIncome, monthlyExpenses, vacancyRatePercent, annualAppreciationPercent } = input;

    const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPaymentAmount;
    const closingCosts = propertyPrice * (closingCostsPercent / 100);
    const totalCashInvested = downPaymentAmount + closingCosts;

    const monthlyInterestRate = (interestRatePercent / 100) / 12;
    const numberOfPayments = loanTermYears * 12;
    const monthlyMortgage = loanAmount > 0 ? loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) : 0;
    const annualDebtService = monthlyMortgage * 12;

    const annualGrossIncome = monthlyRentalIncome * 12;
    const vacancyLoss = annualGrossIncome * (vacancyRatePercent / 100);
    const effectiveGrossIncome = annualGrossIncome - vacancyLoss;
    const annualExpenses = monthlyExpenses * 12;
    const noi = effectiveGrossIncome - annualExpenses;

    const annualCashFlow = noi - annualDebtService;
    const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
    const capRate = propertyPrice > 0 ? (noi / propertyPrice) * 100 : 0;
    
    // Projections
    const projections: RoiMetrics['projections'] = [];
    let currentPropertyValue = propertyPrice;
    let currentLoanBalance = loanAmount;
    
    for (let year = 1; year <= 10; year++) {
        let principalPaid = 0;
        if(loanAmount > 0) {
            for(let month = 1; month <= 12; month++) {
                const interestPayment = currentLoanBalance * monthlyInterestRate;
                principalPaid += monthlyMortgage - interestPayment;
                currentLoanBalance -= (monthlyMortgage - interestPayment);
            }
        }
        
        currentPropertyValue *= (1 + annualAppreciationPercent / 100);
        const equity = currentPropertyValue - currentLoanBalance;
        const totalReturn = (annualCashFlow + principalPaid + (currentPropertyValue - (currentPropertyValue / (1 + annualAppreciationPercent / 100)))) / totalCashInvested * 100;
        
        projections.push({ year, propertyValue: currentPropertyValue, equity, totalReturn });
    }
    
    return {
        noi,
        capRate,
        totalCashInvested,
        annualCashFlow,
        cashOnCashReturn,
        yearOneTotalReturn: projections[0]?.totalReturn || 0,
        projections
    };
};

const RoiCalculator: FC<{ propertyPrice: number }> = ({ propertyPrice }) => {
    const [input, setInput] = useState<RoiInput>({
        propertyPrice: propertyPrice,
        downPaymentPercent: 30,
        interestRatePercent: 6.5,
        loanTermYears: 20,
        closingCostsPercent: 5,
        monthlyRentalIncome: Math.round(propertyPrice / 250),
        monthlyExpenses: Math.round(propertyPrice / 250 * 0.35),
        vacancyRatePercent: 8,
        annualAppreciationPercent: 7,
    });

    const metrics = useMemo(() => calculateRoi(input), [input]);

    const handleInputChange = <K extends keyof RoiInput,>(key: K, value: RoiInput[K]) => {
        setInput(prev => ({ ...prev, [key]: Number(value) }));
    };

    const SliderInput: FC<{label: string, name: keyof RoiInput, value: number, min: number, max: number, step: number, unit: string}> = ({label, name, value, min, max, step, unit}) => {
        let displayValue: string;
        if (name === 'downPaymentPercent' || name === 'loanTermYears') {
            displayValue = Math.round(value).toString();
        } else {
            displayValue = value.toFixed(1);
        }

        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{label}: <span className="font-bold text-primary">{displayValue}{unit}</span></label>
                <input
                    type="range"
                    name={name}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => handleInputChange(name, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
            </div>
        );
    };
    
    const NumberInput: FC<{label: string, name: keyof RoiInput, value: number, unit: string}> = ({label, name, value, unit}) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
             <div className="mt-1 relative rounded-md shadow-sm">
                 {unit === '$' && <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><span className="text-gray-500 sm:text-sm">$</span></div>}
                 <input
                     type="number"
                     name={name}
                     value={value}
                     onChange={(e) => handleInputChange(name, parseFloat(e.target.value))}
                     className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                 />
                 {unit === '/mes' && <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center"><span className="text-gray-500 sm:text-sm">/mes</span></div>}
            </div>
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-lg shadow-2xl my-8">
            <h2 className="font-serif text-4xl font-bold text-primary mb-6">Calculadora de ROI de Inversión</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="md:col-span-1">
                    <h3 className="font-serif text-2xl font-semibold text-text-main border-b border-secondary pb-2 mb-4">Supuestos</h3>
                    <SliderInput label="Enganche" name="downPaymentPercent" value={input.downPaymentPercent} min={10} max={100} step={0.1} unit="%" />
                    <SliderInput label="Tasa de Interés" name="interestRatePercent" value={input.interestRatePercent} min={3} max={12} step={0.1} unit="%" />
                    <SliderInput label="Plazo del Préstamo" name="loanTermYears" value={input.loanTermYears} min={10} max={30} step={0.1} unit=" años" />
                    <SliderInput label="Apreciación Anual" name="annualAppreciationPercent" value={input.annualAppreciationPercent} min={0} max={15} step={0.1} unit="%" />
                    <NumberInput label="Ingreso Mensual por Renta" name="monthlyRentalIncome" value={input.monthlyRentalIncome} unit="/mes" />
                    <NumberInput label="Gastos Mensuales" name="monthlyExpenses" value={input.monthlyExpenses} unit="/mes" />
                </div>

                {/* Metrics */}
                <div className="md:col-span-2">
                    <h3 className="font-serif text-2xl font-semibold text-text-main border-b border-secondary pb-2 mb-4">Métricas Clave</h3>
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                        <div className="bg-background p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Cap Rate</div>
                            <div className="text-3xl font-bold text-primary">{formatPercent(metrics.capRate)}</div>
                        </div>
                         <div className="bg-background p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Retorno sobre Efectivo</div>
                            <div className="text-3xl font-bold text-primary">{formatPercent(metrics.cashOnCashReturn)}</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Retorno Total (Año 1)</div>
                            <div className="text-3xl font-bold text-primary">{formatPercent(metrics.yearOneTotalReturn)}</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Flujo de Efectivo Anual</div>
                            <div className="text-xl font-bold text-primary">{formatCurrency(metrics.annualCashFlow)}</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Ingreso Neto Operativo</div>
                            <div className="text-xl font-bold text-primary">{formatCurrency(metrics.noi)}</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg">
                            <div className="text-sm text-gray-600">Efectivo Total Invertido</div>
                            <div className="text-xl font-bold text-primary">{formatCurrency(metrics.totalCashInvested)}</div>
                        </div>
                    </div>
                    
                    <h3 className="font-serif text-2xl font-semibold text-text-main border-b border-secondary pb-2 mt-8 mb-4">Proyección de Plusvalía y Valor a 10 Años</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                             <BarChart data={metrics.projections} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" tickFormatter={(tick) => `Año ${tick}`} />
                                <YAxis tickFormatter={(tick) => `${(tick / 1000).toLocaleString()}k`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="propertyValue" fill="#004D40" name="Valor de la Propiedad" />
                                <Bar dataKey="equity" fill="#D4AF37" name="Plusvalía" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoiCalculator;
