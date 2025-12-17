import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBroadcastStats } from '$lib/kit/kit';

import {ADMIN_AUTH} from '$env/static/private'
import { updateEmailBroadcastStats } from '$lib/notion/email';


export const POST: RequestHandler = async ({request}) => {

    // AUTH __________________________________________
    const headers = request.headers

    const auth = headers.get('Authorization')

    if (ADMIN_AUTH != auth) {
        error(404, {
			message: 'Authorization Invalid'
		});
    }

    // BODY __________________________________________

    const payload = await request.json();

    const properties = payload.data.properties;

    
    // Retrieve the unique_id number
    const notionPageId = properties?.['Page ID']?.formula?.string;

    // Retrieve the Kit Broadcast ID as a number
    const broadcastID = properties?.['Kit Broadcast Id']?.number;

    if (!notionPageId) {
        // Handle error if ID is missing or invalid
        return json({ error: "No Page Id Found or Invalid" }, { status: 400 });
    }

    if (!broadcastID) {
        // Handle error if Broadcast ID is missing or invalid
        return json({ error: "No Kit Broadcast Id Found or Invalid" }, { status: 400 });
    }

    // Functions __________________________________________

    const broadcastStats = await getBroadcastStats(broadcastID)

    const postStatsResponse = await updateEmailBroadcastStats(notionPageId, broadcastStats)
    
    if (postStatsResponse != true) error (500, "Unable to update notion page")

    return new Response("Updated Successfully")

};


