import 'https://cdn.jsdelivr.net/npm/eruda'
import 'https://cdn.jsdelivr.net/npm/eruda-dom@2.0.0/eruda-dom.min.js'
import 'https://cdn.jsdelivr.net/npm/eruda-features@2.0.0/eruda-features.min.js'
import 'https://cdn.jsdelivr.net/npm/eruda-timing@2.0.0/eruda-timing.min.js'
import 'https://cdn.jsdelivr.net/npm/eruda-code@2.0.0/eruda-code.min.js'

export default {
    install() {
        const queryString = window.location.search
            .substring(1)
            .split('&')
            .map(p => p.split('='))
            .map(p => p.length === 1 ? [...p, true] : p)
            .reduce(
                /**
                 * @param {Record<string, string|boolean>} r
                 * @param {[string, string|boolean]} p
                 * @return {Record<string, string|boolean>}
                 */
                (r, p) => ({
                    ...r,
                    [`${p[0]}`]: p[1]
                }), {}
            );
        const getQueryString = (key) => queryString[key] ?? false;

        if (
            import.meta.env.MODE === 'development' ||
            getQueryString('debug')
        ) {
            eruda.init();

            eruda.add(erudaDom);
            eruda.add(erudaFeatures);
            eruda.add(erudaTiming);
            eruda.add(erudaCode);
        }
    }
};