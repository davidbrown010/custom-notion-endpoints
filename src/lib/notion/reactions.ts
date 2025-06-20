import {notion} from "$lib/notion/notion"
import { error } from "@sveltejs/kit";

export const addReaction = async (hashedEmail: string, reactionId: string, emailCampaignId: string) => {

    const response = await notion.pages.create({
        parent: {
            type: "database_id",
            database_id: "21700f1c8e598076b63be92c75a0b6b0"
        },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: ""
                        }
                    }
                ]
            },
            hashed_email: {
                rich_text: [
                    {
                        "type": "text",
                        "text": {
                            "content": hashedEmail
                        }
                    }
                ]
            },
            reaction_id: {
                select: {
                    name: reactionId
                }
            },
            utm_campaign: {
                rich_text: [
                    {
                        "type": "text",
                        "text": {
                            "content": emailCampaignId
                        }
                    }
                ]
            },
        }
    });

    if (response.id) {
        if (response?.properties.reaction_id.select.name) return {reactionId: response.properties.reaction_id.select.name}
        else return error(404, "Unable to create reaction!")
    }
    else return error(404, "Unable to create reaction!")

}

