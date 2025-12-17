import { error, redirect } from '@sveltejs/kit';
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

    const formData = await request.json()

    console.log(await formData)

    const properties = formData.properties;

    const notionEmailId = properties?.['ID']?.unique_id?.number

    if (!notionEmailId) error(400, "No Notion Id Found")

    // const notionEmailIdNumber = Number(notionEmailId)

    // if (Number.isNaN(notionEmailIdNumber)) error(400, "Notion Id Invalid")

    
    const broadcastID = properties?.["Kit Broadcast Id"]?.number

    if (!notionEmailId) error(400, "No Kit Broadcast Id Found")

    // Functions __________________________________________

    const broadcastStats = await getBroadcastStats(broadcastID)

    const postStatsResponse = await updateEmailBroadcastStats(notionEmailId, broadcastStats)
    
    if (postStatsResponse != true) error (500, "Unable to update notion page")

    return new Response("Updated Successfully")

};


