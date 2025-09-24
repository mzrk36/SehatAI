
import React, { useState, useCallback } from 'react';
import { analyzeXray, fileToBase64 } from '../services/geminiService';
import { XRayResult } from '../types';
import FileUpload from './common/FileUpload';
import Spinner from './common/Spinner';
import Card from './common/Card';

const XrayAnalysis: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<XRayResult | null>(null);

    const handleFileChange = (selectedFile: File) => {
        setFile(selectedFile);
        setResult(null);
        setError(null);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!file) {
            setError("Please upload an X-ray image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const { mimeType, data } = await fileToBase64(file);
            const analysisResult = await analyzeXray(data, mimeType);
            setResult(analysisResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    const getDiagnosisColor = (diagnosis: XRayResult['diagnosis']) => {
        switch (diagnosis) {
            case 'Normal': return 'text-green-600 bg-green-100';
            case 'Pneumonia Suspected': return 'text-yellow-600 bg-yellow-100';
            case 'Tuberculosis Suspected': return 'text-red-600 bg-red-100';
            case 'Indeterminate': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">AI Chest X-Ray Analysis</h2>
            <p className="text-gray-600 mb-6">Upload a chest X-ray image to detect signs of Tuberculosis and Pneumonia.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">1. Upload Image</h3>
                    <FileUpload onFileSelect={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                    {previewUrl && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                            <img src={previewUrl} alt="X-ray preview" className="rounded-lg w-full h-auto object-contain max-h-80 border border-gray-200" />
                        </div>
                    )}
                    <div className="mt-6">
                        <button
                            onClick={handleAnalyze}
                            disabled={!file || isLoading}
                            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? <Spinner /> : "Analyze X-Ray"}
                        </button>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">2. AI Analysis Report</h3>
                    {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
                    {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}
                    {!isLoading && !error && !result && <div className="text-gray-500 text-center py-10">Analysis results will be displayed here.</div>}
                    
                    {result && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Diagnosis</label>
                                <p className={`text-lg font-bold px-3 py-1 rounded-md inline-block ${getDiagnosisColor(result.diagnosis)}`}>{result.diagnosis}</p>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-500">Confidence Score</label>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${result.confidence * 100}%` }}></div>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{(result.confidence * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Key Findings</label>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
                                    {result.findings.length > 0 ? result.findings.map((finding, index) => <li key={index}>{finding}</li>) : <li>No specific findings reported.</li>}
                                </ul>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Disclaimer: This AI analysis is for informational purposes only and is not a substitute for professional medical advice.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default XrayAnalysis;
