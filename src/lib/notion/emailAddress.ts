import { notion } from "./notion";

export const updateEmailAddressKitId = async (pageId: string, subscriberId: number) => {

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
    
    return dataIsUpdatedCorrectly
}




