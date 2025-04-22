// src/generators/generate-input-type.ts
import { GraphQLInputFieldConfigMap, GraphQLInputObjectType } from 'graphql';
import { buildFieldType } from '../utils/build-field-type';
import { capitalize } from '../utils/capitalize';

const inputTypeCache: Record<string, GraphQLInputObjectType> = {};

export const generateInputType = (name: string, model: any): GraphQLInputObjectType => {
    const typeName = `${capitalize(name)}Input`;

    if (inputTypeCache[typeName]) {
        return inputTypeCache[typeName];
    }

    const inputType = new GraphQLInputObjectType({
        name: typeName,
        fields: () => {
            const fields: GraphQLInputFieldConfigMap = {};

            for (const [fieldName, field] of Object.entries<any>(model.fields)) {
                if (field.excludeFromInput) continue;
                fields[fieldName] = { type: buildFieldType(field, fieldName, true) };
            }

            return fields;
        }
    });

    inputTypeCache[typeName] = inputType;
    return inputType;
}
