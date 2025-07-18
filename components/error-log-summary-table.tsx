import React from 'react';
import { ErrorLogSummary } from '@/types/errorLog';

interface ErrorLogSummaryTableProps {
  summaryData: ErrorLogSummary[];
  error?: string | null;
}

export default function ErrorLogSummaryTable({
  summaryData,
  error,
}: ErrorLogSummaryTableProps) {
  return (
    <div className="table-responsive">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <table className="table table-hover table-sm">
        <thead>
          <tr>
            <th scope="col">Severity</th>
            <th scope="col">Count</th>
            <th scope="col">Percent</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((summary, index) => {
            // Determine row style based on severity
            const statusClass =
              summary.Severity === 'Error'
                ? 'error'
                : summary.Severity === 'Warning'
                ? 'warning'
                : '';

            // Calculate total count across all severity levels
            const totalCount = summaryData.reduce(
              (total, item) => total + (item.Cnt || 0),
              0
            );

            // Calculate percentage (avoid division by zero)
            const percentage =
              totalCount > 0
                ? (((summary.Cnt || 0) / totalCount) * 100).toFixed(1)
                : '0.0';

            return (
              <tr key={index}>
                <td className={statusClass}>
                  <i className="bi bi-info-circle-fill me-2"></i>
                  {summary.Severity}
                </td>
                <td>{summary.Cnt}</td>
                <td>{percentage}%</td>
              </tr>
            );
          })}

          {summaryData.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-muted">
                No error logs found matching your criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
