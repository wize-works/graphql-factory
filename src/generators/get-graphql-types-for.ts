import { generateObjectType } from './generate-object-type';
import { generateInputType } from './generate-input-type';
import { generateFilterType } from './generate-filter-type';
import { generateSortType } from './generate-sort-type';
import { generatePagingInput } from './generate-paging-input';

export const getGraphQLTypesFor = (model: any, name: string) => {
    return {
        type: generateObjectType(name, model),
        input: generateInputType(name, model),
        filter: generateFilterType(name, model),
        sort: generateSortType(name, model),
        paging: generatePagingInput(name),
        model
    };
}
