'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {useState} from 'react';

import {shuffle} from '../../utils/random';

interface PlayerSetupProps {
  minPlayers: number;
  maxPlayers: number;
  onSetupComplete: (players: string[]) => void;
}

export default function PlayerSetup({
  minPlayers,
  maxPlayers,
  onSetupComplete,
}: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState(minPlayers);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(minPlayers).fill(''),
  );

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
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleRemovePlayer = (index: number) => {
    if (playerCount > minPlayers) {
      setPlayerNames((prev) => prev.filter((_, i) => i !== index));
      setPlayerCount((prev) => prev - 1);
    }
  };

  const handleRandomize = () => {
    setPlayerNames((prev) => shuffle(prev));
  };

  const handleSubmit = () => {
    const finalNames = playerNames.map(
      (name, i) => name.trim() || `Player ${i + 1}`,
    );
    onSetupComplete(finalNames);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Player Setup
      </Typography>
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
            </Stack>
          ))}
        </Stack>

        <Button variant="outlined" onClick={handleRandomize}>
          Randomize Order
        </Button>

        <Button variant="contained" size="large" onClick={handleSubmit}>
          Start Game
        </Button>
      </Stack>
    </Box>
  );
}
