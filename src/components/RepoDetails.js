import React, { Component } from 'react';
import UserStat from './UserStat';

export default class RepoDetails extends Component {
  render() {
    var { repos, repo } = this.props;
    var repoObject = repos.find(el => {
      return el.name === repo
    });

    return (
      <section className="App-section">
        <div className="UserProfile">
          <div className="UserProfile-content">
            <h3>Showing all contributors for: </h3>
            <p className="UserProfile-name"><strong>{repo}</strong></p>
            <p className="UserProfile-bio">{repoObject.description}</p>
          </div>
        </div>
        <ol className="Stats">
          {repoObject.contributors.map(contributor => {
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
                contributors={repoObject.contributors}
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
      </section>
    );
  }
}
