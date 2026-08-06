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

# Development

## Setup

1. Install Node.js and npm.
   
   It is recommended to install at least the versions specified in the `engines` field of `package.json`.
   
   To more closely match with what is executed in GitHub Actions, use the versions specified in the `Dockerfile`.

2. Install Docker

    Docker must be installed and running if you are making changes to the `Dockerfile` or want to test using the same Docker image that is used in GitHub Actions.

3. Install npm dependencies.

    ```bash
    npm ci
    ```

## Unit Testing

There are currently no unit tests at the moment and is one of the TODO items.

## Linting

During development, you should run the linter to ensure that the code follows our coding standards:

```bash
npm run lint
```

### Fixing Lint Issues

In many cases, lint warnings can be fixed automatically with:

```bash
npm run lint:fix
```

If an issue cannot be resolved automatically, it will require manual review and correction.


## Testing Docker Build Locally

This action can be tested locally by building the Docker image and running it against a target directory.

1. Ensure Docker is installed and running.
2. Clone this repository and change your working directory to the cloned repository.
3. Build the Docker image:

  ```bash
  docker build -t license-checker-action .
  ```

4. Navigate to the target directory you want to analyze.
5. Run the image:

  ```bash
  docker run --rm -t \
    --cap-drop=ALL \
    --security-opt=no-new-privileges \
    -e GITHUB_WORKSPACE=/workspace \
    -e INPUT_LICENSE_CONFIG=false \
    -e INPUT_INCLUDE_ASF_CATEGORY_A=false \
    -v "$(pwd):/workspace:ro" \
    license-checker-action
  ```