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
import path from 'node:path';

import { init } from 'license-checker-rseidelsohn';
import { parse } from 'yaml';

const workspace = process.env.GITHUB_WORKSPACE;

console.log('INPUTS:', {
  licenseConfigPath: process.env.INPUT_LICENSE_CONFIG,
  includeASFCategoryA: process.env.INPUT_INCLUDE_ASF_CATEGORY_A,
});

// Check if ASF Category-A licenses should be included.
const rawIncludeASFCategoryA = process.env.INPUT_INCLUDE_ASF_CATEGORY_A;
const includeASFCategoryA = rawIncludeASFCategoryA === 'true' || rawIncludeASFCategoryA === true;

// Getting license config file.
const rawConfig = process.env.INPUT_LICENSE_CONFIG;
let configFile = null;
if (rawConfig && rawConfig !== 'false') {
  const resolved = path.resolve(workspace, rawConfig);
  // Prevent traversal
  if (!resolved.startsWith(workspace)) {
    console.error(`Invalid config path: "${rawConfig}"`);
    exit(1);
  }
  configFile = resolved;
}

const options = {
  start: workspace,
  excludePrivatePackages: true,
  production: true
};

if (!configFile) {
  console.info('No configuration file was provided for the license checker. Will run with no settings.');
} else {
  if (!existsSync(configFile)) {
    console.error('The provided configuration file does not exists.');
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

if (includeASFCategoryA) {
  const jsonPath = new URL('./allowed-licenses-groups.json', import.meta.url);
  const allowedLicensesGroups = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const userAllowedLicenses = options?.excludeLicenses?.split(',') || [];
  const mergedAllowedLicenses = [
    ...userAllowedLicenses,
    ...allowedLicensesGroups['asf-category-a']
  ];

  // filter for unique licenses
  options.excludeLicenses = [...new Set(mergedAllowedLicenses)].toString();
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

init(options, resultParser);
