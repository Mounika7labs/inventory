import React, { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';
import {
  Card, Button, Table, FormGroup, Label, Input
} from 'reactstrap';

const dbHelper = require('../util/dbHelper');

//Profile state variables
const initialState = {
  name: "",
  note: ""
};


function Dashboard(props) {
  const [state, setState] = useState(initialState);
  const [bins, setBins] = useState([]);
  const [allbins, setAllBins] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [nodata, setnodata] = useState("");
  const { addToast } = useToasts();
  const [pstate, setpState] = useState({
    prevScrollpos: window.pageYOffset,
    visible: true
  })

  const [showBin, setShowBin] = useState(false);

  //Function to set scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [])

  //Set app language and page background color
  useEffect(() => {
    document.body.style.backgroundColor = "#fff";

  })


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
    let nameError, noteError;


    if (!state.name) {
      nameError = 'Name is required';
    }
    if (!state.note) {
      noteError = 'Note is required';
    }


    if (nameError || noteError) {
      setState({ ...state, nameError, noteError });
      return false;
    }
    return true;
  };

  //Function to get bin details
  const getbindetails = async() => {
    await dbHelper.default.getBins().then(function (response) {
      if (response.status === 200) {
        if (response.rows.length !== 0) {
          setBins(response.rows)
          setAllBins(response.rows)
        }
        else {
          setBins({ nodata: "nodata" })
        }
      }
      else if(response.status ===400) {
        setBins({ nodata: "nodata" })
      }
    }
    )
   

      .catch(err => { console.log(err, "get details error") })

  }
  useEffect(() => {
    getbindetails();
  }, [])






  
  const  addbin = async() => {

    const isValid = validate();
    if (isValid) {
      let formbody = {
        name: state.name,
        note: state.note,
        createdDate: new Date(),
        tableName: "bins",

      }
     
await dbHelper.default.addBin(formbody)
     
    .then(async function (response) {
          if(response.status && response.status===400){
            addToast('Bin already exists', {
                          appearance: 'error', autoDismiss: true,
                          autoDismissTimeout: 2000,
                        });
          }
          else if(response.status && response.status===200){
            setState(initialState);
            addToast("Bin added successfully",
              {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 1000,
                onDismiss: () => {
                  setShowBin(false);
                  getbindetails();
    
                },
              })
          }

    
       })

      
     
       }

  }
  //Function to show education form
  const showBinForm = () => {
    setShowBin(!showBin);
  }
  //Function to get patient data by search
  const updateSearch = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === "") {
      getbindetails();
      setnodata("")
    }
    else {
      function filterdata(item) {
        return (item.name && item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) || (item.note && item.note.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) || (item.totalquantity && item.totalquantity.toString().indexOf(e.target.value.toString()) > -1) || (item.itemscount && item.itemscount.toString().indexOf(e.target.value.toString()) > -1)


      }
      const data = allbins.length !== 0 && allbins.nodata == undefined && allbins.filter(filterdata);
      if (data.length !== 0) {
        setBins(data);
        setnodata("")
      }
      else {
        setnodata({ nodata: "nodata" });
      }
    }
  }

  const handleBin = (binid, name) => {
    localStorage.setItem("binid", binid);
    localStorage.setItem("binname", name);

    props.history.push('/binitems')
  }

  return (
    <div className="doctortimeslot-container">
      <div className="top-header">Bins</div>
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
                        Add Bin
                      </Button>
                      {bins.nodata === undefined ? <Input
                        type="text"
                        name="search"
                        value={searchValue}
                        onChange={(e) => updateSearch(e)}
                        placeholder="Search"
                        className="patient_searchcontainer"

                      /> : ""}
                    </div>
                    {showBin ?
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
                              <Label className="alllabel">Note</Label>
                              <Input
                                type="text"
                                name="note"
                                value={state.note}
                                onChange={(event) =>
                                  event.target.value ?
                                    setState({ ...state, note: event.target.value, noteError: "" }) : setState({ ...state, note: event.target.value, noteError:"Note is required"})
                                }
                              />

                            </FormGroup>

                            {state.noteError ? <div className="validation-error" >
                              {state.noteError}
                            </div> : ""}
                          </div>



                          <div className="buttonslargeblue-xUsx1L">
                            <Button className="addbin-button" onClick={addbin}>
                              Save
                            </Button>
                          </div>

                        </Fragment>
                      </div>

                      : ""}

                    <div class="textfields-signup">
                      <div >
                        <Table striped className="educationtable-container" size="sm">
                          <thead>
                            <tr className="education-row">
                              <th style={{ width: "10%" }}>Name</th>
                              <th style={{ width: "40%" }}>Note</th>
                              <th style={{ width: "15%" }}>Items</th>
                              <th style={{ width: "15%" }}>Quantity</th>
                              <th style={{ width: "25%" }}>Date</th>
                            </tr>
                          </thead>
                          <tbody >

                            {
                              (nodata.nodata !== undefined && nodata.nodata === "nodata") || (bins.length !== 0 && bins.nodata !== undefined) ? <div className="profileno-data">No Data</div> :
                                bins.nodata === undefined && bins.length !== 0 && bins.map(
                                  (bin, key) => {
                                    return (
                                      <tr key={key} className="education-row" onClick={() => handleBin(bin._id, bin.name)}>
                                        <td>{bin.name} </td>
                                        <td>{bin.note} </td>
                                        <td>{bin.itemscount}</td>
                                        <td>{bin.totalquantity}</td>
                                        <td>{new Date(bin.createdDate).toLocaleDateString()}</td>




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




    </div>
  )
}

export default withRouter(Dashboard);