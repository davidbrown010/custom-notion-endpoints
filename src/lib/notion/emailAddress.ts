import { getSubscriberId } from "$lib/kit/kit";
import { error } from "@sveltejs/kit";
import { notion } from "./notion";

const updateEmailAddressKitId = async (pageId: string, subscriberId: number) => {

    // Push the stats to the page
    
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            'Kit ID': {
                number: subscriberId
            }
        },
    });

    const dataIsUpdatedCorrectly = response.properties["Kit ID"].number == subscriberId;
    
    return dataIsUpdatedCorrectly && response.properties["Kit ID"].number
}

export const getKitId_AndUpdateNotion = async (pageId: string, emailAddress: string) => {

    const subscriberId = (await getSubscriberId(emailAddress)) as number
    
    const syncedSubscriberId = await updateEmailAddressKitId(pageId, subscriberId)
    
    if (!syncedSubscriberId) error (500, "Unable to update notion page")

    return syncedSubscriberId

}

export const updateEmailAddressPerformance = async (pageId: string, subscriberStats: SubscriberStats) => {

    const dateProperties = {
        'Last Sent': {
            date: {
                "start": subscriberStats.last_sent,
                "end": null,
                "time_zone": null
            }
        },
        'Last Opened': {
            date: {
                "start": subscriberStats.last_opened,
                "end": null,
                "time_zone": null
            }
        },
        'Last Clicked': {
            date: {
                "start": subscriberStats.last_clicked,
                "end": null,
                "time_zone": null
            }
        },
    }

    // Remove empty
    const nonNullDateProperties = Object.fromEntries(
        Object.entries(dateProperties).filter(([key, value]) => 
            value.date.start !== null && value.date.start !== undefined
        )
    );


    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            'Sent': {
                number: subscriberStats.sent
            },
            'Opened': {
                number: subscriberStats.opened
            },
            'Clicked': {
                number: subscriberStats.clicked
            },
            'Bounced': {
                number: subscriberStats.bounced
            },
            'Open Rate': {
                number: subscriberStats.open_rate
            },
            'Click Rate': {
                number: subscriberStats.click_rate
            },
            'Sends Since Last Open': {
                number: subscriberStats.sends_since_last_open
            },
            'Sends Since Last Click': {
                number: subscriberStats.sends_since_last_open
            },
            'Stats Sync Date': {
                date: {
                    "start": (new Date()).toISOString(),
                    "end": null,
                    "time_zone": null
                }
            },
            ...nonNullDateProperties
        },
    });

    if (!response.properties) return false
    
    return true

}

type SubscriberStats = {
    sent: number | null,
    opened: number | null,
    clicked: number | null,
    bounced: number | null,
    open_rate: number | null,
    click_rate: number | null,
    last_sent: Date | null,
    last_opened: Date | null,
    last_clicked: Date | null,
    sends_since_last_open: number | null,
    sends_since_last_click: number | null
}



