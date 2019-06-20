#!/bin/bash

	until ping -c 1 8.8.8.8 >/dev/null 2>&1;do 
sleep 2
done
		 
		sudo systemctl stop ntp
		sudo ntpd -gq
		sudo systemctl start ntp
		echo online>>startup.txt
		exit