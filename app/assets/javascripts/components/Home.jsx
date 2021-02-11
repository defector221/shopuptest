import React, { Component } from 'react'
import Loader from "./Loader";
import LobbyTile from "./LobbyTile";
import SearchBar from "./SearchBar";
import CreateLobbyButton from "./CreateButton";
import {Button} from 'react-bootstrap';
import {Link} from "react-router-dom";

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            lobbies : [],
            isLoading :true,
            searchKey: ""
        }
        this.searchByName = this.searchByName.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentDidMount(){
        fetch('/api/lobby/all')
        .then(res => res.json())
        .then(lobbiesRes => {
            this.setState({
                lobbies: lobbiesRes.lobbies,
                isLoading : false
            })
        })
    }

    handleStateChange(id, status){
        var lobbies = this.state.lobbies;
        var newLobbies = [];
        lobbies.forEach(function(lobby){
            if(lobby.id == id){
                lobby.lobby_status = status;
            }
            newLobbies.push(lobby);
        })
        this.setState({
            lobbies: newLobbies
        });
    }

    renderLobbies(){
        var lobbies = this.state.lobbies;
        var self = this;
        var list =  lobbies.filter(function(lobby){
            return true;
        }).map((lobby, i) => {
           return (<LobbyTile info={lobby} key={lobby.id} handleStateChange={this.handleStateChange}/>)
        });

        return list.length >= 1 ? list : "No Record Found";
    }

    isAllowedToGo(){
        var lobbies = this.state.lobbies;
        for(let i=0; i< lobbies.length; i++){
            if(lobbies[i].lobby_status){
                return true;
            }
        }
        return false;
    }

    searchByName(searchKey) {
        this.setState({
            searchKey
        })
    }

    filterAndRenderLobbies(){
        var lobbies = this.state.lobbies;
        var {searchKey} = this.state;
        var self = this;
        var list =  lobbies.filter(function(lobby){
            return self.state.searchKey.length >=1 ? lobby.lobby_name.indexOf(self.state.searchKey) != -1 : true;
        }).map((lobby, i) => {
           return (<LobbyTile info={lobby} key={lobby.id} handleStateChange={this.handleStateChange}/>)
        });

        return list.length >= 1 ? list : "No Search Result Found";
    }

    shouldComponentUpdate(prevstate){
        return true;
    }

    render() {
        return (
            <React.Fragment>
                <div className="books-container-flex">
                    <img src="/images/banner.jpg" />
                </div>
                <div>
                    {this.state.isLoading ? <Loader /> : (
                        this.props.filter ? this.renderLobbies() : (<React.Fragment>
                            <div className="controls">
                                <Link to={`/lottery/dashboard`}>
                                  <Button disabled={!this.isAllowedToGo()} className="dashboard_btn">DashBoard</Button>
                                </Link>
                                <SearchBar keyword={this.state.searchKey} setKeyword={this.searchByName}/> 
                            </div>
                            <div>
                                <CreateLobbyButton />
                                {this.filterAndRenderLobbies()}
                            </div>
                        </React.Fragment>
                        )
                    )}
                </div>
            </React.Fragment>
        )
    }
}


