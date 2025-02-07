#!/bin/bash

LOGFILE="/home/patrick/.logs/shutdown_pi.log"
exec > >(tee -a "${LOGFILE}") 2>&1

echo "Shutdown script started at $(date)"

# define the Pi server environment variable
PI_SERVER="patrick@192.168.1.21"
echo "PI_SERVER is set to ${PI_SERVER}"

# path to the SSH key
SSH_KEY="/home/patrick/.ssh/id_ed25519"

# function to send a shutdown signal to the Raspberry Pi
function pi_shutdown {
    if [ -n "${PI_SERVER}" ]; then
        # Extract the hostname part from PI_SERVER
        PI_HOST="${PI_SERVER#*@}"
        echo "Checking if ${PI_HOST} is online..."
        if ping -c 1 -W 1 "${PI_HOST}" > /dev/null 2>&1; then
            echo "${PI_HOST} is online. Sending shutdown signal..."
            ssh -i "${SSH_KEY}" "${PI_SERVER}" "sudo /usr/sbin/shutdown now -h"
            echo "SSH command executed"
        else
            echo "${PI_HOST} is offline. Skipping Pi shutdown."
        fi
    else
        echo "PI_SERVER is not defined. Skipping Pi shutdown."
    fi
}
pi_shutdown

echo "Shutdown script finished at $(date)"
