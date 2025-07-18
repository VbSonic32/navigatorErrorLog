export interface ErrorLogEntry {
  Severity: 'Information' | 'Warning' | 'Error' | string;
  Timestamp: string;
  MachineName: string;
  AppDomainName: string;
  FormattedMessage: string;
}
export interface ErrorLogSummary {
  Severity: 'Information' | 'Warning' | 'Error' | string;
  Cnt: number;
}

export interface ErrorLogQueryParams {
  startDate?: string;
  endDate?: string;
  severity?: string;
  getAllRecords?: boolean; // Flag to get all records without pagination
  searchType: 'details' | 'summary';
}
