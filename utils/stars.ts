// The original repo does not provide a library, so I had to copy the code
// Source: https://github.com/bytebase/star-history
// License: MIT

// Number of stargazers to fetch per page
const DEFAULT_PER_PAGE = 30;

export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t);
    return d.getTime();
}

export const getDateString = (
    t: Date | number | string,
    format = 'yyyy/MM',
): string => {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const formatedString = format
        .replace('yyyy', String(year))
        .replace('MM', String(month));

    return formatedString;
};

const range = (from: number, to: number): number[] => {
    const result = [];
    for (let i = from; i <= to; i++) {
        result.push(i);
    }
    return result;
};

const getRepoStargazers = async (
    repo: string,
    token?: string,
    page?: number,
) => {
    let url = `https://api.github.com/repos/${repo}/stargazers?per_page=${DEFAULT_PER_PAGE}`;

    if (page !== undefined) {
        url = `${url}&page=${page}`;
    }
    return await fetch(url, {
        headers: {
            Accept: 'application/vnd.github.v3.star+json',
            Authorization: token ? `token ${token}` : '',
        },
    });
};

const getRepoStargazersCount = async (repo: string, token?: string) => {
    const data = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
            Accept: 'application/vnd.github.v3.star+json',
            Authorization: token ? `token ${token}` : '',
        },
    });
    const json = await data.json();
    return json.stargazers_count;
};

// Evenly distribute the requests across all pages
const getRequestPages = (pageCount: number, maxRequestsCount: number) => {
    const requestPages: number[] = [];
    if (pageCount < maxRequestsCount) {
        requestPages.push(...range(1, pageCount));
    } else {
        range(1, maxRequestsCount).map((i) => {
            requestPages.push(
                Math.round((i * pageCount) / maxRequestsCount) - 1,
            );
        });
        if (!requestPages.includes(1)) {
            requestPages.unshift(1);
        }
    }
    return requestPages;
};

export const getRepoStarRecords = async (
    repo: string,
    token: string,
    requests: number,
) => {
    // Get the total number of pages
    const initialRequest = await getRepoStargazers(repo, token);
    const linkHeader = initialRequest.headers.get('link');
    if (!linkHeader) {
        throw {
            status: initialRequest.status,
            data: [],
        };
    }

    let pageCount = 1;
    const lastPage = /next.*&page=(\d*).*last/.exec(linkHeader);
    if (lastPage) {
        const lastPageId = lastPage[1];
        if (lastPageId && Number.isInteger(Number(lastPageId))) {
            pageCount = Number(lastPageId);
        }
    }

    const json = await initialRequest.json();
    if (pageCount === 1 && json.length === 0) {
        throw {
            status: initialRequest.status,
            data: [],
        };
    }

    const requestPages = getRequestPages(pageCount, requests);

    const resArray = await Promise.all(
        requestPages.map(async (page) => {
            return await getRepoStargazers(repo, token, page);
        }),
    );

    const starRecordsMap: Map<Date, number> = new Map();

    if (requestPages.length < requests) {
        const starRecordsData: {
            starred_at: Date;
        }[] = [];
        for (const res of resArray) {
            const data = await res.json();
            starRecordsData.push(...data);
        }
        for (let i = 0; i < starRecordsData.length; ) {
            const date = new Date(starRecordsData[i].starred_at);
            starRecordsMap.set(date, i + 1);
            i += Math.floor(starRecordsData.length / requests) || 1;
        }
    } else {
        resArray.map(async (res, index) => {
            const data = await res.json();
            if (data.length > 0) {
                const starRecord = data[0];
                const date = new Date(starRecord.starred_at);
                starRecordsMap.set(
                    date,
                    DEFAULT_PER_PAGE * (requestPages[index] - 1),
                );
            }
        });
    }

    const currentStars = await getRepoStargazersCount(repo, token);

    const starRecords: {
        date: Date;
        count: number;
    }[] = [];

    starRecordsMap.forEach((v, k) => {
        starRecords.push({
            date: k,
            count: v,
        });
    });
    starRecords.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
    });

    // Add the current stars if the last datapoint is older than three months
    if (
        starRecords.length > 0 &&
        new Date().getTime() -
            starRecords[starRecords.length - 1].date.getTime() >
            3 * 30 * 24 * 60 * 60 * 1000
    ) {
        starRecords.push({
            date: new Date(),
            count: currentStars,
        });
    }
    return starRecords.map((record) => ({
        date: getDateString(record.date),
        count: record.count,
    }));
};

export const getRepoLogoUrl = async (repo: string, token?: string) => {
    const owner = repo.split('/')[0];
    const data = await fetch(`https://api.github.com/users/${owner}`, {
        headers: {
            Accept: 'application/vnd.github.v3.star+json',
            Authorization: token ? `token ${token}` : '',
        },
    });
    const json = await data.json();
    return await json.avatar_url;
};
