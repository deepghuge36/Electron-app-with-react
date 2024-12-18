import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import backImage from '../assets/images/png/back.png'
import settingIcon from '../assets/images/svg/setting-dashboard.svg'
import './Home.css'
import arrowRight from '../assets/images/svg/arrow-right.svg'
import addBlue from '../assets/images/svg/add-blue.svg'
import createTemplate from '../assets/images/svg/create-template.svg'
import iconMain from '../assets/images/svg/icon_main.svg'
import { ROUTE_TRANSLATION } from '../pathConstant'

function Home() {
  console.log('check img', backImage)
  const [users, setUsers] = useState([])

  useEffect(() => {
    console.log('Component mounted', window.api)

    // Fetch users when the component mounts
    window.api.getUsers().then((data) => {
      console.log('Fetched users:', data)
      setUsers(data)
    })
  }, [])

  const addUser = async () => {
    const newUser = { name: 'New User', age: 40 }
    const updatedUsers = await window.api.addUser(newUser)
    setUsers(updatedUsers)
  }

  const sendPing = () => {
    window.api.sendPing()
  }

  const navigate = useNavigate()

  return (
    <>
      <header className="d-flex justify-content-end p-2">
        <div className="d-flex me-1 ">
          <div className="p-1">
            <img src={settingIcon} />
          </div>
          <div className="dropdown">
            <button
              className="btn btn-dropdown dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              EN
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  EN - English
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  KR - Korean
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main>
        <div className="container">
          {/* <!-- Header Section --> */}
          <div className="header">
            <h1>LLS Admin</h1>
            <p>Languages Localization Solution</p>
          </div>

          {/* <!-- Cards Section --> */}
          <div className="card-container">
            {/* <!-- Create Template Card --> */}
            <div className="card-custom" id="create-template">
              <div className=" w-100">
                <div
                  className="card-containt--top w-100"
                  onClick={() => navigate(ROUTE_TRANSLATION)}
                >
                  <h3>Create Template</h3>
                  <img src={arrowRight} height="50px" alt="" />
                </div>
                <div className="arrow">
                  <img className="arrow-img" src={createTemplate} alt="" />
                  <img className="arrow-img-add" src={addBlue} alt="" />
                </div>
              </div>
            </div>

            {/* <!-- Check Validation Card --> */}
            <div
              className="card-custom"
              id="check-validation"
              onClick={() => navigate(ROUTE_TRANSLATION)}
            >
              <div className=" w-100">
                <div className="card-containt--top w-100">
                  <h3>Check Validation</h3>
                  <img src={arrowRight} height="50px" alt="" />
                </div>
                <div className="arrow">
                  <img className="arrow-img check-tmpl-img" src={iconMain} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
