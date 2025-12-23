'use client';

import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {ReactNode, useEffect, useRef, useState} from 'react';

export interface ScoreResult {
  rank: string;
  playerName: string;
  score: number;
  subtitle?: string;
  details?: string;
}

interface ScoreSheetProps {
  results: ScoreResult[];
  onCalculate: () => void;
  children?: ReactNode;
}

export default function ScoreSheet({
  results,
  onCalculate,
  children,
}: ScoreSheetProps) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [prevResults, setPrevResults] = useState(results);
  const resultsRef = useRef<HTMLDivElement>(null);

  if (results !== prevResults) {
    setVisibleRows(0);
    setPrevResults(results);
  }

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

  return (
    <Stack spacing={2} sx={{mt: 3}}>
      <Button variant="contained" size="large" onClick={onCalculate} fullWidth>
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
                  <Fade in={index < visibleRows} key={index} timeout={500}>
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
                        {row.playerName}
                        {row.subtitle ? ` - ${row.subtitle}` : ''}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">{row.score}</Typography>
                        {row.details && (
                          <Typography variant="caption" display="block">
                            {row.details}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {children}
        </>
      )}
    </Stack>
  );
}
