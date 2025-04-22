import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { getGraphQLSchemaForModel } from '../generators/get-graphql-schema-for'
import { GraphQLModel } from '../types/graphql-model'
import fs from 'fs'
import path from 'path'

interface ModelSchema {
    name: string
    model: GraphQLModel
}

export function buildUnifiedGraphQLSchemaFromFolder(modelsDir: string): GraphQLSchema {
    const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));

    const queryFields: any = {};
    const mutationFields: any = {};
    const subscriptionFields: any = {};

    for (const file of modelFiles) {
        const modelPath = path.join(modelsDir, file);
        const modelName = path.basename(file, '.ts');
        const { default: model } = require(modelPath) as { default: GraphQLModel };

        const modelSchema = getGraphQLSchemaForModel(model, model.name || modelName);

        const queryType = modelSchema.getQueryType();
        if (queryType) {
            Object.assign(queryFields, queryType.getFields());
        }

        const mutationType = modelSchema.getMutationType();
        if (mutationType) {
            Object.assign(mutationFields, mutationType.getFields());
        }

        const subscriptionType = modelSchema.getSubscriptionType();
        if (subscriptionType) {
            Object.assign(subscriptionFields, subscriptionType.getFields());
        }
    }

    const query = new GraphQLObjectType({
        name: 'Query',
        fields: queryFields
    });

    const mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: mutationFields
    });

    const subscription = new GraphQLObjectType({
        name: 'Subscription',
        fields: subscriptionFields
    });

    return new GraphQLSchema({ query, mutation, subscription });
}
