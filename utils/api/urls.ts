import { GetServerSidePropsContext, NextPageContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { objectToQueryString } from 'utils';

export enum APIPaths {
    TOOLS = 'tools',
    TOOL = 'tool',
    BLOG = 'blog',
    VOTES = 'votes',
}

export const getApiURLFromContext = (
    ctx: GetServerSidePropsContext,
    pathName: string,
) => {
    // Get BaseUrl from context request (localhost or host url)
    const protocol = ctx.req?.headers['x-forwarded-proto'] || 'http';
    const baseUrl = ctx.req ? `${protocol}://${ctx.req.headers.host}` : '';

    let url = `${baseUrl}/api/${pathName}`;
    if (!ctx.query) {
        return url;
    }
    const queryString = objectToQueryString(ctx.query);
    if (queryString) {
        url += `?${queryString}`;
    }

    return url;
};
