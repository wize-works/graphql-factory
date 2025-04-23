import {
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLFieldConfigMap,
    GraphQLInputObjectType,
    isNonNullType,
    GraphQLObjectType,
} from 'graphql';
import { hasScope } from '../utils/has-scope';
import Sentry from '../utils/sentry';
import { supabase } from '../utils/supabase';
import { applyFilters } from '../utils/apply-filters';
import { AuthContext } from '../types/auth-context';
import { buildFieldType } from '../utils/build-field-type';

export const generateQueryResolvers = ({
    type,
    filter,
    sort,
    paging,
    model,
    name,
}: {
    type: any
    filter?: GraphQLInputObjectType
    sort?: GraphQLInputObjectType
    paging?: GraphQLInputObjectType
    model: any
    name: string
}): GraphQLFieldConfigMap<any, AuthContext> => {
    const singular = name.toLowerCase();
    const table = singular + 's';


    const idField = model.fields.id;
    let idType = idField ? buildFieldType(idField, 'id', true) : null;
    if (!idType) throw new Error(`Model ${name} is missing a valid 'id' field.`);
    if (!isNonNullType(idType)) {
        idType = new GraphQLNonNull(idType);
    }

    const ListResultType = new GraphQLObjectType({
        name: `${name}ListResult`,
        fields: {
            count: { type: GraphQLInt },
            data: { type: new GraphQLList(type) }
        }
    });

    const baseFields: GraphQLFieldConfigMap<any, AuthContext> = {
        [`get${name}`]: {
            type,
            args: {
                id: { type: idType }
            },
            resolve: async (_, args, context) => {
                return await Sentry.startSpan({ name: `get${name}`, op: 'graphql.query' }, async () => {
                    if (!hasScope(context, `${singular}:read`)) {
                        throw new Error(`Unauthorized: missing ${singular}:read scope`);
                    }

                    const { tenantId } = context
                    await supabase.rpc('set_config', { key: 'app.tenantId', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from(table)
                        .select('*')
                        .eq('id', args.id)
                        .single();

                    if (error) throw new Error(error.message);
                    return data;
                })
            }
        },
        [`list${name}s`]: {
            type: ListResultType,
            args: {
                ...(filter && { filter: { type: filter } }),
                ...(sort && { sort: { type: sort } }),
                ...(paging && { paging: { type: paging } }),
            },
            resolve: async (_, args, context) => {
                return await Sentry.startSpan({ name: `list${name}s`, op: 'graphql.query' }, async () => {
                    if (!hasScope(context, `${singular}:read`)) {
                        throw new Error(`Unauthorized: missing ${singular}:read scope`);
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenantId', value: tenantId });

                    let query = supabase.schema('api').from(table).select('*');

                    if (args.filter)
                        query = applyFilters(query, args.filter, model.fields);

                    let countQuery = supabase.schema('api').from(table).select('id', { count: 'exact' });
                    if (args.filter) {
                        countQuery = applyFilters(countQuery, args.filter, model.fields);
                    }
                    const { count } = await countQuery;

                    if (args.sort) {
                        for (const [field, direction] of Object.entries(args.sort)) {
                            query = query.order(field, { ascending: direction === 'asc' });
                        }
                    }
                    if (args.paging) {
                        const { limit = 20, offset = 0 } = args.paging;
                        query = query.range(offset, offset + limit - 1);
                    }

                    const { data, error } = await query;
                    if (error) throw new Error(error.message);
                    return { count, data };
                })
            }
        }
    }

    return baseFields
}
