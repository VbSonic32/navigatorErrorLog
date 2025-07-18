import React from 'react';

export default function Loading() {
  return (
    <div className="container py-4">
      <h1 className="mb-4">Error Log Explorer</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="placeholder-glow">
            <div className="row mb-3">
              <div className="col-md-4">
                <span className="placeholder col-4 mb-2"></span>
                <span className="placeholder col-12"></span>
              </div>
              <div className="col-md-4">
                <span className="placeholder col-4 mb-2"></span>
                <span className="placeholder col-12"></span>
              </div>
              <div className="col-md-4">
                <span className="placeholder col-4 mb-2"></span>
                <span className="placeholder col-12"></span>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <span className="placeholder col-2"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="placeholder-glow mb-3">
        <span className="placeholder col-3"></span>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <span className="placeholder col-8"></span>
              </th>
              <th scope="col">
                <span className="placeholder col-8"></span>
              </th>
              <th scope="col">
                <span className="placeholder col-8"></span>
              </th>
              <th scope="col">
                <span className="placeholder col-8"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td>
                  <span className="placeholder col-8"></span>
                </td>
                <td>
                  <span className="placeholder col-8"></span>
                </td>
                <td>
                  <span className="placeholder col-8"></span>
                </td>
                <td>
                  <span className="placeholder col-8"></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation placeholder">
          <ul className="pagination">
            <li className="page-item disabled">
              <span className="page-link placeholder col-3"></span>
            </li>
            <li className="page-item">
              <span className="page-link placeholder col-1"></span>
            </li>
            <li className="page-item">
              <span className="page-link placeholder col-1"></span>
            </li>
            <li className="page-item disabled">
              <span className="page-link placeholder col-3"></span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
