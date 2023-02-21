import React, { useRef } from 'react';
import useScript from 'utils/use-script';

const Comments = () => {
    const comment = useRef(null);

    const status = useScript({
        url: 'https://utteranc.es/client.js',
        theme: 'dark-blue',
        issueTerm: 'pathname',
        repo: 'analysis-tools-dev/website-comments',
        crossorigin: 'anonymous',
        async: true,
        ref: comment,
    });

    console.log(status);
    return <div className="w-full">{<div ref={comment}></div>}</div>;
};

export default Comments;
