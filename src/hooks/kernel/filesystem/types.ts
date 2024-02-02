export type FileSystemOptions = {
    mocked?: boolean
};

export type FileItem = {
    type: 'file',
    path: string,
    name: string,
    extension: string,
    content: string|Blob|Array<string>
};
export type DirectoryItem = { type: 'directory' } & Pick<FileItem, 'path' | 'name'>;
export type FSTree = Array<FileItem | DirectoryItem>;

export type File = {
    path: string,
    name: string,
    extension: string
};
export type Directory = Omit<File, 'extension' | 'type'>;

export type UseFileSystemReturn = {
    file: {
        create(file: File, force?: boolean): void,
        remove(file: File, force?: boolean): void,
        rename(from: File, to: File): void,
        update(file: File, content?: string): void,
    },
    directory: {
        create(directory: Directory, force?: boolean): void,
        remove(directory: Directory, force?: boolean): void,
        rename(from: Directory, to: Directory): void,
    }
};
export type UseFileSystem = (options?: FileSystemOptions) => UseFileSystemReturn;

export type UseFilesReturn = {
    [K in keyof UseFileSystemReturn['file'] as `${K}File`]: UseFileSystemReturn['file'][K]
};
export type UseFiles = () => UseFilesReturn;
export type UseFoldersReturn = {
    [K in keyof UseFileSystemReturn['directory'] as `${K}Folder`]: UseFileSystemReturn['directory'][K]
};
export type UseFolders = () => UseFoldersReturn;
export type UseDirectoriesReturn = {
    [K in keyof UseFileSystemReturn['directory'] as `${K}Directory`]: UseFileSystemReturn['directory'][K]
};
export type UseDirectories = () => UseDirectoriesReturn;