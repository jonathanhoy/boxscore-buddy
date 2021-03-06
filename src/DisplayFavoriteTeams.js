import React, {Component} from 'react';
import firebase from './firebase';
import NoFavoriteTeams from './NoFavoriteTeams';
import swal from 'sweetalert';

class DisplayFavoriteTeams extends Component {
  removeTeam = (e) => {
    const teamName = e.target.getAttribute('data-team-name');
    const firebaseKey = e.target.id;
    const teamRef = firebase.database().ref(`/${this.props.user.uid}/${firebaseKey}`);
    teamRef.remove();
    swal(`${teamName} has been removed from your favorite teams.`);
  }
  displayFavoriteTeams = () => {
    return (
      Object.entries(this.props.favoriteTeams).map((team) => {
        return (
          <div className="team" key={team[0]} id={team[0]}>
            <img src={team[1].teamBadge} alt={team[1].teamName} className="team__image" />
            <h2 className="team__name">{team[1].teamName}</h2>
            <button
              onClick={this.removeTeam}
              id={team[0]}
              data-team-name={team[1].teamName}
              className="team__remove"
              >
              &times;
            </button>
          </div>
        )
      })
    )
  }
  render() {
    return (
      <div>
        <h2 className="section-title">My teams</h2>
        <section className={this.props.favoriteTeams && "team-grid"}>
          {
            this.props.favoriteTeams
            ?
            this.displayFavoriteTeams()
            :
            <NoFavoriteTeams />
          }
        </section>
      </div>
    )
  }
}

export default DisplayFavoriteTeams;