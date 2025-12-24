'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import {SyntheticEvent, useState} from 'react';

import GamePageLayout from '../../components/GamePageLayout';
import PlayerSetup, {Player} from '../../components/PlayerSetup';
import ScoreInput from '../../components/ScoreInput';
import ScoreSheet, {ScoreResult} from '../../components/ScoreSheet';
import ScoringSection from '../../components/ScoringSection';
import {useScores} from '../../hooks/useScores';
import {pickOne, shuffle} from '../../utils/random';

const WONDERS = [
  'Rhódos',
  'Alexandria',
  'Éphesos',
  'Babylon',
  'Olympía',
  'Halikarnassós',
  'Gizah',
];

export default function Page() {
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [players, setPlayers] = useState<Player[]>([]);
  const [assignments, setAssignments] = useState<
    {wonder: string; side: 'A' | 'B'}[]
  >([]);
  const military = useScores();
  const treasury = useScores();
  const wonder = useScores();
  const civilian = useScores();
  const commercial = useScores();
  const guild = useScores();
  const scienceTablet = useScores();
  const scienceGear = useScores();
  const scienceCompass = useScores();
  const scienceWildcard = useScores();
  const [wonderSide, setWonderSide] = useState('A');
  const [results, setResults] = useState<ScoreResult[]>([]);

  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handlePlayerSetupComplete = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    setAssignments(
      newPlayers.map((_, i) => ({
        wonder: WONDERS[i % WONDERS.length],
        side: 'A',
      })),
    );
    military.reset(newPlayers.length);
    treasury.reset(newPlayers.length);
    wonder.reset(newPlayers.length);
    civilian.reset(newPlayers.length);
    commercial.reset(newPlayers.length);
    guild.reset(newPlayers.length);
    scienceTablet.reset(newPlayers.length);
    scienceGear.reset(newPlayers.length);
    scienceCompass.reset(newPlayers.length);
    scienceWildcard.reset(newPlayers.length);
    setResults([]);
    setExpanded('panel2');
  };

  const handleWonderChange = (index: number, newWonder: string) => {
    setAssignments((prev) => {
      const next = [...prev];
      const oldWonder = next[index].wonder;
      const swapIndex = next.findIndex(
        (a, i) => i !== index && a.wonder === newWonder,
      );
      if (swapIndex !== -1) {
        next[swapIndex] = {...next[swapIndex], wonder: oldWonder};
      }
      next[index] = {...next[index], wonder: newWonder};
      return next;
    });
  };

  const handleSideToggle = (index: number) => {
    setAssignments((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        side: next[index].side === 'A' ? 'B' : 'A',
      };
      return next;
    });
  };

  const handleRandomize = () => {
    const shuffled = shuffle([...WONDERS]);
    setAssignments((prev) =>
      prev.map((_, i) => {
        let side: 'A' | 'B' = 'A';
        if (wonderSide === 'B') side = 'B';
        else if (wonderSide === 'Both') side = pickOne(['A', 'B']) as 'A' | 'B';
        return {
          wonder: shuffled[i % shuffled.length],
          side,
        };
      }),
    );
  };

  const calculateScientificScore = (
    t: number,
    g: number,
    c: number,
    w: number,
  ) => {
    let maxScore = 0;

    for (let wt = 0; wt <= w; wt++) {
      for (let wg = 0; wg <= w - wt; wg++) {
        const wc = w - wt - wg;
        const T = t + wt;
        const G = g + wg;
        const C = c + wc;
        const currentScore = T * T + G * G + C * C + 7 * Math.min(T, G, C);
        if (currentScore > maxScore) {
          maxScore = currentScore;
        }
      }
    }
    return maxScore;
  };

  const handleCalculateScores = () => {
    const calculated = players.map((player, index) => {
      const militaryVal = military.numericScores[index];
      const coinsVal = treasury.numericScores[index];
      const treasuryVal = Math.floor(coinsVal / 3);
      const wonderVal = wonder.numericScores[index];
      const civilianVal = civilian.numericScores[index];
      const commercialVal = commercial.numericScores[index];
      const scientificVal = calculateScientificScore(
        scienceTablet.numericScores[index],
        scienceGear.numericScores[index],
        scienceCompass.numericScores[index],
        scienceWildcard.numericScores[index],
      );
      const guildVal = guild.numericScores[index];
      const total =
        militaryVal +
        treasuryVal +
        wonderVal +
        civilianVal +
        scientificVal +
        commercialVal +
        guildVal;

      return {
        player: player.name,
        wonder: assignments[index].wonder,
        score: total,
        coins: coinsVal,
      };
    });

    calculated.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.coins - a.coins;
    });

    const ranked = calculated.map((item, i, arr) => {
      let rankIndex = i;
      while (
        rankIndex > 0 &&
        arr[rankIndex - 1].score === item.score &&
        arr[rankIndex - 1].coins === item.coins
      ) {
        rankIndex--;
      }
      const rankNum = rankIndex + 1;
      const isTie =
        arr.filter((x) => x.score === item.score && x.coins === item.coins)
          .length > 1;
      const rank = isTie ? `T${rankNum}` : `${rankNum}`;
      const showCoins = arr.some(
        (x, idx) => idx !== i && x.score === item.score,
      );

      return {
        rank,
        playerName: item.player,
        score: item.score,
        subtitle: item.wonder,
        details: showCoins ? `(${item.coins} coins)` : undefined,
      };
    });

    setResults(ranked.reverse());
  };

  const getWonderAbbr = (wonder: string) => wonder.charAt(0);

  return (
    <GamePageLayout title="7 Wonders">
      <PlayerSetup
        minPlayers={2}
        maxPlayers={7}
        onSetupComplete={handlePlayerSetupComplete}
        expanded={expanded === 'panel1'}
        onChange={handleAccordionChange('panel1')}
        players={players}
      />
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleAccordionChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>
            2. Wonder Selection
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            {wonderSide === 'A'
              ? 'Side A'
              : wonderSide === 'B'
                ? 'Side B'
                : 'Both Sides'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4}>
            <Grid size={{xs: 12, md: 8}}>
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
                    <FormControl fullWidth size="small">
                      <Select
                        value={assignments[index]?.wonder || ''}
                        onChange={(e) =>
                          handleWonderChange(index, e.target.value as string)
                        }>
                        {WONDERS.map((w) => (
                          <MenuItem key={w} value={w}>
                            {w}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption">A</Typography>
                      <Switch
                        checked={assignments[index]?.side === 'B'}
                        onChange={() => handleSideToggle(index)}
                      />
                      <Typography variant="caption">B</Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <Stack spacing={2}>
                <FormControl>
                  <RadioGroup
                    value={wonderSide}
                    onChange={(e) => setWonderSide(e.target.value)}>
                    <FormControlLabel
                      value="A"
                      control={<Radio />}
                      label="Everyone uses Side A"
                    />
                    <FormControlLabel
                      value="B"
                      control={<Radio />}
                      label="Everyone uses Side B"
                    />
                    <FormControlLabel
                      value="Both"
                      control={<Radio />}
                      label="Use both"
                    />
                  </RadioGroup>
                </FormControl>
                <Button variant="contained" onClick={handleRandomize}>
                  Choose for us
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleAccordionChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>3. Scoring</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ScoringSection
            title="3a. Military Conflicts"
            description="Each player adds their Victory and Defeat tokens (this total can be negative!)."
            players={players}
            sx={{mt: 0}}>
            {(_, index) => (
              <ScoreInput
                value={military.scores[index] || ''}
                onChange={(val) => military.handleChange(index, val)}
                slotProps={{htmlInput: {min: -6, max: 18}}}
              />
            )}
          </ScoringSection>
          <ScoringSection
            title="3b. Treasury Contents"
            description="Enter the number of coins you have. (1 point per 3 coins)"
            players={players}>
            {(_, index) => (
              <>
                <ScoreInput
                  value={treasury.scores[index] || ''}
                  onChange={(val) => treasury.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0}}}
                  label="Coins"
                />
                <Typography>
                  {Math.floor(treasury.numericScores[index] / 3)} points
                </Typography>
              </>
            )}
          </ScoringSection>
          <ScoringSection
            title="3c. Wonder"
            description="Each player then adds to their score the victory points from their wonder."
            players={players}>
            {(_, index) => (
              <ScoreInput
                value={wonder.scores[index] || ''}
                onChange={(val) => wonder.handleChange(index, val)}
                slotProps={{htmlInput: {min: 0, max: 20}}}
              />
            )}
          </ScoringSection>
          <ScoringSection
            title="3d. Civilian Structures"
            description="Each player adds the victory points of their Civilian structures. This amount is indicated on each Civilian structure."
            players={players}>
            {(_, index) => (
              <ScoreInput
                value={civilian.scores[index] || ''}
                onChange={(val) => civilian.handleChange(index, val)}
                slotProps={{htmlInput: {min: 0}}}
              />
            )}
          </ScoringSection>
          <ScoringSection
            title="3e. Scientific Structures"
            description="Enter the number of scientific symbols."
            players={players}
            header={
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}} />
                <Box
                  sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                  <Image
                    src="/7-wonders/tablet.jpg"
                    alt="Tablet"
                    width={24}
                    height={24}
                  />
                </Box>
                <Box
                  sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                  <Image
                    src="/7-wonders/gear.jpg"
                    alt="Gear"
                    width={24}
                    height={24}
                  />
                </Box>
                <Box
                  sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                  <Image
                    src="/7-wonders/compass.jpg"
                    alt="Compass"
                    width={24}
                    height={24}
                  />
                </Box>
                <Box
                  sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                  <Typography>❓</Typography>
                </Box>
                <Typography>Total</Typography>
              </Stack>
            }>
            {(_, index) => (
              <>
                <ScoreInput
                  sx={{width: 60}}
                  value={scienceTablet.scores[index] || ''}
                  onChange={(val) => scienceTablet.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0, max: 4}}}
                />
                <ScoreInput
                  sx={{width: 60}}
                  value={scienceGear.scores[index] || ''}
                  onChange={(val) => scienceGear.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0, max: 4}}}
                />
                <ScoreInput
                  sx={{width: 60}}
                  value={scienceCompass.scores[index] || ''}
                  onChange={(val) => scienceCompass.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0, max: 4}}}
                />
                <ScoreInput
                  sx={{width: 60}}
                  value={scienceWildcard.scores[index] || ''}
                  onChange={(val) => scienceWildcard.handleChange(index, val)}
                  slotProps={{htmlInput: {min: 0, max: 2}}}
                />
                <Typography>
                  {calculateScientificScore(
                    scienceTablet.numericScores[index],
                    scienceGear.numericScores[index],
                    scienceCompass.numericScores[index],
                    scienceWildcard.numericScores[index],
                  )}
                </Typography>
              </>
            )}
          </ScoringSection>
          <ScoringSection
            title="3f. Commercial Structures"
            description="Some commercial structures from Age III grant victory points."
            players={players}>
            {(_, index) => (
              <ScoreInput
                value={commercial.scores[index] || ''}
                onChange={(val) => commercial.handleChange(index, val)}
                slotProps={{htmlInput: {min: 0}}}
              />
            )}
          </ScoringSection>
          <ScoringSection
            title="3g. Guilds"
            description="Enter the victory points from Guilds (purple cards)."
            players={players}>
            {(_, index) => (
              <ScoreInput
                value={guild.scores[index] || ''}
                onChange={(val) => guild.handleChange(index, val)}
                slotProps={{htmlInput: {min: 0}}}
              />
            )}
          </ScoringSection>
          <ScoreSheet results={results} onCalculate={handleCalculateScores}>
            <TableContainer component={Paper}>
              <Table
                size="small"
                sx={{
                  border: '2px solid black',
                  '& .MuiTableCell-root': {
                    fontFamily:
                      '"Ink Free", "Segoe Print", "Chalkboard SE", "Gochi Hand", cursive',
                    color: 'grey.800',
                    fontSize: '1.1rem',
                    border: '2px solid black',
                  },
                }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: '3px double black',
                        bgcolor: 'grey.300',
                      }}
                    />
                    {players.map((p, i) => (
                      <TableCell
                        key={i}
                        align="center"
                        sx={{
                          fontWeight: 'bold',
                          borderBottom: '3px double black',
                          bgcolor: 'grey.300',
                        }}>
                        {p.name} ({getWonderAbbr(assignments[i].wonder)})
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    {
                      icon: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: '#d32f2f',
                            borderRadius: 0.5,
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ),
                      color: '#ffcdd2',
                      values: military.numericScores,
                    },
                    {
                      icon: <Typography>🪙</Typography>,
                      color: '#fff9c4',
                      values: treasury.numericScores.map((s) =>
                        Math.floor(s / 3),
                      ),
                    },
                    {
                      icon: <Typography>🔺</Typography>,
                      color: '#f5f5f5',
                      values: wonder.numericScores,
                    },
                    {
                      icon: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: '#1976d2',
                            borderRadius: 0.5,
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ),
                      color: '#bbdefb',
                      values: civilian.numericScores,
                    },
                    {
                      icon: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: '#fbc02d',
                            borderRadius: 0.5,
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ),
                      color: '#fff59d',
                      values: commercial.numericScores,
                    },
                    {
                      icon: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: '#7b1fa2',
                            borderRadius: 0.5,
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ),
                      color: '#e1bee7',
                      values: guild.numericScores,
                    },
                    {
                      icon: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: '#388e3c',
                            borderRadius: 0.5,
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ),
                      color: '#c8e6c9',
                      values: players.map((_, i) =>
                        calculateScientificScore(
                          scienceTablet.numericScores[i],
                          scienceGear.numericScores[i],
                          scienceCompass.numericScores[i],
                          scienceWildcard.numericScores[i],
                        ),
                      ),
                    },
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell align="center" sx={{bgcolor: 'grey.300'}}>
                        {row.icon}
                      </TableCell>
                      {row.values.map((val, i) => (
                        <TableCell
                          key={i}
                          align="center"
                          sx={{bgcolor: row.color}}>
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        borderTop: '3px double black',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        bgcolor: 'grey.300',
                      }}>
                      Σ
                    </TableCell>
                    {players.map((_, i) => {
                      const total =
                        military.numericScores[i] +
                        Math.floor(treasury.numericScores[i] / 3) +
                        wonder.numericScores[i] +
                        civilian.numericScores[i] +
                        commercial.numericScores[i] +
                        guild.numericScores[i] +
                        calculateScientificScore(
                          scienceTablet.numericScores[i],
                          scienceGear.numericScores[i],
                          scienceCompass.numericScores[i],
                          scienceWildcard.numericScores[i],
                        );
                      return (
                        <TableCell
                          key={i}
                          align="center"
                          sx={{
                            borderTop: '3px double black',
                            fontWeight: 'bold',
                            bgcolor: 'grey.300',
                          }}>
                          {total}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ScoreSheet>
        </AccordionDetails>
      </Accordion>
    </GamePageLayout>
  );
}
