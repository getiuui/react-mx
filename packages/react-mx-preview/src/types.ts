export type FileLoader = (library: string, exportName?: string | null | undefined) => any

export type Props = {
  [key: string]: any
}

export type CodeLanguage = 'javascript' | 'typescript'
