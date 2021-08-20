import React from 'react';

export default function BrowserNotSupported() {

    const [url, setUrl] = React.useState('');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            let urlopen = window.location.href;
            // credits for this code goes to https://urlopen.link/
            setUrl(urlopen.replace(/^https?:\/\/((?:(?:[a-z\d_\-=]+\.)+[a-z\d]+)(\/[a-z\d_\-=\+\.\/:]*)?)(?:\?(.*))?$/i, function ($0, u, d, q): string {
                let qs, i, kv, k, v, j;
                if (!d) u += '/';
                if (q) {
                    qs = q.split('&');
                    for (i = 0; i < qs.length; i++) {
                        kv = qs[i].split('=');
                        k = kv.shift();
                        v = kv.join('=');
                        if (/[^a-z\d_\-\.]/i.test(k)) return '';
                        for (j = 0; j < v.length; j++) {
                            if (v.charCodeAt(j) < 256 && /[^a-z\d_\-=\+\.\/]/i.test(v[j])) return '';
                            if (v.charCodeAt(j) > 256 && encodeURIComponent(v[j]).length < 9) return '';
                        }
                    }
                    u += '?' + q;
                }
                return ('https://urlopen.link/' + u);
            }));
        }
    }, []);

    return (
        <div
            style={{
                margin: '20px',
                width: '100vw',
                height: '60vh',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <p>Your browser is not supported. Please use a newer version or another browser.</p>
            <p>
                <a href={url} rel="nofollow noreferrer">Try to open a compatible browser.</a>
            </p>
        </div>
    );
}
