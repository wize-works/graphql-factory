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

        const modelSchema = getGraphQLSchemaForModel(model, model.name || modelName);

        const queryType = modelSchema.getQueryType();
        if (queryType) {
            const fields = queryType.getFields();
            for (const [key, value] of Object.entries(fields)) {
                if (value.args && Array.isArray(value.args)) {
                    throw new Error(`Query.${key} args must be an object, but received an array.`);
                }
                queryFields[key] = value;
            }
        }

        const mutationType = modelSchema.getMutationType();
        if (mutationType) {
            const fields = mutationType.getFields();
            for (const [key, value] of Object.entries(fields)) {
                if (value.args && Array.isArray(value.args)) {
                    throw new Error(`Mutation.${key} args must be an object, but received an array.`);
                }
                mutationFields[key] = value;
            }
        }

        const subscriptionType = modelSchema.getSubscriptionType();
        if (subscriptionType) {
            const fields = subscriptionType.getFields();
            for (const [key, value] of Object.entries(fields)) {
                if (value.args && Array.isArray(value.args)) {
                    throw new Error(`Subscription.${key} args must be an object, but received an array.`);
                }
                subscriptionFields[key] = value;
            }
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
