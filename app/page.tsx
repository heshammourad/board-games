import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Link from './components/Link';

const games = [
  {
    name: 'Heat: Pedal to the Metal',
    url: 'heat-pedal-to-the-metal',
    bggId: '366013',
  },
];

games.sort((a, b) => a.name.localeCompare(b.name, 'en', {numeric: true}));

async function getGameImages(ids: string[]) {
  // const idString = ids.join(',');
  // const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${idString}`);
  // const text = await res.text();

  const images: Record<string, string> = {};

  // Basic XML parsing to avoid external dependencies
  // const items = text.split('<item type="boardgame"');
  // items.forEach((item) => {
  //   const idMatch = item.match(/id="(\d+)"/);
  //   const thumbMatch = item.match(/<thumbnail>(.*?)<\/thumbnail>/);
  //   if (idMatch && thumbMatch) {
  //     images[idMatch[1]] = thumbMatch[1];
  //   }
  // });

  return images;
}

export default async function Home() {
  const images = await getGameImages(games.map((g) => g.bggId));

  return (
    <Box sx={{minHeight: '100vh', bgcolor: 'background.default', py: 4}}>
      <Container maxWidth="md">
        <Box component="header" sx={{mb: 6, textAlign: 'center'}}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom>
            Board Game Tools
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Select a game to access setup and scoring utilities.
          </Typography>
        </Box>

        <List sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          {games.map((game) => (
            <Paper key={game.name} variant="outlined" sx={{overflow: 'hidden'}}>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={game.url} sx={{p: 2}}>
                  {/* {images[game.bggId] && (
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <Avatar
                        src={images[game.bggId]}
                        variant="rounded"
                        sx={{ width: 64, height: 64 }}
                      />
                    </ListItemAvatar>
                  )} */}
                  <ListItemText
                    primary={game.name}
                    primaryTypographyProps={{variant: 'h6', fontWeight: 'bold'}}
                  />
                </ListItemButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Container>
    </Box>
  );
}
