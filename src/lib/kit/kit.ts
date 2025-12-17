import { KIT_API_KEY } from '$env/static/private';

export const getBroadcastStats = async (broadcastId: string) => {

    const options = {
        method: 'GET',
        headers: {'X-Kit-Api-Key': KIT_API_KEY}
    };

    const response = await fetch(`https://api.kit.com/v4/broadcasts/${broadcastId}/stats`, options)

    const data = await response.json()

    return (await data.broadcast)
}

export const getSubscriberId = async (email: string) => {

    const options = {
        method: 'GET',
        headers: {'X-Kit-Api-Key': KIT_API_KEY}
    };

    const encodedEmail = encodeURI(email)

    const response = await fetch(`https://api.kit.com/v4/subscribers?email_address=${encodedEmail}`, options)

    const data = await response.json()

    const subscribers = await data?.subscribers

    if (!subscribers || subscribers.length() < 1) return null

    const subscriberId = subscribers[0].id

    return subscriberId as number
}

