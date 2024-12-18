import React from 'react'
import backImage from '../assets/images/png/back.png'
import { useNavigate } from 'react-router-dom'
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import NavBar from '../components/Navbar'
import { ROUTE_TRANSLATION_VIEW } from '../pathConstant'

const Translation = () => {
  const navigate = useNavigate()
  console.log('check', backImage)

  return (
    <div className="main-body">
      <NavBar />
      <div className="container">
        <div className="row fullheight">
          <div className="col">
            <div className="custom__upload">
              <input
                id="btnTranslation"
                type="button"
                value="Translation"
                onClick={() => navigate(ROUTE_TRANSLATION_VIEW)}
              />
            </div>
          </div>
          <div className="col">
            <div className="custom__upload">
              <input id="btnExport" type="button" value="Export" />
            </div>
          </div>
          <div className="col">
            <div className="custom__upload">
              <input id="btnImport" type="button" value="Validations" />
            </div>
          </div>
          <div className="col">
            <div className="custom__upload">
              <input id="btnCategory" type="button" value="Category" />
            </div>
          </div>
          <div>
            <div className="custom__upload">
              <input id="btnTranslationView" type="button" value="Translation Page" />
            </div>
          </div>
          <div className="col">
            <div className="custom__upload">
              <input id="btnImageEdit" type="button" value="Image Edit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Translation
