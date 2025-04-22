// src/types/map-scalars.ts
import {
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLBoolean,
    GraphQLID,
} from 'graphql';
import {
    DateTimeResolver,
    JSONObjectResolver,
} from 'graphql-scalars';

export const scalarMap: Record<string, any> = {
    int: GraphQLInt,
    float: GraphQLFloat,
    string: GraphQLString,
    boolean: GraphQLBoolean,
    datetime: DateTimeResolver,
    json: JSONObjectResolver,
    id: GraphQLID,
    text: GraphQLString, // alias for long-form strings
    uuid: GraphQLString, // alias for UUIDs
};
