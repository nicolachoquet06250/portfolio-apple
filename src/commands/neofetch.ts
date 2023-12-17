import type {TerminalCommand, TerminalCommandExecute} from '@/commands/types';

export const command: TerminalCommand['command'] = /^neofetch ?(?<flags>--help ?)?$/g;

const profilePicture = () => [
    `<div style="font-family: monospace; font-size: 7px">
        ${[
        "KOK9H#BQDyzi|j#@@@@@@@@@@@@Q@@@@QQQQQQQQQQQQQQQQQQQQQQQQQQQQgDW#NQQ@QQQQQQQ#NWRd",
        "+|iy%@@@@QObMO6dBQ@@@@@@@@@@@@@@QQQQQQQQQQQQQQQQQQQQQQQQBN8HKKbgNOEw4ayjf[Jzzzvv",
        ">;::>R@@@@@@@@Qgq9RQQQQQQQQQQQQQQQQQQQQQQQQQQQBB##NNNNggM8NWOOKOHm}Jx[Fuj2oVmP6q",
        "|=;;^E@@@@@@@@@@@QDpO8dA6pOdHDNNNNNNNggW88RRRRRRRRRR8RRR%OdNNDO99pdW#BQQQQQQQQQQ",
        "/lup##Ng8DOpUkXe4ZoyVEEPEkAEwP9dR8RRD%%%HbOKOdHHHH%%DRRDb96bWH99XmOQQ@@@@@@@@@@@",
        "ujjufII[{[[IfjyaeP6pORW8%ObdpEmmPUOR88RD%HHHbbbOHDRRRR88R%KPyoPUqKpOgQQQQQQQQQQQ",
        "Xk9pOb%RWN#BQQQQQQ@@@@@QQB8HbDb6PE69OHR888888MMWggggggNNNNNWD8N#BQQQQQQQQQQQQQQQ",
        "QQQ@@@@@@@@@@@@@@@@@QQB#Ng#BMRRDOqpKOdRW#BQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ@@",
        "k#Q@@@@@@@@@@@@QQ#W#gg8WNNNN#NN#NHOp9O%W#QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ@@@",
        "k6#@QQQQQQ@Q@@@WbDMgBN#NNN#N8%qEUpHNDp6qODg#N#QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ@",
        "NK6BQQQQQQQQQWDRMDRR%O9Emayyyxl///luPOH92zFoa4DQ#gg#BBN#BBBBBBQQQQQQQQQQQBBB####",
        "NQAqQQQQQQNWDD84xz[oyI}I{zzzviL\\i)vzzo6%2**=?I88RRWNgD%DDdOp96EPmeVo2yjuII{xzvu@",
        "SgQmNQQ#8dp9MOv//ivzx{JJzzv)lllll)vzzzzFEb4ilzf2yjuFIxx{{xJJ{}IFuj2oZewP6qKdbekD",
        "IPQNaeZy}z2R9{zzvTvzzzzv)v))))TvvvvzzzzzyKgpoePPPPUObpqKOOOOOOObdDRR8WNBQQQ#96HD",
        "ImNQeTzi^:mHofFIxzzzzzvT)T))vvvvvzvzzxJzuANQMqaS4kKHDHqVoay2aVeXEA9KO%MWNNgE9Ob9",
        "oXNQRSm?`'BOayuufIzzvvv))TvvvvvvvvvzvzzJI48BB9zTv}ujSSI,```':;rrrrr+^r^^+xE9q66@",
        "oAQQQx` ;QDwVyjuIxzvvvvT)vvvvvT)TTTvvzz{I6BBp+rr^r;;;:_.     `'~_~_:::::L6KDHqE@@@@",
        "yEQQQf:  LQ8EeajuF{zvvvv)llllllv}Smmou{zzJjgBbvLiii=:,,,,,'`    `'~___+vzzXpqmI}@@@",
        "f9QQNe;` iQN6moyy2yu}xxzT)llv{oEPau{}I}}JzzP8Ujivzz|:~~~~~~~,-`    -,^llzz{PPf[x@",
        "SgQQD9,`zQ#keEqEwEEEX4jI{zz}ySeEpRKpkofJzzVOe[/)v?:~~~,,,,,,,'`   `=vujx}kfxx[@",
        "8QQQWHlv^jQBmXUmyjawkEmeVIvvxuym4oyuI{Tl)vz4pez*|ll|^^^^^;;;;;;;;:,,;vfyfjVjJJxx@",
        "QQQQNNLvvfQBPVZwOOAP4mVyjFxJ[}xzJx{zvlLl)vzwKjv[22z|=?||?****=>^;;;;;z[Ijm2fIIFF@",
        "Q@@QQQ;^rNB6eaSf}[ff{xjjf}{{IFFIzviLLLlv{IUdZFHMdS/>r^^^;;;;^;;:::::=iISVaajjjy@",
        "Q@@QQQ/;;;aQ%waj}vvTvzIojuJvzJzJjayxzvlvfao9D6F6RNqv>^;;;;;;;;;;::__:_+luSeayyoo@@",
        "@@Q@QB[r*=/N#peofzllzjmaZEmSVk9PajoeZojuV99ORRmok9Z/=?*rr=??|||r::::;;/)jememwVa@@@@",
        "@QQQQ#az2S2UBgK6VFzzIeeXpNQBQBBNMHKOHRKyEbODRNDEXRQQQQBBQQQQQQQQQQQQQFvxe6U9bOek",
        "QQQQB#eJ2yjm8#WDq4yy6OdMg#BNNBNRD8gRNN94dR8gggDUHQQ@@@QQQQQQQ@Q@@Q#A}{}uP9pD%6pp",
        "QQQQgWz.`'+i6#BN8pXEWNN#B#DPyfj4V22PRgKdgNQQBN8XwRQ#8N#OdNBQ@@@QBOSF}jZaE6KRU64a",
        "QQQ#RO;    ')O#B#MOk%NRPXEmVVmXmmwEK8N#BBQQQQ#Ou{xNQ#QQPVjuVVm69eouFjaEUKdD8K9Vw",
        "QB#8Hp:    '=UNQQQN8WBg%p9pbHRRRdOOM#BQQQQQQQOj{z}QQQQH6wXX6AAXmXXeaoZXK8##NDgOp",
        "QN8%KX: `,^|)wONQQQQQQQ#gOOOpOOpK8N#QQQQQQQBOZI[xNQQQ8UEXkpq99U6AAEEPEEEE9O88R8N",
        "Bgb%6V|^|//)2XpMQQQQQQQQNRbKdD8NBQQQQQQQBRPVyjyNQQQN96UEEmEOK96UU96EEXPkp9qKKqq",
        "RNPpEu;r||>^=vzFgQQQQ@@QQQQQQQQQQQQQQQQQ#HwV4eqQ@@QHHdHgWDKU6UqKpKq6A9qpp9qpKOOp",
        "%NAm4z;|/*=akqHNQQQQQQQQQQ@@QQQQQQQQQBD9kAOQ@@@NObqqHq9KR8RHppAk69qpO6kpdOK9dO",
        "D8KZmzr|/)Tj8BNOOHQQQQQQQQQQQ@@QQQQQQBWDdHNQ@@@#dDbpOHO99q96KD8NR6E69qkpddHU6Obp",
        "O9qeazzPU8##N8DN%gQ@@@QQQQQQQWH%HMRdbD#Q@@@@NDdHKbHdbppqp999KbOpdK6pKD%d99dDHUp",
        "9VXkZFmgNNgN8#WRNNWWQ@@@@@QQW9PXPU9HNQ@@@@@BDbOOO%RDDdOOdOpp9UK8DOU99pKOpHDOUpRd",
        "kjo96oHgNN#M8#gRgNNWWgQ@@@@@@@@@@@@@@@@@@QHDHb%RDR8RDHdH%bpUqqqK%RD69pbODK69bd6O",
        "myVE9mNNQQ#N##N8gNNNN#ggB@@@@@@@@@@@@@QBMHD%DRRRRgR8RdHRHOp9pKpqKpObKpOp9bRdEEDq",
        "w6VwkmMQQQN####NNN#NN#BNgg#Q@@@@@@@@QNN888RRRRMRMg88RHOddOOOK96pdO9KHDKRM8OKd66W"
    ].join('<br>')}
    </div>`
]

export const execute: TerminalCommandExecute = () => {
    return profilePicture();
}