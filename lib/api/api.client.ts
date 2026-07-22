// using fetch over axios
// suggestion from the next.js community is that this allows support for server side rendering, if needed?
// having never done server side rendering... I much prefer axios so far haha!

export type ApiOptions = RequestInit & {
    params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {

    //separate custom props from RequestInit
    const { params, ...fetchOptions } = options;

    //sanitize leading slashes
    endpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    //sanitize ending slashes
    let baseUrl = (process.env.API_URL || 'https://localhost:5001');
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    const url = new URL(`${baseUrl}/${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
        ...fetchOptions,
        headers
    };

    const response = await fetch(url.toString(), config);

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message || `API Error: ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
    }

    return response.json();
}