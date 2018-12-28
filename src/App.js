import React, { Component } from 'react';
import firebase from './firebase';
import { BrowserRouter as Router, Route, NavLink, Redirect } from 'react-router-dom';
import './styles/styles.scss';

import DisplayLeagues from './DisplayLeagues';
import DisplayFavoriteTeams from './DisplayFavoriteTeams';
import DisplaySchedules from './DisplaySchedules'

const moment = require('moment');
moment().format();
const currentDate = moment().format('dddd MMMM D, YYYY');

class App extends Component {
  constructor() {
    super();
    this.state = {
      favoriteTeams: {},
    }
  }
  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on('value', (snapshot) => {
      this.setState({
        favoriteTeams: snapshot.val()
      })
    });
  }
  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <header className="header">
              <div className="wrapper">
                <h1 className="header__title">Sport Schedules</h1>
                <nav className="nav">
                  <NavLink to="/schedules" className="nav__link" activeClassName="active">Schedules</NavLink>
                  <NavLink to="/my-teams" className="nav__link" activeClassName="active">My Teams</NavLink>
                  <NavLink to="/leagues" className="nav__link" activeClassName="active">Leagues</NavLink>
                </nav>
                <p className="header__date">{currentDate}</p>
              </div>
            </header>
            <main className="main">
              <div className="wrapper">
                  <Route exact path='/' render={() => <Redirect to='/schedules' /> } />
                  <Route path="/schedules" render={(props) => <DisplaySchedules {...props} favoriteTeams={this.state.favoriteTeams} /> } />
                  <Route path="/my-teams" render={(props) => <DisplayFavoriteTeams {...props} favoriteTeams={this.state.favoriteTeams} /> } />
                  <Route path="/leagues" render={(props) => <DisplayLeagues {...props} favoriteTeams={this.state.favoriteTeams} /> } />
              </div>
            </main>
          </div>
          <footer className="footer">
            <div className="wrapper">
              <p>&copy; Jonathan 2018 | <a href="https://jonathanhoy.com/" className="portfolio-link">Back to Portfolio</a></p>
              <p>API information courtesy of <a href="https://www.thesportsdb.com/api.php">TheSportsDB</a></p>
            </div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;