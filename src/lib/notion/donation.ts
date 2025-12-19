import { notion } from "./notion";
import { getPartnerFromAccountNumber } from "./partner";

export const pushDonationsForMonth = async (donationMonthPageId: string, donations: NotionDonation[]) => {

    // Donations DB
    const dbId = "494214063b754695888a9b3f1ab70800"

    // Online Platform Type Page ID
    const platformTypeId = "9793411f894145f2957d94ba387fbb21"


    // Create every donation
    const notionDonations = await Promise.all(donations.map(async (donation) => {

        const partnerPageId = await getPartnerFromAccountNumber(donation.donorAccountNumber)

        //Only add relation of partner if found

        const partnerSchema = partnerPageId ? {
            "Partner": {
                "relation": [
                    { "id": partnerPageId }
                ]
            }
        } : {
            "Notes": {
                "rich_text": [{ "text": { "content": donation.donorAccountNumber } }]
            }
        }



        const response = await notion.pages.create({
            parent: { "database_id": dbId },
            properties: {
                "Name": {
                    "title": [{ "text": { "content": "Donation" } }]
                },
                "Donation Amount": {
                    number: donation.donationAmount
                },
                "Platform Type": {
                    "relation": [
                        { "id": platformTypeId }
                    ]
                },
                "Donation Month": {
                    "relation": [
                        { "id": donationMonthPageId }
                    ]
                },
                "Missing": {
                    "select": {
                        name: "Found"
                    }
                },
                ...partnerSchema
            }
        });

        return response.id

    }))


    // console.log("AG Donations Count: " + donations.length, "Created Donations Count: " + notionDonations.length)

    const allDonationsCreated = notionDonations.length == donations.length
    
    return allDonationsCreated
}

export type NotionDonation = {
    dateGiven: string,
    donationAmount: number,
    donorAccountNumber: string
}




