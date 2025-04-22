import {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLEnumType,
    GraphQLSchema
} from 'graphql';

export interface GraphQLFactoryTypes {
    type: GraphQLObjectType;
    input: GraphQLInputObjectType;
    filter: GraphQLInputObjectType;
    sort: GraphQLInputObjectType;
    paging: GraphQLInputObjectType;
    model: any;
}

export interface GraphQLFactorySchema {
    type: GraphQLObjectType;
    input: GraphQLInputObjectType;
    filter: GraphQLInputObjectType;
    sort: GraphQLInputObjectType;
    paging: GraphQLInputObjectType;
    resolvers: {
        query: Record<string, any>;
        mutation?: Record<string, any>;
        subscription?: Record<string, any>;
    };
    schema: GraphQLSchema;
}
