import { GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { capitalize } from '../utils/capitalize';

const pagingInputCache: Record<string, GraphQLInputObjectType> = {};

export const generatePagingInput = (name: string): GraphQLInputObjectType => {
    const typeName = `${capitalize(name)}PagingInput`;

    if (pagingInputCache[typeName]) {
        return pagingInputCache[typeName];
    }

    const type = new GraphQLInputObjectType({
        name: typeName,
        fields: {
            limit: { type: GraphQLInt },
            offset: { type: GraphQLInt }
        }
    });

    pagingInputCache[typeName] = type;
    return type;
};
