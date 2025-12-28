import * as React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Chip } from '@mui/material';

const DemoExpressiveCard: React.FC = () => (
  <Card sx={{ maxWidth: 360, m: 3 }}>
    <CardContent>
      <Typography variant="h6" color="primary" gutterBottom>
        Classe 3A - Matematica
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Questa è una card con bordo, ombra e forme arrotondate secondo Material 3 expressive. Puoi aggiungere qui info sulla classe, docente, ecc.
      </Typography>
      <Chip label="Attiva" color="secondary" sx={{ borderRadius: 24, fontWeight: 500 }} />
    </CardContent>
    <CardActions>
      <Button variant="contained" color="primary" sx={{ borderRadius: 40 }}>
        Dettagli
      </Button>
      <Button variant="outlined" color="secondary" sx={{ borderRadius: 40 }}>
        Modifica
      </Button>
    </CardActions>
  </Card>
);

export default DemoExpressiveCard;
