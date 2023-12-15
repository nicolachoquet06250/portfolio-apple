import { useInstalled } from '@/hooks/installed';
const { skipped } = useInstalled();

import * as finder from './finder';
import * as finderMock from './finder-mock';

import type {ComputedRef, Ref, WritableComputedRef} from 'vue';
import {Item} from '@/hooks/finder/types.ts';
import {computed} from 'vue';
import iconDirectory from '@/assets/icons/icon-directory.png';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';

export type Finder = {
    initBreadcrumb(): void,

    useFinder(maxPerLine: number): {
        selectedTab: ComputedRef<string>,
        showedItems: ComputedRef<Item[][]>,
        activatedItem: ComputedRef<string>,
        breadcrumb: ComputedRef<string[]>;

        selectTab(tab: string): void,
        initBreadcrumb(): void,
        selectItem(item: Item): void,
        activeItem(item: string): void,
        backInPath(): void
    },

    useRootDirectory(): {
        root: ComputedRef<string>,
        subDirectory: ComputedRef<string>,

        setRoot(root: string): void,
        setSubDirectory(subDir: string): void
    },

    useTreeActions(): {
        tree: ComputedRef<Item[]>,
        get(): void,
        add(root: string, dirName: string): void,
        createFile(path: string, { name, type, extension }: Pick<Item, 'name' | 'type' | 'extension'>): void,
        remove(id: number): void
    },

    getChildrenItems(): (root: string, dirName: string) => Item[];

    isPathExists(path: string): boolean;
}

type WritableRef<T> = Ref<T> | WritableComputedRef<T>

export function createItemSelector(
    breadcrumb: WritableRef<string[]>,
    showedItems: WritableRef<Item[]>,
    activeItem: WritableRef<string>
) {
    return (item: Item) => {
        if (
            item.type === 'directory' &&
            !breadcrumb.value.includes(item.name)
        ) {
            breadcrumb.value = [
                ...breadcrumb.value,
                item.name
            ];

            activeItem.value = '';
            showedItems.value = item.children!;
        }
    };
}

export function createTabSelector(
    rootDir: WritableRef<string>,
    selectedTab: WritableRef<string>
) {
    return (tab: string) => {
        rootDir.value = tab;
        selectedTab.value = tab;
    };
}

export function createItemActivator(
    activeItem: WritableRef<string>
) {
    return (item: string) => {
        activeItem.value = item;
    }
}

export function createBreadcrumbInitializer(
    breadcrumb: WritableRef<string[]>,
    selectedTab: WritableRef<string>
) {
    return () => {
        breadcrumb.value = [selectedTab.value];
    }
}

export const getChildren = (tree: WritableRef<Item[]>) =>
    (root: string, dirName: string): Item[] => {
        return tree.value.reduce<Item[]>((r, c) => {
            return c.parent === `${root}/${dirName}`
                .replace('//', '/')
                    ? [
                        ...r,
                        {
                            ...c,
                            icon: c.type === 'directory'
                                ? iconDirectory : iconUnknownFile,
                            children: getChildren(tree)(
                                `${root}/${dirName}`,
                                c.name
                            )
                        }
                    ] : r
        }, []);
    };

export const getComputedShowedItems = (
    showedItems: Ref<Item[]> | WritableComputedRef<Item[]>,
    maxPerLine: number
) => computed<Item[][]>(() => showedItems.value
    .reduce<{ cmp: number, result: Item[][] }>(
        (r, c) => {
            if (r.cmp === 0) {
                return {
                    cmp: r.cmp + 1,
                    result: [...r.result, [c]]
                }
            }
            else if (r.cmp < maxPerLine) {
                const lastItem = r.result.pop()!;
                return {
                    cmp: r.cmp + 1,
                    result: [...r.result, [...lastItem, c]]
                };
            }
            else if (r.cmp === maxPerLine) {
                return {
                    cmp: 1,
                    result: [...r.result, [c]]
                }
            }
        
            return r
        }, {cmp: 0, result: []}
    ).result ?? []);

export default () => ({
    ...(skipped.value ? finderMock : finder)
} as unknown as Finder);
