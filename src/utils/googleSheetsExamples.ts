/**
 * Google Sheets Database Usage Examples
 * 
 * This file contains sample code demonstrating how to use the Google Sheets service
 * for CRUD operations on crime data.
 */

import { googleSheetsService, CrimeRecord } from '../services/googleSheetsService';

/**
 * Example 1: Reading all data from Google Sheets
 */
export async function exampleReadAllData() {
  try {
    console.log('📖 Reading all data from Google Sheets...');
    const records = await googleSheetsService.readAllData();
    console.log(`✅ Successfully read ${records.length} records`);
    console.log('Sample record:', records[0]);
    return records;
  } catch (error) {
    console.error('❌ Error reading data:', error);
    throw error;
  }
}

/**
 * Example 2: Adding new crime records
 */
export async function exampleAddRecords() {
  const newRecords: CrimeRecord[] = [
    {
      id: `crime-${Date.now()}-1`,
      date: '2024-01-15',
      time: '14:30:00',
      location: '123 MG Road, Koramangala',
      latitude: 12.9352,
      longitude: 77.6245,
      crime_type: 'Theft',
      severity: 'Medium',
      district: 'Koramangala, Bangalore, Karnataka',
      city: 'Bangalore',
      state: 'Karnataka',
      description: 'Mobile phone theft reported near metro station',
      status: 'Under Investigation'
    },
    {
      id: `crime-${Date.now()}-2`,
      date: '2024-01-16',
      time: '22:15:00',
      location: '456 Brigade Road, MG Road',
      latitude: 12.9716,
      longitude: 77.6412,
      crime_type: 'Chain Snatching',
      severity: 'High',
      district: 'MG Road, Bangalore, Karnataka',
      city: 'Bangalore',
      state: 'Karnataka',
      description: 'Gold chain snatching by bike-borne miscreants',
      status: 'Open'
    }
  ];

  try {
    console.log('➕ Adding new records to Google Sheets...');
    await googleSheetsService.addRecords(newRecords);
    console.log(`✅ Successfully added ${newRecords.length} records`);
  } catch (error) {
    console.error('❌ Error adding records:', error);
    throw error;
  }
}

/**
 * Example 3: Updating an existing record
 */
export async function exampleUpdateRecord(recordId: string) {
  const updates: Partial<CrimeRecord> = {
    status: 'Closed',
    description: 'Case resolved - suspect apprehended and items recovered'
  };

  try {
    console.log(`🔄 Updating record ${recordId}...`);
    await googleSheetsService.updateRecord(recordId, updates);
    console.log('✅ Successfully updated record');
  } catch (error) {
    console.error('❌ Error updating record:', error);
    throw error;
  }
}

/**
 * Example 4: Deleting a record
 */
export async function exampleDeleteRecord(recordId: string) {
  try {
    console.log(`🗑️ Deleting record ${recordId}...`);
    await googleSheetsService.deleteRecord(recordId);
    console.log('✅ Successfully deleted record');
  } catch (error) {
    console.error('❌ Error deleting record:', error);
    throw error;
  }
}

/**
 * Example 5: Initializing the sheet with headers
 */
export async function exampleInitializeSheet() {
  try {
    console.log('🚀 Initializing Google Sheet with headers...');
    await googleSheetsService.initializeSheet();
    console.log('✅ Successfully initialized sheet');
  } catch (error) {
    console.error('❌ Error initializing sheet:', error);
    throw error;
  }
}

/**
 * Example 6: Getting sheet information
 */
export async function exampleGetSheetInfo() {
  try {
    console.log('ℹ️ Getting sheet information...');
    const info = await googleSheetsService.getSheetInfo();
    console.log('✅ Sheet info:', {
      title: info.properties?.title,
      sheets: info.sheets?.length,
      spreadsheetId: info.spreadsheetId
    });
    return info;
  } catch (error) {
    console.error('❌ Error getting sheet info:', error);
    throw error;
  }
}

/**
 * Example 7: Bulk operations - Clear and repopulate
 */
export async function exampleBulkOperations() {
  const sampleData: CrimeRecord[] = [
    {
      id: 'bulk-1',
      date: '2024-01-20',
      time: '10:00:00',
      location: 'Commercial Street, Bangalore',
      latitude: 12.9698,
      longitude: 77.6099,
      crime_type: 'Pickpocketing',
      severity: 'Low',
      district: 'Shivaji Nagar, Bangalore, Karnataka',
      city: 'Bangalore',
      state: 'Karnataka',
      description: 'Wallet theft in crowded market area',
      status: 'Open'
    },
    {
      id: 'bulk-2',
      date: '2024-01-21',
      time: '18:30:00',
      location: 'Whitefield Main Road',
      latitude: 12.9698,
      longitude: 77.7500,
      crime_type: 'Vehicle Theft',
      severity: 'High',
      district: 'Whitefield, Bangalore, Karnataka',
      city: 'Bangalore',
      state: 'Karnataka',
      description: 'Two-wheeler theft from IT park parking',
      status: 'Under Investigation'
    }
  ];

  try {
    console.log('🧹 Clearing all existing data...');
    await googleSheetsService.clearAllData();
    
    console.log('📝 Adding sample data...');
    await googleSheetsService.addRecords(sampleData);
    
    console.log('✅ Bulk operations completed successfully');
  } catch (error) {
    console.error('❌ Error in bulk operations:', error);
    throw error;
  }
}

/**
 * Example 8: Complete workflow demonstration
 */
export async function exampleCompleteWorkflow() {
  try {
    console.log('🔄 Starting complete workflow demonstration...');
    
    // Step 1: Initialize sheet
    await exampleInitializeSheet();
    
    // Step 2: Add some records
    await exampleAddRecords();
    
    // Step 3: Read all data
    const allRecords = await exampleReadAllData();
    
    // Step 4: Update first record if exists
    if (allRecords.length > 0) {
      await exampleUpdateRecord(allRecords[0].id);
    }
    
    // Step 5: Get sheet info
    await exampleGetSheetInfo();
    
    console.log('✅ Complete workflow demonstration finished');
  } catch (error) {
    console.error('❌ Error in complete workflow:', error);
    throw error;
  }
}

// Export all examples for easy access
export const googleSheetsExamples = {
  readAllData: exampleReadAllData,
  addRecords: exampleAddRecords,
  updateRecord: exampleUpdateRecord,
  deleteRecord: exampleDeleteRecord,
  initializeSheet: exampleInitializeSheet,
  getSheetInfo: exampleGetSheetInfo,
  bulkOperations: exampleBulkOperations,
  completeWorkflow: exampleCompleteWorkflow
};