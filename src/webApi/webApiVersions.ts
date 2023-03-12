import { fetchFromWebApi } from "./webApiCore"

type FigmaVersionHistoryApiResponse = {
    versions: FigmaVersion[]
}

type FigmaVersion = {
    id: string,
    // created_at: string,
    // label: string,
    // description: string,
    // user: {
    //   handle: string
    //   img_url: string
    //   id: string
    // },
    // thumbnail_url: string
}

export async function fetchPreviousVersion(): Promise<string | null> {
    const fileKey = figma.fileKey
    const response = await fetchFromWebApi(`/v1/files/${fileKey}/versions`, '') as FigmaVersionHistoryApiResponse
    if (response.versions.length < 2) return null
    return response.versions[1].id
}
