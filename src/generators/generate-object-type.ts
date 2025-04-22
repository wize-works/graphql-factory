import { GraphQLFieldConfigMap, GraphQLObjectType } from 'graphql';
import { buildFieldType } from '../utils/build-field-type';
import { capitalize } from '../utils/capitalize';

const objectTypeCache: Record<string, GraphQLObjectType> = {};

export const generateObjectType = (name: string, model: any): GraphQLObjectType => {
    const typeName = capitalize(name);

    if (objectTypeCache[typeName]) {
        return objectTypeCache[typeName];
    }

    const type = new GraphQLObjectType({
        name: typeName,
        fields: (): GraphQLFieldConfigMap<any, any> => {
            const fields: GraphQLFieldConfigMap<any, any> = {};

            for (const [fieldName, field] of Object.entries<any>(model.fields)) {
                if (field.excludeFromOutput) continue;
                fields[fieldName] = { type: buildFieldType(field, fieldName, false) };
            }

            return fields;
        }
    });

    objectTypeCache[typeName] = type;
    return type;
}