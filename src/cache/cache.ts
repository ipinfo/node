export default interface IPCache {
    get(key: string): any;
    set(key: string, data: any): void;
}
