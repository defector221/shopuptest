import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

export default class Member extends Component {
    constructor(props){
        super(props);
    }

    getName(){
        var {info} = this.props;
        return info.first_name+" "+info.last_name;
    }

    render() {
        var {info} = this.props;
        return (
            <div id={this.props.info.candidate_id} className="tile m_card">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/images/avatar.png" />
                      <Card.Body>
                        <Card.Title>{this.getName()}</Card.Title>
                    </Card.Body>
                </Card>          
            </div>
        )
    }
}
