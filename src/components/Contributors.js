import React, { Component } from 'react';
import Loader from './Loader';
import UserStat from './UserStat';
import '../css/App.css';
import '../css/Btn.css';
import '../css/Stats.css';
import '../css/Stat.css';

export default class Contributors extends Component {
  render() {
    var {
      contributors,
      loading,
      handleSortButtonClicked
    } = this.props;

    return (
      <section className="App-section">
        <h3>Showing all contributors</h3>
        {!!contributors.length &&
          <div>
            <p>Sort by:</p>
            <button className="Btn" onClick={() => handleSortButtonClicked('contributions')}>contributions</button>
            <button className="Btn" onClick={() => handleSortButtonClicked('followers')}>Followers</button>
            <button className="Btn" onClick={() => handleSortButtonClicked('repos')}>Repositories</button>
            <button className="Btn" onClick={() => handleSortButtonClicked('gists')}>Gists</button>
          </div>
        }
        <ol className="Stats">
          {contributors.map(contributor => {
            var {
              contributions,
              followers,
              gists,
              id,
              login,
              repos,
            } = contributor;

            return (
              <UserStat
                login={login}
                contributors={contributors}
                contributions={contributions}
                gists={gists}
                repos={repos}
                followers={followers}
                id={id}
                key={id}
              />
            )
          })}
        </ol>
        {loading &&
          <Loader/>
        }
      </section>
    );
  }
}
