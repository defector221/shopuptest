import React, { Component } from 'react'
import {Link} from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

export default class CreateLobbyButton extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="tile">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/images/plus.jpg" />
                      <Card.Body>
                        <Card.Text>
                            Create, Configure New Lobby    
                        </Card.Text>
                        <Link to={`/lobby/create/new`}>
                          <Button variant="primary" onClick={this.handleClick}>Create New Lobby</Button>
                        </Link>
                    </Card.Body>
                </Card>          
            </div>
        )
    }
}