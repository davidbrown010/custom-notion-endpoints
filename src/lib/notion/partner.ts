import { notion } from "./notion";

export const getPartnerFromAccountNumber = async (accountNumber: string) => {

    // PARTNER DB
    const dbID = "5982600443904dd191c25c89182db165"

    //get the page ID fron the DB
    const pageResponse = await notion.databases.query({
        database_id: dbID,
        filter: {
            "property": "Account Number",
            "rich_text": {
                "contains": accountNumber
            }
        },
    })

    if (pageResponse.results.length < 1) return null

    const pageId = pageResponse.results[0].id

    return pageId
}



