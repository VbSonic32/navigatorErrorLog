import {
  ErrorLogEntry,
  ErrorLogQueryParams,
  ErrorLogSummary,
} from '@/types/errorLog';
import { generateJWTToken } from '@/lib/api';

// Helper function to format dates for ASP.NET Core DateTime binding in SQL-friendly format
function formatDateForDotNet(date: Date): string {
  // Format as MM/DD/YYYY HH:MM:SS (American date format with time)
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

export async function getErrorLogs(params?: ErrorLogQueryParams): Promise<{
  data: ErrorLogEntry[] | ErrorLogSummary[];
  total: number;
  error: string;
}> {
  try {
    // Get API base URL from environment or use default
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_ERROR_LOG_API_URL || 'http://localhost:5075/api';

    // Format start date (begDate for API)
    let begDateStr;
    if (params?.startDate) {
      // Use the date constructor carefully to avoid timezone issues
      // We need to parse yyyy-MM-dd format from the date input
      const [year, month, day] = params.startDate.split('-').map(Number);
      const startDate = new Date(year, month - 1, day);
      // Set to beginning of day (00:00:00)
      startDate.setHours(0, 0, 0, 0);
      begDateStr = formatDateForDotNet(startDate);
    } else {
      const defaultStartDate = new Date();
      defaultStartDate.setDate(defaultStartDate.getDate() - 5);
      // Set to beginning of day (00:00:00)
      defaultStartDate.setHours(0, 0, 0, 0);
      begDateStr = formatDateForDotNet(defaultStartDate);
    }

    // Format end date (endDate for API) - ensuring we capture until 23:59:59
    let endDateStr;
    if (params?.endDate) {
      // Use the date constructor carefully to avoid timezone issues
      // We need to parse yyyy-MM-dd format from the date input
      const [year, month, day] = params.endDate.split('-').map(Number);
      const endDate = new Date(year, month - 1, day);
      // Set to end of day (23:59:59)
      endDate.setHours(23, 59, 59, 999);
      endDateStr = formatDateForDotNet(endDate);
    } else {
      const today = new Date();
      // Set to end of day (23:59:59)
      today.setHours(23, 59, 59, 999);
      endDateStr = formatDateForDotNet(today);
    }

    // Build the API URL with parameters matching the ASP.NET Core method signature
    // [HttpGet(Name = "GetErrorLog")]
    // public async Task<IEnumerable<ErrorLog>> GetErrors([FromQuery] DateTime begDate, [FromQuery] DateTime endDate)
    const apiUrl = `${apiBaseUrl}/ErrorLog/getErrorLog?beginDate=${encodeURIComponent(
      begDateStr
    )}&endDate=${encodeURIComponent(endDateStr)}&searchType=${
      params?.searchType || 'details'
    }`;

    // Make the API request
    const token = await generateJWTToken();

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Parse the response
    const responseData = await response.json();
    console.log('Raw API response:', responseData);

    // Check if the API already returned summary data
    if (
      params?.searchType === 'summary' &&
      responseData &&
      Array.isArray(responseData) &&
      responseData.length > 0 &&
      'Count' in responseData[0]
    ) {
      console.log('API already returned summary data');
      // Apply severity filtering if needed
      let summaryData = responseData;
      if (params?.severity && params.severity !== 'All') {
        summaryData = responseData.filter(
          (item) => item.Severity === params.severity
        );
      }

      return {
        data: summaryData,
        total: summaryData.length,
        error: '',
      };
    }

    // Handle response data based on search type
    let filteredLogs: ErrorLogEntry[] | ErrorLogSummary[];

    if (params?.searchType === 'summary') {
      // For summary search type, treat as ErrorLogSummary[]
      const summaryLogs = responseData as ErrorLogSummary[];

      // Apply severity filtering if needed
      if (params?.severity && params.severity !== 'All') {
        filteredLogs = summaryLogs.filter(
          (log) => log.Severity === params.severity
        );
      } else {
        filteredLogs = summaryLogs;
      }
    } else {
      // For details search type, treat as ErrorLogEntry[]
      const detailLogs = responseData as ErrorLogEntry[];

      // Apply severity filtering if needed
      if (params?.severity && params.severity !== 'All') {
        filteredLogs = detailLogs.filter(
          (log) => log.Severity === params.severity
        );
      } else {
        filteredLogs = detailLogs;
      }
    }

    // For summary search type, return the filtered summary logs directly
    if (params?.searchType === 'summary') {
      console.log('Returning summary data to client');
      const summaryData = filteredLogs as ErrorLogSummary[];

      console.log('Summary data:', summaryData);
      return {
        data: summaryData,
        total: summaryData.length,
        error: '',
      };
    }

    console.log('Returning detailed data from API');

    return {
      data: filteredLogs,
      total: filteredLogs.length,
      error: '',
    };
  } catch (error) {
    console.error('Error fetching error logs:', error);
    let errorMessage = 'An error occurred while fetching error logs';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      data: [],
      total: 0,
      error: errorMessage,
    };
  }
}
