export interface CrudRepo<T> {
    save(entity: T): Promise<T>;
    delete(id: number): Promise<void>;
    getById(id: number): Promise<T | null>;
    update(entity: T): Promise<T>;
}