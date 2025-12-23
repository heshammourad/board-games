'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {SyntheticEvent, useState} from 'react';

import GamePageLayout from '../../components/GamePageLayout';
import {pickMany, pickOne, randomInt} from '../../utils/random';

const HERB_WITCHES = {
  'Silver': [
    'Use your flask after your pot explodes.',
    'Draw 6 chips and decide what order to place them in.',
    'If your pot has not exploded yet, you can return the last 2 white chips placed to the bag.',
    'Receive the full bonus even though your pot exploded.',
  ],
  'Bronze': [
    'Exchange your last 2 chips placed or one placed of your choice for the next higher chip of the same color.',
    'You can shop for twice the value.',
    'Take 1 of your chips you just purchased a second time for free.',
    'For every ruby in your possession, your purchase value increases by 2.',
  ],
  'Gold': [
    'According to the number of different chip colors in the pot, you receive the following victory points.',
    'Empty out your bag.',
    'Instead of just one ruby, take as many rubies as you have victory points.',
    'In this round, the price for moving the droplet and filling the flasg is 1 ruby each.',
  ],
};

const ESSENCES = [
  'Nervousness',
  'Ear worm',
  'Carrot nose',
  'Wing ears',
  'Chicken eyes',
  "Witch's hump",
  'Forgetfulness',
  'Vampirism',
];

export default function Page() {
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [herbWitches, setHerbWitches] = useState(false);
  const [alchemists, setAlchemists] = useState(false);
  const [mixAndMatch, setMixAndMatch] = useState(false);
  const [bookResult, setBookResult] = useState<
    string | Record<string, number> | null
  >(null);
  const [herbWitchesResult, setHerbWitchesResult] = useState<Record<
    string,
    string
  > | null>(null);
  const [alchemistsResult, setAlchemistsResult] = useState<string[] | null>(
    null,
  );

  const handleAccordionChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleRandomizeBooks = () => {
    const maxBooks = herbWitches ? 6 : 4;

    if (!mixAndMatch) {
      const setNum = randomInt(1, maxBooks);
      setBookResult(`Set ${setNum}`);
    } else {
      const res: Record<string, number> = {};
      const colors = ['Blue', 'Red', 'Yellow', 'Green', 'Purple'];
      colors.forEach((c) => {
        res[c] = randomInt(1, maxBooks);
      });

      if (herbWitches) {
        res['Locoweed'] = randomInt(1, 6);
        res['Black'] = randomInt(1, 3);
      } else {
        res['Black'] = 1;
      }
      setBookResult(res);
    }
  };

  const handleRandomizeExpansions = () => {
    if (herbWitches) {
      setHerbWitchesResult({
        Silver: pickOne(HERB_WITCHES.Silver),
        Bronze: pickOne(HERB_WITCHES.Bronze),
        Gold: pickOne(HERB_WITCHES.Gold),
      });
    } else {
      setHerbWitchesResult(null);
    }

    if (alchemists) {
      setAlchemistsResult(pickMany(ESSENCES, 3));
    } else {
      setAlchemistsResult(null);
    }
  };

  const getColorSx = (color: string) => {
    switch (color) {
      case 'Blue':
        return {bgcolor: '#1976d2', color: 'white'};
      case 'Red':
        return {bgcolor: '#d32f2f', color: 'white'};
      case 'Yellow':
        return {bgcolor: '#fbc02d', color: 'black'};
      case 'Green':
        return {bgcolor: '#388e3c', color: 'white'};
      case 'Purple':
        return {bgcolor: '#7b1fa2', color: 'white'};
      case 'Locoweed':
        return {bgcolor: '#7fffd4', color: 'black'};
      case 'Black':
        return {bgcolor: 'black', color: 'white'};
      default:
        return {};
    }
  };

  return (
    <GamePageLayout title="Quacks">
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleAccordionChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>
            1. Select Expansions
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            {[
              herbWitches ? 'The Herb Witches' : '',
              alchemists ? 'The Alchemists' : '',
            ]
              .filter(Boolean)
              .join(', ')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={herbWitches}
                  onChange={(e) => setHerbWitches(e.target.checked)}
                />
              }
              label="The Herb Witches"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={alchemists}
                  onChange={(e) => setAlchemists(e.target.checked)}
                />
              }
              label="The Alchemists"
            />
          </FormGroup>
          <Box sx={{mt: 2}}>
            <Button variant="contained" onClick={() => setExpanded('panel2')}>
              Next
            </Button>
          </Box>
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
            2. Ingredient Books
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            {typeof bookResult === 'string'
              ? bookResult
              : bookResult
                ? 'Mixed Set'
                : ''}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mixAndMatch}
                  onChange={(e) => setMixAndMatch(e.target.checked)}
                />
              }
              label="Mix and Match Sets"
            />
            <Button variant="contained" onClick={handleRandomizeBooks}>
              Randomize Books
            </Button>

            {bookResult && (
              <Box sx={{mt: 2}}>
                {typeof bookResult === 'string' ? (
                  <Typography variant="h5">{bookResult}</Typography>
                ) : (
                  <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                    {Object.entries(bookResult).map(([color, num]) => (
                      <Chip
                        key={color}
                        label={`${color}: ${num}`}
                        sx={getColorSx(color)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {(herbWitches || alchemists) && (
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleAccordionChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header">
            <Typography sx={{width: '33%', flexShrink: 0}}>
              3. Expansion Setup
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Button variant="contained" onClick={handleRandomizeExpansions}>
                Randomize Expansions
              </Button>
              {herbWitchesResult && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Herb Witches
                  </Typography>
                  {Object.entries(herbWitchesResult).map(([color, text]) => (
                    <Typography key={color} paragraph>
                      <strong>{color}:</strong> {text}
                    </Typography>
                  ))}
                </Box>
              )}
              {alchemistsResult && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Alchemists (Essences)
                  </Typography>
                  <ul>
                    {alchemistsResult.map((essence) => (
                      <li key={essence}>
                        <Typography>{essence}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </GamePageLayout>
  );
}
