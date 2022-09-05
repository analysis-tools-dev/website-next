const DEFAULT_PER_PAGE = 30;

export function range(from: number, to: number): number[] {
    const result = [];
    for (let i = from; i <= to; i++) {
        result.push(i);
    }
    return result;
}

export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t);

    return d.getTime();
}

export function getDateString(
    t: Date | number | string,
    format = 'yyyy/MM',
): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    // const date = d.getDate();
    // const hours = d.getHours();
    // const minutes = d.getMinutes();
    // const seconds = d.getSeconds();

    const formatedString = format
        .replace('yyyy', String(year))
        .replace('MM', String(month));

    return formatedString;
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
    const maxRequestAmount = requests || 5;

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

    const starRecordsMap: Map<string, number> = new Map();

    if (requestPages.length < maxRequestAmount) {
        const starRecordsData: {
            starred_at: string;
        }[] = [];
        resArray.map(async (res) => {
            const data = await res.json();
            starRecordsData.push(...data);
        });
        for (let i = 0; i < starRecordsData.length; ) {
            starRecordsMap.set(
                getDateString(starRecordsData[i].starred_at),
                i + 1,
            );
            i += Math.floor(starRecordsData.length / maxRequestAmount) || 1;
        }
    } else {
        resArray.map(async (res, index) => {
            const data = await res.json();
            if (data.length > 0) {
                const starRecord = data[0];
                starRecordsMap.set(
                    getDateString(starRecord.starred_at),
                    DEFAULT_PER_PAGE * (requestPages[index] - 1),
                );
            }
        });
    }

    const starAmount = await getRepoStargazersCount(repo, token);
    starRecordsMap.set(getDateString(Date.now()), starAmount);

    const starRecords: {
        date: string;
        count: number;
    }[] = [];

    starRecordsMap.forEach((v, k) => {
        starRecords.push({
            date: k,
            count: v,
        });
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
