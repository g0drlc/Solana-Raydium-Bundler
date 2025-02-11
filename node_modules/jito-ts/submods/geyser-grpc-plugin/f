#!/usr/bin/env bash
# Builds this program in a container.
# Useful for running on machines that might not have cargo installed but can run docker/podman (Flatcar Linux).
set -eux

# Comma delimited list of feature flags passed to the geyser-grpc-plugin/server crate e.g. jito-solana.
FEATURES=${1:-""}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

GIT_SHA="$(git describe --always --dirty)"

echo "${GIT_SHA}"

DOCKER_CMD=${DOCKER_CMD:-"docker"}
PODMAN_CMD=${PODMAN_CMD:-"podman"}
CONTAINER_CMD="unknown"
if ! command -v "${PODMAN_CMD}" >/dev/null 2>&1; then
  if command -v "${DOCKER_CMD}" >/dev/null 2>&1; then
    export DOCKER_BUILDKIT=1
    CONTAINER_CMD=${DOCKER_CMD}
  else
    echo "could not find a container runtime executable!"
    echo "please make sure ${PODMAN_CMD} or ${DOCKER_CMD} is installed and in the path variable."
    exit 1
  fi
else
  CONTAINER_CMD=${PODMAN_CMD}
fi

echo "container runtime command is: ${CONTAINER_CMD}"

${CONTAINER_CMD} build \
  --build-arg ci_commit="$GIT_SHA" \
  -t geyser-grpc-plugin \
  -f Dockerfile . \
  --progress=plain \
  --build-arg features="$FEATURES"

# Creates a temporary container, copies geyser-grpc-plugin built inside container there and
# removes the temporary container.
${CONTAINER_CMD} rm temp || true
${CONTAINER_CMD} container create --name temp geyser-grpc-plugin

# Outputs the binary to $SCRIPT_DIR/container-output
mkdir -p "${SCRIPT_DIR}"/container-output
${CONTAINER_CMD} container cp temp:/geyser-grpc-plugin/container-output "${SCRIPT_DIR}"/
${CONTAINER_CMD} rm temp
