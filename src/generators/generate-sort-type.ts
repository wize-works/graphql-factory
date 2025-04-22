import { GraphQLEnumType, GraphQLInputObjectType } from 'graphql';
import { capitalize } from '../utils/capitalize';

const sortTypeCache: Record<string, GraphQLInputObjectType> = {};

export const generateSortType = (name: string, model: any): GraphQLInputObjectType => {
    const typeName = `${capitalize(name)}Sort`;

    if (sortTypeCache[typeName]) {
        return sortTypeCache[typeName];
    }

    const sortEnum = new GraphQLEnumType({
        name: `${typeName}Direction`,
        values: {
            asc: { value: 'asc' },
            desc: { value: 'desc' }
        }
    });

    const sortType = new GraphQLInputObjectType({
        name: typeName,
        fields: () => {
            const fields: Record<string, any> = {};

            for (const [fieldName, field] of Object.entries<any>(model.fields)) {
                if (field.excludeFromSort) continue;
                fields[fieldName] = { type: sortEnum };
            }

            return fields;
        }
    });

    sortTypeCache[typeName] = sortType;
    return sortType;
}