import {
    GraphQLInputFieldConfigMap,
    GraphQLInputObjectType,
    GraphQLList
} from 'graphql';
import { buildFieldType } from '../utils/build-field-type';
import { capitalize } from '../utils/capitalize';

const filterTypeCache: Record<string, GraphQLInputObjectType> = {};

export const generateFilterType = (name: string, model: any): GraphQLInputObjectType => {
    const typeName = `${capitalize(name)}Filter`;

    if (filterTypeCache[typeName]) {
        return filterTypeCache[typeName];
    }

    const filterType = new GraphQLInputObjectType({
        name: typeName,
        fields: () => {
            const fields: GraphQLInputFieldConfigMap = {};

            fields.AND = { type: new GraphQLList(filterType) };
            fields.OR = { type: new GraphQLList(filterType) };
            fields.NOT = { type: filterType };

            for (const [fieldName, field] of Object.entries<any>(model.fields)) {
                if (field.excludeFromFilter) continue;
                const baseType = buildFieldType(field, fieldName, true);

                fields[fieldName] = { type: baseType };
                fields[`${fieldName}_eq`] = { type: baseType };
                fields[`${fieldName}_neq`] = { type: baseType };
                fields[`${fieldName}_lt`] = { type: baseType };
                fields[`${fieldName}_lte`] = { type: baseType };
                fields[`${fieldName}_gt`] = { type: baseType };
                fields[`${fieldName}_gte`] = { type: baseType };

                if (["string", "text"].includes(field.type)) {
                    fields[`${fieldName}_contains`] = { type: baseType };
                    fields[`${fieldName}_startsWith`] = { type: baseType };
                    fields[`${fieldName}_endsWith`] = { type: baseType };
                }
            }

            return fields;
        }
    });

    filterTypeCache[typeName] = filterType;
    return filterType;
}