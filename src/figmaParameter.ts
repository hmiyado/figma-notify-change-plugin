const KeySlackWebhookUrl = 'slackWebhookUrl'

export const FigmaParameter = {
    initWithParameters(parameters: ParameterValues) {
        const slackWehookUrl = parameters?.[KeySlackWebhookUrl]
        figma.clientStorage.setAsync(KeySlackWebhookUrl, slackWehookUrl)
    },
    async slackWebhookUrl() {
        return await figma.clientStorage.getAsync(KeySlackWebhookUrl)
    }
}