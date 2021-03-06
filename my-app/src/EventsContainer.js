import './App.css';
import React from 'react';
import EventCard from './EventCard'
import EventsForm from './EventsForm';


class EventsContainer extends React.Component {

  state= {
    eventsForm: false,
}

    handleEventsForm = () => {
    this.setState({
  eventsForm : !this.state.eventsForm
    })
    }
   

    
  render() {

   


    return (
      <div className= 'events' style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
      {this.props.userInfo.id >= 1 ? <button style={{marginTop: 50}} className = 'glow-on-hover' onClick ={() => this.handleEventsForm()}>Create new event</button>: null}
       {this.state.eventsForm ? <EventsForm addEvent = {this.props.addEvent} userInfo={this.props.userInfo}/>:null}
       <br></br>
       {this.props.events.map(event => { return <EventCard event={event} key={event.id} userInfo={this.props.userInfo} deleteEvent={this.props.deleteEvent} /> })}
      </div>
    )
  }
}

export default EventsContainer;
