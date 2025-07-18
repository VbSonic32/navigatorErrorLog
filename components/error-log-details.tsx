import React, { useEffect } from 'react';
import { ErrorLogEntry } from '@/types/errorLog';

interface ErrorLogDetailsProps {
  log: ErrorLogEntry | null;
  onClose: () => void;
}

export default function ErrorLogDetails({
  log,
  onClose,
}: ErrorLogDetailsProps) {
  // Enable Bootstrap tabs when component mounts
  useEffect(() => {
    if (!log) return;

    // This requires Bootstrap JS to be loaded globally
    const tabElements = document.querySelectorAll(
      '#details-tab, #message-tab, #error-tab'
    );
    tabElements.forEach((tab) => {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        // @ts-ignore
        this.classList.add('active');

        // Get the target content
        // @ts-ignore
        const targetId = this.getAttribute('data-bs-target').substring(1);
        const targetContent = document.getElementById(targetId);

        // Hide all tab contents
        document.querySelectorAll('.tab-pane').forEach((pane) => {
          pane.classList.remove('show', 'active');
        });

        // Show the target content
        if (targetContent) {
          targetContent.classList.add('show', 'active');
        }

        // Update active state of tabs
        tabElements.forEach((t) => {
          if (t !== tab) {
            // @ts-ignore
            t.classList.remove('active');
          }
        });
      });
    });
  }, [log]);

  // No special formatting functions needed

  if (!log) return null;

  // Extract parts from formattedMessage for better display
  const titleMatch = log.FormattedMessage?.match(/Title:(.*?)(?:Category:|$)/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const categoryMatch = log.FormattedMessage?.match(
    /Category: (.*?) Priority:/i
  );
  const category = categoryMatch ? categoryMatch[1] : '';

  const priorityMatch = log.FormattedMessage?.match(
    /Priority: (.*?) EventId:/i
  );
  const priority = priorityMatch ? priorityMatch[1] : '';

  const eventIdMatch = log.FormattedMessage?.match(/EventId: (.*?) Severity:/i);
  const eventId = eventIdMatch ? eventIdMatch[1] : '';

  const processIdMatch = log.FormattedMessage?.match(
    /Process Id: (.*?) Process Name:/i
  );
  const processId = processIdMatch ? processIdMatch[1] : '';

  const processNameMatch = log.FormattedMessage?.match(
    /Process Name: (.*?) Message:/i
  );
  const processName = processNameMatch ? processNameMatch[1] : '';

  // Extract the message part - splitting the string at "Message:" and then at "ErrorInfo:" if present
  let message = '';
  if (log.FormattedMessage) {
    const parts = log.FormattedMessage.split(/Message:\s*/i);
    if (parts.length > 1) {
      message = parts[1];
      // If ErrorInfo exists, remove everything after it
      const errorInfoIndex = message.indexOf('ErrorInfo:');
      if (errorInfoIndex !== -1) {
        message = message.substring(0, errorInfoIndex);
      }
      message = message.trim();
    }
  }

  // Extract exception XML if present in the message
  let exceptionContent = '';
  if (message.includes('<Exception') && message.includes('</Exception>')) {
    const startIndex = message.indexOf('<Exception');
    const endIndex = message.indexOf('</Exception>') + '</Exception>'.length;
    if (startIndex !== -1 && endIndex !== -1) {
      exceptionContent = message.substring(startIndex, endIndex);
    }
  }

  // Extract exception message from XML if present
  let exceptionMessage = '';
  if (exceptionContent) {
    const messageStartTag = '<Message>';
    const messageEndTag = '</Message>';
    const msgStartIndex = exceptionContent.indexOf(messageStartTag);
    if (msgStartIndex !== -1) {
      const msgValueStartIndex = msgStartIndex + messageStartTag.length;
      const msgEndIndex = exceptionContent.indexOf(
        messageEndTag,
        msgValueStartIndex
      );
      if (msgEndIndex !== -1) {
        exceptionMessage = exceptionContent
          .substring(msgValueStartIndex, msgEndIndex)
          .trim();
      }
    }
  }

  // We'll show the complete message including the exception

  // Extract error info using string operations rather than regex
  let errorInfo = '';
  if (log.FormattedMessage) {
    const errorInfoParts = log.FormattedMessage.split(/ErrorInfo:\s*/i);
    if (errorInfoParts.length > 1) {
      errorInfo = errorInfoParts[1].trim();
    }
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content t-custom">
          <div className="modal-header py-2">
            <h5 className="modal-title fs-6">Error Log Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-3">
            {/* Basic Info - Compact Row */}
            <div className="row g-2 mb-3">
              <div className="col-md-3 col-sm-6">
                <label className="text-muted small d-block mb-1">
                  Severity
                </label>
                <span
                  className={`badge ${
                    log.Severity === 'Warning'
                      ? 'bg-warning text-dark'
                      : log.Severity === 'Error'
                      ? 'bg-danger'
                      : 'bg-info'
                  }`}
                >
                  {log.Severity}
                </span>
              </div>
              <div className="col-md-3 col-sm-6">
                <label className="text-muted small d-block mb-1">
                  Timestamp
                </label>
                <small>{new Date(log.Timestamp).toLocaleString()}</small>
              </div>
              <div className="col-md-3 col-sm-6">
                <label className="text-muted small d-block mb-1">Machine</label>
                <small>{log.MachineName}</small>
              </div>
              <div className="col-md-3 col-sm-6">
                <label className="text-muted small d-block mb-1">
                  App Domain
                </label>
                <small
                  className="d-inline-block w-100"
                  title={log.AppDomainName}
                >
                  {log.AppDomainName}
                </small>
              </div>
            </div>

            {/* Message Details - Tabbed Layout */}
            <ul className="nav nav-tabs mb-2" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="details-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#details"
                  type="button"
                  role="tab"
                  aria-controls="details"
                  aria-selected="true"
                >
                  Details
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="message-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#message"
                  type="button"
                  role="tab"
                  aria-controls="message"
                  aria-selected="false"
                >
                  Message
                </button>
              </li>
              {errorInfo && (
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="error-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#error"
                    type="button"
                    role="tab"
                    aria-controls="error"
                    aria-selected="false"
                  >
                    Error Info
                  </button>
                </li>
              )}
            </ul>

            <div className="tab-content">
              {/* Details Tab */}
              <div
                className="tab-pane fade show active"
                id="details"
                role="tabpanel"
                aria-labelledby="details-tab"
              >
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: '20%' }}>Title</th>
                        <td>{title}</td>
                      </tr>
                      <tr>
                        <th>Category</th>
                        <td>{category}</td>
                      </tr>
                      <tr>
                        <th>Priority</th>
                        <td>{priority}</td>
                      </tr>
                      <tr>
                        <th>Event ID</th>
                        <td>{eventId}</td>
                      </tr>
                      <tr>
                        <th>Process</th>
                        <td>
                          ID: {processId}
                          <br />
                          <small
                            className="text-truncate d-inline-block w-100"
                            title={processName}
                          >
                            {processName}
                          </small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Message Tab */}
              <div
                className="tab-pane fade"
                id="message"
                role="tabpanel"
                aria-labelledby="message-tab"
              >
                <div className="p-2 border rounded">
                  {exceptionMessage && (
                    <div className="alert alert-danger mb-3">
                      <strong>Exception:</strong> {exceptionMessage}
                    </div>
                  )}
                  <pre
                    className="mb-0"
                    style={{
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.875rem',
                      maxHeight: '300px',
                      overflow: 'auto',
                    }}
                  >
                    {message}
                  </pre>
                </div>
              </div>

              {/* Error Info Tab */}
              {errorInfo && (
                <div
                  className="tab-pane fade"
                  id="error"
                  role="tabpanel"
                  aria-labelledby="error-tab"
                >
                  <div className="p-2 border rounded">
                    <pre
                      className="mb-0"
                      style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}
                    >
                      {errorInfo}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer py-1">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
