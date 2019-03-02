import React, { Component } from 'react';
import { Link } from '@reach/router';
import RepoStat from './RepoStat';
import '../css/Btn.css';
import '../css/UserProfile.css';
import '../css/Stats.css';
import '../css/Stat.css';

export default class UserProfile extends Component {
  render() {
    var {
      username,
      contributors,
      repos
    } = this.props;
    var contributor = contributors.find(el => {
      return el.login === username;
    });
    var contributedRepos = [];

    repos.forEach(repo => {
      repo.contributors.forEach(contributor => {
        if (contributor.login === username) {
          contributedRepos.push(repo);
        }
      });
    });

    return (
      <section className="App-section">
        <div className="UserProfile">
          <img className="UserProfile-img" src={contributor.avatar_url} alt=""/>
          <div className="UserProfile-content">
            <p className="UserProfile-name"><strong>{contributor.name}</strong></p>
            <p className="UserProfile-bio">{contributor.bio}</p>
            <Link
              to="/"
              className="Btn"
            >
              View All Contributors
            </Link>
          </div>
        </div>
        <p>{contributor.name} has contributed to these Angular repos:</p>
        <ul>
          {contributedRepos.map(repo => {
            return (
              <RepoStat
                name={repo.name}
                key={repo.name}
              />
            )
          })}
        </ul>
      </section>
    );
  }
}
