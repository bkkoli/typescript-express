#!/bin/bash
NODE_DIRS=("required-services/oss/oss01" "required-services/oss/oss02" "required-services/oss/oss03")
SNAPSHOT_NODE_DIRS=("required-services/oss-snapshot/oss01" "required-services/oss-snapshot/oss02" "required-services/oss-snapshot/oss03")

# Make oss node data, log dir
for NODE_DIR in ${NODE_DIRS[@]}
do
    mkdir -p $PWD/$NODE_DIR/data $PWD/$NODE_DIR/logs
done

# Make snapshot dir
for SNAPSHOT_NODE_DIR in ${SNAPSHOT_NODE_DIRS[@]}
do
    mkdir -p $PWD/$SNAPSHOT_NODE_DIR
done

cd $PWD/required-services && docker-compose up -d