import { FigmaParameter } from "../figmaParameter"

export async function fetchFromWebApi(path: string, queryParam: string): Promise<any> {
    const accessToken = await FigmaParameter.figmaPersonalAccessToken()
    const response = await fetch(`https://api.figma.com${path}?${queryParam}`, {
        headers: {
            'X-FIGMA-TOKEN': accessToken,
        }
    })
    return response.json()
}

export function createQueryParameter(params: object): string {
    let queryParameterExists = false
    const query = Object.entries(params).map(([key, v]) => {
        if (v.length === 0) return ''
        queryParameterExists = true
        const value = Array.isArray(v) ? v.join(',') : v
        return `${key}=${value}`
    }).join('&')
    if (!queryParameterExists) return ''
    return query
}
