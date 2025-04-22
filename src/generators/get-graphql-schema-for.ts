import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { generateObjectType } from './generate-object-type';
import { generateInputType } from './generate-input-type';
import { generateFilterType } from './generate-filter-type';
import { generateSortType } from './generate-sort-type';
import { generatePagingInput } from './generate-paging-input';
import { generateQueryResolvers } from '../resolvers/generate-query-resolvers';
import { generateMutationResolvers } from '../resolvers/generate-mutation-resolvers';
import { generateSubscriptionResolvers } from '../resolvers/generate-subscription-resolvers';
import { GraphQLModel } from '../types/graphql-model';

export const getGraphQLSchemaForModel = (model: GraphQLModel, name: string): GraphQLSchema => {
    const objectType = generateObjectType(name, model);
    const inputType = generateInputType(name, model);
    const filterType = generateFilterType(name, model);
    const sortType = generateSortType(name, model);
    const pagingInput = generatePagingInput(name);

    const query = new GraphQLObjectType({
        name: 'Query',
        fields: () => generateQueryResolvers({ name, model, type: objectType, filter: filterType, sort: sortType, paging: pagingInput })
    });

    const mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => generateMutationResolvers({ name, model, type: objectType, input: inputType })
    });

    const subscription = new GraphQLObjectType({
        name: 'Subscription',
        fields: () => generateSubscriptionResolvers({ name, type: objectType })
    });

    return new GraphQLSchema({
        query,
        mutation,
        subscription
    });
}
export const getGraphQLTypesForModel = (model: GraphQLModel, name: string) => {
    return {
        type: generateObjectType(name, model),
        input: generateInputType(name, model),
        filter: generateFilterType(name, model),
        sort: generateSortType(name, model),
        paging: generatePagingInput(name),
        model
    };
}
