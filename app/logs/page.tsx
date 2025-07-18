'use client';

import { useState, useEffect } from 'react';
import {
  ErrorLogEntry,
  ErrorLogQueryParams,
  ErrorLogSummary,
} from '@/types/errorLog';
import ErrorLogTable from '@/components/error-log-table';
import ErrorLogSummaryTable from '@/components/error-log-summary-table';
import ErrorLogDetails from '@/components/error-log-details';
import Pagination from '@/components/pagination';
import RecordsPerPage from '@/components/records-per-page';

export default function ErrorLogExplorer() {
  // State for search parameters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [severity, setSeverity] = useState<string>('All');
  const [searchType, setSearchType] =
    useState<ErrorLogQueryParams['searchType']>('details');

  // Validation states
  const [startDateError, setStartDateError] = useState<string>('');
  const [endDateError, setEndDateError] = useState<string>('');

  // State for error logs and pagination
  const [allFetchedLogs, setAllFetchedLogs] = useState<
    ErrorLogEntry[] | ErrorLogSummary[]
  >([]); // Store all fetched logs
  const [errorLogs, setErrorLogs] = useState<
    ErrorLogEntry[] | ErrorLogSummary[]
  >([]); // Current page of logs
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);

  // State for selected log details
  const [selectedLog, setSelectedLog] = useState<ErrorLogEntry | null>(null);

  // Function to fetch error logs - only called when search parameters change
  const fetchErrorLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters - don't include page/pageSize since we're getting all results
      const params = new URLSearchParams();
      if (startDate) {
        // Pass the date as is - our backend code will format it for the external API
        params.append('startDate', startDate);
      }
      if (endDate) {
        // Pass the date as is - our backend code will format it for the external API
        params.append('endDate', endDate);
      }
      if (severity !== 'All') params.append('severity', severity);

      // Add search type parameter
      params.append('searchType', searchType);

      // We won't paginate on the server side - get all matching records
      params.append('getAllRecords', 'true');

      // Fetch error logs from API
      const response = await fetch(`/api/errorLogs?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch error logs');
      }

      const data = await response.json();

      // Check if API returned an error
      if (data.error) {
        setError(data.error);
        setAllFetchedLogs([]);
        setErrorLogs([]);
        setTotalRecords(0);
        setTotalPages(1);
        return;
      }

      // Store all fetched logs
      setAllFetchedLogs(data.data);

      // Calculate pagination values
      const totalLogs = data.data.length;
      const calculatedTotalPages = Math.ceil(totalLogs / pageSize);

      setTotalRecords(totalLogs);
      setTotalPages(calculatedTotalPages);

      // Update displayed logs based on current page
      updateDisplayedLogs(data.data, 1); // Always start at page 1
      setPage(1); // Reset to first page when new data is fetched
    } catch (err) {
      setError('An error occurred while fetching error logs');
      console.error(err);
      setAllFetchedLogs([]);
      setErrorLogs([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Function to update displayed logs based on current page without API call
  const updateDisplayedLogs = (
    logs: ErrorLogEntry[] | ErrorLogSummary[],
    currentPage: number
  ) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setErrorLogs(logs.slice(startIndex, endIndex));
  };

  // Update displayed logs when page changes or page size changes
  useEffect(() => {
    if (hasSearched && allFetchedLogs.length > 0) {
      updateDisplayedLogs(allFetchedLogs, page);

      // Recalculate total pages whenever page size changes
      const calculatedTotalPages = Math.ceil(allFetchedLogs.length / pageSize);
      setTotalPages(calculatedTotalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous validation errors
    setStartDateError('');
    setEndDateError('');

    // Validate form inputs
    let isValid = true;

    if (!startDate) {
      setStartDateError('Start date is required');
      isValid = false;
    }

    if (!endDate) {
      setEndDateError('End date is required');
      isValid = false;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setEndDateError('End date must be after start date');
      isValid = false;
    }

    // Check if date range exceeds 5 days
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculate the difference in days (accounting for date-only values)
      const differenceInTime = end.getTime() - start.getTime();
      const differenceInDays = Math.round(
        differenceInTime / (1000 * 3600 * 24)
      );

      if (differenceInDays > 5) {
        setEndDateError('Date range cannot exceed 5 days');
        isValid = false;
      }
    }

    // If validation fails, stop
    if (!isValid) {
      return;
    }

    // Proceed with search
    setPage(1); // Reset to first page on new search
    setHasSearched(true);
    fetchErrorLogs();
  };

  // Handle log row click to show details
  const handleLogClick = (log: ErrorLogEntry) => {
    setSelectedLog(log);
  };

  // Handle closing the details modal
  const handleCloseDetails = () => {
    setSelectedLog(null);
  };

  // Handle changing the page - no API call needed
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // The useEffect hook will update displayed logs
  };

  // Handle changing the records per page
  const handleRecordsPerPageChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size

    // Recalculate total pages
    if (allFetchedLogs.length > 0) {
      const newTotalPages = Math.ceil(allFetchedLogs.length / newPageSize);
      setTotalPages(newTotalPages);
    }

    // Update displayed logs with new page size
    if (hasSearched && allFetchedLogs.length > 0) {
      const startIndex = 0; // Start from beginning (page 1)
      const endIndex = startIndex + newPageSize;
      setErrorLogs(allFetchedLogs.slice(startIndex, endIndex));
    }
  };

  // Reset search filters
  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSeverity('All');
    setSearchType('details');
    setPage(1);
    setHasSearched(false);
    setAllFetchedLogs([]);
    setErrorLogs([]);
    setTotalRecords(0);
    setTotalPages(1);
    setError(null);
    setStartDateError('');
    setEndDateError('');
  };

  return (
    <>
      <div className="container py-4">
        <h1 className="mb-4">Error Log Explorer</h1>

        {/* Search Form */}
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSearch}>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Search Type</label>
                  <div className="d-flex flex-row gap-3">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="searchType"
                        id="searchTypeDetails"
                        value="details"
                        checked={searchType === 'details'}
                        onChange={() => {
                          setSearchType('details');
                          // Reset data when changing search type
                          setHasSearched(false);
                          setAllFetchedLogs([]);
                          setErrorLogs([]);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="searchTypeDetails"
                      >
                        <i className="bi bi-list-ul me-2"></i>
                        Details
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="searchType"
                        id="searchTypeSummary"
                        value="summary"
                        checked={searchType === 'summary'}
                        onChange={() => {
                          setSearchType('summary');
                          // Reset data when changing search type
                          setHasSearched(false);
                          setAllFetchedLogs([]);
                          setErrorLogs([]);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="searchTypeSummary"
                      >
                        <i className="bi bi-pie-chart me-2"></i>
                        Summary
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="startDate" className="form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        className={`form-control ${
                          startDateError ? 'is-invalid' : ''
                        }`}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      {startDateError && (
                        <div className="invalid-feedback">{startDateError}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="endDate" className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        className={`form-control ${
                          endDateError ? 'is-invalid' : ''
                        }`}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      {endDateError && (
                        <div className="invalid-feedback">{endDateError}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="severity" className="form-label">
                        Severity
                      </label>
                      <select
                        id="severity"
                        className="form-select"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="Information">Information</option>
                        <option value="Warning">Warning</option>
                        <option value="Error">Error</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-secondary"
                >
                  Reset Filters
                </button>
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Summary */}
        {hasSearched && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted small">
              Showing {errorLogs.length > 0 ? (page - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(page * pageSize, totalRecords)} of {totalRecords}{' '}
              results
            </p>
          </div>
        )}

        {/* Error Message - Now displayed in the table component */}

        {/* Loading State */}
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : hasSearched ? (
          <>
            {/* Conditional rendering based on searchType */}
            {searchType === 'details' ? (
              // Error Log Table for detailed view
              <ErrorLogTable
                errorLogs={errorLogs as ErrorLogEntry[]}
                onRowClick={handleLogClick}
                error={error}
              />
            ) : (
              // Summary Table for summary view
              <ErrorLogSummaryTable
                summaryData={errorLogs as ErrorLogSummary[]}
                error={error}
              />
            )}

            {/* Records Per Page and Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              {searchType === 'details' && totalRecords > 10 && (
                <RecordsPerPage
                  recordsPerPage={pageSize}
                  onChange={handleRecordsPerPageChange}
                  options={[10, 25, 50]}
                />
              )}
              {searchType === 'details' && totalRecords <= 10 && <div></div>}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <i className="bi bi-search" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="card-title">Ready to Search</h5>
              <p className="card-text text-muted">
                Use the form above to search for error logs. Select a date range
                (up to 5 days maximum) and severity, then click the Search
                button. You can click on each row in the results to view
                detailed information about the error log.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Error Log Details Modal */}
      {selectedLog && (
        <ErrorLogDetails log={selectedLog} onClose={handleCloseDetails} />
      )}
    </>
  );
}
