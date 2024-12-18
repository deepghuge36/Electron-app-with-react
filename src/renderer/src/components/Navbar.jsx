import { Link, useNavigate } from 'react-router-dom'
import backImage from '../assets/images/png/back.png'
const NavBar = () => {
  const navigate = useNavigate()
  const navigateHome = () => {
    console.log('navigateHome')
    navigate('/')
  }
  return (
    <nav>
      <div className="header__new">
        <div className="container">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="home_back">
              <span>
                <img src={backImage} />
                <input id="btnHome" type="button" value="Home" onClick={navigateHome} />
              </span>
            </div>
            <div className="homelogo">
              <h1>LLS</h1>
            </div>
            <div className="setting"></div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
