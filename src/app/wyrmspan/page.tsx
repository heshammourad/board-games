'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import {ChangeEvent, SyntheticEvent, useState} from 'react';

import GamePageLayout from '../../components/GamePageLayout';
import PlayerSetup, {Player} from '../../components/PlayerSetup';
import ScoreInput from '../../components/ScoreInput';
import ScoreSheet, {ScoreResult} from '../../components/ScoreSheet';
import {useScores} from '../../hooks/useScores';
import {pickMany, pickOne} from '../../utils/random';

const GUILDS = [
  {name: 'Guild of Highlands', color: '#e1ad01'},
  {name: 'Guild of Seafarers', color: '#5c6bc0'},
  {name: 'Plains Guild', color: '#ff8a65'},
  {name: 'Rainforest Guild', color: '#26a69a'},
];

const OBJECTIVE_TILES = [
  ['Aggressive Dragons', 'Playful Dragons'],
  ['Cached Resources', 'Position on Dragon Guild'],
  ['Cave Cards', 'Dragons & cave cards in your Amethyst Abyss'],
  [
    'Dragons that have a printed cost of 0-2',
    'Dragons that have a printed cost of 3+',
  ],
  [
    'Dragons with "When Played" or "Once Per Round"',
    'Dragons with "If Activated by Adventurer"',
  ],
  [
    'Dragons & cave cards in your Crimson Cavern',
    'Dragons & cave cards in your Golden Grotto',
  ],
  ['Eggs', 'Total egg storage capacity on your dragons'],
  ['Hatchlings', 'Small Dragons'],
  ['Helpful Dragons', 'Shy Dragons'],
  ['Large Dragons', 'Medium Dragons'],
];

const PLAYER_COLORS = [
  'maroon',
  'gold',
  'darkgreen',
  'darkslateblue',
  'purple',
];

export default function Page() {
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string>('');
  const [objectives, setObjectives] = useState<string[]>([]);
  const [results, setResults] = useState<ScoreResult[]>([]);

  const dragonGuild = useScores();
  const printedCard = useScores();
  const endGameAbility = useScores();
  const egg = useScores();
  const cachedResource = useScores();
  const tuckedCard = useScores();
  const publicObjective = useScores();
  const excessCoin = useScores();
  const excessResources = useScores();
  const excessDragonCards = useScores();
  const excessCaveCards = useScores();
  const visibleDragons = useScores();

  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handlePlayerSetupComplete = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    dragonGuild.reset(newPlayers.length);
    printedCard.reset(newPlayers.length);
    endGameAbility.reset(newPlayers.length);
    egg.reset(newPlayers.length);
    cachedResource.reset(newPlayers.length);
    tuckedCard.reset(newPlayers.length);
    publicObjective.reset(newPlayers.length);
    excessCoin.reset(newPlayers.length);
    excessResources.reset(newPlayers.length);
    excessDragonCards.reset(newPlayers.length);
    excessCaveCards.reset(newPlayers.length);
    visibleDragons.reset(newPlayers.length);
    setResults([]);
    setExpanded('panel2');
  };

  const handleGuildChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedGuild(event.target.value);
  };

  const handleRandomGuild = () => {
    const guild = pickOne(GUILDS);
    setSelectedGuild(guild.name);
  };

  const handleRandomObjectives = () => {
    const selected = pickMany(OBJECTIVE_TILES, 4);
    const result = selected.map((tile) => pickOne(tile));
    setObjectives(result);
  };

  const calculateExcessItemsScore = (r: number, d: number, c: number) => {
    return Math.floor((r + d + c) / 4);
  };

  const handleCalculateScores = () => {
    const calculated = players.map((player, index) => {
      const excessItemsVal = calculateExcessItemsScore(
        excessResources.numericScores[index],
        excessDragonCards.numericScores[index],
        excessCaveCards.numericScores[index],
      );

      const total =
        dragonGuild.numericScores[index] +
        printedCard.numericScores[index] +
        endGameAbility.numericScores[index] +
        egg.numericScores[index] +
        cachedResource.numericScores[index] +
        tuckedCard.numericScores[index] +
        publicObjective.numericScores[index] +
        excessCoin.numericScores[index] +
        excessItemsVal;

      return {
        player: player.name,
        score: total,
        visibleDragons: visibleDragons.numericScores[index],
      };
    });

    calculated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.visibleDragons - a.visibleDragons;
    });

    const ranked = calculated.map((item, i, arr) => {
      let rankIndex = i;
      while (
        rankIndex > 0 &&
        arr[rankIndex - 1].score === item.score &&
        arr[rankIndex - 1].visibleDragons === item.visibleDragons
      ) {
        rankIndex--;
      }
      const rankNum = rankIndex + 1;
      const isTie =
        arr.filter(
          (x) =>
            x.score === item.score && x.visibleDragons === item.visibleDragons,
        ).length > 1;
      const rank = isTie ? `T${rankNum}` : `${rankNum}`;
      const showTieBreaker = arr.some(
        (x, idx) => idx !== i && x.score === item.score,
      );

      return {
        rank,
        playerName: item.player,
        score: item.score,
        details: showTieBreaker ? `(${item.visibleDragons} dragons)` : undefined,
      };
    });

    setResults(ranked.reverse());
  };

  return (
    <GamePageLayout title="Wyrmspan">
      <PlayerSetup
        minPlayers={1}
        maxPlayers={5}
        onSetupComplete={handlePlayerSetupComplete}
        showPickFirstPlayer
        expanded={expanded === 'panel1'}
        onChange={handleAccordionChange('panel1')}
        players={players}
        availableColors={PLAYER_COLORS}
      />
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleAccordionChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>
            2. Guild Selection
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            {selectedGuild}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControl>
              <RadioGroup value={selectedGuild} onChange={handleGuildChange}>
                {GUILDS.map((guild) => (
                  <FormControlLabel
                    key={guild.name}
                    value={guild.name}
                    control={<Radio />}
                    label={
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: guild.color,
                            mr: 1,
                            borderRadius: '50%',
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                        {guild.name}
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Button variant="outlined" onClick={handleRandomGuild}>
              Pick for me
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleAccordionChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>
            3. Objective Tiles
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {objectives.length > 0 && (
              <Stack spacing={1}>
                {objectives.map((obj, i) => (
                  <Typography key={i}>
                    {i + 1}. {obj}
                  </Typography>
                ))}
              </Stack>
            )}
            <Button variant="outlined" onClick={handleRandomObjectives}>
              Pick Objectives
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleAccordionChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>4. Scoring</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6">4a. Markers on the Dragon Guild</Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Points from markers on the Dragon Guild
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={dragonGuild.scores[index] || ''}
                  onChange={(val) => dragonGuild.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4b. Printed VP Values
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Visible dragons on your player mat (not in hand and not tucked).
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={printedCard.scores[index] || ''}
                  onChange={(val) => printedCard.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4c. End Game Abilities
          </Typography>
          <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <Box
              sx={{
                bgcolor: 'grey.100',
                borderRadius: 1,
                p: 0.5,
                mr: 1,
                display: 'inline-flex',
              }}>
              <Image
                src="/wyrmspan/end_game.png"
                alt="End Game"
                width={24}
                height={24}
              />
            </Box>
            <Typography color="text.secondary">
              on visible dragons on your player mat (not in hand and not
              tucked).
            </Typography>
          </Box>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={endGameAbility.scores[index] || ''}
                  onChange={(val) => endGameAbility.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4d. Eggs
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Gain 1 VP per egg, unless otherwise specified.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={egg.scores[index] || ''}
                  onChange={(val) => egg.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4e. Cached Resources
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Gain 1 VP per cached resource, unless otherwise specified.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={cachedResource.scores[index] || ''}
                  onChange={(val) => cachedResource.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4f. Tucked Cards
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Gain 1 VP per tucked dragon, unless otherwise specified.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={tuckedCard.scores[index] || ''}
                  onChange={(val) => tuckedCard.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4g. Public Objectives
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Ties are friendly.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={publicObjective.scores[index] || ''}
                  onChange={(val) => publicObjective.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4h. Excess Coins
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Gain 1 VP per coin you have remaining.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={excessCoin.scores[index] || ''}
                  onChange={(val) => excessCoin.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4i. Excess Items
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Gain 1 VP for every 4 other items (in any combination: resources,
            dragon cards, and cave cards) that you have remaining. Round down.
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{width: 120, flexShrink: 0}} />
              <Box sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                <Image
                  src="/wyrmspan/any_resource.png"
                  alt="Resources"
                  width={24}
                  height={24}
                />
              </Box>
              <Box sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                <Image
                  src="/wyrmspan/dragon_card.jpg"
                  alt="Dragon Cards"
                  width={24}
                  height={24}
                />
              </Box>
              <Box sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                <Image
                  src="/wyrmspan/cave_card.jpg"
                  alt="Cave Cards"
                  width={24}
                  height={24}
                />
              </Box>
              <Typography>Total</Typography>
            </Stack>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  sx={{width: 60}}
                  value={excessResources.scores[index] || ''}
                  onChange={(val) => excessResources.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
                <ScoreInput
                  sx={{width: 60}}
                  value={excessDragonCards.scores[index] || ''}
                  onChange={(val) => excessDragonCards.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
                <ScoreInput
                  sx={{width: 60}}
                  value={excessCaveCards.scores[index] || ''}
                  onChange={(val) => excessCaveCards.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
                <Typography>
                  {calculateExcessItemsScore(
                    excessResources.numericScores[index],
                    excessDragonCards.numericScores[index],
                    excessCaveCards.numericScores[index],
                  )}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            4j. Visible Dragons
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Used to break scoring ties.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player.name}
                </Typography>
                <ScoreInput
                  value={visibleDragons.scores[index] || ''}
                  onChange={(val) => visibleDragons.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <ScoreSheet results={results} onCalculate={handleCalculateScores} />
        </AccordionDetails>
      </Accordion>
    </GamePageLayout>
  );
}
