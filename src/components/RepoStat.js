import React, { Component } from 'react';
import { Link } from '@reach/router';

export default class RepoStat extends Component {
  render() {
    var { name } = this.props;

    return(
      <Link
        to={`/repos/${name}`}
      >
        <li
          className="Stat Repo"
        >
          {name}
        </li>
      </Link>
    );
  }
}
