import { GraphQLEnumType } from 'graphql';

const enumCache: Record<string, GraphQLEnumType> = {};

export const mapEnumType = (name: string, values: string[]): GraphQLEnumType => {
    const typeName = `${name}Enum`;

    if (enumCache[typeName]) return enumCache[typeName];

    const enumType = new GraphQLEnumType({
        name: typeName,
        values: values.reduce((acc, val) => {
            acc[val] = { value: val };
            return acc;
        }, {} as Record<string, { value: string }>),
    });

    enumCache[typeName] = enumType;
    return enumType;
}