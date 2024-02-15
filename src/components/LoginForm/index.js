import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    /* STEP-7  we know that or remember that when any component like <LoginFrom/> or <Home/> 
    or etc components is rendering through <Route/> then automatically some additional props 
    are passed directly like they are : 1)match , 2)history , 3)location etc.. */

    // therefor hence bring and use  history from props directly

    const {history} = this.props
    /* this history object contains several methods like replace() , push() , go() 
    goBack(), goForward() etc are used to control navigate pages from on page to another 
    when we click on submit */

    history.replace('/') // here are we are navigating to slash ('/') path by using only push method in history
    Cookies.set('jwt_token', jwtToken, {expires: 30}) // STEP -10
    /* Here if STEP-8 , STEP-9 are not followed by error, if every thing is successful then this STEP-10 Executes.
    and syntax for setting cookies is => Cookies.set('token_name_our_wish', token_value_passing_from_argument_directly, {expires: DAYS}) */
  }

  onSubmitFailure = error => {
    // STEP-9
    console.log(error)
    this.setState({showErrorMsg: true, errorMsg: error})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state // STEP-1 bringing username and password from present state.
    const userDetails = {username, password} // STEP-2 wrap username and password in userDetails.
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails), // STEP-3 posting our details in string format.
    }

    const response = await fetch(url, options) // STEP-4 sending options into the particular url.
    const data = await response.json() /* getting data from response in json format that is we get 
    in JWT TOKEN format  so that we can work easily or else  if we not use json() format 
    we get in stringify() format which we can't work on that */
    console.log(data) // STEP-5 in console if username and password are correct  we get one JWT TOKEN.
    console.log(response.ok)
    /* check wether value for ok in response is true or false ,
    if ok:true means successful authentication , if ok:false means something error  */

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token) // STEP-6 used this function for successful login and jwt_token is passing as an argument
    } else {
      this.onSubmitFailure(data.error_msg) // STEP-8
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-filed"
          placeholder="Password"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-filed"
          placeholder="Username"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    /* STEP-11 Getting token by its name called 'jwt_token'
    and  we are getting cookies only if its successful login means it should not be undefined */
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    // if there is no jwt token created means if login is not successful it shows below login form
    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showErrorMsg && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
