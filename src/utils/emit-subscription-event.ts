import { pubsub } from '../resolvers/generate-subscription-resolvers';
import { capitalize } from './capitalize';

export const emitSubscriptionEvent = (
        modelName: string,
        event: 'created' | 'updated' | 'deleted',
        payload: any
) => {
    const topic = `${modelName.toLowerCase()}_${event}`;
    const key = `on${capitalize(modelName)}${capitalize(event)}`;
    pubsub.publish(topic, { [key]: payload });
}
