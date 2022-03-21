import '../App.css';
import {
  Button,
  Input,
  FormGroup,
} from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';


//Initializing state variables
const initialState = {
  password: "",
  passwordError: "",
  email: '',
  emailError: ''

};



function Signin(props) {
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

  const signup = () => {
    const isValid = validate();
    let url = process.env.REACT_APP_API_URL + '/api/user'
    if (isValid) {
      axios.post(url, {
        email: state.email,
        password: state.password

      })
        .then(function (response) {
          if (response.data.status === 200) {
            addToast('User Registered Successfully',
              {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 1000,
                onDismiss: () => {
                  setState(initialState);
            
              
                  localStorage.setItem("id", response.data.data._id);
                  localStorage.setItem("loggedin", true);
                      localStorage.setItem('token', response.data.token);
                      props.history.push("/dashboard");

                    
                  

                },
              })
          }
          else if (response.data.status === 400) {
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
          <div className="content-signup">
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

export default withRouter(Signin);
