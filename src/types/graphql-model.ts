export type GraphQLFieldType =
    | 'int'
    | 'float'
    | 'string'
    | 'boolean'
    | 'datetime'
    | 'json'
    | 'id'
    | 'text'
    | 'uuid';

export interface GraphQLFieldDefinition {
    type: GraphQLFieldType;
    required?: boolean;
    array?: boolean;
    enum?: string[];
    defaultValue?: any;
    excludeFromInput?: boolean;
    excludeFromOutput?: boolean;
    excludeFromFilter?: boolean;
    excludeFromSort?: boolean;
}

export interface GraphQLModel {
    name: string;
    fields: Record<string, GraphQLFieldDefinition>;
}