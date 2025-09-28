import React, { useState, useMemo, FC } from 'react';
import type { MortgageInput, MortgageMetrics } from '../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const calculateMortgage = (input: MortgageInput): MortgageMetrics => {
    const { propertyPrice, downPaymentPercent, interestRatePercent, loanTermYears } = input;

    const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPaymentAmount;

    if (loanAmount <= 0) {
        return { monthlyPayment: 0, loanAmount: 0, downPaymentAmount };
    }

    const monthlyInterestRate = (interestRatePercent / 100) / 12;
    const numberOfPayments = loanTermYears * 12;

    if (monthlyInterestRate <= 0) {
         return { monthlyPayment: loanAmount / numberOfPayments, loanAmount, downPaymentAmount };
    }

    // FIX: Corrected typo `monthlyInterestrate` to `monthlyInterestRate`.
    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    return { monthlyPayment, loanAmount, downPaymentAmount };
};

// FIX: Defined a props interface for SliderInput to correctly type the `onChange` handler.
interface SliderInputProps {
    label: string;
    name: keyof MortgageInput;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    onChange: (name: keyof MortgageInput, value: number) => void;
}

const SliderInput: FC<SliderInputProps> = ({label, name, value, min, max, step, unit, onChange}) => {
    let displayValue: string;
    if (name === 'downPaymentPercent' || name === 'loanTermYears') {
        displayValue = Math.round(value).toString();
    } else {
        displayValue = value.toFixed(1);
    }

    return (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">{label}: <span className="font-bold text-primary">{displayValue}{unit}</span></label>
            <input
                type="range"
                name={name}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(name, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
        </div>
    );
};

const MortgageCalculator: FC<{ propertyPrice: number }> = ({ propertyPrice }) => {
    const [input, setInput] = useState<MortgageInput>({
        propertyPrice,
        downPaymentPercent: 20,
        interestRatePercent: 7.0,
        loanTermYears: 30,
    });
    
    const metrics = useMemo(() => calculateMortgage(input), [input]);

    const handleInputChange = <K extends keyof MortgageInput>(key: K, value: MortgageInput[K]) => {
        setInput(prev => ({ ...prev, [key]: Number(value) }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-serif text-2xl font-bold text-primary mb-4">Calculadora de Hipoteca</h3>
            <div className="space-y-4">
                <SliderInput label="Enganche" name="downPaymentPercent" value={input.downPaymentPercent} min={10} max={100} step={1} unit="%" onChange={handleInputChange} />
                <SliderInput label="Tasa de Interés" name="interestRatePercent" value={input.interestRatePercent} min={3} max={12} step={0.1} unit="%" onChange={handleInputChange} />
                <SliderInput label="Plazo del Préstamo" name="loanTermYears" value={input.loanTermYears} min={10} max={30} step={1} unit=" años" onChange={handleInputChange} />
            </div>
            <div className="mt-6 border-t pt-4 text-center">
                <p className="text-gray-600 text-sm">Pago Mensual Estimado</p>
                <p className="text-4xl font-bold text-primary">{formatCurrency(metrics.monthlyPayment)}</p>
            </div>
        </div>
    );
};

export default MortgageCalculator;