export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedIssues: string[];
  statistics: {
    totalRecords: number;
    validRecords: number;
    duplicatesRemoved: number;
    missingValuesFixed: number;
    formatIssuesFixed: number;
    outliersCorrected: number;
  };
}

export interface CleaningOptions {
  removeDuplicates: boolean;
  fillMissingValues: boolean;
  correctFormats: boolean;
  removeOutliers: boolean;
  validateCoordinates: boolean;
  standardizeAddresses: boolean;
}

export class DataValidator {
  private static readonly COORDINATE_BOUNDS = {
    lat: { min: -90, max: 90 },
    lng: { min: -180, max: 180 }
  };

  private static readonly CRIME_TYPES = [
    'Theft', 'Burglary', 'Assault', 'Vandalism', 'Drug-related', 
    'Vehicle Crime', 'Robbery', 'Fraud', 'Homicide', 'Arson',
    'Domestic Violence', 'Cybercrime', 'Public Order', 'Weapons'
  ];

  private static readonly SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
  private static readonly STATUS_TYPES = ['Open', 'Under Investigation', 'Closed', 'Cold Case'];

  static async validateAndCleanDataset(
    data: any[], 
    options: CleaningOptions = {
      removeDuplicates: true,
      fillMissingValues: true,
      correctFormats: true,
      removeOutliers: true,
      validateCoordinates: true,
      standardizeAddresses: true
    }
  ): Promise<{ cleanedData: any[], result: ValidationResult }> {
    
    const result: ValidationResult = {
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

    let cleanedData = [...data];

    try {
      // Step 1: Remove duplicates
      if (options.removeDuplicates) {
        const beforeCount = cleanedData.length;
        cleanedData = this.removeDuplicates(cleanedData);
        const duplicatesRemoved = beforeCount - cleanedData.length;
        result.statistics.duplicatesRemoved = duplicatesRemoved;
        if (duplicatesRemoved > 0) {
          result.fixedIssues.push(`Removed ${duplicatesRemoved} duplicate records`);
        }
      }

      // Step 2: Validate and fix coordinates
      if (options.validateCoordinates) {
        const coordResults = this.validateCoordinates(cleanedData);
        cleanedData = coordResults.data;
        result.statistics.outliersCorrected += coordResults.fixed;
        if (coordResults.fixed > 0) {
          result.fixedIssues.push(`Fixed ${coordResults.fixed} invalid coordinates`);
        }
        result.errors.push(...coordResults.errors);
      }

      // Step 3: Standardize and validate crime types
      if (options.correctFormats) {
        const crimeResults = this.standardizeCrimeTypes(cleanedData);
        cleanedData = crimeResults.data;
        result.statistics.formatIssuesFixed += crimeResults.fixed;
        if (crimeResults.fixed > 0) {
          result.fixedIssues.push(`Standardized ${crimeResults.fixed} crime type entries`);
        }
      }

      // Step 4: Fill missing values
      if (options.fillMissingValues) {
        const missingResults = this.fillMissingValues(cleanedData);
        cleanedData = missingResults.data;
        result.statistics.missingValuesFixed = missingResults.fixed;
        if (missingResults.fixed > 0) {
          result.fixedIssues.push(`Filled ${missingResults.fixed} missing values`);
        }
      }

      // Step 5: Validate dates and times
      if (options.correctFormats) {
        const dateResults = this.validateDates(cleanedData);
        cleanedData = dateResults.data;
        result.statistics.formatIssuesFixed += dateResults.fixed;
        if (dateResults.fixed > 0) {
          result.fixedIssues.push(`Fixed ${dateResults.fixed} date/time format issues`);
        }
        result.errors.push(...dateResults.errors);
      }

      // Step 6: Standardize addresses (for global coverage)
      if (options.standardizeAddresses) {
        const addressResults = this.standardizeAddresses(cleanedData);
        cleanedData = addressResults.data;
        result.statistics.formatIssuesFixed += addressResults.fixed;
        if (addressResults.fixed > 0) {
          result.fixedIssues.push(`Standardized ${addressResults.fixed} address formats`);
        }
      }

      // Step 7: Final validation
      const finalValidation = this.performFinalValidation(cleanedData);
      result.statistics.validRecords = finalValidation.validCount;
      result.warnings.push(...finalValidation.warnings);
      result.errors.push(...finalValidation.errors);

      result.isValid = result.errors.length === 0;

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { cleanedData, result };
  }

  // Add missing method
  static removeDuplicates(data: any[]): any[] {
    return this.removeDuplicates(data);
  }

  private static removeDuplicates(data: any[]): any[] {
    const seen = new Set();
    return data.filter(record => {
      // Create a unique key based on location, time, and crime type
      const key = `${record.latitude || ''}-${record.longitude || ''}-${record.date || record.timestamp || ''}-${record.crime_type || record.type || ''}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private static validateCoordinates(data: any[]): { data: any[], fixed: number, errors: string[] } {
    let fixed = 0;
    const errors: string[] = [];
    
    const processedData = data.map((record, index) => {
      let lat = parseFloat(record.latitude || record.lat || '0');
      let lng = parseFloat(record.longitude || record.lng || record.lon || '0');

      // Check if coordinates are valid
      if (isNaN(lat) || isNaN(lng)) {
        // Use default coordinates (center of world map)
        lat = 0;
        lng = 0;
        fixed++;
      } else {
        // Validate coordinate bounds
        if (lat < this.COORDINATE_BOUNDS.lat.min || lat > this.COORDINATE_BOUNDS.lat.max) {
          lat = Math.max(this.COORDINATE_BOUNDS.lat.min, Math.min(this.COORDINATE_BOUNDS.lat.max, lat));
          fixed++;
        }
        if (lng < this.COORDINATE_BOUNDS.lng.min || lng > this.COORDINATE_BOUNDS.lng.max) {
          lng = Math.max(this.COORDINATE_BOUNDS.lng.min, Math.min(this.COORDINATE_BOUNDS.lng.max, lng));
          fixed++;
        }
      }

      return {
        ...record,
        latitude: lat,
        longitude: lng,
        lat: lat,
        lng: lng
      };
    });

    return { data: processedData, fixed, errors };
  }

  private static standardizeCrimeTypes(data: any[]): { data: any[], fixed: number } {
    let fixed = 0;
    
    const processedData = data.map(record => {
      let crimeType = record.crime_type || record.type || record.crimeType || 'Unknown';
      
      // Standardize common variations
      const standardized = this.standardizeCrimeType(crimeType);
      if (standardized !== crimeType) {
        fixed++;
      }

      return {
        ...record,
        crime_type: standardized,
        type: standardized
      };
    });

    return { data: processedData, fixed };
  }

  private static standardizeCrimeType(type: string): string {
    const normalized = type.toLowerCase().trim();
    
    // Map common variations to standard types
    const mappings: Record<string, string> = {
      'theft': 'Theft',
      'stealing': 'Theft',
      'larceny': 'Theft',
      'burglary': 'Burglary',
      'breaking and entering': 'Burglary',
      'b&e': 'Burglary',
      'assault': 'Assault',
      'battery': 'Assault',
      'violence': 'Assault',
      'vandalism': 'Vandalism',
      'property damage': 'Vandalism',
      'graffiti': 'Vandalism',
      'drug': 'Drug-related',
      'drugs': 'Drug-related',
      'narcotics': 'Drug-related',
      'vehicle': 'Vehicle Crime',
      'car': 'Vehicle Crime',
      'auto': 'Vehicle Crime',
      'robbery': 'Robbery',
      'mugging': 'Robbery',
      'fraud': 'Fraud',
      'scam': 'Fraud',
      'homicide': 'Homicide',
      'murder': 'Homicide',
      'arson': 'Arson',
      'fire': 'Arson'
    };

    for (const [key, value] of Object.entries(mappings)) {
      if (normalized.includes(key)) {
        return value;
      }
    }

    // If no match found, capitalize first letter
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  private static fillMissingValues(data: any[]): { data: any[], fixed: number } {
    let fixed = 0;
    
    // Calculate common values for filling
    const severityDistribution = this.calculateDistribution(data, 'severity');
    const statusDistribution = this.calculateDistribution(data, 'status');
    const districtDistribution = this.calculateDistribution(data, 'district');

    const processedData = data.map(record => {
      const updated = { ...record };
      
      // Fill missing severity
      if (!updated.severity || updated.severity.trim() === '') {
        updated.severity = this.getMostCommon(severityDistribution) || 'Medium';
        fixed++;
      }

      // Fill missing status
      if (!updated.status || updated.status.trim() === '') {
        updated.status = this.getMostCommon(statusDistribution) || 'Open';
        fixed++;
      }

      // Fill missing district
      if (!updated.district || updated.district.trim() === '') {
        updated.district = this.getMostCommon(districtDistribution) || 'Unknown District';
        fixed++;
      }

      // Fill missing description
      if (!updated.description || updated.description.trim() === '') {
        updated.description = `${updated.crime_type || updated.type || 'Crime'} incident reported`;
        fixed++;
      }

      // Fill missing location name
      if (!updated.location_name && !updated.address) {
        updated.location_name = `${updated.latitude || 0}, ${updated.longitude || 0}`;
        fixed++;
      }

      return updated;
    });

    return { data: processedData, fixed };
  }

  private static validateDates(data: any[]): { data: any[], fixed: number, errors: string[] } {
    let fixed = 0;
    const errors: string[] = [];
    
    const processedData = data.map((record, index) => {
      let dateField = record.date || record.timestamp || record.incident_date;
      
      if (!dateField) {
        // Use current date as fallback
        dateField = new Date().toISOString();
        fixed++;
      } else {
        // Try to parse and validate date
        const parsedDate = new Date(dateField);
        if (isNaN(parsedDate.getTime())) {
          // Invalid date, use current date
          dateField = new Date().toISOString();
          fixed++;
        } else {
          // Check if date is reasonable (not too far in future or past)
          const now = new Date();
          const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
          const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
          
          if (parsedDate < tenYearsAgo || parsedDate > oneYearFromNow) {
            dateField = now.toISOString();
            fixed++;
          } else {
            dateField = parsedDate.toISOString();
          }
        }
      }

      return {
        ...record,
        timestamp: dateField,
        date: dateField,
        incident_date: dateField
      };
    });

    return { data: processedData, fixed, errors };
  }

  private static standardizeAddresses(data: any[]): { data: any[], fixed: number } {
    let fixed = 0;
    
    const processedData = data.map(record => {
      let address = record.address || record.location_name || record.location || '';
      
      if (address && typeof address === 'string') {
        // Basic address standardization
        const standardized = address
          .trim()
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\b(st|street)\b/gi, 'Street')
          .replace(/\b(ave|avenue)\b/gi, 'Avenue')
          .replace(/\b(rd|road)\b/gi, 'Road')
          .replace(/\b(blvd|boulevard)\b/gi, 'Boulevard')
          .replace(/\b(dr|drive)\b/gi, 'Drive')
          .replace(/\b(ln|lane)\b/gi, 'Lane')
          .replace(/\b(ct|court)\b/gi, 'Court')
          .replace(/\b(pl|place)\b/gi, 'Place');

        if (standardized !== address) {
          fixed++;
        }

        return {
          ...record,
          address: standardized,
          location_name: standardized
        };
      }

      return record;
    });

    return { data: processedData, fixed };
  }

  private static performFinalValidation(data: any[]): { validCount: number, warnings: string[], errors: string[] } {
    const warnings: string[] = [];
    const errors: string[] = [];
    let validCount = 0;

    data.forEach((record, index) => {
      let isValid = true;

      // Check required fields
      if (!record.crime_type && !record.type) {
        errors.push(`Record ${index + 1}: Missing crime type`);
        isValid = false;
      }

      if (!record.latitude && !record.lat) {
        warnings.push(`Record ${index + 1}: Missing latitude`);
      }

      if (!record.longitude && !record.lng) {
        warnings.push(`Record ${index + 1}: Missing longitude`);
      }

      if (isValid) {
        validCount++;
      }
    });

    return { validCount, warnings, errors };
  }

  private static calculateDistribution(data: any[], field: string): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    data.forEach(record => {
      const value = record[field];
      if (value && typeof value === 'string' && value.trim() !== '') {
        distribution[value] = (distribution[value] || 0) + 1;
      }
    });

    return distribution;
  }

  private static getMostCommon(distribution: Record<string, number>): string | null {
    let maxCount = 0;
    let mostCommon = null;

    for (const [value, count] of Object.entries(distribution)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = value;
      }
    }

    return mostCommon;
  }
}