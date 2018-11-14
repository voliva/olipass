
// Hackish implementation of Q promises
export const deferPromise = <T = any>() => {
    const ret = {
        resolve: null as any as ((res: T | PromiseLike<T> | undefined) => void),
        reject: null as any as ((reason: any) => void),
        resolved: false,
        promise: null as any as Promise<T>
    };
    ret.promise = new Promise<T>((res, rej) => {
        ret.resolve = (...args) => {
            ret.resolved = true;
            res(...args);
        };
        ret.reject = rej as any;
    });
    return ret;
}