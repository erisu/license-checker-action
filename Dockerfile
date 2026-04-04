# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# Pin Node.js to a specific minor version line. Allows patch updates for
# bug & security fixes when the image is rebuilt. Alpine version is also
# pinned to improve reproducibility and avoid unexpected OS changes.
FROM node:24.14-alpine3.23

# Create a non-root user and group to follow least-privilege principles.
RUN addgroup -S app && adduser -S app -G app

# Set working directory for the action's code inside the container image
WORKDIR /app

# Copy dependency manifests first.
COPY package.json package-lock.json ./

# Install dependencies deterministically from the lockfile
# --omit=dev: to exclude devDependencies
# --ignore-scripts: prevents execution of lifecycle scripts
RUN npm ci --omit=dev --ignore-scripts

COPY license-checker.js allowed-licenses-groups.json ./

USER app

ENTRYPOINT ["node", "/app/license-checker.js"]
