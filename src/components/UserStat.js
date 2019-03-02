import React, { Component } from 'react';
import { Link } from '@reach/router';

export default class UserStat extends Component {
  render() {
    var {
      login,
      contributions,
      contributors,
      gists,
      id,
      repos,
      followers,
    } = this.props;

    return (
      <Link
        to={`/users/${login}`}
        contributors={contributors}
      >
        <li className="Stat">
          <img
            src={`https://avatars3.githubusercontent.com/u/${id}?s=60&v=4`}
            className="Stat-img"
            alt={`${login}`}
          />
          <div className="Stat-text">
            <p><strong>{login}</strong></p>
            <p>
              {contributions} <span className="Stat-text-small">Contributions </span>
              {gists} <span className="Stat-text-small">gists</span>
            </p>
            <p>
              {repos} <span className="Stat-text-small">repositories </span>
              {followers} <span className="Stat-text-small">followers</span>
            </p>
          </div>
        </li>
      </Link>
    );
  }
}
