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

