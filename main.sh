#!/bin/bash

#BASH CONFIGURATION
# Enable colored log
export TERM=xterm-256color

DOCKER_FABER_BACK_NAME="faber"
DOCKER_ALICE_BACK_NAME="alice"
DOCKER_ACME_BACK_NAME="acme"
DOCKER_FABER_FRONT_NAME="front_faber_1"
DOCKER_ALICE_FRONT_NAME="front_alice_1"
DOCKER_ACME_FRONT_NAME="front_acme_1"
BACK_PATH="back/demo"
BLOCKCHAIN_PATH="blockchain"
FRONT_PATH="front"

# Check whether a given container (filtered by name) exists or not
function exists_Container(){
	containerName=$1
	if [ -n "$(docker ps -aq -f name=$containerName)" ]; then
	    return 0 #true
	else
		return 1 #false
	fi
}

#stop and remove a container with its associated volumes 
function remove_container(){
	containerName=$1
	if exists_Container $containerName; then
		echo "Stopping previously deployed start containers..."
		docker stop $containerName;
		docker rm -v $containerName;
	fi
}


# Stop and remove blockchain containers
function remove_blockchain {
   dockerContainers=$(docker ps -a | awk ' $2~/von/ || $2~/dev-peer/ {print $1}');
   log dockerContainers
    if [ "$dockerContainers" != "" ]; then
        log "Deleting Blockchain existing docker containers ...";
        docker rm -f $dockerContainers > /dev/null;
    fi
}


#stop and remove back containers 
function remove_back(){
	log "Deleting Faber Back existing docker containers ...";
	remove_container $DOCKER_FABER_BACK_NAME;
   log "Deleting Acme Back existing docker containers ...";
	remove_container $DOCKER_ACME_BACK_NAME;
   log "Deleting Alice Back existing docker containers ...";
	remove_container $DOCKER_ALICE_BACK_NAME;
}

#stop and remove front containers
function remove_front(){
	log "Deleting Faber Front existing docker containers ...";
	remove_container $DOCKER_FABER_FRONT_NAME;
   log "Deleting Acme Front existing docker containers ...";
	remove_container $DOCKER_ACME_FRONT_NAME;
   log "Deleting Alice Front existing docker containers ...";
	remove_container $DOCKER_ALICE_FRONT_NAME;
}


#Deploying functions 
function deploy_blockchain(){
	cd $BLOCKCHAIN_PATH;
	./manage up;
	cd ..;	
}

function deploy_back(){
	log " Start deploying Back Containers ...."
	cd $BACK_PATH;
	./run_demo $DOCKER_FABER_BACK_NAME --revocation;	
	./run_demo $DOCKER_ALICE_BACK_NAME;
	./run_demo $DOCKER_ACME_BACK_NAME;	
	log " End deploying Back Containers ...."
	cd ../../
}

function deploy_front(){
	log " Start deploying Front Containers ...."
	cd $FRONT_PATH;
	./manage up;
	log " End deploying Front Containers ...."
	cd ..	
}

#Remove and Deploy all containers
function remove_all(){
	echo "remove old containers starts ..."
	remove_blockchain;
	remove_back;
	remove_front;
}
function launch_all(){
	deploy_blockchain;
	sleep 10;
	deploy_back;
	deploy_front;
}

function deploy_all(){
	remove_all;
	launch_all;
}

function build_all(){
	log " Start Building all projects ...."
	cd $BLOCKCHAIN_PATH;
	./manage build;
	cd ..;	
	cd $FRONT_PATH;
	./manage build;
	log " End Building all projects ...."
	cd ..	
}


function build_blockchain(){
	log " Start Building the blockchain project ...."
	cd $BLOCKCHAIN_PATH;
	./manage build;
	log " End Building the blockchain project ...."
	cd ..;	
}

function build_back(){
	log " Start Building the back project ...."
	log " The back project does not need build ...."
	log " End Building the back project ...."
}

function build_front(){
	log " Start Building the front project ...."
	cd $FRONT_PATH;
	./manage build;
	log " End Building the front project ...."
	cd ..	
}


# log a message
function log {
   if [ "$1" = "-n" ]; then
      shift
      echo -n "##### `date '+%Y-%m-%d %H:%M:%S'` $*"
   else
      echo "##### `date '+%Y-%m-%d %H:%M:%S'` $*"
   fi
}


# =================================================================================================================
# Usage:
# -----------------------------------------------------------------------------------------------------------------
usage () {
  cat <<-EOF

  Usage: $0 [command] [options]

  Commands:

  build - Build the docker images for the project.
          You need to do this first.

  up - Starts all containers.
       Use "down" or "stop" to stop the run.
  start - same as up

  down - Brings down the services and removes the volumes (storage).  The containers
         are deleted so they will be re-created the next time you run start.
  stop - same as down

  options:

   - if no options are provided, the command will run on all projects "blockchain", "front" and "back".

	blockchain - the blockchain project "von_network" will be considered.

	back - the back project for the different entities Faber, Alice and Acme will be considered.

	front - the front project for the different entities Faber, Alice and Acme will be considered.

EOF
exit 1
}

function main(){
	argsArray=( "$@" )
	argsLength=${#argsArray[@]}

	if [ "$argsLength" -eq 0 ]; then
	    log "Removing and Deploying all containers ....";
		remove_all;
		deploy_all;
	else
		case ${argsArray[0]} in
			start|up)
				if [ "$argsLength" -eq 1 ]; then
					log "Starting all containers ...."
					remove_all;
					deploy_all;
				else
					for ((idx=1; idx< $argsLength; ++idx)); do
						remove_${argsArray[idx]};
						deploy_${argsArray[idx]};
					done
				fi
			;;
			stop|down)
				if [ "$argsLength" -eq 1 ]; then
					log "Stopping all containers ...."
					remove_all;
				else
					for ((idx=1; idx< $argsLength; ++idx)); do
						remove_${argsArray[idx]};
					done
				fi
			;;
			build)
				if [ "$argsLength" -eq 1 ]; then
					log "Building all containers ...."
					build_all;
				else
					for ((idx=1; idx< $argsLength; ++idx)); do
						build_${argsArray[idx]};
					done
				fi
			;;
			*)
				log "Error in the execution command ..."
				usage
			;;
		esac
			
	fi	
}


main "$@"