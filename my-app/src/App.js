import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Signup from './Signup'
import Login from './Login'
import NavBar from './Navbar'
import Home from './Home'
import BikeContainer from './BikeContainer'
import SkatesContainer from './SkatesContainer'
import Cart from './Cart'
import Profile from './Profile'
import MapContainer from './MapContainer'
import EventsContainer from './EventsContainer'
import PurchaseContainer from './PurchaseContainer'
import BoardContainer from './BoardContainer'
import ChatBox from './ChatBox'
import ChatStore from './ChatStore';
import 'bootstrap/dist/css/bootstrap.min.css'



class App extends React.Component {

 
  state = {
    userInfo: [],
    events: [],
    bikes: [],
    skates: [],
    skateBoards: [],
    cart: [],
    purchases: [],
    items: [],
    
  }
 
  componentDidMount() {
    fetch('http://localhost:3000/api/v1/items', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.token}`
      }
    })
      .then(res => res.json())
      .then(items => this.setState({
        items: items,
        bikes: items.filter(item => item.kind === "bike"),
        skates: items.filter(item => item.kind === "skates"),
        skateBoards: items.filter(item => item.kind === "skateboard")
      })
      )
      fetch('http://localhost:3000/api/v1/events', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.token}`
        }
      })
        .then(res => res.json())
        .then(events=> this.setState({
          events: events
        })
        )
  }

  



  logOut = () => {
    localStorage.clear()
    this.setState({
      userInfo: [],
    })
  }   



  signup = (e) => {
    e.preventDefault()

    fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: e.target[0].value,
        password: e.target[1].value
      })
    })
      .then(res => res.json())
      .then(console.log)
      alert("Succesfully signed up")
  }


  login = (e) => {
    e.preventDefault()

    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: e.target[0].value,
        password: e.target[1].value
      })
    })
      .then(res => res.json())
      .then(userInfo => {
        localStorage.token = userInfo.token
        if (userInfo.token) {
          this.setState({
          userInfo: userInfo.user,
          purchases: userInfo.user.purchases
          })
          alert("Welcome back")
          console.log(userInfo.user)
        }
      })
  }
  


  

  deleteEvent = (itemObj) => {
    
    let deletedEventArr = this.state.events.filter(item => item.id !== itemObj)
    
    fetch(`http://localhost:3000/api/v1/events/${itemObj}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.token}`,
        "Content-Type": "application/json"
      },
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          events: deletedEventArr
        })

      })
  }

  addItem = (itemObj) => {
    alert("item added to cart")
    let newCartArray = [...this.state.cart, itemObj]
    this.setState({ cart: newCartArray })
    
  
  }
  
  addEvent = (eventObj) => {
    let newEventArray = [...this.state.events, eventObj]
    this.setState({ events: newEventArray })
  
  }
  addPurchase = (perchObj) => {
    alert("item purchased")
    let newPurchArray = [...this.state.purchases, perchObj]
    this.setState({ purchases: newPurchArray })
  
  }


  updateProfile= (updatedProfile) => {
    this.setState({userInfo: updatedProfile})
  }
  
  deleteItem = (itemObj) => {
    let deletedCartArr = this.state.cart.filter(item => item.id !== itemObj)
    this.setState({
              cart: deletedCartArr
            })
  }
  render() {

  

    return (
      <div>
        <Router>
        <NavBar />
          <Switch>
            <Route path ='/' exact component = {Home}/>
            <Route path = '/login' >
              <Login login= {this.login}/>
              <Signup signup={this.signup} />
              <div  style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
              {this.state.userInfo.id >= 1 ? <button className ="glow-on-hover" onClick={this.logOut}>Logout</button>: null}
              </div>
            </Route>
            <Route path = '/bikes' >
              <BikeContainer bikes={this.state.bikes} addItem={this.addItem} cart={this.state.cart} userInfo={this.state.userInfo}/>
            </Route>
            <Route path = '/skateboards' >
             <BoardContainer boards={this.state.skateBoards} addItem={this.addItem} cart={this.state.cart} userInfo={this.state.userInfo}/>
            </Route>
            <Route path = '/skates' >
              <SkatesContainer skates={this.state.skates} addItem={this.addItem} cart={this.state.cart} userInfo={this.state.userInfo}/>
            </Route>
            <Route path = '/cart' >
             <Cart cart={this.state.cart} userInfo={this.state.userInfo} purchaseItem={this.addPurchase} deleteItem={this.deleteItem}/>
            </Route>
            <Route path = '/profile' >
             <Profile profile={this.state.userInfo} updateProfile={this.updateProfile}/>
            </Route>
            <Route path = '/map' >
             <MapContainer events ={this.state.events}/>
            </Route>
            <Route path = '/events' >
             <EventsContainer events ={this.state.events} userInfo={this.state.userInfo} addEvent ={this.addEvent} deleteEvent={this.deleteEvent}/>
            </Route>
            <Route path = '/purchase' >
            {this.state.userInfo.id >= 1 ?  <PurchaseContainer purchases={this.state.purchases} items = {this.state.items} userInfo={this.state.userInfo} />:null}
            </Route>
            <Route path = '/chat' >
              <ChatStore  userInfo={this.state.userInfo}>
              <ChatBox />
              </ChatStore>
            </Route>
            
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
