import { notion } from "./notion";

export const logDonationSyncDateForDonationMonth = async (pageId: string) => {

    const timeLog = (new Date()).toISOString()
    
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            'Donation Sync Date': {
                date:  {
                    start: timeLog
                }
            }
        },
    });
    

    if (!response.id) return false
    
    return true
}