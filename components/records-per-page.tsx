import React from 'react';

interface RecordsPerPageProps {
  recordsPerPage: number;
  onChange: (value: number) => void;
  options?: number[];
}

export default function RecordsPerPage({
  recordsPerPage,
  onChange,
  options = [10, 20],
}: RecordsPerPageProps) {
  return (
    <div className="d-flex align-items-center">
      <span className="me-2 text-muted small">Records per page:</span>
      <select
        className="form-select form-select-sm"
        style={{ width: 'auto' }}
        value={recordsPerPage}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Records per page"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
