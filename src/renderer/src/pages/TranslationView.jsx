import React, { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'

const TranslationView = () => {
  const [data, setData] = useState([])

  return (
    <div>
      {/* Header */}
      <NavBar />

      {/* Main Body */}
      <div className="main-body">
        <div className="container">
          {/* Title Row */}
          <div className="row">
            <div className="col-md-12 d-flex justify-content-between border-bottom border-1 align-items-center">
              <h3 className="heading text-primary py-3">Key Master</h3>
              <button className="btn btn-primary mb-3 mb-0" onClick={() => handleAddEditKey(0)}>
                Add New
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="row g-3 py-3">
            <div className="col-12">
              {data.length > 0 ? (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Key</th>
                      <th>English Name</th>
                      <th>Korea</th>
                      <th>Image</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((element, index) => (
                      <tr key={element.key_id}>
                        <td>{index + 1}</td>
                        <td className="text-wrap">{element.key}</td>
                        <td>{element.english_name}</td>
                        <td>{element.korea}</td>
                        <td>
                          <img
                            width="100px"
                            src={`${spath.replace('app.asar', '')}/uploads/${element.image_path}`}
                            alt="Key"
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddEditKey(element.key_id)}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleDelete(element.key_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Data Found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationView
