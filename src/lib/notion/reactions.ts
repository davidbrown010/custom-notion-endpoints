import {notion} from "$lib/notion/notion"
import { error } from "@sveltejs/kit";

export const addReaction = async (emailAddress: string, reactionId: string, emailId: string) => {

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
            "Email Address": {
                email: emailAddress
            },
            reaction_id: {
                select: {
                    name: reactionId
                }
            },
            Email: {
                relation: [{
                    id: emailId
                }]
            }
        }
    });

    if (response.id) {
        if (response?.properties.reaction_id.select.name) return {reactionId: response.properties.reaction_id.select.name}
        else return error(404, "Unable to create reaction!")
    }
    else return error(404, "Unable to create reaction!")

}

