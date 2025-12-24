import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {SxProps, Theme} from '@mui/material/styles';
import {ReactNode} from 'react';

import {Player} from './PlayerSetup';

interface ScoringSectionProps {
  title: string;
  description: ReactNode;
  players: Player[];
  children: (player: Player, index: number) => ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function ScoringSection({
  title,
  description,
  players,
  children,
  header,
  icon,
  sx,
}: ScoringSectionProps) {
  const mergedSx = Array.isArray(sx) ? [{mt: 3}, ...sx] : [{mt: 3}, sx];

  return (
    <Box sx={mergedSx}>
      <Typography variant="h6">{title}</Typography>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
        {icon && (
          <Box
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 0.5,
              mr: 1,
              display: 'inline-flex',
            }}>
            {icon}
          </Box>
        )}
        <Typography sx={{color: 'text.secondary'}}>{description}</Typography>
      </Box>
      <Stack spacing={2}>
        {header}
        {players.map((player, index) => (
          <Stack key={index} direction="row" alignItems="center" spacing={2}>
            <Typography sx={{width: 120, flexShrink: 0}}>
              {player.name}
            </Typography>
            {children(player, index)}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
