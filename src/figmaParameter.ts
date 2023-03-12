const Keys = {
    slackWebhookUrl: 'slackWebhookUrl',
    figmaPersonalAccessToken: 'figmaPersonalAccessToken',
    figmaFileKey: 'figmaFileKey',
}

export const FigmaParameter = {
    async initWithParameters(parameters: ParameterValues) {
        for (const key in Keys) {
            await figma.clientStorage.setAsync(Keys.slackWebhookUrl, parameters[key])
        }
    },
    async slackWebhookUrl() {
        return await figma.clientStorage.getAsync(Keys.slackWebhookUrl)
    },
    async figmaPersonalAccessToken() {
        return await figma.clientStorage.getAsync(Keys.figmaPersonalAccessToken)
    },
    async figmaFileKey() {
        return await figma.clientStorage.getAsync(Keys.figmaFileKey)
    }
}