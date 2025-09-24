
import React, { useState, useCallback } from 'react';
import { digitizePrescription, fileToBase64 } from '../services/geminiService';
import { Prescription } from '../types';
import FileUpload from './common/FileUpload';
import Spinner from './common/Spinner';
import Card from './common/Card';

const PrescriptionOCR: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Prescription | null>(null);

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

    const handleDigitize = useCallback(async () => {
        if (!file) {
            setError("Please upload a prescription image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const { mimeType, data } = await fileToBase64(file);
            const prescriptionResult = await digitizePrescription(data, mimeType);
            setResult(prescriptionResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [file]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Prescription Digitization (OCR)</h2>
            <p className="text-gray-600 mb-6">Upload a handwritten prescription (Urdu or English) to convert it into a digital record.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">1. Upload Prescription</h3>
                    <FileUpload onFileSelect={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                    {previewUrl && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                            <img src={previewUrl} alt="Prescription preview" className="rounded-lg w-full h-auto object-contain max-h-80 border border-gray-200" />
                        </div>
                    )}
                    <div className="mt-6">
                        <button
                            onClick={handleDigitize}
                            disabled={!file || isLoading}
                            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isLoading ? <Spinner /> : "Digitize Prescription"}
                        </button>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">2. Digital Medical Record</h3>
                    {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
                    {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}
                    {!isLoading && !error && !result && <div className="text-gray-500 text-center py-10">Digital record will be displayed here.</div>}
                    
                    {result && (
                        <div className="space-y-4 animate-fade-in">
                           <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Patient Name</label>
                                    <p className="text-lg font-bold text-gray-800">{result.patientName || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Date</label>
                                    <p className="text-lg font-bold text-gray-800">{result.date || 'N/A'}</p>
                                </div>
                           </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Medications</label>
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {result.items && result.items.length > 0 ? result.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.medicine}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.dosage}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.frequency}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">No medications found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Disclaimer: Always verify the digitized prescription with the original document. This tool is for assistance only.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PrescriptionOCR;
