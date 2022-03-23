import '../App.css';
import {
  Button,
  Input,
  FormGroup,
} from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
const dbHelper = require('../util/dbHelper');


//Initializing state variables
const initialState = {
  password: "",
  passwordError: "",
  email: '',
  emailError: ''

};



function Signup(props) {
  const [state, setState] = useState(initialState);

  const { addToast } = useToasts();



  //Set page background color
  useEffect(() => {
    document.body.style.backgroundColor = "#2e3649"
  })


  //Function to validate signup state variables
  const validate = () => {
    let emailError, passwordError;

 
    if (!state.email) {
      emailError = 'Email is required';
    }
    let emailRegex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
  
    if (state.email && !state.email.match(emailRegex)) {
      emailError = "Invalid Email";
    }
    if (!state.password) {
      passwordError = 'Password is required';
    }
  
    if ( emailError || passwordError ) {
      setState({ ...state,emailError, passwordError});
      return false;
    }
    return true;
  };

  const signup = async() => {
    const isValid = validate();
    if (isValid) {
        let formbody={
          email: state.email,
          password: state.password
  
        }
        await dbHelper.default.register(formbody)
        .then(function (response) {
          if(response.status && response.status===200){
            addToast('User Registered Successfully',
              {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 1000,
                onDismiss: () => {
                  setState(initialState);
            
              
                  localStorage.setItem("id", response.data._id);
                  localStorage.setItem("loggedin", true);
                      props.history.push("/dashboard");

                    
                  

                },
              })
          }
          else if (response.status && response.status===400) {
            addToast('User already exists', {
              appearance: 'error', autoDismiss: true,
              autoDismissTimeout: 2000,
            });

          }
        })
        .catch(err => { console.log(err) })


    }
  }

  const Return=()=>{
    props.history.push('/')
  }


  return (
    <div>
      <div className="container-center-horizontal">
          <div className="top-C61RwL">
        
          </div>
          <div className="content-signinup">
            <div className="textfields-signup">
            
              <div className="group">
                <FormGroup>
                  <Input
                    type="text"
                    name="email"
                    value={state.email}
                    onChange={(event) =>
                      event.target.value ?
                        setState({ ...state, email: event.target.value, emailError: "" }) : setState({ ...state, email: event.target.value, emailError: "Email is required" })
                    }
                    placeholder="Email"

                  />

                </FormGroup>


                {state.emailError ? <div className="validation-error" >
                  {state.emailError}
                </div> : ""}
              </div>
              <div className="group">
                <FormGroup>
                  <Input
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={(event) =>
                      event.target.value ?
                        setState({ ...state, password: event.target.value, passwordError: "" }) : setState({ ...state, password: event.target.value, passwordError: "Password is required" })
                    }
                    placeholder="Password"

                  />
                </FormGroup>


                {state.passwordError ? <div className="validation-error" >
                  {state.passwordError}
                </div> : ""}
              </div>
     
            </div>
            <div className="buttonslargeblue-xUsx1L">
              <Button className="signup-button" onClick={signup}>
              Register
        </Button>
            </div>
            <div className="buttonslargeblue-xUsx1L">
              <Button className="return-button" onClick={Return}>
              Return
        </Button>



            </div>
          </div>
    
        
      </div>

    </div>

  );
}

export default withRouter(Signup);
