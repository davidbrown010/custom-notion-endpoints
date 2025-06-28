import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	return {
        reaction: url.searchParams.get("r")
    }
};