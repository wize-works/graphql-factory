// src/resolvers/generate-query-resolvers.ts
import { GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import { supabase } from '../utils/supabase';
import Sentry from '../utils/sentry';
import { AuthContext } from '../types/auth-context';
import { hasScope } from '../utils/has-scope';
import { applyFilters } from '../utils/apply-filters';
import { buildFieldType } from '../utils/build-field-type';

export const generateQueryResolvers = ({
    type,
    filter,
    sort,
    paging,
    model,
    name
}: {
    type: any;
    filter: any;
    sort: any;
    paging: any;
    model: any;
    name: string;
}) => {
    const singular = name.toLowerCase();
    const table = singular + 's';

    const idField = model.fields.id;
    const idType = idField ? buildFieldType(idField, 'id', true) : null;
    if (!idType) throw new Error(`Model ${name} is missing a valid 'id' field.`);

    return {
        [`get${name}`]: {
            type,
            args: {
                id: { type: new GraphQLNonNull(idType) }
            },
            resolve: async (_: any, args: any, context: AuthContext) => {
                return await Sentry.startSpan({ name: `get${name}`, op: 'graphql.query' }, async () => {
                    if (!hasScope(context, `${singular}:read`)) {
                        throw new Error(`Unauthorized: missing ${singular}:read scope`);
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenant_id', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from(table)
                        .select('*')
                        .eq('id', args.id)
                        .single();

                    if (error) throw new Error(error.message);
                    return data;
                });
            }
        },
        [`list${name}s`]: {
            type: new GraphQLList(type),
            args: (() => {
                const args: Record<string, any> = {};
                if (filter) args.filter = { type: filter };
                if (sort) args.sort = { type: sort };
                if (paging) args.paging = { type: paging };
                return args;
            })(),
            resolve: async (_: any, args: any, context: AuthContext) => {
                return await Sentry.startSpan({ name: `list${name}s`, op: 'graphql.query' }, async () => {
                    if (!hasScope(context, `${singular}:read`)) {
                        throw new Error(`Unauthorized: missing ${singular}:read scope`);
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenant_id', value: tenantId });

                    let query = supabase.schema('api').from(table).select('*');

                    if (args.filter) query = applyFilters(query, args.filter, model.fields);
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
                    return data;
                });
            }
        }
    };
};
