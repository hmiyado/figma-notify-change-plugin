import { createQueryParameter, fetchFromWebApi } from "./webApiCore"

// https://www.figma.com/developers/api#get-files-endpoint
type FigmaFileApiQueryParameter = {
    ids: string[]
    version: string
}

type FigmaNodesApiResponse = {
    version: string
    nodes: {
        [key: string]: FigmaNode
    }
}

type FigmaNode = {
    document: {
        id: string
        name: string
        type: NodeType
    }
}

export async function fetchNodes(params: FigmaFileApiQueryParameter): Promise<{ [key: string]: FigmaNode }> {
    const fileKey = figma.fileKey
    const query = createQueryParameter(params)
    const response = await fetchFromWebApi(`/v1/files/${fileKey}/nodes`, query) as FigmaNodesApiResponse
    return response.nodes
}
