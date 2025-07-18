export default function About() {
  return (
    <div className="container py-4">
      <h1 className="mb-4">About Error Log Explorer</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Overview</h5>
          <p className="card-text">
            Error Log Explorer is a simple application for browsing, filtering,
            and analyzing error logs. It provides an easy way to search for logs
            by date range and severity, and to view detailed information about
            each log entry. The application also offers a summary view that
            provides statistical insights about error distribution by severity.
          </p>

          <h5 className="card-title mt-4">Features</h5>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item">
              Search logs by date range and severity
            </li>
            <li className="list-group-item">
              Toggle between detailed view and summary view of error logs
            </li>
            <li className="list-group-item">
              View statistical summaries with counts and percentages for each
              severity level
            </li>
            <li className="list-group-item">
              View detailed information about each log entry
            </li>
            <li className="list-group-item">
              Pagination for easier navigation through large result sets
            </li>
            <li className="list-group-item">
              Responsive design that works on desktop and mobile devices
            </li>
          </ul>

          <h5 className="card-title mt-4">Technologies</h5>
          <p className="card-text">
            This application is built with Next.js, React, and Bootstrap. It
            uses a REST API to fetch error logs from a backend service and JWT
            for authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
