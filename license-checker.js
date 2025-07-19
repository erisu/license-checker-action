/*
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
 */

import { exit } from 'node:process';
import { existsSync, readFileSync } from 'node:fs';

import checker from 'license-checker-rseidelsohn';
import { parse } from 'yaml';

const [ workspace, configFile ] = process.argv.slice(2);

if (!existsSync(workspace)) {
  console.error('Workspace does not exist:', workspace);
  exit(1);
}

const options = {
  start: workspace,
  excludePrivatePackages: true,
  production: true
};

if (!configFile) {
  console.info('No configuration file was provided for the licese checker. Will run with no settings.');
} else {
  const hasConfigFile = existsSync(configFile);

  if (!hasConfigFile) {
    console.info('The provided configuration file does not exists.');
    exit(1);
  }

  const configFileRawYml = readFileSync(configFile, 'utf-8');
  const config = parse(configFileRawYml);

  if (config?.['allowed-licenses']) {
    options.excludeLicenses = config['allowed-licenses'].toString();
  }

  if (config?.['ignored-packages']) {
    options.excludePackagesStartingWith = config['ignored-packages'].join(';');
  }
}

function resultParser(err, packages) {
  const formatted = {};
  // Sort the packages by grouping by licenses
  Object.keys(packages).forEach(pkg => {
    const license = packages[pkg].licenses;
    if(!formatted[license]) {
      formatted[license] = [];
    }
    formatted[license].push(pkg);
  });

  if(Object.keys(packages).length > 0) {
    console.error(JSON.stringify(formatted, null, 2));
    exit(1);
  } else {
    console.log('All packages contain acceptable licenses.');
  }
}

checker.init(options, resultParser);
