export type Item = {
    id?: number,
    user_id: number,
    name: string,
    type: string,
    parent: string,
    icon?: string,
    children?: Item[],
    content: string|null,
    extension: string|null,
    creation_date: Date|string,
    updated_date: Date|string,
    opened_date: Date|string,
};

export type FinderEvent = {
    context: {
        getAllValues(): {
            connect(): void
        },
        add(item: Item): void,
        remove(id: number): void
    }
};