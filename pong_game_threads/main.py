import pygame
import threading
import random
import time

# Configuración del juego
WIDTH, HEIGHT = 640, 480
BALL_SPEED = 5
PADDLE_SPEED = 10
WHITE = (255, 255, 255)
WINNING_SCORE = 10

# Inicialización de Pygame
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")

# Clase para la pelota
class Ball:
    def __init__(self):
        self.reset()
    
    def reset(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.dx = random.choice((1, -1)) * BALL_SPEED
        self.dy = random.choice((1, -1)) * BALL_SPEED

    def move(self):
        self.x += self.dx
        self.y += self.dy

# Clase para la paleta
class Paddle:
    def __init__(self, x):
        self.x = x
        self.y = HEIGHT // 2 - 50
        self.dy = 0

# Función para dibujar objetos en pantalla
def draw(ball, paddle1, paddle2, score1, score2, winner_text):
    screen.fill((0, 0, 0))
    pygame.draw.rect(screen, WHITE, (ball.x, ball.y, 10, 10))
    pygame.draw.rect(screen, WHITE, (paddle1.x, paddle1.y, 10, 100))
    pygame.draw.rect(screen, WHITE, (paddle2.x, paddle2.y, 10, 100))

    font = pygame.font.Font(None, 36)
    text1 = font.render(f"Player 1: {score1}", True, WHITE)
    text2 = font.render(f"Player 2: {score2}", True, WHITE)
    screen.blit(text1, (20, 20))
    screen.blit(text2, (WIDTH - 150, 20))

    if winner_text:
        font = pygame.font.Font(None, 72)
        text = font.render(winner_text, True, WHITE)
        screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))

    pygame.display.flip()

# Función para mover la paleta del jugador 1
def move_paddle1(paddle1):
    while True:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_w]:
            paddle1.y -= PADDLE_SPEED
        if keys[pygame.K_s]:
            paddle1.y += PADDLE_SPEED
        time.sleep(0.02)

# Función para mover la paleta del jugador 2
def move_paddle2(paddle2):
    while True:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP]:
            paddle2.y -= PADDLE_SPEED
        if keys[pygame.K_DOWN]:
            paddle2.y += PADDLE_SPEED
        time.sleep(0.02)

# Función principal del juego
def main():
    ball = Ball()
    paddle1 = Paddle(10)
    paddle2 = Paddle(WIDTH - 20)
    score1 = 0
    score2 = 0
    winner_text = ""

    # Iniciar hilos para mover las paletas
    thread1 = threading.Thread(target=move_paddle1, args=(paddle1,))
    thread2 = threading.Thread(target=move_paddle2, args=(paddle2,))
    thread1.daemon = True
    thread2.daemon = True
    thread1.start()
    thread2.start()

    running = True
    clock = pygame.time.Clock()

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        ball.move()

        # Colisiones con paletas
        if ball.x <= paddle1.x + 10 and paddle1.y <= ball.y <= paddle1.y + 100:
            ball.dx *= -1
        if ball.x >= paddle2.x - 10 and paddle2.y <= ball.y <= paddle2.y + 100:
            ball.dx *= -1

        # Colisiones con bordes
        if ball.y <= 0 or ball.y >= HEIGHT - 10:
            ball.dy *= -1

        # Puntos marcados
        if ball.x < 0:
            score2 += 1
            if score2 >= WINNING_SCORE:
                winner_text = "Player 2 Wins!"
            else:
                ball.reset()
        elif ball.x > WIDTH:
            score1 += 1
            if score1 >= WINNING_SCORE:
                winner_text = "Player 1 Wins!"
            else:
                ball.reset()

        # Finalizar el juego cuando un jugador gana
        if winner_text:
            draw(ball, paddle1, paddle2, score1, score2, winner_text)
            while True:
                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        running = False
                keys = pygame.key.get_pressed()
                if keys[pygame.K_r]:
                    score1 = 0
                    score2 = 0
                    winner_text = ""
                    ball.reset()
                if keys[pygame.K_q]:
                    running = False
                if not running:
                    break
        else:
            draw(ball, paddle1, paddle2, score1, score2, winner_text)
            clock.tick(60)

    pygame.quit()

if __name__ == "__main__":
    main()
