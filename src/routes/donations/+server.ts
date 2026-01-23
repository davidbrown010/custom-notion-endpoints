import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { getDonationsForMonth } from '$lib/missionsPortal/missionsPortal';

import {ADMIN_AUTH} from '$env/static/private'
import { pushDonationsForMonth, type NotionDonation } from '$lib/notion/donation';
import { logDonationSyncDateForDonationMonth } from '$lib/notion/donationMonth';


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

    // Get start and end date
    const startDate = properties?.['Date Range']?.date?.start;
    const endDate = properties?.['Date Range']?.date?.end;

    //Get cookies string
    const missionsPortalCookies = properties?.['Formatted Cookies']?.formula?.string

    //Get designationId
    const designationId = properties?.['Designation Id']?.number

    if (!missionsPortalCookies) {
        
        return json({ error: "Unable to access missions portal cookies" }, { status: 500 });
    }

    if (!notionPageId) {
        // Handle error if ID is missing or invalid
        return json({ error: "No Page Id Found or Invalid" }, { status: 400 });
    }

    if (!startDate || !endDate) {
        
        return json({ error: "No start or end date found" }, { status: 400 });
    }

    if (!designationId) {
        return json({ error: "No designation ID found" }, { status: 400 });
    }

    // Functions __________________________________________
        

    //GET DONATOINS
    const donationsForMonth: NotionDonation[] | null | false = await getDonationsForMonth(startDate, endDate, missionsPortalCookies, designationId)

    if (!donationsForMonth) error(500, "Unable to get donations")

    const pushResult = await pushDonationsForMonth(notionPageId, donationsForMonth)

    
    if (pushResult != true) {
        error(500, "Unable to add all donations")
    } else {
        const logSuccess = await logDonationSyncDateForDonationMonth(notionPageId)

        if (!logSuccess) error (500, "Unable to log sync date")


        return new Response("Updated Successfully")
    }
    

};

