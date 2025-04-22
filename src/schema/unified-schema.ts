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

    const queryFields: Record<string, any> = {};
    const mutationFields: Record<string, any> = {};
    const subscriptionFields: Record<string, any> = {};

    for (const file of modelFiles) {
        const modelPath = path.join(modelsDir, file);
        const modelName = path.basename(file, '.ts');
        const { default: model } = require(modelPath) as { default: GraphQLModel };

        const { queryFields: q, mutationFields: m, subscriptionFields: s } = getGraphQLSchemaForModel(model, model.name || modelName);

        Object.assign(queryFields, q);
        Object.assign(mutationFields, m);
        Object.assign(subscriptionFields, s);
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
