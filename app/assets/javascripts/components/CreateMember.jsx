import React, { Component } from 'react';
import {Card, Button, Modal, Spinner} from 'react-bootstrap';
import ReactDOM from "react-dom";

export default class CreateMember extends Component {
    constructor(props){
        super(props);
        this.addMember = this.addMember.bind(this);
    }
    addMember(){
        if(!this.model){
            var section = document.createElement('section');
            (document.getElementsByTagName('body')[0]).appendChild(section);
            ReactDOM.render(<FormModel ref={(_ref) =>{this.model = _ref}} cost={this.props.cost} handleStateChange={this.props.handleStateChange} id={this.props.id} />, section);  
        }
        this.model.setState({
            show: true
        });
    }

    render() {
        return (
            <div className="tile m_card">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/images/enroll.png" />
                      <Card.Body>
                        <Card.Text>
                            Create, Entroll New Member    
                        </Card.Text>
                          <Button variant="primary" onClick={this.addMember}>Add Member</Button>
                    </Card.Body>
                </Card>          
            </div>
        )
    }
}

class FormModel extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            validated: false,
            isLoading: false
        }
        this.handleClose = this.handleClose.bind(this);
    }

    setValidated(status){
        this.setState({
            validated: status
        });
    }

    handleSubmit = (event) => {
        var {handleStateChange, id} = this.props;
        var self = this;
        var data  = {
            id
        };
        ['mFirstName', 'mLastName', 'mEmail', 'mPhone', 'mAddress', 'mCost'].forEach(function(key){
            data[key] = document.getElementById(key).value;
        });
        

        this.setState({
            isLoading: true
        });

        $.ajax({
            url: '/api/lobby/add_member',
            method: 'POST',
            data: data,
            success: function(responseObj){
               if(responseObj.status){
                    self.setState({
                        isLoading:false,
                        show:false
                    });     
                    handleStateChange && handleStateChange();    
               }else{
                    alert('Internal Server Error , Please try Again');
               }
            },
            error: function(error){
                alert('Internal Server Error , Please try Again');
            }
        })
    }

    handleClose(){
        this.setState({
            show:false
        });
    }

    render(){
        var {cost} = this.props;
        return (
            <React.Fragment>
                 <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Please Fill Member Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row m_card_input">
                            <section className="col-sm-12 col-md-12 col-lg-12">
                                <input type="text" placeholder="Enter First Name" required className="col-sm-12 col-md-5 col-lg-5" id="mFirstName"/>
                                <input type="text" placeholder="Enter Last Name" required className="col-sm-12 col-md-5 col-lg-5" id="mLastName"/>
                            </section>
                            <section className="col-sm-12 col-md-12 col-lg-12">
                                <input type="email" placeholder="Enter Email " required className="col-sm-12 col-md-12 col-lg-12" id="mEmail"/>
                            </section>
                            <section className="col-sm-12 col-md-12 col-lg-12">
                                <input type="text" placeholder="Enter Phone " required className="col-sm-12 col-md-12 col-lg-12" id="mPhone"/>
                            </section>
                            <section className="col-sm-12 col-md-12 col-lg-12">
                                <input type="Address" placeholder="Enter Address... " required className="col-sm-12 col-md-12 col-lg-12" id="mAddress"/>
                            </section>
                            <section className="col-sm-12 col-md-12 col-lg-12">
                                <input type="text" value={cost} required className="col-sm-12 col-md-12 col-lg-12" disabled id='mCost'/>
                            </section>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        {
                        !this.state.isLoading ?
                                (<Button variant="primary" onClick={this.handleSubmit}>
                                    Proceed
                                </Button>)
                                :
                            (<Button variant="primary" disabled>
                                <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />
                                <span className="sr-only">Loading...</span>
                            </Button>)
                        }
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}