// place files you want to import through the `$lib` alias in this folder.
import { Client } from '@notionhq/client'
import { NOTION_API_KEY } from '$env/static/private';


// Initializing a client
export const notion = new Client({
  auth: NOTION_API_KEY,
})
