import { AuthContext } from '../types/auth-context';

export const hasScope = (context: AuthContext, requiredScope: string): boolean => {
    return context.scopes.includes(requiredScope);
}