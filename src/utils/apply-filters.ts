import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export const applyFilters = <T extends Record<string, unknown>>(
    query: PostgrestFilterBuilder<any, T, any>,
    filters: Record<string, any>,
    modelFields: Record<string, any>
): PostgrestFilterBuilder<any, T, any> => {
    for (const [key, value] of Object.entries(filters)) {
        const [field, op] = key.includes('_') ? key.split('_') : [key, 'eq'];

        if (!modelFields[field]) continue;

        switch (op) {
            case 'contains':
                query = query.ilike(field, `%${value}%`);
                break;
            case 'startsWith':
                query = query.ilike(field, `${value}%`);
                break;
            case 'endsWith':
                query = query.ilike(field, `%${value}`);
                break;
            case 'eq':
                query = query.eq(field, value);
                break;
            case 'neq':
                query = query.neq(field, value);
                break;
            case 'lt':
                query = query.lt(field, value);
                break;
            case 'lte':
                query = query.lte(field, value);
                break;
            case 'gt':
                query = query.gt(field, value);
                break;
            case 'gte':
                query = query.gte(field, value);
                break;
            default:
                if (modelFields[key]) {
                    query = query.eq(key, value);
                }
        }
    }

    return query;
}
