import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addReaction } from '$lib/notion/reactions';

export const GET: RequestHandler = async (event) => {

	const emailId = event.params.email_id
	const reactionName = event.params.reaction_name
	
	const emailAddress = decodeURI(event.url.searchParams.get('e') || "")
	

	const response = await addReaction(emailAddress, reactionName, emailId)

	const reactionIdCreated = response.reactionId


	redirect(301, "/email/reactions?r=" + reactionIdCreated)
};