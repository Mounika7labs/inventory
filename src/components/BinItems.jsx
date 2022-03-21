import React, { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import {
  Card, Button,  Table, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


//Profile state variables
const initialState = {
  name:"",
  quantity:null,
  items:1
};


function BinItems(props) {
  const [state, setState] = useState(initialState);
  const [binitems,setBinItems] = useState([]);
  const [allbinitems,setAllBinItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [nodata, setnodata] = useState("");
  const { addToast } = useToasts();  
  const [pstate, setpState] = useState({
    prevScrollpos: window.pageYOffset,
    visible: true
  })
  const [itemudpated, setitemupdated]=useState(false);
  const[binid,setBinid]= useState(localStorage.getItem("binid"))

  const [showBinItem, setShowBinItem] = useState(false);

  const [confirmdeleteitem, setConfirmDeleteItem] = useState(false);
  const [deleteitemid, setDeleteItemid] = useState("");
  const [deleteitemrev, setDeleteItemrev] = useState("");


  //Function to set scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [])

  //Set app language and page background color
  useEffect(() => {
    document.body.style.backgroundColor = "#fff";

  })

  //Funtion to move to patients page
  const handleNavigation = () => {
    props.history.push('/dashboard');

  }

  //Function to handle scroll
  const handleScroll = () => {
    const { prevScrollpos } = pstate;

    const currentScrollPos = window.pageYOffset;
    let visible = prevScrollpos > currentScrollPos;
    if (prevScrollpos == currentScrollPos) {
      visible = true;
    }

    setpState({
      prevScrollpos: currentScrollPos,
      visible
    });
  }


 

  
  //Function to validate basic information values
  const validate = () => {
    let nameError, quantityError;


    if (!state.name) {
      nameError = 'Name is required';
    }
    if (!state.quantity) {
      quantityError = 'Quantity is required';
    }
    let quantityRegex =/^[0-9]+$/
  
    if (state.quantity && !state.quantity.match(quantityRegex)) {
      quantityError = "Quantity should be in digits";
    }


    if (nameError || quantityError ) {
      setState({ ...state, nameError, quantityError });
      return false;
    }
    return true;
  };


  //Function to get bin item details
  const getbinitemdetails = () => {

    let url = process.env.REACT_APP_API_URL + '/api/getbinitems/' + binid;
    axios.get(url, {
      headers: {
        token: localStorage.getItem("token")
      }
    }
      ,)
      .then(function (response) {
        if (response.data.status === 200) {
           if(response.data.rows.length !==0){
            setBinItems(response.data.rows)
            setAllBinItems(response.data.rows)
           }
           else{
            setBinItems({nodata:"nodata"})
           }
        }
        
      })
      .catch(err => { console.log(err, "get details error") })

  }
  useEffect(() => {
    getbinitemdetails();
  }, [])

  
  
  

 
const addbinitem = ()=>{

  const isValid = validate();
  let url = process.env.REACT_APP_API_URL + '/api/addbinitem';
  if (isValid) {
    let axiosConfig = {
      headers: {
        token: localStorage.getItem("token")
      },
    };
    let formbody={
      binid: binid,
      name: state.name,
      quantity: state.quantity,
      items:state.items
  
  }
    axios.post(url,
      formbody,
      axiosConfig
     )
      .then(function (response) {
        if (response.data.status === 200) {
          setState(initialState);
          addToast("Bin item added successfully",
            {
              appearance: 'success',
              autoDismiss: true,
              autoDismissTimeout: 1000,
              onDismiss: () => {
                setShowBinItem(false);
                getbinitemdetails();
              
              },
            })
        }
        else if(response.data.status===400){
          addToast('Bin already exists', {
            appearance: 'error', autoDismiss: true,
            autoDismissTimeout: 2000,
          });
        }
      })
      .catch(err => { console.log(err) })
  }

}
  //Function to show education form
  const showBinForm = () => {
    setShowBinItem(!showBinItem);
  }
//Function to get patient data by search
const updateSearch = (e) => {
  setSearchValue(e.target.value);
  if (e.target.value === "") {
    getbinitemdetails();
    setnodata("")
  }
  else {
    function filterdata(item) {
      return (item.name && item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) || (item.quantity && item.quantity.toString().indexOf(e.target.value.toString()) > -1)

    }
    const data = allbinitems.length !== 0 && allbinitems.nodata == undefined && allbinitems.filter(filterdata);
    if (data.length !== 0) {
      setBinItems(data);
      setnodata("")
    }
    else {
      setnodata({ nodata: "nodata" });
    }
  }
}

const handleItemcount = (e,id) =>{
  if(e.target.value !==""){
    if(e.target.value.length<5){
     binitems.find(item => item._id=== id).items = parseInt(e.target.value);
     setitemupdated(!itemudpated)
    }
    else{
    }

 }
 else{
   binitems.find(item => item._id=== id).items="";
   setitemupdated(!itemudpated)

 }
 

  
}

const removeItem = (id,count,quantity)=>{
  if(count>0 && count <= quantity){
    binitems.find(item => item._id=== id).quantity = parseInt(quantity) -parseInt(count);

    setitemupdated(!itemudpated);
    updateItem(id,parseInt(quantity) -parseInt(count))
  }


}
const addItem = (id,count,quantity)=>{
  if(count>0){
    binitems.find(item => item._id=== id).quantity =  parseInt(quantity) +parseInt(count);

    setitemupdated(!itemudpated);
    updateItem(id,parseInt(quantity) +parseInt(count))
  }



}

const updateItem = (id,quantity) =>{
  let url = process.env.REACT_APP_API_URL + '/api/updatebinitem';
  
    let axiosConfig = {
      headers: {
        token: localStorage.getItem("token")
      },
    };
    let formbody={
      quantity:quantity,
      id:id
  
  }
    axios.post(url,
      formbody,
      axiosConfig
     )
      .then(function (response) {
        if (response.data.status === 200) {
          setState(initialState);
        }
        else if(response.data.status===400){
        }
      })
      .catch(err => { console.log(err) })
  

}
  //Function to set confirm modal for delete item
  const toggleConfirmDeleteItem = (id,rev) => {
    setConfirmDeleteItem(!confirmdeleteitem);
    setDeleteItemid(id);
    setDeleteItemrev(rev)
  }

    //Function to handle confirm item modal response
    const handleConfirmDeleteItem = (confirm) => {
      if (confirm) {
        deleteSpeciality()
      }
      else {
        setConfirmDeleteItem(!confirmdeleteitem);
      }
    }

      //Function to delete item data
  const deleteSpeciality = () => {
    let url = process.env.REACT_APP_API_URL + '/api/deletebinitem/' + deleteitemid +'/'+ deleteitemrev;
    axios.get(url, {
      headers: {
        token: localStorage.getItem("token")
      }
    }
      ,)
      .then(function (response) {
        if (response.data.status === 200) {
          setConfirmDeleteItem(!confirmdeleteitem);
          getbinitemdetails()
          addToast('Bin item deleted successfully', {
            appearance: 'success', autoDismiss: true,
            autoDismissTimeout: 2000,
        
          });
          
        }
        
      })
      .catch(err => { console.log(err, "get details error") })
  }


  return (
    <div className="doctortimeslot-container">
      <div className={pstate.visible === true ? "top-container" : "doctor-filternone"}>
        <img src="/static/img/arrow.svg" alt="back" className="arrow-image" onClick={handleNavigation} />
      </div>
      <div className="top-header">{localStorage.getItem("binname")}</div>
      <div className="tabs-container">
     

  
       
          <div>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="flex-start"
              alignItems="flex-start"

            >
              <Fragment>
                <Grid item xs={12} sm={12} md={12} >
                  <Card className={`bin-containercard`}>
                    <div className="">
                      {/* <p className="education-container">{props.label.education}</p> */}
                      <div className="search-paginationcontainer">
                      <Button className="useraddbin-button" onClick={showBinForm}>
                        Add Item
                      </Button>
                      {binitems.nodata === undefined ? <Input
                type="text"
                name="search"
                value={searchValue}
                onChange={(e) => updateSearch(e)}
                placeholder="Search"
                className="patient_searchcontainer"

              /> : ""}
              </div>
                      {showBinItem ?
                       <div className="content-profilesettings">
                        <Fragment>
                         <div className="group">
                        <FormGroup>
                          <Label className="alllabel">Name</Label>
                          <Input
                            type="text"
                            name="name"
                            value={state.name}
                            onChange={(event) =>
                              event.target.value ?
                                setState({ ...state, name: event.target.value, nameError: "" }) : setState({ ...state, name: event.target.value, nameError: "Name is required" })
                            }
                          />

                        </FormGroup>

                        {state.nameError ? <div className="validation-error" >
                          {state.nameError}
                        </div> : ""}
                        </div>

                        <div className="group">
                        <FormGroup>
                          <Label className="alllabel">Quantity</Label>
                          <Input
                            type="text"
                            name="quantity"
                            value={state.quantity}
                            onChange={(event) =>
                              event.target.value ?
                                setState({ ...state, quantity: event.target.value, quantityError: "" }) : setState({ ...state, quantity: event.target.value, quantityError: "Quantity is required"})
                            }
                          />

                        </FormGroup>

                        {state.quantityError ? <div className="validation-error" >
                          {state.quantityError}
                        </div> : ""}
                        </div>
                     

                    
                        <div className="buttonslargeblue-xUsx1L">
                      <Button className="addbin-button" onClick={addbinitem}>
                        Save
                      </Button>
                    </div>
                  
                        </Fragment>
                        </div>

                        : "" }

                      <div class="textfields-signup">
                        <div >
                          <Table striped className="educationtable-container" size="sm">
                            <thead>
                              <tr className="education-row">
                                <th style={{ width: "10%" }}>Name</th>
                                <th style={{ width: "15%" }}>Quantity</th>
                                <th style={{ width: "15%" }}>Add/Remove</th>
                                <th style={{ width: "15%" }}>Remove</th>
                             
                              </tr>
                            </thead>
                            <tbody >

                              {
                              (nodata.nodata !== undefined && nodata.nodata === "nodata") || (binitems.length !== 0 && binitems.nodata!==undefined)? <div className="profileno-data">No Data</div> :
                                binitems.nodata===undefined&& binitems.length !== 0 &&binitems.map(
                                    (binitem, key) => {
                                      return (
                                        <tr key={key} className="education-row">
                                          <td>{binitem.name} </td>
                                          <td>{binitem.quantity} </td>
                                          <td><button className="item-button" onClick={()=>removeItem(binitem._id,binitem.items,binitem.quantity)}>-</button> <input type="text" value={binitem.items} onChange={(e)=>handleItemcount(e,binitem._id)}  className="item-input" /><button className="item-button" onClick={()=>addItem(binitem._id,binitem.items,binitem.quantity)}>+</button> </td>
                                          <td >  <img onClick={() => toggleConfirmDeleteItem(binitem._id,binitem._rev)} src="/static/img/delete.svg" alt="save" className="education-edit" /></td>
                                  

                                      
                                     
                                          
                                        </tr>

                                      )
                                    }
                                  )
                              }
                            </tbody>
                          </Table>
                        </div>

                      </div>
                
                     


                 
                    </div>

                  </Card>
                </Grid>
              </Fragment>
            </Grid>


          </div>

     

      </div>
      <Modal isOpen={confirmdeleteitem} toggle={toggleConfirmDeleteItem}>
        <ModalHeader toggle={toggleConfirmDeleteItem}>Confirm Deletion </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this item?

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleConfirmDeleteItem(true)}>Yes</Button>{' '}
          <Button color="secondary" onClick={() => handleConfirmDeleteItem(false)}>No</Button>
        </ModalFooter>
      </Modal>

   
    

    </div>
  )
}

export default withRouter(BinItems);