const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { Kayn, REGIONS } = require('kayn');

const app = express();

const origin = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://compassionate-noyce-576507.netlify.com';

const kayn = Kayn(process.env.RIOT_LOL_API_KEY)();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin }));

const processMatch = (championIdMap, summonerId, match, spellList, itemList) => {
    const { participantId } = match.participantIdentities.find(
        pi => pi.player.summonerId === summonerId,
    );
    const participant = match.participants.find(
        p => p.participantId === participantId,
    );
    const champion = championIdMap.data[participant.championId];

    const findSpell = id => spellList.find(spell => spell.key == id);
    const findItem = id => {
        const item = itemList.find(item => item[0] == id);
        if (item && item.length > 1) return item[1].name;
        else return;
    }

    return {
        gameCreation: match.gameCreation,
        seasonId: match.seasonId,
        didWin:
            participant.teamId ===
            match.teams.find(({ win }) => win === 'Win').teamId,
        championName: champion.name,
        championImg: champion.image,
        kda: {
            kills: participant.stats.kills,
            death: participant.stats.deaths,
            assists: participant.stats.assists
        },
        items: [
            findItem(participant.stats.item0),
            findItem(participant.stats.item1),
            findItem(participant.stats.item2),
            findItem(participant.stats.item3),
            findItem(participant.stats.item4),
            findItem(participant.stats.item5),
            findItem(participant.stats.item6)
        ],
        championLevel: participant.stats.champLevel,
        totalCreepScore: participant.stats.totalMinionsKilled,
        creepScorePerMin: participant.stats.totalMinionsKilled / (match.gameDuration / 60),
        spells: [
            findSpell(participant.spell1Id),
            findSpell(participant.spell2Id)
        ],
        perks: [
            participant.stats.perk0,
            participant.stats.perk1,
            participant.stats.perk2,
            participant.stats.perk3,
            participant.stats.perk4,
            participant.stats.perk5,
            participant.stats.statPerk0,
            participant.stats.statPerk1,
            participant.stats.statPerk2
        ],
        duration: match.gameDuration
    }
}

app.get('/', async (req, res) => {
    const name = req.query.name;

    const championIdMap = await kayn.DDragon.Champion.listDataByIdWithParentAsId();
    const { id, accountId } = await kayn.Summoner.by.name(name);
    const { matches } = await kayn.Matchlist.by
        .accountID(accountId)
        .query({ queue: 420 });
    const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId);
    const matchDtos = await Promise.all(gameIds.map(kayn.Match.get));
    const spellListResult = await kayn.DDragon.SummonerSpell.list().version('9.16.1');
    const itemListResult = await kayn.DDragon.Item.list().version('9.16.1');
    // convert spell and item list object into array
    const spellList = Object.values(spellListResult.data);
    const itemList = Object.entries(itemListResult.data);

    // `processor` is a helper function to make the subsequent `map` cleaner.
    const processor = match => processMatch(championIdMap, id, match, spellList, itemList);
    const results = await Promise.all(matchDtos.map(processor));

    res.json({ data: results });

});

app.listen(4000, () => {
    console.log('Listening on port 4000')
})

