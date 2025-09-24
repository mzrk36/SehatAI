
import React, { useState, useCallback } from 'react';
import { calculateRiskScore } from '../services/geminiService';
import { RiskScoreResult, RiskLevel } from '../types';
import Spinner from './common/Spinner';
import Card from './common/Card';

const RiskScoring: React.FC = () => {
    const [formData, setFormData] = useState({
        age: 55,
        gender: 'Male',
        systolicBP: 135,
        cholesterol: 220,
        hdl: 45,
        smoker: 'Yes',
        diabetes: 'No',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<RiskScoreResult | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'systolicBP' || name === 'cholesterol' || name === 'hdl' ? Number(value) : value }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const riskResult = await calculateRiskScore(formData);
            setResult(riskResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const getRiskColor = (level: RiskLevel): string => {
        switch (level) {
            case 'Low': return 'bg-green-500';
            case 'Medium': return 'bg-yellow-500';
            case 'High': return 'bg-orange-500';
            case 'Very High': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };
    
    const getRiskTextColor = (level: RiskLevel): string => {
        switch (level) {
            case 'Low': return 'text-green-700';
            case 'Medium': return 'text-yellow-700';
            case 'High': return 'text-orange-700';
            case 'Very High': return 'text-red-700';
            default: return 'text-gray-700';
        }
    }


    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Predictive Risk Scoring</h2>
            <p className="text-gray-600 mb-6">Enter patient data to calculate the risk score for Diabetes and Heart Disease.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">1. Patient Health Data</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                                <input type="number" name="age" id="age" value={formData.age} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                <select name="gender" id="gender" value={formData.gender} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                                <label htmlFor="systolicBP" className="block text-sm font-medium text-gray-700">Systolic BP (mmHg)</label>
                                <input type="number" name="systolicBP" id="systolicBP" value={formData.systolicBP} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                             <div>
                                <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-700">Total Cholesterol (mg/dL)</label>
                                <input type="number" name="cholesterol" id="cholesterol" value={formData.cholesterol} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="hdl" className="block text-sm font-medium text-gray-700">HDL Cholesterol (mg/dL)</label>
                            <input type="number" name="hdl" id="hdl" value={formData.hdl} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="smoker" className="block text-sm font-medium text-gray-700">Smoker</label>
                                <select name="smoker" id="smoker" value={formData.smoker} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="diabetes" className="block text-sm font-medium text-gray-700">Has Diabetes</label>
                                <select name="diabetes" id="diabetes" value={formData.diabetes} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
                                    <option>No</option>
                                    <option>Yes</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                             <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isLoading ? <Spinner /> : "Calculate Risk Score"}
                            </button>
                        </div>
                    </form>
                </Card>
                
                <Card>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">2. Health Risk Report</h3>
                    {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
                    {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}
                    {!isLoading && !error && !result && <div className="text-gray-500 text-center py-10">Risk report will be displayed here.</div>}
                    
                    {result && (
                        <div className="space-y-4 animate-fade-in text-center">
                            <div className="flex flex-col items-center">
                                <label className="text-sm font-medium text-gray-500">10-Year Risk Score</label>
                                <p className={`text-6xl font-bold ${getRiskTextColor(result.level)}`}>{result.score}%</p>
                                <p className={`text-xl font-semibold px-4 py-1 rounded-full text-white ${getRiskColor(result.level)}`}>{result.level} Risk</p>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                <div className={`h-4 rounded-full ${getRiskColor(result.level)}`} style={{ width: `${result.score}%` }}></div>
                            </div>

                            <div className="text-left pt-4">
                                <label className="text-sm font-medium text-gray-500">Explanation</label>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{result.explanation}</p>
                            </div>

                            <div className="text-left">
                                <label className="text-sm font-medium text-gray-500">Primary Risk Factors</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {result.riskFactors.map((factor, index) => (
                                        <span key={index} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{factor}</span>
                                    ))}
                                </div>
                            </div>
                             <p className="text-xs text-gray-400 pt-4">Disclaimer: This risk score is an estimate based on provided data and not a definitive diagnosis. Consult a healthcare professional.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default RiskScoring;
