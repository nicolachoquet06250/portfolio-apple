// import profilePicture from '@/assets/icons/facebook-profile-pic.png';

export enum InformationsType {
    ALL = 0,
    NEOFETCH = 1,
}

type PersonalInformations = {
    firstname: string,
    lastname: string,
    email: string,
    github: string,
    age: number,
    studiesLevel: string,
    expertiseField: string,
    globalSkill: string,
    programationLanguages: {
        label: string,
        icon: string,
        stars: number,
        frameworks?: {
            label: string,
            icon: string,
            stars?: number,
        }[],
        libraries?: {
            label: string,
            icon: string,
            stars?: number,
        }[],
        runtimes?: {
            label: string,
            icon: string,
            stars?: number,
        }[],
    }[],
    speakLanguages: string[],
    profilePicture: string,
    description: string|string[],
    postTitle: string,
    society: string,
    location: {
        city: string,
        region: string,
        country: string
    },
    summary: string|string[],
    phoneNumber: `${number}${number}.${number}${number}.${number}${number}.${number}${number}.${number}${number}.${number}${number}`,
    sites: {
        url: string,
        label: string
    }[]
}
type PersonalInformationsNeofetch = {
    firstname: string,
    lastname: string,
    age: number,
    studiesLevel: string,
    expertiseField: string,
    globalSkill: string,
    languages: string[],
    terminal: string
}

type UsePersonalInformations = <
    T extends InformationsType = InformationsType.ALL,
    R = T extends InformationsType.NEOFETCH ? PersonalInformationsNeofetch : PersonalInformations
>(type?: T) => R;

const birthday = new Date(1995, 6, 21);

// @ts-expect-error
export const usePersonalInformations: UsePersonalInformations = (type = InformationsType.ALL) => {
    const general = {
        firstname: 'Nicolas',
        lastname: 'Choquet',
        age: ((date) => {
            const diff = Date.now() - date.getTime();
            const age = new Date(diff);
            return Math.abs(age.getUTCFullYear() - 1970);
        })(birthday),
        studiesLevel: 'Bac +5',
        expertiseField: 'Développement FrontEnd',
        globalSkill: 'Développement FullStack',
    };

    if (type === InformationsType.NEOFETCH) {
        return {
            ...general,
            languages: [
                'JavaScript',
                'TypeScript',
                'PHP',
                'Go',
                'Bash',
                'PowerShell'
            ],
            terminal: 'macos-portfolio-nchoquet-terminal'
        } as PersonalInformationsNeofetch;
    }

    return {
        ...general,
        email: 'nicolachoquet06250@gmail.com',
        github: 'https://github.com/nicolachoquet06250',
        profilePicture: 'https://media.licdn.com/dms/image/D4D03AQFTmZCf8bLwNg/profile-displayphoto-shrink_800_800/0/1703607251330?e=1709164800&v=beta&t=v5PkiqgSs1Sd2h-1eb6Q5y6SicUgSzIsbLF2tEGNweM',
        programationLanguages: [
            {
                label: 'HTML 5',
                icon: 'fa-brands fa-html5',
                stars: 5
            },
            {
                label: 'CSS 3',
                icon: 'fa-brands fa-css3',
                stars: 4.5
            },
            {
                label: 'JavaScript',
                icon: 'fa-brands fa-js',
                stars: 4.5,
                runtimes: [
                    {
                        label: 'NodeJS',
                        icon: 'fa-brands fa-node-js',
                        stars: 4
                    },
                    {
                        label: 'Deno',
                        icon: 'fa-brands fa-microsoft',
                        stars: 4
                    },
                    {
                        label: 'BunJS',
                        icon: 'fa-brands fa-js',
                        stars: 2
                    },
                ],
                libraries: [
                    {
                        label: 'ReactJS',
                        icon: 'fa-brands fa-react',
                        stars: 3
                    },
                    {
                        label: 'VueJS',
                        icon: 'fa-brands fa-vuejs',
                        stars: 4.5
                    },
                    {
                        label: 'QwikJS',
                        icon: 'fa-brands fa-node-js',
                        stars: 4
                    },
                ],
                frameworks: [
                    {
                        label: 'Angular',
                        icon: 'fa-brands fa-angular',
                        stars: 3
                    }
                ],
            },
            {
                label: 'TypeScript',
                icon: 'fa-brands fa-microsoft',
                stars: 3
            },
            {
                label: 'PHP',
                icon: 'fa-brands fa-php',
                stars: 4,
                frameworks: [
                    {
                        label: 'Symfony',
                        icon: 'fa-brands fa-symfony',
                        stars: 3
                    },
                    {
                        label: 'Symfony API Plateform',
                        icon: 'fa-brands fa-symfony',
                        stars: 2
                    },
                    {
                        label: 'Symfony',
                        icon: 'fa-brands fa-laravel',
                        stars: 4
                    },
                ]
            },
            {
                label: 'Go',
                icon: 'fa-brands fa-golang',
                stars: 3
            },
            {
                label: 'Bash',
                icon: 'fa-brands fa-linux',
                stars: 3
            },
            {
                label: 'PowerShell',
                icon: 'fa-solid fa-terminal',
                stars: 2
            },
            {
                label: 'MySQL',
                icon: 'fa-solid fa-database',
                stars: 2
            },
        ],
        speakLanguages: [
            'Français',
            'Anglais'
        ],
        postTitle: 'Ingénieur Développeur FullStack',
        society: 'norsys',
        location: {
            city: 'Sophia-Antipolis',
            region: 'Provence-Alpes-Côte d\'Azur',
            country: 'France'
        },
        summary: [
            "Passionné par le développement, je passe mon temps à étudier",
            "de nouvelles technologies et de nouveaux langages dans le but de",
            "m’adapter plus facilement aux différents contextes projets",
            "",
            "PS: J'adore les karaokés."
        ],
        phoneNumber: '07.63.20.76.30',
        sites: [
            {
                url: 'https://www.linkedin.com/nicolqs-choquet-23323993',
                label: 'Linkedin'
            },
            {
                url: ((href: string) => {
                    const splitHref = href.split('/');
                    splitHref.pop();
                    return splitHref.join('/')
                })(window.location.href),
                label: 'Personnel'
            },
            {
                url: 'https://devengers.slidelist.nicolaschoquet.fr',
                label: 'Autre'
            },
        ]
    }
}
