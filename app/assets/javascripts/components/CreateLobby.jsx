import {Form, InputGroup, Button} from 'react-bootstrap';
import React, { useState } from "react";

export default function CreateLobbyForm() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        if (form.checkValidity() === true) {
            var data = {}
            data['lobby_name'] = form.querySelector('#validationCustom01').value;
            data['entry_fee'] = form.querySelector('#validationCustom03').value;
            data['max_persons'] = form.querySelector('#validationCustom04').value;
            createLobby(data);
        }  
    };

    const createLobby = (data) => {
        $.ajax({
            url: '/api/lobby/create',
            method: 'POST',
            data: data,
            success: function(){
                window.location.replace('/home');
            },
            error: function(error){
                alert('Internal Server Error , Please try Again');
            }
        })
    }

    return (
        <React.Fragment>
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container-lobby">
                <Form.Group controlId="validationCustom01">
                    <Form.Control
                        required
                        type="text"
                        placeholder="Enter Lobby Name"
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid Lobby Name.
                    </Form.Control.Feedback>
                </Form.Group>
        
                <Form.Group controlId="validationCustom03">
                    <Form.Control type="number" placeholder="Entry Fee" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid entry fee.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="validationCustom04">
                    <Form.Control type="number" placeholder="No. of Member allowed to add" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid input.
                    </Form.Control.Feedback>
                </Form.Group>    
                <Form.Group>
                    <Form.Check
                    required
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    />
                </Form.Group>
                <Button type="submit">Proceed</Button>
            </Form>
        </React.Fragment>
    );
}