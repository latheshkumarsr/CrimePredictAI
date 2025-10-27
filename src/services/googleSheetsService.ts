import { GoogleAuth } from 'google-auth-library';

// Google Sheets configuration
const SPREADSHEET_ID = '1bYwyyGFR-Dkfo7yE8t0ftw_xXblJosKEP3ud3k0IPAc';
const SHEET_NAME = 'Sheet1'; // Default sheet name, can be changed
const API_KEY = process.env.VITE_GOOGLE_SHEETS_API_KEY || '';

// Google Sheets API endpoints
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

interface CrimeRecord {
  id: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  crime_type: string;
  severity: string;
  district: string;
  city?: string;
  state?: string;
  description?: string;
  status?: string;
}

class GoogleSheetsService {
  private apiKey: string;
  private spreadsheetId: string;
  private sheetName: string;

  constructor() {
    this.apiKey = API_KEY;
    this.spreadsheetId = SPREADSHEET_ID;
    this.sheetName = SHEET_NAME;
  }

  /**
   * Authenticate and get access token for Google Sheets API
   */
  private async getAuthToken(): Promise<string> {
    try {
      // For client-side authentication, we'll use API key
      // In production, you'd want to use OAuth2 or service account
      return this.apiKey;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with Google Sheets API');
    }
  }

  /**
   * Read all data from the Google Sheet
   * @returns Promise<CrimeRecord[]>
   */
  async readAllData(): Promise<CrimeRecord[]> {
    try {
      const range = `${this.sheetName}!A:L`; // Adjust range based on your columns
      const url = `${SHEETS_API_BASE}/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      if (rows.length === 0) {
        return [];
      }

      // Skip header row and convert to CrimeRecord objects
      const headers = rows[0];
      const records: CrimeRecord[] = [];
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length > 0) {
          const record: CrimeRecord = {
            id: row[0] || `record-${i}`,
            date: row[1] || '',
            time: row[2] || '',
            location: row[3] || '',
            latitude: parseFloat(row[4]) || 0,
            longitude: parseFloat(row[5]) || 0,
            crime_type: row[6] || '',
            severity: row[7] || '',
            district: row[8] || '',
            city: row[9] || '',
            state: row[10] || '',
            description: row[11] || '',
            status: row[12] || 'Open'
          };
          records.push(record);
        }
      }
      
      return records;
    } catch (error) {
      console.error('Error reading data from Google Sheets:', error);
      throw new Error('Failed to read data from Google Sheets');
    }
  }

  /**
   * Add new records to the Google Sheet
   * @param records - Array of CrimeRecord objects to add
   */
  async addRecords(records: CrimeRecord[]): Promise<void> {
    try {
      const range = `${this.sheetName}!A:L`;
      const values = records.map(record => [
        record.id,
        record.date,
        record.time,
        record.location,
        record.latitude,
        record.longitude,
        record.crime_type,
        record.severity,
        record.district,
        record.city || '',
        record.state || '',
        record.description || '',
        record.status || 'Open'
      ]);

      const url = `${SHEETS_API_BASE}/${this.spreadsheetId}/values/${range}:append?valueInputOption=RAW&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Successfully added ${records.length} records to Google Sheets`);
    } catch (error) {
      console.error('Error adding records to Google Sheets:', error);
      throw new Error('Failed to add records to Google Sheets');
    }
  }

  /**
   * Update a specific record in the Google Sheet
   * @param recordId - ID of the record to update
   * @param updatedRecord - Updated record data
   */
  async updateRecord(recordId: string, updatedRecord: Partial<CrimeRecord>): Promise<void> {
    try {
      // First, find the row number for the record
      const allData = await this.readAllData();
      const recordIndex = allData.findIndex(record => record.id === recordId);
      
      if (recordIndex === -1) {
        throw new Error(`Record with ID ${recordId} not found`);
      }

      const rowNumber = recordIndex + 2; // +2 because of header row and 0-based index
      const range = `${this.sheetName}!A${rowNumber}:L${rowNumber}`;
      
      const existingRecord = allData[recordIndex];
      const mergedRecord = { ...existingRecord, ...updatedRecord };
      
      const values = [[
        mergedRecord.id,
        mergedRecord.date,
        mergedRecord.time,
        mergedRecord.location,
        mergedRecord.latitude,
        mergedRecord.longitude,
        mergedRecord.crime_type,
        mergedRecord.severity,
        mergedRecord.district,
        mergedRecord.city || '',
        mergedRecord.state || '',
        mergedRecord.description || '',
        mergedRecord.status || 'Open'
      ]];

      const url = `${SHEETS_API_BASE}/${this.spreadsheetId}/values/${range}?valueInputOption=RAW&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Successfully updated record ${recordId}`);
    } catch (error) {
      console.error('Error updating record in Google Sheets:', error);
      throw new Error('Failed to update record in Google Sheets');
    }
  }

  /**
   * Delete a record from the Google Sheet
   * @param recordId - ID of the record to delete
   */
  async deleteRecord(recordId: string): Promise<void> {
    try {
      // First, find the row number for the record
      const allData = await this.readAllData();
      const recordIndex = allData.findIndex(record => record.id === recordId);
      
      if (recordIndex === -1) {
        throw new Error(`Record with ID ${recordId} not found`);
      }

      const rowNumber = recordIndex + 2; // +2 because of header row and 0-based index
      
      // Note: Google Sheets API doesn't have a direct delete row method
      // We'll clear the row content instead
      const range = `${this.sheetName}!A${rowNumber}:L${rowNumber}`;
      const url = `${SHEETS_API_BASE}/${this.spreadsheetId}/values/${range}:clear?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Successfully deleted record ${recordId}`);
    } catch (error) {
      console.error('Error deleting record from Google Sheets:', error);
      throw new Error('Failed to delete record from Google Sheets');
    }
  }

  /**
   * Clear all data from the sheet (except headers)
   */
  async clearAllData(): Promise<void> {
    try {
      const range = `${this.sheetName}!A2:L`;
      const url = `${SHEETS_API_BASE}/${this.spreadsheetId}/values/${range}:clear?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Successfully cleared all data from Google Sheets');
    } catch (error) {
      console.error('Error clearing data from Google Sheets:', error);
      throw new Error('Failed to clear data from Google Sheets');
    }
  }

  /**
   * Initialize the sheet with headers if empty
   */
  async initializeSheet(): Promise<void> {
    try {
      const headers = [
        'ID', 'Date', 'Time', 'Location', 'Latitude', 'Longitude',
        'Crime Type', 'Severity', 'District', 'City', 'State', 'Description', 'Status'
      ];

      const range = `${this.sheetName}!A1:L1`;
      const url = `${SHEETS_API_BASE}/${this.spreadsheetId}/values/${range}?valueInputOption=RAW&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Successfully initialized sheet with headers');
    } catch (error) {
      console.error('Error initializing sheet:', error);
      throw new Error('Failed to initialize sheet');
    }
  }

  /**
   * Get sheet metadata and information
   */
  async getSheetInfo(): Promise<any> {
    try {
      const url = `${SHEETS_API_BASE}/${this.spreadsheetId}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting sheet info:', error);
      throw new Error('Failed to get sheet information');
    }
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
export type { CrimeRecord };