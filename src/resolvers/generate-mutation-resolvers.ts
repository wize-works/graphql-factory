import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { supabase } from '../utils/supabase';
import Sentry from '../utils/sentry';
import { AuthContext } from '../types/auth-context';
import { hasScope } from '../utils/has-scope';

export const generateMutationResolvers = ({
    type,
    input,
    model,
    name
}: {
    type: any;
    input: any;
    model: any;
    name: string;
}) => {
    const singular = name.toLowerCase();
    const table = singular + 's';

    return {
        [`create${name}`]: {
            type,
            args: {
                input: { type: new GraphQLNonNull(input) }
            },
            resolve: async (_: any, args: any, context: AuthContext) => {
                return await Sentry.startSpan({ name: `create${name}`, op: 'graphql.mutation' }, async () => {
                    if (!hasScope(context, `${singular}:write`)) {
                        throw new Error(`Unauthorized: missing ${singular}:write scope`);
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenantId', value: tenantId });

                    const input = { ...args.input };
                    for (const [key, field] of Object.entries(model.fields) as [string, { defaultValue?: any }][]) {
                        if (input[key] === undefined && field.defaultValue !== undefined) {
                            input[key] = typeof field.defaultValue === 'function'
                                ? field.defaultValue()
                                : field.defaultValue;
                        }
                    }
                    
                    const { data, error } = await supabase
                        .schema('api')
                        .from(table)
                        .insert([{ ...args.input, tenantId: tenantId }])
                        .select()
                        .single();

                    if (error) throw new Error(error.message);
                    return data;
                });
            }
        },
        [`update${name}`]: {
            type,
            args: (() => {
                const args: Record<string, any> = {
                    input: { type: new GraphQLNonNull(input) }
                };
                if (model.fields.id) {
                    args.id = { type: new GraphQLNonNull(GraphQLInt) };
                }
                return args;
            })(),
            resolve: async (_: any, args: any, context: AuthContext) => {
                return await Sentry.startSpan({ name: `update${name}`, op: 'graphql.mutation' }, async () => {
                    if (!hasScope(context, `${singular}:write`)) {
                        throw new Error(`Unauthorized: missing ${singular}:write scope`);
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenantId', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from(table)
                        .update(args.input)
                        .eq('id', args.id)
                        .select()
                        .single();

                    if (error) throw new Error(error.message);
                    return data;
                });
            }
        },
        [`delete${name}`]: {
            type,
            args: (() => {
                const args: Record<string, any> = {};
                if (model.fields.id) {
                    args.id = { type: new GraphQLNonNull(GraphQLInt) };
                }
                return args;
            })(),
            resolve: async (_: any, args: any, context: AuthContext) => {
                return await Sentry.startSpan({ name: `delete${name}`, op: 'graphql.mutation' }, async () => {
                    if (!hasScope(context, `${singular}:write`)) {
                        throw new Error(`Unauthorized: missing ${singular}:write scope`);
                    }

                    const { tenantId } = context;
                    await supabase.rpc('set_config', { key: 'app.tenantId', value: tenantId });

                    const { data, error } = await supabase
                        .schema('api')
                        .from(table)
                        .delete()
                        .eq('id', args.id)
                        .select()
                        .single();

                    if (error) throw new Error(error.message);
                    return data;
                });
            }
        }
    };
}