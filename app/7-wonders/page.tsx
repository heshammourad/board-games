'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import {SyntheticEvent, useEffect, useRef, useState} from 'react';

import {shuffle} from '../../utils/random';
import GamePageLayout from '../components/GamePageLayout';
import PlayerSetup from '../components/PlayerSetup';

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
  const [players, setPlayers] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<
    {wonder: string; side: 'A' | 'B'}[]
  >([]);
  const [militaryScores, setMilitaryScores] = useState<string[]>([]);
  const [treasuryCoins, setTreasuryCoins] = useState<string[]>([]);
  const [wonderScores, setWonderScores] = useState<string[]>([]);
  const [civilianScores, setCivilianScores] = useState<string[]>([]);
  const [commercialScores, setCommercialScores] = useState<string[]>([]);
  const [scientificScores, setScientificScores] = useState<
    {tablet: string; gear: string; compass: string; wildcard: string}[]
  >([]);
  const [guildScores, setGuildScores] = useState<string[]>([]);
  const [wonderSide, setWonderSide] = useState('A');
  const [results, setResults] = useState<
    {
      rank: string;
      player: string;
      wonder: string;
      score: number;
      coins: number;
      showCoins: boolean;
    }[]
  >([]);
  const [visibleRows, setVisibleRows] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleSetupComplete = (newPlayers: string[]) => {
    setPlayers(newPlayers);
    setAssignments(
      newPlayers.map((_, i) => ({
        wonder: WONDERS[i % WONDERS.length],
        side: 'A',
      })),
    );
    setMilitaryScores(new Array(newPlayers.length).fill('0'));
    setTreasuryCoins(new Array(newPlayers.length).fill('0'));
    setWonderScores(new Array(newPlayers.length).fill('0'));
    setCivilianScores(new Array(newPlayers.length).fill('0'));
    setCommercialScores(new Array(newPlayers.length).fill('0'));
    setScientificScores(
      newPlayers.map(() => ({
        tablet: '0',
        gear: '0',
        compass: '0',
        wildcard: '0',
      })),
    );
    setGuildScores(new Array(newPlayers.length).fill('0'));
    setResults([]);
    setVisibleRows(0);
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
        else if (wonderSide === 'Both') side = Math.random() < 0.5 ? 'A' : 'B';
        return {
          wonder: shuffled[i % shuffled.length],
          side,
        };
      }),
    );
  };

  const handleMilitaryScoreChange = (index: number, value: string) => {
    setMilitaryScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleTreasuryCoinsChange = (index: number, value: string) => {
    setTreasuryCoins((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleWonderScoreChange = (index: number, value: string) => {
    setWonderScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleCivilianScoreChange = (index: number, value: string) => {
    setCivilianScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleCommercialScoreChange = (index: number, value: string) => {
    setCommercialScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleScientificScoreChange = (
    index: number,
    field: keyof (typeof scientificScores)[0],
    value: string,
  ) => {
    setScientificScores((prev) => {
      const next = [...prev];
      next[index] = {...next[index], [field]: value};
      return next;
    });
  };

  const handleGuildScoreChange = (index: number, value: string) => {
    setGuildScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const calculateScientificScore = (
    tStr: string,
    gStr: string,
    cStr: string,
    wStr: string,
  ) => {
    const t = parseInt(tStr || '0', 10);
    const g = parseInt(gStr || '0', 10);
    const c = parseInt(cStr || '0', 10);
    const w = parseInt(wStr || '0', 10);

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
      const military = parseInt(militaryScores[index] || '0', 10);
      const coinsVal = parseInt(treasuryCoins[index] || '0', 10);
      const treasury = Math.floor(coinsVal / 3);
      const wonder = parseInt(wonderScores[index] || '0', 10);
      const civilian = parseInt(civilianScores[index] || '0', 10);
      const commercial = parseInt(commercialScores[index] || '0', 10);
      const scientific = calculateScientificScore(
        scientificScores[index]?.tablet,
        scientificScores[index]?.gear,
        scientificScores[index]?.compass,
        scientificScores[index]?.wildcard,
      );
      const guild = parseInt(guildScores[index] || '0', 10);
      const total =
        military +
        treasury +
        wonder +
        civilian +
        scientific +
        commercial +
        guild;

      return {
        player,
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

      return {...item, rank, showCoins};
    });

    setResults(ranked.reverse());
    setVisibleRows(0);
  };

  useEffect(() => {
    if (results.length > 0 && visibleRows < results.length) {
      const timer = setTimeout(() => {
        setVisibleRows((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [results, visibleRows]);

  useEffect(() => {
    if (results.length > 0 && visibleRows === 0) {
      resultsRef.current?.scrollIntoView({behavior: 'smooth'});
    }
  }, [results, visibleRows]);

  const getWonderAbbr = (wonder: string) => wonder.charAt(0);

  return (
    <GamePageLayout title="7 Wonders">
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleAccordionChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>
            1. Player Setup
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            {players.length > 0 ? players.join(', ') : ''}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PlayerSetup
            minPlayers={2}
            maxPlayers={7}
            onSetupComplete={handleSetupComplete}
          />
        </AccordionDetails>
      </Accordion>
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
                      {player}
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
          <Typography variant="h6">3a. Military Conflicts</Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Each player adds their Victory and Defeat tokens (this total can be
            negative!).
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={militaryScores[index] || ''}
                  onChange={(e) =>
                    handleMilitaryScoreChange(index, e.target.value)
                  }
                  slotProps={{htmlInput: {min: -6, max: 18}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            3b. Treasury Contents
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Enter the number of coins you have. (1 point per 3 coins)
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={treasuryCoins[index] || ''}
                  onChange={(e) =>
                    handleTreasuryCoinsChange(index, e.target.value)
                  }
                  slotProps={{htmlInput: {min: 0}}}
                  label="Coins"
                />
                <Typography>
                  {Math.floor(parseInt(treasuryCoins[index] || '0', 10) / 3)}{' '}
                  points
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            3c. Wonder
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Each player then adds to their score the victory points from their
            wonder.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={wonderScores[index] || ''}
                  onChange={(e) =>
                    handleWonderScoreChange(index, e.target.value)
                  }
                  slotProps={{htmlInput: {min: 0, max: 20}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            3d. Civilian Structures
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Each player adds the victory points of their Civilian structures.
            This amount is indicated on each Civilian structure.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={civilianScores[index] || ''}
                  onChange={(e) =>
                    handleCivilianScoreChange(index, e.target.value)
                  }
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            3e. Scientific Structures
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Enter the number of scientific symbols.
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{width: 120, flexShrink: 0}} />
              <Box sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                <Image
                  src="/7-wonders/tablet.jpg"
                  alt="Tablet"
                  width={24}
                  height={24}
                />
              </Box>
              <Box sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                <Image
                  src="/7-wonders/gear.jpg"
                  alt="Gear"
                  width={24}
                  height={24}
                />
              </Box>
              <Box sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                <Image
                  src="/7-wonders/compass.jpg"
                  alt="Compass"
                  width={24}
                  height={24}
                />
              </Box>
              <Box sx={{width: 60, display: 'flex', justifyContent: 'center'}}>
                <Typography>❓</Typography>
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
                  {player}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  sx={{width: 60}}
                  value={scientificScores[index]?.tablet || ''}
                  onChange={(e) =>
                    handleScientificScoreChange(index, 'tablet', e.target.value)
                  }
                  slotProps={{htmlInput: {min: 0, max: 4}}}
                />
                <TextField
                  type="number"
                  size="small"
                  sx={{width: 60}}
                  value={scientificScores[index]?.gear || ''}
                  onChange={(e) =>
                    handleScientificScoreChange(index, 'gear', e.target.value)
                  }
                  slotProps={{htmlInput: {min: 0, max: 4}}}
                />
                <TextField
                  type="number"
                  size="small"
                  sx={{width: 60}}
                  value={scientificScores[index]?.compass || ''}
                  onChange={(e) =>
                    handleScientificScoreChange(
                      index,
                      'compass',
                      e.target.value,
                    )
                  }
                  slotProps={{htmlInput: {min: 0, max: 4}}}
                />
                <TextField
                  type="number"
                  size="small"
                  sx={{width: 60}}
                  value={scientificScores[index]?.wildcard || ''}
                  onChange={(e) =>
                    handleScientificScoreChange(
                      index,
                      'wildcard',
                      e.target.value,
                    )
                  }
                  slotProps={{htmlInput: {min: 0, max: 2}}}
                />
                <Typography>
                  {calculateScientificScore(
                    scientificScores[index]?.tablet,
                    scientificScores[index]?.gear,
                    scientificScores[index]?.compass,
                    scientificScores[index]?.wildcard,
                  )}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            3f. Commercial Structures
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Some commercial structures from Age III grant victory points.
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={commercialScores[index] || ''}
                  onChange={(e) =>
                    handleCommercialScoreChange(index, e.target.value)
                  }
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Typography variant="h6" sx={{mt: 3}}>
            3g. Guilds
          </Typography>
          <Typography sx={{color: 'text.secondary', mb: 2}}>
            Enter the victory points from Guilds (purple cards).
          </Typography>
          <Stack spacing={2}>
            {players.map((player, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}>
                <Typography sx={{width: 120, flexShrink: 0}}>
                  {player}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={guildScores[index] || ''}
                  onChange={(e) =>
                    handleGuildScoreChange(index, e.target.value)
                  }
                  slotProps={{htmlInput: {min: 0}}}
                />
              </Stack>
            ))}
          </Stack>
          <Stack spacing={2} sx={{mt: 3}}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCalculateScores}
              fullWidth>
              Calculate Score
            </Button>
            {results.length > 0 && (
              <>
                <TableContainer component={Paper} ref={resultsRef} sx={{mb: 4}}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Player</TableCell>
                        <TableCell align="right">Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((row, index) => (
                        <Fade
                          in={index < visibleRows}
                          key={index}
                          timeout={500}>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': {border: 0},
                              backgroundColor:
                                row.rank === '1' || row.rank === 'T1'
                                  ? 'action.hover'
                                  : 'inherit',
                            }}>
                            <TableCell component="th" scope="row">
                              {row.rank}
                            </TableCell>
                            <TableCell>
                              {row.player} - {row.wonder}
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="bold">
                                {row.score}
                              </Typography>
                              {row.showCoins && (
                                <Typography variant="caption" display="block">
                                  ({row.coins} coins)
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        </Fade>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                            {p} ({getWonderAbbr(assignments[i].wonder)})
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
                          values: militaryScores.map((s) =>
                            parseInt(s || '0', 10),
                          ),
                        },
                        {
                          icon: <Typography>🪙</Typography>,
                          color: '#fff9c4',
                          values: treasuryCoins.map((s) =>
                            Math.floor(parseInt(s || '0', 10) / 3),
                          ),
                        },
                        {
                          icon: <Typography>🔺</Typography>,
                          color: '#f5f5f5',
                          values: wonderScores.map((s) =>
                            parseInt(s || '0', 10),
                          ),
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
                          values: civilianScores.map((s) =>
                            parseInt(s || '0', 10),
                          ),
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
                          values: commercialScores.map((s) =>
                            parseInt(s || '0', 10),
                          ),
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
                          values: guildScores.map((s) =>
                            parseInt(s || '0', 10),
                          ),
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
                          values: scientificScores.map((s) =>
                            calculateScientificScore(
                              s.tablet,
                              s.gear,
                              s.compass,
                              s.wildcard,
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
                            parseInt(militaryScores[i] || '0', 10) +
                            Math.floor(
                              parseInt(treasuryCoins[i] || '0', 10) / 3,
                            ) +
                            parseInt(wonderScores[i] || '0', 10) +
                            parseInt(civilianScores[i] || '0', 10) +
                            parseInt(commercialScores[i] || '0', 10) +
                            parseInt(guildScores[i] || '0', 10) +
                            calculateScientificScore(
                              scientificScores[i]?.tablet,
                              scientificScores[i]?.gear,
                              scientificScores[i]?.compass,
                              scientificScores[i]?.wildcard,
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
              </>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </GamePageLayout>
  );
}
