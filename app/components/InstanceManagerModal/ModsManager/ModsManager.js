import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Link from 'react-router-dom/Link';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import { List, Icon, Button, Radio } from 'antd';
import { PACKS_PATH } from '../../../constants';
import ModsList from './ModsBrowser/ModsList';
import LocalMods from './LocalMods/LocalMods';
import ModPage from './ModsBrowser/ModPage';

import styles from './ModsManager.scss';

type Props = {};

class ModsManager extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isForge: false,
      version: null,
      checkingForge: true
    };
  }

  componentDidMount = async () => {
    try {
      const config = JSON.parse(
        await promisify(fs.readFile)(
          path.join(PACKS_PATH, this.props.match.params.instance, 'config.json')
        )
      );

      this.setState({ version: config.version });

      if (config.forgeVersion !== null) {
        this.setState({ isForge: true });
      }
    } catch (err) {
      log.error(err.message);
    } finally {
      this.setState({ checkingForge: false });
    }
  };

  render() {
    if (this.state.checkingForge) {
      return null;
    }
    if (!this.state.isForge) {
      return (
        <div>
          <h2 style={{ textAlign: 'center', margin: 20 }}>
            This instance does not allow mods. <br /> Install forge if you want
            to use them
          </h2>
        </div>
      );
    }
    return (
      <div style={{ width: '100%', maxWidth: '800px', height: '100%', overflow: 'hidden' }}>
        <Switch>
          <Route
            path="/editInstance/:instance/mods/local/:version"
            component={LocalMods}
          />
          <Route
            path="/editInstance/:instance/mods/browse/:version/:mod"
            component={ModPage}
          />
          <Route
            path="/editInstance/:instance/mods/browse/:version"
            component={ModsList}
          />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ModsManager);
