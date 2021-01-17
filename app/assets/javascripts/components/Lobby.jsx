import React, { Component, useState } from 'react';
import Loader from "./Loader";
import CreateMember from "./CreateMember";
import Member from "./Member";
import {Button, Alert} from 'react-bootstrap';
import ReactDOM from "react-dom";

export default class Lobby extends Component {
    constructor(props){
        super(props);
        this.renderLobby = this.renderLobby.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleClaimAmount = this.handleClaimAmount.bind(this);
        this.startLottery = this.startLottery.bind(this);
        this.state = {
            lobbyDetails : null,
            isLoading : true,
            members: []
        }
    }

    handleStateChange(){
       this.fetchAndRender();
    }

    handleClaimAmount(){
        var self = this;
        var {members, lobbyDetails} = this.state;
        var totalMember = lobbyDetails.lobby_total_member_alloted_seats;
        var entryFee    =  lobbyDetails.entry_fee_per_seat;
        var prizeMoney  =  totalMember * entryFee;
        var cuts        =  prizeMoney * 0.05;
        var wMember     =  members[this.winnerID];
        $.ajax({
            url:'/api/lobby/contest/result',
            method:'POST',
            data:{
                id: lobbyDetails.id,
                member_id: wMember.candidate_id,
                ticket_id: wMember.ticket_id,
                amount: prizeMoney*0.95,
                status: 2,
                cuts
            },
            success: function(responseObj){
                if(responseObj.status){
                    self.section && self.section.remove();
                    window.location.replace('/lottery/dashboard');
                } 
            },
            error: function(){
                self.section && self.section.remove();
                alert('internal Server Error');
            }
        });

        self.section && ReactDOM.render(<Loader />, self.section);
    }

    canBeAddedNewMember(){
        var {lobbyDetails, members} = this.state;
        if(lobbyDetails.lobby_total_member_alloted_seats > members.length){
            return true;
        }
        return false;
    }

    getCost(){
        var {lobbyDetails} = this.state;
        return lobbyDetails.entry_fee_per_seat;
    }

    componentDidMount(){
        this.fetchAndRender();
    }
    getTotalRemaning(){
        var {lobbyDetails, members} = this.state;
        try{
           return lobbyDetails.lobby_total_member_alloted_seats - members.length;
        }catch(err){}
        return Infinity;
    }
    canStartLotter(){
        return this.getTotalRemaning() == 0;
    }
    startLottery(){
        var {members, lobbyDetails} = this.state;
        var self = this;
        var min = 0;
        var max = lobbyDetails.lobby_total_member_alloted_seats - 1;
        var winnerIndex = getRandomIndex(min, max);

        this.winnerID = winnerIndex;
        
        function getRandomIndex(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        function _getDummyArea(){
            self.section = document.createElement('section');
            (document.getElementsByTagName('body')[0]).appendChild(self.section);
            self.section.classList.add('lottery_info_section');
            return self.section;
        }

        ReactDOM.render(<WinnerBadge ticket_id={members[winnerIndex].ticket_id} handleClaimAmount={this.handleClaimAmount} />, _getDummyArea());
    }
    fetchAndRender(){
        var props = this.props;
        var self = this;
        $.ajax({
            url: `/api/lobby/fetch`,
            method: 'POST',
            data: {id: props.id},
            success: function(response){
                if(response.status){
                    self.setState({
                        lobbyDetails : response.details.lobby_details,
                        members:  response.details.members,
                        isLoading: false
                    })
                }else{
                    alert('Internal Server Error , Please try Again'); 
                }
            },
            error: function(error){
                alert('Internal Server Error , Please try Again');
            }
        })
    }

    renderMember(){
        var {members} = this.state;
        return members.map((member, i) => {
            return (<Member info={member} key={member.candidate_id} />)
        });
    }

    renderLobby(){
        var count = this.getTotalRemaning();
        var isDisable = this.canStartLotter();
        return(
            <React.Fragment>
                <div className="col-sm-12 col-md-12 col-lg-12 lottery_cont">
                    <Button variant="primary" disabled={!isDisable} className="lottery btn btn-primary col-sm-5 col-md-5 col-lg-5" onClick={this.startLottery}>Start Lottery</Button>
                    {!isDisable && <span className="d-inline-block col-sm-6 col-md-6 col-lg-6">
                        To Start Lottery, {count} member need to add
                    </span>
                    }
                </div>
                <div id={this.props.id} className="row">
                   {this.canBeAddedNewMember() && <CreateMember cost={this.getCost()} id={this.props.id} handleStateChange={this.handleStateChange} />}
                   {this.renderMember()}
                </div>
            </React.Fragment>
        )

    }
    
    render() {
        return (
            <React.Fragment>
                { this.state.isLoading ?  <Loader /> : this.renderLobby()}
            </React.Fragment>
        )
        
    }
}

function WinnerBadge(props) {
    const [show, setShow] = useState(true);
    
    function handleClick(){
        setShow(false)
        var handleClaimAmount = props.handleClaimAmount;
        handleClaimAmount && handleClaimAmount();
    }
    
    return (
      <>
        <Alert show={show} variant="success">
          <img src="/images/congratulation.jpg" className="lottery_info_img">
          </img>
          <div className="lottery_info">
            <span>Ticket Number </span>
            <br />
            <div className="lottery_info_block">{props.ticket_id}</div>
            <span>is winner</span>
          </div>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => handleClick()} variant="outline-success">
              Claim Amount
            </Button>
          </div>
        </Alert>
      </>
    );
  }
