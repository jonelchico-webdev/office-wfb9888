import React from 'react';
import CircleIcon from '../../icons/circle';
import {statusesValues} from '../../values';

export default function Status({status}) {
	let color = "";
	if(status === statusesValues.confirmed) {
		color = "#1BC167";
	} else if(status === statusesValues.cancelled) {
		color = "#FE6767";
	} else {
		color = "#FDCB58"
	}
	return <CircleIcon fontSize="small" htmlColor={color}/>
}