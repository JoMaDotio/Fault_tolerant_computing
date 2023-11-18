import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h1" component="div" align="center" gutterBottom>
        Bienvenido a nuestra Réplica de Trello
      </Typography>
      <Typography variant="h5" align="center" paragraph>
        Organiza tu trabajo de manera eficiente y colaborativa.
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Nuestra plataforma ofrece una experiencia similar a Trello para ayudarte a gestionar tus proyectos de manera efectiva.
      </Typography>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/login" passHref>
          <Button variant="contained" color="primary">
            Iniciar Sesión
          </Button>
        </Link>
        <span style={{ margin: '0 10px' }}>o</span>
        <Link href="/register" passHref>
          <Button variant="outlined" color="primary">
            Registrarse
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default LandingPage;