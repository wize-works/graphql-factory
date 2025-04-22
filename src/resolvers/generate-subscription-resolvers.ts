// src/resolvers/generate-subscription-resolvers.ts
import { GraphQLObjectType } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const generateSubscriptionResolvers = ({
    type,
    name
}: {
    type: GraphQLObjectType;
    name: string;
}) => {
    const singular = name.toLowerCase();
    const CREATED = `${singular}_created`;
    const UPDATED = `${singular}_updated`;
    const DELETED = `${singular}_deleted`;

    return {
        [`on${name}Created`]: {
            type,
            subscribe: () => pubsub.asyncIterableIterator([CREATED])
        },
        [`on${name}Updated`]: {
            type,
            subscribe: () => pubsub.asyncIterableIterator([UPDATED])
        },
        [`on${name}Deleted`]: {
            type,
            subscribe: () => pubsub.asyncIterableIterator([DELETED])
        }
    };
}

export { pubsub };
