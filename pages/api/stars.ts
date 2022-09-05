// The original repo does not provide a library, so I had to copy the code
// Source: https://github.com/bytebase/star-history
// License: MIT
const DEFAULT_PER_PAGE = 30;

export function range(from: number, to: number): number[] {
    const result = [];
    for (let i = from; i <= to; i++) {
        result.push(i);
    }
    return result;
}

export async function getRepoStargazers(
    repo: string,
    token?: string,
    page?: number,
) {
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
}

export async function getRepoStargazersCount(repo: string, token?: string) {
    const data = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
            Accept: 'application/vnd.github.v3.star+json',
            Authorization: token ? `token ${token}` : '',
        },
    });
    const json = await data.json();
    return json.stargazers_count;
}

export async function getRepoStarRecords(
    repo: string,
    token?: string,
    requests?: number,
) {
    const maxRequestAmount = requests || 10;

    const patchRes = await getRepoStargazers(repo, token);

    const linkHeader = patchRes.headers.get('link');
    if (!linkHeader) {
        throw {
            status: patchRes.status,
            data: [],
        };
    }

    let pageCount = 1;
    const regResult = /next.*&page=(\d*).*last/.exec(linkHeader);

    if (regResult) {
        if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
            pageCount = Number(regResult[1]);
        }
    }

    const json = await patchRes.json();
    if (pageCount === 1 && json.length === 0) {
        throw {
            status: patchRes.status,
            data: [],
        };
    }

    const requestPages: number[] = [];
    if (pageCount < maxRequestAmount) {
        requestPages.push(...range(1, pageCount));
    } else {
        range(1, maxRequestAmount).map((i) => {
            requestPages.push(
                Math.round((i * pageCount) / maxRequestAmount) - 1,
            );
        });
        if (!requestPages.includes(1)) {
            requestPages.unshift(1);
        }
    }

    const resArray = await Promise.all(
        requestPages.map(async (page) => {
            return await getRepoStargazers(repo, token, page);
        }),
    );

    const starRecordsMap: Map<Date, number> = new Map();

    if (requestPages.length < maxRequestAmount) {
        const starRecordsData: {
            starred_at: Date;
        }[] = [];
        resArray.map(async (res) => {
            const data = await res.json();
            starRecordsData.push(...data);
        });
        for (let i = 0; i < starRecordsData.length; ) {
            const date = new Date(starRecordsData[i].starred_at);
            starRecordsMap.set(date, i + 1);
            i += Math.floor(starRecordsData.length / maxRequestAmount) || 1;
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

    await getRepoStargazersCount(repo, token);

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

    return starRecords;
}

export async function getRepoLogoUrl(
    repo: string,
    token?: string,
): Promise<string> {
    const owner = repo.split('/')[0];
    const data = await fetch(`https://api.github.com/users/${owner}`, {
        headers: {
            Accept: 'application/vnd.github.v3.star+json',
            Authorization: token ? `token ${token}` : '',
        },
    });
    const json = await data.json();
    return json.avatar_url;
}
