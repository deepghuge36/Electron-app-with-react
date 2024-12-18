import React, { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'

const TranslationView = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start loading
        setIsLoading(true)

        // Fetch translation data
        const translationData = window.myAPI.kettranslation.translationDB?.readAllKeyTranslation()

        // Process images with async/await
        const processedData = await Promise.all(
          translationData.map(async (element) => {
            if (element.image_path) {
              try {
                const imageBase64 = await window.myAPI.readLocalFile(element.image_path)
                return { ...element, imageBase64 }
              } catch (error) {
                console.error('Error processing image for', element.key, error)
                return { ...element, imageBase64: null }
              }
            }
            return element
          })
        )

        setData(processedData)
      } catch (error) {
        console.error('Error fetching translation data:', error)
      } finally {
        // Stop loading regardless of success or failure
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Loader Component
  const Loader = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  // No Data Component
  const NoData = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <h4 className="text-muted">No Data Found</h4>
    </div>
  )

  return (
    <div>
      <NavBar />

      {isLoading ? (
        <Loader />
      ) : data.length === 0 ? (
        <NoData />
      ) : (
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
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-wrap">{element.key}</td>
                        <td>{element.english_name}</td>
                        <td>{element.korea}</td>
                        <td>
                          {element.imageBase64 && (
                            <img
                              width="100px"
                              src={element.imageBase64}
                              alt={`Image for ${element.key}`}
                            />
                          )}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TranslationView
