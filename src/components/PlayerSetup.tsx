'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {SyntheticEvent, useState} from 'react';

import {pickOne, shuffle} from '../utils/random';

export interface Player {
  name: string;
  color?: string;
}

interface PlayerSetupProps {
  minPlayers: number;
  maxPlayers: number;
  onSetupComplete: (players: Player[]) => void;
  showPickFirstPlayer?: boolean;
  expanded: boolean;
  onChange: (event: SyntheticEvent, isExpanded: boolean) => void;
  players: Player[];
  availableColors?: string[];
}

export default function PlayerSetup({
  minPlayers,
  maxPlayers,
  onSetupComplete,
  showPickFirstPlayer = false,
  expanded,
  onChange,
  players,
  availableColors,
}: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState(minPlayers);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(minPlayers).fill(''),
  );
  const [playerColors, setPlayerColors] = useState<string[]>(() => {
    if (availableColors) {
      return availableColors.slice(0, minPlayers);
    }
    return [];
  });
  const [firstPlayer, setFirstPlayer] = useState<string | null>(null);

  const handleCountChange = (event: SelectChangeEvent<number>) => {
    const count = Number(event.target.value);
    setPlayerCount(count);
    setPlayerNames((prev) => {
      const newNames = [...prev];
      if (count > prev.length) {
        return newNames.concat(Array(count - prev.length).fill(''));
      } else {
        return newNames.slice(0, count);
      }
    });
    if (availableColors) {
      setPlayerColors((prev) => {
        const newColors = [...prev];
        if (count > prev.length) {
          const usedColors = new Set(newColors);
          const unusedColors = availableColors.filter(
            (c) => !usedColors.has(c),
          );
          return newColors.concat(unusedColors.slice(0, count - prev.length));
        } else {
          return newColors.slice(0, count);
        }
      });
    }
    setFirstPlayer(null);
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    setFirstPlayer(null);
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...playerColors];
    const existingIndex = newColors.indexOf(color);

    if (existingIndex !== -1) {
      // Swap colors
      newColors[existingIndex] = newColors[index];
      newColors[index] = color;
    } else {
      newColors[index] = color;
    }
    setPlayerColors(newColors);
  };

  const handleRemovePlayer = (index: number) => {
    if (playerCount > minPlayers) {
      setPlayerNames((prev) => prev.filter((_, i) => i !== index));
      setPlayerColors((prev) => prev.filter((_, i) => i !== index));
      setPlayerCount((prev) => prev - 1);
      setFirstPlayer(null);
    }
  };

  const handleRandomize = () => {
    const combined = playerNames.map((name, index) => ({
      name,
      color: playerColors[index],
    }));
    const shuffled = shuffle(combined);
    setPlayerNames(shuffled.map((p) => p.name));
    setPlayerColors(shuffled.map((p) => p.color || ''));
    setFirstPlayer(null);
  };

  const handlePickFirstPlayer = () => {
    const currentNames = playerNames.map(
      (name, i) => name.trim() || `Player ${i + 1}`,
    );
    setFirstPlayer(pickOne(currentNames));
  };

  const handleSubmit = () => {
    const finalPlayers = playerNames.map((name, i) => ({
      name: name.trim() || `Player ${i + 1}`,
      color: playerColors[i],
    }));
    onSetupComplete(finalPlayers);
  };

  return (
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="player-setup-content"
        id="player-setup-header">
        <Typography sx={{width: '33%', flexShrink: 0}}>
          1. Player Setup
        </Typography>
        <Typography sx={{color: 'text.secondary'}}>
          {players.map((player, index) => (
            <span key={index}>
              {player.name === firstPlayer ? (
                <Box component="span" sx={{fontWeight: 'bold'}}>
                  {player.name}*
                </Box>
              ) : (
                player.name
              )}
              {index < players.length - 1 ? ', ' : ''}
            </span>
          ))}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="player-count-label">Number of Players</InputLabel>
            <Select
              labelId="player-count-label"
              value={playerCount}
              label="Number of Players"
              onChange={handleCountChange}>
              {Array.from(
                {length: maxPlayers - minPlayers + 1},
                (_, i) => i + minPlayers,
              ).map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack spacing={2}>
            {playerNames.map((name, index) => (
              <Stack key={index} direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemovePlayer(index)}
                  disabled={playerCount <= minPlayers}
                  sx={{minWidth: '56px'}}>
                  -
                </Button>
                <TextField
                  label={`Player ${index + 1} Name`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  fullWidth
                />
                {availableColors && (
                  <FormControl sx={{minWidth: 80}}>
                    <InputLabel id={`color-select-label-${index}`}>
                      Color
                    </InputLabel>
                    <Select
                      labelId={`color-select-label-${index}`}
                      value={playerColors[index] || ''}
                      label="Color"
                      onChange={(e) =>
                        handleColorChange(index, e.target.value)
                      }>
                      {availableColors.map((color) => (
                        <MenuItem key={color} value={color}>
                          <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: color,
                                border: '1px solid rgba(0,0,0,0.1)',
                              }}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Stack>
            ))}
          </Stack>

          <Button variant="outlined" onClick={handleRandomize}>
            Randomize Order
          </Button>

          {showPickFirstPlayer && (
            <Button variant="outlined" onClick={handlePickFirstPlayer}>
              Pick First Player
            </Button>
          )}

          {firstPlayer && (
            <Typography align="center" fontWeight="bold" color="primary">
              First Player: {firstPlayer}
            </Typography>
          )}

          <Button variant="contained" size="large" onClick={handleSubmit}>
            Start Game
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
