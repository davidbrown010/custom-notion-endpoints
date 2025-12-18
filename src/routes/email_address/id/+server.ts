import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSubscriberId } from '$lib/kit/kit';

import {ADMIN_AUTH} from '$env/static/private'
import { updateEmailBroadcastStats } from '$lib/notion/email';
import { getKitId_AndUpdateNotion, updateEmailAddressKitId } from '$lib/notion/emailAddress';


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

    // Get email address
    const emailAddress = properties?.['Email']?.title[0]?.plain_text;

    if (!notionPageId) {
        // Handle error if ID is missing or invalid
        return json({ error: "No Page Id Found or Invalid" }, { status: 400 });
    }

    if (!emailAddress) {
        // Handle error if Broadcast ID is missing or invalid
        return json({ error: "No Email Address Found or Invalid" }, { status: 400 });
    }

    // Functions __________________________________________

    const kitIdResponse = await getKitId_AndUpdateNotion(notionPageId, emailAddress)

    if (!kitIdResponse) {
        // Handle error if ID is missing or invalid
        return json({ error: "Unable to update Kit Subscriber Id" }, { status: 500 });
    }

    return new Response("Updated Successfully")

};


