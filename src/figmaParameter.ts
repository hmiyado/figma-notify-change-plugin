const Keys = {
    slackWebhookUrl: 'slackWebhookUrl',
    figmaPersonalAccessToken: 'figmaPersonalAccessToken',
}

export const FigmaParameter = {
    async initWithParameters(parameters: ParameterValues) {
        for (const key in Keys) {
            await figma.clientStorage.setAsync(key, parameters[key])
        }
    },
    async slackWebhookUrl() {
        return await figma.clientStorage.getAsync(Keys.slackWebhookUrl)
    },
    async figmaPersonalAccessToken() {
        return await figma.clientStorage.getAsync(Keys.figmaPersonalAccessToken)
    }
}