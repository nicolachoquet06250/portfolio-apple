import { useInstalled } from '@/hooks/installed';
const { skipped } = useInstalled();

import * as finder from './finder';
import * as finderMock from './finder-mock';

import {ComputedRef} from 'vue';
import {Item} from '@/hooks/finder/types.ts';

export type Finder = {
    initBreadcrum(): void,

    useFinder(maxPerLine: number): {
        selectedTab: ComputedRef<string>,
        showedItems: ComputedRef<Item[][]>,
        activedItem: ComputedRef<string>,
        breadcrum: ComputedRef<string[]>;

        selectTab(tab: string): void,
        initBreadcrum(): void,
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
        createFile(path: string, { name, type, extention }: Pick<Item, 'name' | 'type' | 'extention'>): void,
        remove(id: number): void
    }
}

export default () => ({
    ...(skipped.value ? finderMock : finder)
} as unknown as Finder);
