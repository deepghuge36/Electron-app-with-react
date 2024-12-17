import React from 'react'
import backImage from '../assets/images/png/back.png'
import { useNavigate } from 'react-router-dom'

const Translation = () => {
  const navigate = useNavigate()
  console.log('check', backImage)
  return (
    <div>
      <div class="header__new">
        <div class="container">
          <div class="row d-flex justify-content-between align-items-center">
            <div class="home_back">
              <span>
                <img src={backImage} />
                <input id="btnHome" type="button" value="Home" onClick={navigate('/')} />
              </span>
            </div>
            <div class="homelogo">
              <h1>LLS</h1>
            </div>
            <div class="setting"></div>
          </div>
        </div>
      </div>

      <div class="main-body">
        <div class="container">
          <div class="row">
            <div class="col-md-12 d-flex justify-content-between border-bottom border-1 align-items-center">
              <h3 class="heading text-primary py-3">Key Master</h3>
              <button id="btnAddNew" class="btn btn-primary mb-3 mb-0">
                Add New
              </button>
            </div>
          </div>
          <div class="row g-3 py-3">
            <div class="col-auto">
              <input id="hdnKeyId" type="hidden" />
            </div>
          </div>

          <div id="tbData"></div>
        </div>
      </div>
    </div>
  )
}

export default Translation
