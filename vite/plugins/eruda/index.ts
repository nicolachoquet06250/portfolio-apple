// @ts-nocheck

import 'https://cdn.jsdelivr.net/npm/eruda'
import 'https://cdn.jsdelivr.net/npm/eruda-dom@2.0.0/eruda-dom.min.js'
import 'https://cdn.jsdelivr.net/npm/eruda-features@2.0.0/eruda-features.min.js'
import 'https://cdn.jsdelivr.net/npm/eruda-timing@2.0.0/eruda-timing.min.js'
import 'https://cdn.jsdelivr.net/npm/eruda-code@2.0.0/eruda-code.min.js'

export default {
    install() {
        const queryString: Record<string, string|boolean> = window.location.search
            .substring(1)
            .split('&')
            .map(p => p.split('='))
            .map(p => p.length === 1 ? [...p, true] as [string, string|boolean] : p)
            .reduce<Record<string, string|boolean>>(
                (r, p) => ({
                    ...r,
                    [`${p[0]}`]: p[1]
                }), {} as {[k: string]: string|boolean}
            );
        const getQueryString = (key: string) => queryString[key] ?? false;

        if (getQueryString('debug')) {
            eruda.init();

            eruda.add(erudaDom);
            eruda.add(erudaFeatures);
            eruda.add(erudaTiming);
            eruda.add(erudaCode);
        }

        if (import.meta.env.MODE === 'development') {
            const banner = document.createElement('div');
            banner.innerHTML = 'Développement';
            banner.style.backgroundColor = 'darkgreen';
            banner.style.position = 'absolute';
            banner.style.top = '50px';
            banner.style.left = '20px';
            banner.style.display = 'flex';
            banner.style.justifyContent = 'center';
            banner.style.alignItems = 'center';
            banner.style.color = 'white';
            banner.style.padding = '10px';
            banner.style.borderRadius = '10px';

            document.querySelector('body').insertBefore(banner, document.querySelector('#app'))
        }
    }
};