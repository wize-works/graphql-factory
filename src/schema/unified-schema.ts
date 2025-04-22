import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { getGraphQLUnifiedSchemasForModel } from '../generators/get-graphql-schema-for'
import { GraphQLModel } from '../types/graphql-model'
import fs from 'fs'
import path from 'path'

interface ModelSchema {
    name: string
    model: GraphQLModel
}

export function buildUnifiedGraphQLSchemaFromFolder(modelsDir: string): GraphQLSchema {
    const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

    const queryFields: Record<string, any> = {};
    const mutationFields: Record<string, any> = {};
    const subscriptionFields: Record<string, any> = {};
    
    if (!fs.existsSync(modelsDir)) {
        console.warn(`[GraphQL] Models directory not found: ${modelsDir}`);
        throw new Error('Models directory not found — cannot build GraphQL schema.');
    }
    
    for (const file of modelFiles) {
        const modelPath = path.join(modelsDir, file);
        const modelName = path.parse(file).name;
    
        let model: GraphQLModel | undefined;
        try {
            const mod = require(modelPath);
            model = mod.default || mod;
            console.log(`Loading model: ${modelName}`);
        } catch (e) {
            console.error(`[GraphQL] Failed to load model: ${modelPath}`, e);
            continue;
        }
    
        if (!model) {
            console.error(`Model not found in ${modelPath}`);
            continue;
        }
    
        const { queryFields: q, mutationFields: m, subscriptionFields: s } = getGraphQLUnifiedSchemasForModel(model, model.name || modelName);
    
        Object.assign(queryFields, q);
        Object.assign(mutationFields, m);
        Object.assign(subscriptionFields, s);
    }

    const schemaConfig: any = {};

    if (Object.keys(queryFields).length > 0) {
        schemaConfig.query = new GraphQLObjectType({
            name: 'Query',
            fields: queryFields
        });
    }

    if (Object.keys(mutationFields).length > 0) {
        schemaConfig.mutation = new GraphQLObjectType({
            name: 'Mutation',
            fields: mutationFields
        });
    }

    if (Object.keys(subscriptionFields).length > 0) {
        schemaConfig.subscription = new GraphQLObjectType({
            name: 'Subscription',
            fields: subscriptionFields
        });
    }

    if (!schemaConfig.query && !schemaConfig.mutation && !schemaConfig.subscription) {
        throw new Error('No GraphQL fields defined — cannot create schema.');
    }

    return new GraphQLSchema(schemaConfig);
}
