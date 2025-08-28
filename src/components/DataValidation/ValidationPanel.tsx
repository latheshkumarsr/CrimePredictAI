import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, FileCheck, Globe, Settings } from 'lucide-react';
import { DataValidator, ValidationResult, CleaningOptions } from '../../utils/dataValidation';

interface ValidationPanelProps {
  data: any[];
  onDataCleaned: (cleanedData: any[], result: ValidationResult) => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ data, onDataCleaned }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>({
    removeDuplicates: true,
    fillMissingValues: true,
    correctFormats: true,
    removeOutliers: true,
    validateCoordinates: true,
    standardizeAddresses: true
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleValidation = async () => {
    if (data.length === 0) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Process data in chunks for better performance
      const chunkSize = 1000;
      const chunks = [];
      
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }

      let allCleanedData: any[] = [];
      let combinedResult: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        fixedIssues: [],
        statistics: {
          totalRecords: data.length,
          validRecords: 0,
          duplicatesRemoved: 0,
          missingValuesFixed: 0,
          formatIssuesFixed: 0,
          outliersCorrected: 0
        }
      };

      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const { cleanedData, result } = await DataValidator.validateAndCleanDataset(chunk, cleaningOptions);
        
        allCleanedData = allCleanedData.concat(cleanedData);
        
        // Combine results
        combinedResult.errors.push(...result.errors);
        combinedResult.warnings.push(...result.warnings);
        combinedResult.fixedIssues.push(...result.fixedIssues);
        combinedResult.statistics.validRecords += result.statistics.validRecords;
        combinedResult.statistics.duplicatesRemoved += result.statistics.duplicatesRemoved;
        combinedResult.statistics.missingValuesFixed += result.statistics.missingValuesFixed;
        combinedResult.statistics.formatIssuesFixed += result.statistics.formatIssuesFixed;
        combinedResult.statistics.outliersCorrected += result.statistics.outliersCorrected;

        // Update progress (simulate delay for large datasets)
        if (chunks.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Remove duplicates across all chunks
      if (cleaningOptions.removeDuplicates) {
        const beforeCount = allCleanedData.length;
        allCleanedData = DataValidator.removeDuplicates(allCleanedData);
        const additionalDuplicates = beforeCount - allCleanedData.length;
        combinedResult.statistics.duplicatesRemoved += additionalDuplicates;
      }

      combinedResult.isValid = combinedResult.errors.length === 0;
      setValidationResult(combinedResult);
      onDataCleaned(allCleanedData, combinedResult);

    } catch (error) {
      const errorResult: ValidationResult = {
        isValid: false,
        errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        fixedIssues: [],
        statistics: {
          totalRecords: data.length,
          validRecords: 0,
          duplicatesRemoved: 0,
          missingValuesFixed: 0,
          formatIssuesFixed: 0,
          outliersCorrected: 0
        }
      };
      setValidationResult(errorResult);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = () => {
    if (isValidating) return <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />;
    if (!validationResult) return <FileCheck className="h-5 w-5 text-gray-400" />;
    if (validationResult.isValid) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusColor = () => {
    if (isValidating) return 'border-blue-200 bg-blue-50';
    if (!validationResult) return 'border-gray-200 bg-gray-50';
    if (validationResult.isValid) return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Global Data Validation & Cleaning</h2>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Advanced Options</span>
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cleaning Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(cleaningOptions).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setCleaningOptions({
                    ...cleaningOptions,
                    [key]: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Validation Status */}
      <div className={`border rounded-lg p-4 mb-6 ${getStatusColor()}`}>
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {isValidating ? 'Validating and Cleaning Data...' : 
               !validationResult ? 'Ready to Validate' :
               validationResult.isValid ? 'Data Successfully Cleaned' : 'Validation Issues Found'}
            </h3>
            {isValidating && (
              <p className="text-sm text-gray-600 mt-1">
                Processing {data.length.toLocaleString()} records globally. This may take a few moments for large datasets.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div className="space-y-4 mb-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {validationResult.statistics.totalRecords.toLocaleString()}
              </div>
              <div className="text-xs text-blue-800">Total Records</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {validationResult.statistics.validRecords.toLocaleString()}
              </div>
              <div className="text-xs text-green-800">Valid Records</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {validationResult.statistics.duplicatesRemoved.toLocaleString()}
              </div>
              <div className="text-xs text-yellow-800">Duplicates Removed</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {validationResult.statistics.missingValuesFixed.toLocaleString()}
              </div>
              <div className="text-xs text-purple-800">Missing Values Fixed</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {validationResult.statistics.formatIssuesFixed.toLocaleString()}
              </div>
              <div className="text-xs text-indigo-800">Format Issues Fixed</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {validationResult.statistics.outliersCorrected.toLocaleString()}
              </div>
              <div className="text-xs text-orange-800">Outliers Corrected</div>
            </div>
          </div>

          {/* Fixed Issues */}
          {validationResult.fixedIssues.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Issues Automatically Fixed
              </h4>
              <ul className="space-y-1">
                {validationResult.fixedIssues.map((issue, index) => (
                  <li key={index} className="text-sm text-green-700">• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {validationResult.warnings.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Warnings ({validationResult.warnings.length})
              </h4>
              <div className="max-h-32 overflow-y-auto">
                <ul className="space-y-1">
                  {validationResult.warnings.slice(0, 10).map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700">• {warning}</li>
                  ))}
                  {validationResult.warnings.length > 10 && (
                    <li className="text-sm text-yellow-600 italic">
                      ... and {validationResult.warnings.length - 10} more warnings
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Errors */}
          {validationResult.errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                <XCircle className="h-4 w-4 mr-2" />
                Errors ({validationResult.errors.length})
              </h4>
              <div className="max-h-32 overflow-y-auto">
                <ul className="space-y-1">
                  {validationResult.errors.slice(0, 10).map((error, index) => (
                    <li key={index} className="text-sm text-red-700">• {error}</li>
                  ))}
                  {validationResult.errors.length > 10 && (
                    <li className="text-sm text-red-600 italic">
                      ... and {validationResult.errors.length - 10} more errors
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleValidation}
        disabled={isValidating || data.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isValidating ? (
          <>
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Processing {data.length.toLocaleString()} Records...</span>
          </>
        ) : (
          <>
            <FileCheck className="h-5 w-5" />
            <span>Validate & Clean Global Dataset</span>
          </>
        )}
      </button>

      {data.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          Upload a dataset to begin validation and cleaning
        </p>
      )}
    </div>
  );
};

export default ValidationPanel;