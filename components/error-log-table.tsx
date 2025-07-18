import React, { useState } from 'react';
import { ErrorLogEntry } from '@/types/errorLog';

interface ErrorLogTableProps {
  errorLogs: ErrorLogEntry[];
  onRowClick: (log: ErrorLogEntry) => void;
  error?: string | null;
}

export default function ErrorLogTable({
  errorLogs,
  onRowClick,
  error,
}: ErrorLogTableProps) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortedLogs, setSortedLogs] = useState<ErrorLogEntry[]>([...errorLogs]);

  // Update sortedLogs when errorLogs changes
  React.useEffect(() => {
    setSortedLogs([...errorLogs]);
  }, [errorLogs]);

  // Sort handler
  const handleSortTimestamp = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    setSortedLogs((prevLogs) =>
      [...prevLogs].sort((a, b) => {
        const aTime = new Date(a.Timestamp).getTime();
        const bTime = new Date(b.Timestamp).getTime();
        return newDirection === 'asc' ? aTime - bTime : bTime - aTime;
      })
    );
  };

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
            <th
              scope="col"
              style={{ cursor: 'pointer' }}
              onClick={handleSortTimestamp}
            >
              Timestamp{' '}
              <span style={{ fontSize: '0.9em' }}>
                {sortDirection === 'asc' ? '▲' : '▼'}
              </span>
            </th>
            <th scope="col">Machine Name</th>
            <th scope="col">Title</th>
          </tr>
        </thead>
        <tbody>
          {sortedLogs.map((log, index) => {
            // Extract title from formattedMessage (safely handling undefined)
            let title = 'N/A';
            if (log.FormattedMessage) {
              // Try different patterns to extract title
              const titleMatch =
                log.FormattedMessage.match(/Title:(.*?)(?:Category:|$)/i) ||
                log.FormattedMessage.match(/Message:(.*?)(?:Category:|$)/i);

              if (titleMatch) {
                title = titleMatch[1].trim();
              } else {
                // If no specific pattern found, use a portion of formattedMessage as title
                title =
                  log.FormattedMessage.length > 50
                    ? `${log.FormattedMessage.substring(0, 50)}...`
                    : log.FormattedMessage;
              }
            }

            // Determine row style based on severity
            const statusClass =
              log.Severity === 'Error'
                ? 'error'
                : log.Severity === 'Warning'
                ? 'warning'
                : '';

            return (
              <tr
                key={index}
                onClick={() => onRowClick(log)}
                style={{ cursor: 'pointer' }}
              >
                <td className={statusClass}>
                  {' '}
                  <i
                    className="bi bi-info-circle-fill me-2"
                    title="Click for details"
                  ></i>
                  {log.Severity}
                </td>
                <td>{new Date(log.Timestamp).toLocaleString()}</td>
                <td>{log.MachineName}</td>
                <td>
                  <div className="d-flex align-items-center justify-content-between">
                    <span>{title}</span>
                  </div>
                </td>
              </tr>
            );
          })}

          {sortedLogs.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">
                No error logs found matching your criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
