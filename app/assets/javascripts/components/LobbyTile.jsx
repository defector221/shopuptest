import React, { Component } from 'react'
import {Link} from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

export default class LobbyTile extends Component {
    constructor(props){
        super(props);
        this.startLottery = this.startLottery.bind(this);
    }
    getPriceMoney(){
        var {info} = this.props;
        return (info.lobby_total_member_alloted_seats * info.entry_fee_per_seat * 0.95);
    }
    getStatus(){
        var {info} = this.props;
        switch(info.lobby_status){
            case 0:
                return 'Not Started';
            case 1:
                return 'Running';
            default:
                return 'Completed';
        }
    }

    startLottery(){
        var {handleStateChange, info} = this.props;
        $.ajax({
            url: '/api/lobby/status',
            method: 'POST',
            data: {
                id:this.props.info.id,
                status: 1
            },
            success: function(){
                handleStateChange(info.id, 1);
                window.location.replace(`/lobby/open/${info.id}`);
            },
            error: function(error){
                alert('Internal Server Error , Please try Again');
            }
        })
    }

    renderButtons(){
        var {info} = this.props;
        switch(info.lobby_status){
            case 0:
                return (
                    <Button variant="primary" onClick={this.startLottery}>Start</Button>
                );
            case 1:
                return (
                <Link to={`/lobby/open/${this.props.info.id}`}>
                    <Button variant="primary" >Go Inside</Button>
                </Link>
              );
            default:
                return null;
        }
    }
    render() {
        var {info} = this.props;
        return (
            <div id={this.props.info.id} className="tile">
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="/images/lottery.png" />
                      <Card.Body>
                        {info.lobby_status >= 2 ? <span className="badge badge-success">{this.getStatus()}</span> : <span className="badge badge-info">{this.getStatus()}</span> }
                        <Card.Title>{this.props.info.lobby_name}</Card.Title>
                           <Card.Text>
                             {`Start, Enroll Yourself To Win Price Money of ${this.getPriceMoney()} million dollor`}
                        </Card.Text>
                            {this.renderButtons()}
                    </Card.Body>
                </Card>          
            </div>
        )
    }
}
