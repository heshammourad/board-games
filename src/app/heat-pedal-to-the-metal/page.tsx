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
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useState} from 'react';

import GamePageLayout from '../../components/GamePageLayout';
import {pickMany, pickOne, shuffle} from '../../utils/random';

const TRACKS = ['France', 'Great Britain', 'Italy', 'Japan', 'Mexico', 'USA'];
const WEATHER_TOKENS = ['Sunny', 'Overcast', 'Showers', 'Rain', 'Snow', 'Fog'];
const PLAYER_COLORS = [
  'Black',
  'Blue',
  'Green',
  'Orange',
  'Red',
  'Silver',
  'Yellow',
];
const ROAD_TOKENS_POOL = [
  '+1',
  '+1',
  '-1',
  '-1',
  'Overheat',
  'Overheat',
  'Slipstream boost',
  'Slipstream boost',
  'Heat control',
  'Heat control',
  'Weather',
  'Weather',
];

export default function Page() {
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [weatherModule, setWeatherModule] = useState<boolean | null>(null);
  const [weatherToken, setWeatherToken] = useState<string | null>(null);
  const [roadConditions, setRoadConditions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleTrackSelect = (track: string) => {
    setSelectedTrack(track);
    setExpanded('panel2'); // Advance to next
  };

  const handleWeatherSelect = (useModule: boolean) => {
    setWeatherModule(useModule);
    if (useModule) {
      setWeatherToken(pickOne(WEATHER_TOKENS));

      let count = 5;
      if (selectedTrack === 'Italy') count = 3;
      else if (selectedTrack === 'USA') count = 4;
      else if (selectedTrack === 'Mexico') count = 6;

      setRoadConditions(pickMany(ROAD_TOKENS_POOL, count));
    } else {
      setWeatherToken(null);
      setRoadConditions([]);
    }
    setExpanded('panel3');
  };

  const handleColorToggle = (color: string) => {
    const currentIndex = selectedColors.indexOf(color);
    const newChecked = [...selectedColors];

    if (currentIndex === -1) {
      newChecked.push(color);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSelectedColors(newChecked);
    setPlayerOrder([]);
  };

  const handleSelectAllColors = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      setSelectedColors([...PLAYER_COLORS]);
    } else {
      setSelectedColors([]);
    }
    setPlayerOrder([]);
  };

  const handleRandomizeOrder = () => {
    setPlayerOrder(shuffle(selectedColors));
    setExpanded(false);
  };

  const pickRandomTrack = () => {
    handleTrackSelect(pickOne(TRACKS));
  };

  return (
    <GamePageLayout title="Heat: Pedal to the Metal">
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleAccordionChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography sx={{width: '33%', flexShrink: 0}}>
            1. Select Track
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            {selectedTrack}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {TRACKS.map((track) => (
              <Grid size={{xs: 6, sm: 4}} key={track}>
                <Button
                  variant={selectedTrack === track ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => handleTrackSelect(track)}>
                  {track}
                </Button>
              </Grid>
            ))}
            <Grid size={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={pickRandomTrack}
                color="inherit">
                🎲 Random Track
              </Button>
            </Grid>
          </Grid>
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
            2. Weather & Road
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mr: 2,
            }}>
            {weatherModule === true
              ? `${weatherToken} | ${roadConditions.join(', ')}`
              : weatherModule === false
                ? 'Skipped'
                : ''}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            <Typography>Use Weather & Road Conditions Module?</Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleWeatherSelect(true)}>
                  Yes
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleWeatherSelect(false)}>
                  No
                </Button>
              </Grid>
            </Grid>
            {weatherModule && (
              <Stack spacing={2}>
                <Typography variant="subtitle2">Result:</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">Weather:</Typography>
                  <Chip label={weatherToken} color="primary" />
                </Stack>
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                  <Typography variant="body2" sx={{width: '100%'}}>
                    Road Conditions:
                  </Typography>
                  {roadConditions.map((rc, i) => (
                    <Chip key={i} label={rc} size="small" variant="outlined" />
                  ))}
                </Box>
              </Stack>
            )}
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
            3. Player Order
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            {playerOrder.length > 0 ? playerOrder.join(', ') : ''}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Typography>Select Colors (Min 2):</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedColors.length === PLAYER_COLORS.length}
                    indeterminate={
                      selectedColors.length > 0 &&
                      selectedColors.length < PLAYER_COLORS.length
                    }
                    onChange={handleSelectAllColors}
                  />
                }
                label="Select All"
              />
            </FormGroup>
            <FormGroup row>
              {PLAYER_COLORS.map((color) => (
                <FormControlLabel
                  key={color}
                  control={
                    <Checkbox
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorToggle(color)}
                    />
                  }
                  label={color}
                />
              ))}
            </FormGroup>
            <Button
              variant="contained"
              disabled={selectedColors.length < 2}
              onClick={handleRandomizeOrder}>
              Randomize Order
            </Button>
            {playerOrder.length > 0 && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">Turn Order:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {playerOrder.map((color, index) => (
                    <Chip
                      key={color}
                      label={`${index + 1}. ${color}`}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </GamePageLayout>
  );
}
