import { notion } from "./notion";

export const updateEmailBroadcastStats = async (notionBroadcastId: number, broadcast: Broadcast) => {

    const dbID = "2c800f1c8e5980faa248c32e760dd7dd"

    //get the page ID fron the DB
    const pageResponse = await notion.databases.query({
        database_id: dbID,
        filter: {
            "property": "ID",
            "unique_id": {
                "equals": notionBroadcastId
            }
        },
    })

    if (pageResponse.results.length < 1) return "Page Not Found"

    const pageId = pageResponse.results[0].id

    const openRateAsPercent = Math.round(100 * (broadcast.stats.open_rate / 100)) / 100


    // Push the stats to the page
    
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            'Opens': {
                number: broadcast.stats.emails_opened
            },
            'Open Rate': {
                number: openRateAsPercent
            }
        },
    });

    const dataIsUpdatedCorrectly = response.properties["Open Rate"].number == openRateAsPercent && response.properties["Opens"].number == broadcast.stats.emails_opened
    
    return dataIsUpdatedCorrectly
}

type Broadcast = {
    id: number,
    stats: {
        recipients: number,
        open_rate: number,
        emails_opened: number,
        click_rate: number,
        unsubscribe_rate: number,
        unsubscribes: number,
        total_clicks: number,
        show_total_clicks: boolean,
        status: string,
        progress: number,
        open_tracking_disabled: boolean,
        click_tracking_disabled: boolean
    }
}