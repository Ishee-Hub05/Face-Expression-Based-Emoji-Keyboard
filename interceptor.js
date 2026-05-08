const origFetch = window.fetch;
window.fetch = async function(...args) {
    try {
    let request = args[0];
    let urlStr = typeof request === 'string' ? request : request.url;
    
    for (const key in MODELS_CACHE) {
        if (urlStr && urlStr.includes(key)) {
        if (key.endsWith('.json')) {
            return new Response(JSON.stringify(MODELS_CACHE[key]), { 
                headers: { 'Content-Type': 'application/json' } 
            });
        } else {
            const binaryString = atob(MODELS_CACHE[key]);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return new Response(bytes.buffer, { 
                headers: { 'Content-Type': 'application/octet-stream' } 
            });
        }
        }
    }
    return origFetch.apply(this, args);
    } catch (e) {
        return origFetch.apply(this, args);
    }
};
