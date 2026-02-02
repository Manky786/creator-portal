'use client';

import { useState } from 'react';
import { BudgetFormData } from '@/types/budget';

interface Props {
  formData: Partial<BudgetFormData>;
  setFormData: (data: Partial<BudgetFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface UploadedDocument {
  id: string;
  type: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
}

const documentTypes = [
  { value: 'artist-agreement', label: 'Artist Agreement / NDA' },
  { value: 'script', label: 'Script (PDF)' },
  { value: 'scene-breakdown', label: 'Scene Breakdown' },
  { value: 'shooting-schedule', label: 'Shooting Schedule' },
  { value: 'location-agreements', label: 'Location Agreements & Permits' },
  { value: 'insurance', label: 'Insurance Certificates' },
  { value: 'risk-assessment', label: 'Risk Assessment & Safety Protocols' },
  { value: 'cast-list', label: 'Cast List with Photos' },
  { value: 'crew-list', label: 'Crew List with Experience Details' },
  { value: 'equipment-list', label: 'Equipment List & Rental Agreements' },
  { value: 'budget-template', label: 'Detailed Budget Template' },
  { value: 'production-design', label: 'Production Design Brief & Mood Boards' },
  { value: 'storyboard', label: 'Storyboards & Shot Lists' },
  { value: 'music-rights', label: 'Music Rights & Clearances' },
  { value: 'brand-clearance', label: 'Brand & Product Clearances' },
  { value: 'vfx-breakdown', label: 'VFX Breakdown & Requirements' },
  { value: 'post-schedule', label: 'Post-Production Schedule' },
  { value: 'delivery-specs', label: 'Technical Delivery Specifications' },
  { value: 'gst-pan', label: 'GST & PAN Documents' },
  { value: 'bank-details', label: 'Bank Account Details' },
  { value: 'incorporation', label: 'Company Incorporation Certificate' },
  { value: 'previous-work', label: 'Portfolio / Previous Work Links' },
  { value: 'other', label: 'Other Documents' },
];

export default function DocumentsStep({ formData, setFormData, onNext, onBack }: Props) {
  const [selectedDocType, setSelectedDocType] = useState('artist-agreement');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSelectedFile(files[0]);
  };

  const handleAddDocument = () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const newDoc: UploadedDocument = {
      id: Date.now().toString(),
      type: documentTypes.find(d => d.value === selectedDocType)?.label || selectedDocType,
      fileName: selectedFile.name,
      fileSize: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadDate: new Date().toLocaleDateString(),
    };

    setUploadedDocs([...uploadedDocs, newDoc]);
    setSelectedFile(null);

    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = (id: string) => {
    setUploadedDocs(uploadedDocs.filter(doc => doc.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClearContents = () => {
    if (confirm('Are you sure you want to clear all documents? This action cannot be undone.')) {
      setUploadedDocs([]);
      setSelectedFile(null);
      setSelectedDocType('artist-agreement');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Filmmaker Quote */}
      <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">📄</span>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-bold text-amber-900 italic mb-2">
              "हर महान कहानी कागज़ पर शुरू होती है।"
            </p>
            <p className="text-sm font-bold text-amber-800/80">— सलीम-जावेद (Salim-Javed)</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-5xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 bg-clip-text text-transparent tracking-tight">
            📄 Documents
          </h2>
          <button
            onClick={handleClearContents}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center gap-2 border-2 border-red-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Contents
          </button>
        </div>
        <p className="text-gray-700 text-lg font-semibold">
          Upload required documents such as agreements, permits, and certificates.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-8 mb-8 shadow-lg">
        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-3xl">📤</span>
          Upload New Document
        </h3>

        {/* Document Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Document Type
          </label>
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900 font-semibold bg-white hover:border-purple-400 transition-colors"
          >
            {documentTypes.map((docType) => (
              <option key={docType.value} value={docType.value}>
                {docType.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-purple-500 bg-purple-100'
              : selectedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg ${
              selectedFile
                ? 'bg-gradient-to-br from-green-400 to-green-600'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}>
              <span className="text-4xl text-white">{selectedFile ? '✓' : '⬆️'}</span>
            </div>
            {selectedFile ? (
              <>
                <p className="text-xl font-bold text-green-700 mb-2">
                  ✓ File Selected
                </p>
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Click to change file or click "Add Document" button below
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG. Max size: 10MB
                </p>
              </>
            )}
          </label>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex-1 px-8 py-4 bg-white border-2 border-purple-500 text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            📁 Choose File
          </button>
          <button
            onClick={handleAddDocument}
            disabled={!selectedFile}
            className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl hover:scale-105 ${
              selectedFile
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ➕ Add Document
          </button>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <span className="text-3xl">📂</span>
            Uploaded Documents ({uploadedDocs.length})
          </h3>
          {uploadedDocs.length > 0 && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-sm">
              ✓ {uploadedDocs.length} Document{uploadedDocs.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {uploadedDocs.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
            <span className="text-6xl mb-4 inline-block">📭</span>
            <p className="text-xl text-gray-500 font-semibold">
              No documents uploaded yet.
            </p>
            <p className="text-sm text-gray-400 font-medium mt-2">
              Upload your first document using the form above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-lg text-gray-900 mb-1">
                      {doc.type}
                    </h4>
                    <p className="text-sm font-semibold text-gray-600">
                      {doc.fileName} • {doc.fileSize} • Uploaded on {doc.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all shadow-md hover:scale-105"
                    onClick={() => alert('Preview: ' + doc.fileName)}
                  >
                    👁️ View
                  </button>
                  <button
                    className="px-5 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all shadow-md hover:scale-105"
                    onClick={() => handleDelete(doc.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-600 text-white hover:from-purple-600 hover:via-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span className="text-xl">←</span>
          <span>Previous Step</span>
        </button>
        <button
          onClick={onNext}
          className="px-10 py-4 rounded-xl text-lg font-black transition-all duration-200 flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:scale-105 border-2 border-white/20"
        >
          <span>Continue to Next Step</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
}
