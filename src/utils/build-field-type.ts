import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql';
import { scalarMap } from '../types/map-scalars';
import { mapEnumType } from '../types/map-enum-type';

export const buildFieldType = (field: any, fieldName: string, isInput = false): any => {
    let baseType: any;

    if (field.enum && Array.isArray(field.enum)) {
        baseType = mapEnumType(fieldName, field.enum);
    } else {
        baseType = scalarMap[field.type] || GraphQLString;
    }

    let gqlType = field.array ? new GraphQLList(baseType) : baseType;
    if (!isInput && field.required) gqlType = new GraphQLNonNull(gqlType);

    return gqlType;
}