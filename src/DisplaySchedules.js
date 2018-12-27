import React, {Component} from 'react';
import NoFavoriteTeams from './NoFavoriteTeams';
import Axios from 'axios';
import firebase from './firebase';

// moment.js to fix date issues
const moment = require('moment');
moment().format();

class DisplaySchedules extends Component {
  componentDidMount() {
    this.updateSchedules();
  }
  updateSchedules = () => {
    return (
      Object.entries(this.props.favoriteTeams)
        .map((team) => {
          const firebaseKey = team[0];
          const teamID = team[1].teamID;
          Axios.get(`https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=${teamID}`, {
          }).then((res) => {
            if (res.data.events !== null) {
              const upcomingGames = res.data.events.map((game) => {
                const regDate = moment(`${game.dateEvent}`, 'YYYY-MM-DD').format('dddd MMMM D, YYYY');
                const nbaDate = moment(`${game.dateEvent} ${game.strTime}`, 'YYYY-MM-DD HH:mm').subtract(5, 'hours').format('dddd MMMM D, YYYY');
                if (game.strLeague === 'NHL') {
                  return [regDate, game.strHomeTeam, game.strAwayTeam]
                } else if (game.strLeague === 'NBA') {
                  return [nbaDate, game.strAwayTeam, game.strHomeTeam]
                } else {
                  return [regDate, game.strAwayTeam, game.strHomeTeam]
                }
              });
              const teamRef = firebase.database().ref(`/${firebaseKey}/teamSchedule`);
              teamRef.set(upcomingGames);
            }
          })
        })
    )
  }
  displaySchedules = () => {
    return (
      <div className="schedule">
        {
          Object.entries(this.props.favoriteTeams).map((team) => {
            return (
              <div
                key={team[0]}
                className="schedule__team-card"
                style={{
                  background: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(${team[1].teamBadge})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                <div className="schedule__team-info">
                  <h2 className="schedule__team-name">{team[1].teamName}</h2>
                  <p className="schedule__team-league">{team[1].teamLeague}</p>
                </div>
                <div>
                  {
                    team[1].teamSchedule
                    ?
                    team[1].teamSchedule.map((game) => {
                      const date = game[0];
                      const awayTeam = game[1];
                      const homeTeam = game[2];
                      return (
                        <div key={date} className="event">
                          <p>
                            <span className="event__away-team">{awayTeam}</span>
                            {team[1].teamName === awayTeam ? ' @ ' : ' vs. '}
                            <span className="event__home-team">{homeTeam}</span>
                          </p>
                          <p className="event__date">{date}</p>
                        </div>
                      )
                    })
                    :
                      this.offseason()
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
  offseason = () => {
    return (
      <div className="event">
        <p className="event__offseason">This team is currently offseason. Please check back later.</p>
      </div>
    )
  }
  render() {
    return (
      <div>
        <h2 className="section-title">Schedules</h2>
        {
          this.props.favoriteTeams
          ?
          this.displaySchedules()
          :
          <NoFavoriteTeams />
        }
      </div>
    )
  }
}
export default DisplaySchedules;