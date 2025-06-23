import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addReaction } from '$lib/notion/reactions';

export const GET: RequestHandler = async (event) => {

	const reactionName = event.params.reaction_name
	
	const hashedEmail = decodeURI(event.url.searchParams.get('sh_kit') || "")
	const emailCampaignId = decodeURI(event.url.searchParams.get('utm_campaign') || "")
	

	const response = await addReaction(hashedEmail, reactionName, emailCampaignId)

	const reactionIdCreated = response.reactionId


	redirect(301, "/email/reactions?r=" + reactionIdCreated)
};