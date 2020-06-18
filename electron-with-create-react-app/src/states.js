export const gameStates = {
    phase1: {
        name: 'Banning Phase 1',
        type: 'ban',
        perTeam: 3,
        cycles: 3 * 2,
        time: 27,
        totalTime: 6 * 27
    },
    phase2: {
        name: 'Champion Selection 1',
        type: 'champ',
        perTeam: 3,
        cycles: 3 * 2,
        time: 27,
        totalTime: 6 * 27
    },
    phase3: {
        name: 'Banning Phase 2',
        type: 'ban',
        perTeam: 2,
        cycles: 2 * 2,
        time: 27,
        totalTime: 6 * 27
    },
    phase4: {
        name: 'Champion Selection 2',
        type: 'champ',
        perTeam: 2,
        cycles: 2 * 2,
        time: 27,
        totalTime: 6 * 27
    },
    phase5: {
        name: 'Finalization',
        type: 'finish',
        perTeam: 1,
        cycles: 1,
        time: 60,
        totalTime: 1 * 60
    }
}