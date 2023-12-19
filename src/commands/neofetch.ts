import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';
import {useTerminalLineHeader} from '@/hooks/terminal/line-header';
import {InformationsType, usePersonalInformations} from '@/hooks/personal-informations';
import {CSSProperties} from 'vue';

export const command: TerminalCommand['command'] = /^neofetch ?(?<flags>--help ?)?$/g;

const profilePicture = () => `<div style="font-family: monospace; font-size: 5px; line-height: 5px">
        ${[
        "UKpq8BQQ84{v/uBQ@@@@@@@@@@@@@@@@QQQQQQQQQQQQQQQQQQQQQQQQQQQB8Dg#NBQQQQQQQ#NgR%Op",
        "r+zHQ@@@Q8WBMqKNQ@@@@@@@@@@@Q@QQQQQQQQQQQQQQQQQQQQQQQQQBNR%KKH8gOeZ2juF[xzzzzzz@",
        ">^::=6@@@@@@@@QQbpRBQQQQQQQQBQQQQQQQQQQQQQQQBBB##NNNNNWg8RNNHOKKbAufjjSaVeXE9pOH",
        "|?^;?P@@@@@@@@@@QQDpKDO6A9KbdHWNN#NNgggW88RRDDRRRRRR88RR%OdWNRKp9pHgQQQQQQQQQQQ@",
        "/lzjKWg8%bK9APweZZaoyVkkEE66kPPUbD88RD%DDHdOObdH%%DDDRRRDdp6d8dp9EXKQQ@@@@@@@@@@",
        "ujjjuuuFFfuj2o4Xk9OdRg#NRddHKUXwP6OD8MRRD%%%HHHHDR888888R%KEyo6qKOOH#QQQQQQQQQQQ",
        "qOHDR8NN#BQQQQQQ@@@@@@QQQQNRbHHpEkU9OHRR8MWgggNNNNNNN#######gNBBQQQQQQQQQQQQQQQ@",
        "QQ@@@@@@@@@@@@@@@@@QQQNNNgBQgMMMOKOOOHRgBQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ@@",
        "XD@@@@@@@@@@@@@Qg8DgNg#N######NN#8dO9pHRN#QQQQ@@QQQQQQQQQQQQQQQQQQQQQQQQQQQQ@@@@",
        "K6NQQQQQQQ@QQQQR%MNNB##N8RDRO6ajSZ6HW%966pRgWMQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ@",
        "BRk8QQQQQQQQQRR8pAUO9EVV2jIIIvi///ivoXKOevlvzJpQN8WNQQNNQQBBBBB#####NNgW8RD%bOKK",
        "HQpwQQQQQ#R%O8k})lJuuI}}{JzzTliL/lvvzzue%p|?||jOOOOOKpAEPm4Vo2yjufIII}[[{[III{za",
        "jOQKR##gbq6qNEliilzz{{zzzzvv))TTTvzzzzz[eO6IJIy2jujjjuuyoooaZVemPE69pKHDMgN#%kH8",
        "IeQQuzvT/|aMa}}{zvzzzzzvTvTTvvvvvvzzJxJJy9#gEEkEkUODR%OKOOKKppKKOb%RRM#QQQQW6pHH",
        "feBQ4}oz:,KdojufI{zzzzvvTvvvvvzzzzzzzxxxjPNQNKyjVEqOHdEyvL|z}j2oaZemX6E666EKOKq@",
        "aXBQ%ju;`,Q%ZojjuIJzvvvTTvvvvvvvvvzzvzzJIo8BBd//i))vvL=-   `':;;;;;;;;;;^oEppUU@",
        "SPQQQj;` ^Q8Peoyjf{JzvvvvTTT)Tvvvv{I}zzJxxE#BR|??**^:~,,'.`    `',__::;r|zpHHp4o",
        "jXQQQE_` |QNAXajfF}xvvzvlllllvIaEEXVjuF[xxI9#d[)zJx/:~~~~_~,``   `',_:)zxJyP6o}[",
        "jKQQRp;.`iQBAmePE696XVyFzzvvxjaZVVmeXejF{zzoD6FLlvv|:~~~~~~~~,.`    'rizux[Ey[{}",
        "UQQQD%i*'vQQXwq9jIIfaVVVSuzzF2ZEPE9PeZfxvvJZOXz|lT|;:::::::::::,'``,\\fS}}Zm[xx[@",
        "QQQQMgixLjQQmmma9OKO66wVSFzz{}IujjfI{zilTvzZpVTTzv=*||****>>>+^^;;+zIuuaaj{[I}@@",
        "Q@@@BQ|||/QQP4Zemajj22jjjuI}IFI}zvvvliilvzIXKVF6O9}=====>>>>>r;::::;iuj4wSyuujj@",
        "Q@@QQQ=;;;OQ9woyIzzzzz}2yu{zz[II2yzvTliv{jy6%AyOggPv>^;;;;;;;;;;::::::*vyoeejy2S",
        "@@QQQQ/^+rFB86Z2Izllv{VZy2FxIjyyjjaoF{z[SXPp8Hy4bRPT++r^^^rrr++;::__::|ljZm4aZZZ",
        "@QQQQ#I/J{I9QMUES}vv}Z4498N8NN#8bp69KbASEbOHRNOXmpDKppUA9pOKOOK9Ek69K{lzeEAAKpee",
        "@QQQ##S{VZoPN#R%EaufmqKDW#QBBQBN88M8NNpZODRWgND6DQQQ@QQQQQQQQQQQ@@QWo{[fApKODpqO",
        "QQQQNNJ::;izd##ND9eP8gN#B#WqmeeEEkwE8g9pWNBB#gR99NQQ#QBgBQQ@@@@@QgVf}fooA6OR96XV",
        "QQQQRD;   `~oHQQNR9A8N8KbOAeaVVaoam6RNN###QQQ#boIuQQg#QEyjaAO%8DUmufuoPEpODWK9Zm",
        "QQBNDH_    `?e#QQBgHR#8O6AUpODDHOKOR##QQQQQQQWaIzzQQQQDEwPmPPPmem4oyyZAdNN#N%866",
        "Q#gROU'  -:^vE8BQQQQQQBNROOHd%ddbDMNQQQQQQQQREF[z9QQQB9kXP9pU6AEk66APEPX6dW#g8gN",
        "QNDR9Pr:;?/zSEpMQQQQQQQBWHOqKHHM#QQQQQQQQNKm2uuDQQQBO99P6AAK96666AAEEk66UA9ddOH@",
        "8gAOEo^>\\?>zIyBQQQ@@QQQQB##QQQQQQQQQQQB8Pe4VPg@@Q#HOHgDKUA6U9q99UAEA6pppp9bdpK@@",
        "DNweVI;|/=+/jm6RNQQQQQQQQQQ@@QQQQQQQQQQDpAkb#@@@BHbqqdpqdRR%bqpA6U99pKU9ObOppbK@",
        "RM9ZeI+|/l)FRBgHObQQQQQQQQQQQ@@QQQQQQQgRHHNQ@@@QDRbKbHO9qp99O8WgH6E6U99OObd9Kbbp",
        "Hpqmo{000beA%#BNR%MDNQ@@@QQQQQQQN88RNMHdDNQ@@@@QRHDObDHdKppp99pKdbHHp9pO%dO9OH@@",
        "9ek6afPR#NgNMN8DNNMNQ@@@@@QQgOEPE6pHNQ@@@@@QRddbb%RDDdOOdbppq9b8DO99ppKObH%O9ODd",
        "Eye9EaRNNN#gM#WRNNNNMNQ@@@@@@@@@Q@@@@@@@@QDDHb%RDR8RRHHH%bp9qpqK%R%69pHbHO9Kbd9d",
        "eS4EqX##QQ#N##N8gNNNN#NNQ@@@@@@@@@@@@@QQWDR%DRR88g88DH%RHOKqpOppOKddOKHKKdRHE6Hp",
        "P6VXEwNQQQ##B##NN#####BNggQQ@@@@@@@@QBNMW8RRR8W8Wg8MR%dHHbOOKq9pHHpOH%OH8RObO6pW"
    ].map(l => l.replace(/ /g, '&nbsp;')).join('<br>')}
    </div>`;

type CSS = (style?: CSSProperties|null) => string;
const css: CSS = (style = null) => {
    if (!style) return '';

    return Object.entries(style).map(([property, value]) => {
        if ((property.match(/(^[a-z]|[A-Z0-9])[a-z]*/g) ?? []).length > 1) {
            const matches = property.match(/(^[a-z]|[A-Z0-9])[a-z]*/g)!;
            return [matches.map(p => p.toLowerCase()).join('-'), value];
        }
        return [property, value];
    }).map(([property, value]) => `${property}: ${value};`).join(' ');
};

export const execute: TerminalCommandExecute = () => {
    const {
        firstname,
        lastname,
        age,
        expertiseField,
        languages,
        terminal,
        studiesLevel,
        globalSkill
    } = usePersonalInformations(InformationsType.NEOFETCH);
    const lineHeader = useTerminalLineHeader();
    const profilPic = profilePicture();

    const monospace = css({
        fontFamily: 'monospace'
    })

    return `<div style="${css({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    })}">
        ${profilPic}
        
        <div style="${css({
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: '10px',
        })}">
            <div style="${monospace}">
                ${lineHeader.value}
            </div>
            
            <div style="${monospace}">
                ${Array.from(new Array(lineHeader.value.length)).map(() => '-').join('')}
            </div>
            
            <div style="${monospace}"> Prénom: ${firstname} </div>
            
            <div style="${monospace}"> Nom de famille: ${lastname} </div>
            
            <div style="${monospace}"> Age: ${age} </div>
            
            <div style="${monospace}"> Niveau d'études: ${studiesLevel} études:</div>
            
            <div style="${monospace}"> Domaine d'expertise: ${expertiseField} </div>
            
            <div style="${monospace}"> Cométences globales: ${globalSkill} </div>
            
            <div style="${monospace}"> 
                Langages maitrisés:
                és:<ul style="${css({
                    padding: 0,
                    paddingLeft: '15px',
                    marginTop: '5px',
                    marginBottom: '5px',
                    listStyle: 'none',
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                })}">
                    ${languages.map((language => 
                        `<li style="${monospace}">
                            ${language}
                        </li>`)).join('')}
                </ul>
            </div>
            
            <div style="${monospace}"> Terminal: ${terminal} </div>
        </div>
    </div>`;
}