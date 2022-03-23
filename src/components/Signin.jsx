import '../App.css';
import {
  Button,
  Input,
  FormGroup,
} from 'reactstrap';
import React, { useEffect,useState } from 'react'
import { withRouter } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
const dbHelper = require('../util/dbHelper');



const initialLoginState = {
  password: "",
  passwordError: "",
  email: '',
  emailError: ''
};

function Signin(props) {
  const [loginState, setLoginState] = useState(initialLoginState);
  const { addToast } = useToasts();


 

  //Set page background color
  useEffect(() => {
    document.body.style.backgroundColor = "#2e3649"
  })



    //Function to validate login state variables
    const validateLogin = () => {
      let passwordError, emailError;
   
    
        if (!loginState.email) {
          emailError = 'Email is required';
        }
        let emailRegex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
  
        if (loginState.email && !loginState.email.match(emailRegex)) {
          emailError = "Invalid Email";
        }
      
  
      if (!loginState.password) {
        passwordError = 'Password is required';
      }
      if ( passwordError || emailError) {
        setLoginState({ ...loginState,  passwordError, emailError });
        return false;
      }
      return true;
    };


  //Function to sign in user

  const signin = async() => {
  



    
    const isValid = validateLogin();
    if (isValid) {
        
      let formbody = {
        email: loginState.email,
        password: loginState.password
      }

  
      await dbHelper.default.login(formbody)
        .then(function (response) {
          if(response.status && response.status===200){

            addToast('User Loggedin Successfully', {
              appearance: 'success',
              autoDismiss: true,
              autoDismissTimeout: 1000,
              onDismiss: () => {
                setLoginState(initialLoginState);
                localStorage.setItem("loggedin", true);
                localStorage.setItem("id", response.data._id);
                props.history.push("/dashboard");

              }
            })

         

          }
          else if(response.status && response.status===400){
            addToast('User does not exists', {
              appearance: 'error', autoDismiss: true,
              autoDismissTimeout: 2000,
            });
          }
          else if(response.status && response.status===401){
            addToast('Password is incorrect', {
              appearance: 'error', autoDismiss: true,
              autoDismissTimeout: 2000,
            });
          }
        })
        .catch(err => { console.log(err) })
    }

  }

  const signup=()=>{
    props.history.push('/signup')
  }

  return (
    <div className="splash-container">
      <div className="welcome-to">Welcome to <span className="sub-text">Inventory</span><br /><span className="sub-text">Management System</span></div>
      {/* <div className="home-to">Home of Healthcare <br /><span className="powered-by">Powered by innovation & caring communities</span></div> */}
      <div className="continue-with">CONTINUE WITH:</div>
      <div className="buttons-xUsx1L">



      <div className="content-signinup">
            <div className="textfields-signin">
            
                <div className="group">
                  <FormGroup>
                    <Input
                      type="text"
                      name="email"
                      value={loginState.email}
                      onChange={(event) =>
                        event.target.value ?
                          setLoginState({ ...loginState, email: event.target.value, emailError: "" }) : setLoginState({ ...loginState, email: event.target.value, emailError: "Email is required" })
                      }
                      placeholder="Email"

                    />

                  </FormGroup>

                  {loginState.emailError ? <div className="validation-error" >
                    {loginState.emailError}
                  </div> : ""}
                </div>
              

              <div className="group">
                <FormGroup>
                  <Input
                    type="password"
                    name="password"
                    value={loginState.password}
                    onChange={(event) =>
                      event.target.value ?
                        setLoginState({ ...loginState, password: event.target.value, passwordError: "" }) : setLoginState({ ...loginState, password: event.target.value, passwordError: "Password is required" })
                    }
                    placeholder="Password"

                  />
                </FormGroup>

                {loginState.passwordError ? <div className="validation-error" >
                  {loginState.passwordError}
                </div> : ""}
              </div>
            </div>
            <div className="buttonslargeblue-signin">
              <Button className="splash-signin-button" onClick={signin}>
                Login
        </Button>
            </div>

            <div className="buttonslargeblue-signin">
              <Button className="splash-signup-button" onClick={signup}>
                Create New User
        </Button>
            </div>
    
          </div>

   
   
      </div>
    </div>

  );
}

export default withRouter(Signin);
