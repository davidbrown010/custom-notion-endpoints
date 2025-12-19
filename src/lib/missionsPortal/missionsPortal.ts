import type  { NotionDonation }  from "$lib/notion/donation";

export const getDonationsForMonth = async (startDate: string, endDate: string, missionsPortalCookies: string, designationId: number) => {

    const options = {
        method: 'GET',
        headers: {
            'Cookie': missionsPortalCookies,
            'Content-Type' : "application/json",
            'Accept': "*/*",
            'Accept-Encoding': "gzip, deflate, br",
            'Connection': "keep-alive",
            'Host': "missionsportal.ag.org",
            'User-Agent': "NotionAutomation"
        }
    };

    //GET DONATIONS FROM AG.ORG -------------------------------------
    const response = await fetch(`https://missionsportal.ag.org/api/v1/contributions?designationId=${designationId}&pageSize=0&pageNumber=1&sort=createddate:desc&searchPhrase=&classType=&beginDate=${startDate}&endDate=${endDate}`, options);

    const status = await response.status;

    if (status != 200) return false

    const data = await response.json()

    const donations = await data?.items as AG_Donation[]

    if (!donations || donations.length < 1) return null

    //FORMAT DONATIONS -------------------------------------

    const formattedDonations = donations.map(current => {
        return {
            dateGiven: current.batchDate,
            donationAmount: current.amount,
            donorAccountNumber: current.donorAccountNumber
        } as NotionDonation

    })

    return formattedDonations as NotionDonation[]

}

export type AG_Donation = {
    "batchDate": string,
    "amount": number,
    "donorAccountNumber": string
}