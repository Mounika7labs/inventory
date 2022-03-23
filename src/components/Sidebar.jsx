import React, { useEffect, useState} from 'react';
import { slide as Menu } from 'react-burger-menu';
import { withRouter } from 'react-router-dom';

const Sidebar = (props) => {
  const [state, setState] = useState({
    prevScrollpos: window.pageYOffset,
    visible: true
  }

  )





  //Set scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [])

  //Function to handle scroll
  const handleScroll = () => {
    const { prevScrollpos } = state;

    const currentScrollPos = window.pageYOffset;
    let visible = prevScrollpos > currentScrollPos;
    if (prevScrollpos == currentScrollPos) {
      visible = true;
    }

    setState({
      prevScrollpos: currentScrollPos,
      visible
    });
  }

  //Function to logout from the app
  const logout = () => {
    localStorage.clear();
  }

  //Function to handle home 
  const handleSearch = () => {

      props.history.push('/dashboard')
    


  }



  return (
    <div style={{ direction: "ltr" }} className={state.visible === true ? "snavbar" : "snavbarh"}  >
     <Menu>
          <a id="home" className="menu-item" href="#/"><div className="userimage-container"> <img src={"/static/img/users/user.png"} alt="profilepic"/></div></a>
          <a id="home" className="menu-item" href="#/" onClick={() => handleSearch()}><img src="/static/img/home.svg" alt="home" className="menu-home-container" /></a>
          <a className="menu-item" href="#/"><img src="/static/img/logout.svg" alt="logout" onClick={logout} className="menu-logout-container" /></a>
        </Menu>

    </div>
  );
}

export default withRouter(Sidebar);