import React  from "react";
import { Signup, Signin} from "./components";
import { BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import Routes from './Routes'


function App() {

  return (
    
    <div className="App">
      <Router>
       <Switch>
        <div>
        <ToastProvider>
          <Route exact path="/" render={()=>localStorage.getItem("loggedin")? "":<Signin />}/>
          <Route exact path="/signup" render={()=><Signup />}/>
          <Route path="/" render={(props)=><Routes {...props}/>}/>
          </ToastProvider>
         
          </div>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
