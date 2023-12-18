export enum InformationsType {
    ALL = 0,
    NEOFETCH = 1,
}

type PersonalInformations = {}
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
    if (type === InformationsType.NEOFETCH) {
        return {
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
            languages: [
                'JavaScript',
                'TypeScript',
                'PHP',
                'Go',
                'Bash',
                'PowerShell'
            ],
            terminal: 'macos-portfolio-nchoquet-terminal'
        };
    }

    return {}
}
