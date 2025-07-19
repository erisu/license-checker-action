<!--
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
-->

# license-checker-action

This GitHub Action allows you to audit the licenses of the project's NPM dependency tree.

Under the covers, it uses the `license-checker-rseidelsohn` package created by RSeidelsohn.

This Action can take in a configuration file that allows you to define which licenses are allowed and which packages are ignored.

## Example GitHub Action Workflow

```yml
name: Release Auditing

on: [push, pull_request]

jobs:
  test:
    name: Audting Licenses
    runs-on: ubuntu-latest
    steps:
      # Checkout project
      - uses: actions/checkout@v4

      # Setup environment with node
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      # Install node packages
      - name: npm install packages
        run: npm i

      # Check node package licenses
      - uses: erisu/license-checker-action@v1
        with:
          license-config: 'licence_checker.yml'
```

In the above example of GitHub Action Workflow, we are:

1. Checking out the project
2. Setting up node
3. Installing the project's npm packages
4. Running the `license-checker-action` with provided configurations (`licence_checker.yml`)

## Example `license-config` YAML file

```yml
allowed-licenses:
  - Apache-2.0

ignored-packages:
  - spdx-exceptions@2.3.0
```

- `allowed-licenses` - Contains a list of licenses that is define as "Allowed" in your project.
- `ignored-packages` - Contains a list of npm packages that did not contain an "Allowed" license but has been define as acceptable for the project.

## License

  Licensed to the Apache Software Foundation (ASF) under one or more
  contributor license agreements.  See the NOTICE file distributed with
  this work for additional information regarding copyright ownership.
  The ASF licenses this file to You under the Apache License, Version 2.0
  (the "License"); you may not use this file except in compliance with
  the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

## Contribution

If you want to contribute, feel free to branch from main and provide a pull request via Github.
