#!/usr/bin/env node
/**
 * driver-osram-lightify, 26.09.2016 Spaceify Oy
 *
 * @class OsramLightifyDriver
 */

var spaceify = require("/api/spaceifyapplication.js");

function OsramLightifyDriver()
{
var self = this;

var lightsServiceIds = {};
var lightsService = null;

	// CONNECTIONS  -- -- -- -- -- -- -- -- -- -- //
var onClientDisconnected = function(connectionId)
	{
	if(connectionId in lightsServiceIds)
		delete lightsServiceIds[connectionId];
	}

	// EXPOSED JSON-RPC METHODS -- -- -- -- -- -- -- -- -- -- //
var lightsConnect = function(lightsServiceId)
	{ // Each connected lights service web page has an lightsServiceId (e.g. "default")
	lightsServiceIds[arguments[arguments.length-1].connectionId] = {lightsServiceId: lightsServiceId};	// Add bigscreen to the connected bigscreens
	}

var getLightsServiceIds = function()
	{ // Return a list of unique lights service ids.
	var ids = [];
	for(var connectionId in lightsServiceIds)
		{
		if(!ids.indexOf(lightsServiceIds[connectionId].lightsServiceId))
			ids.push(lightsServiceIds[connectionId].lightsServiceId);
		}

	return ids;
	}

	// IMPLEMENT start AND fail IN YOUR APPLICATION!!! -- -- -- -- -- -- -- -- -- -- //
self.start = function()
	{
	lightsService = spaceify.getProvidedService("spaceify.org/services/lights");

	lightsService.exposeRpcMethod("getLightsServiceIds", self, getLightsServiceIds);
	lightsService.exposeRpcMethod("lightsConnect", self, lightsConnect);

	lightsService.setDisconnectionListener(onClientDisconnected);
	}

self.fail = function(err)
	{	
	}

var stop = function()
	{
	spaceify.stop();
	}

}

var osramLightifyDriver = new OsramLightifyDriver();
spaceify.start(osramLightifyDriver, {webservers: {http: true, https: true}});
