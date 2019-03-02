import React, { Component } from 'react';
import { Router } from '@reach/router';
import Contributors from './components/Contributors';
import UserProfile from './components/UserProfile';
import RepoDetails from './components/RepoDetails';
import axios from 'axios';
import { pick, cloneDeep } from 'lodash';
import './css/reset.css';
import './css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.API_KEY = '';
    this.url = 'https://api.github.com/users/angular/repos';
    this.axiosInstance = axios.create({
      headers: { 'Authorization': `bearer ${this.API_KEY}`},
    });
    this.state = {
      contributors: [],
      loading: true,
      repos: [],
      usersSortedAscending: false,
    }
  }

  sort(a, b, rule) {
    return (() => b[rule] - a[rule] )();
  }

  handleSortButtonClicked = (rule) => {
    var sortedContributors = cloneDeep(this.state.contributors);

    if (!this.state.usersSortedAscending) {
      sortedContributors.sort((a, b) => this.sort(a, b, rule));
      this.setState({ usersSortedAscending: true });
    } else {
      sortedContributors.sort((a, b) => this.sort(b, a, rule));
      this.setState({ usersSortedAscending: false });
    }

    this.setState({ contributors: sortedContributors });
  }

  componentDidMount() {
    var contributorIds = [];
    var contributorsWithDups = [];
    var contributors = [];
    var contributorPromises = [];
    var repos = [];
    var repoPromises = [];

    // Get N number of repos by page number
    // pull off only necessary properties of each repo object
    //  and add them to repos array
    var getNreposByPage = (number, page) => {
      return this.axiosInstance
        .get(`${this.url}?per_page=${number}&page=${page}`)
        .then(res => {
          var responseTrimmed = [...res.data].map(repo => {
            return pick(repo, [
              'contributors',
              'contributors_url',
              'description',
              'name',
            ]);
          });

          repos.push(...responseTrimmed);
        })
    }

    getNreposByPage(10, 1)
    // getNreposByPage(100, 1)
    // .then(getNreposByPage(100, 2))
    .then(() => {
      // Get contributors for each repo
      // pull off only the necessary properties of each contributor and
      // add them to the contributors property of each repo object
      repoPromises = repos.map(repo => {
        return new Promise((resolve) => {
          this.axiosInstance
            .get(repo.contributors_url)
            .then(res => {
              if (Array.isArray(res.data)) {
                var responseTrimmed = [...res.data].map(repo => {
                  return pick(repo, [
                    'avatar_url',
                    'bio',
                    'contributions',
                    'followers',
                    'gists',
                    'id',
                    'login',
                    'name',
                    'repos',
                    'url',
                  ]);
                });

                repo.contributors = responseTrimmed;
                contributorsWithDups.push(...responseTrimmed);
              }
              resolve();
            })
        });
      });
    })
    .then(() => {
      return Promise.all(repoPromises)
        .then(() => {
          // Build up the contributors array with only unique contributor objects
          contributorsWithDups.forEach(el => {
            if (el && !contributorIds.includes(el.id)) {
              contributorIds.push(el.id);
              contributors.push(el);
            }
          });
        });
    })
    .then(() => {
      // Get additional details for each contributor
      // and add them to the contributor object
      contributorPromises = contributors.map(contributor => {
        return new Promise((resolve) => {
          this.axiosInstance
            .get(contributor.url)
            .then(res => {
              contributor.bio = res.data.bio;
              contributor.name = res.data.name;
              contributor.followers = res.data.followers;
              contributor.gists = res.data.public_gists;
              contributor.repos = res.data.public_repos;
              resolve();
            })
        });
      })
    })
    .then(() => {
      return Promise.all(contributorPromises)
        .then(() => {
          this.setState({
            repos,
            loading: false,
            contributors,
          });
        })
    })
    .catch(err => {
      this.setState({ loading: false });
      console.error(err);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="https://avatars0.githubusercontent.com/u/139426?s=200&v=4" className="App-logo" alt="@Angular" />
          <div className="App-title-container">
            <h1 className="App-title">Angular Rank</h1>
            <h2 className="App-subtitle">Rank Angular repositories and contributors</h2>
          </div>
        </header>
        <Router className="App-view-controller">
          <Contributors
            handleSortButtonClicked={this.handleSortButtonClicked}
            loading={this.state.loading}
            path="/"
            contributors={this.state.contributors}
          />
          <UserProfile
            path="/users/:username"
            contributors={this.state.contributors}
            repos={this.state.repos}
          />
          <RepoDetails
            path="/repos/:repo"
            repos={this.state.repos}
          />
        </Router>
        <footer className="App-footer">
          <p>Designed and coded by Paul Garcia</p>
        </footer>
      </div>
    );
  }
}

export default App;
